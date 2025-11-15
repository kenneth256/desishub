import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const isLoginPage = pathname === "/login";
  const isHomePage = pathname === "/";
  const isAnswerPage = pathname.startsWith("/answer");
  const isDashboardPage = pathname === '/dashboard'

  let userEmail = null;
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      console.log(payload)
      userEmail = payload.email as string;
    } catch (error) {
      console.error("Invalid token:", error);
      if (isAnswerPage || isDashboardPage) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  
}

  if (token && userEmail === "kennethdavid256@gmail.com") {
    if (isLoginPage || isHomePage || isAnswerPage) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  
    if (isDashboardPage) {
      return NextResponse.next();
    }
  }


  if (token && (isLoginPage || isHomePage)) {
    return NextResponse.redirect(new URL("/answer", request.url));
  }
 
  if (!token && isAnswerPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

   if (token && isDashboardPage && userEmail !== "kennethdavid256@gmail.com") {
    return NextResponse.redirect(new URL("/answer", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/answer/:path*", "/dashboard/:path*"],
};
