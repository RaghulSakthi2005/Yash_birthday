import { NextResponse } from "next/server";

const COOKIE_NAME  = "hbd_unlocked";
const COOKIE_VALUE = "9f3a2b7e";

// Everything except the root password gate needs auth
const PUBLIC_PATHS = ["/", "/_next", "/favicon.ico", "/animations", "/birthday"];

export function proxy(request) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith("/_next"));
  if (isPublic) return NextResponse.next();

  const cookie = request.cookies.get(COOKIE_NAME);
  if (!cookie || cookie.value !== COOKIE_VALUE) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("locked", "1");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|animations|birthday|lands.png).*)"],
};
