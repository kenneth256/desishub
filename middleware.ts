import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const isLoginPage = pathname === "/login";
  const isHomePage = pathname === "/";
  const isAnswerPage = pathname.startsWith("/answer");


  if (token && (isLoginPage || isHomePage)) {
    return NextResponse.redirect(new URL("/answer", request.url));
  }

 
  if (!token && isAnswerPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/answer/:id*"],
};
