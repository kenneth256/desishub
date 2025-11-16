import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const isLoginPage = pathname === "/login";
  const isHomePage = pathname === "/";
  const isAnswerPage = pathname.startsWith("/answer");
  const isDashboardPage = pathname === '/dashboard';
  const isCreateQs = pathname === '/createQs'

  let userEmail = null;
  let tier = null;
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      console.log(payload)
      userEmail = payload.email as string;
      tier = payload.tier as string;
      console.log(tier)
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

  if (isDashboardPage || isCreateQs) {
    return NextResponse.next();
  }
}

if (token && tier && (isLoginPage || isHomePage)) {
  return NextResponse.redirect(new URL(`/answer/${tier}`, request.url));
}
 
  if (!token && isAnswerPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

   if (token && (isDashboardPage || isCreateQs) && userEmail !== "admin2@gmail.com") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/answer/:path*", "/dashboard/:path*"],
};
