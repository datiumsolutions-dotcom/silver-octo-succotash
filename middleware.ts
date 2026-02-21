import { NextResponse, type NextRequest } from "next/server";

import { createMiddlewareClient } from "@/server/supabase/middleware";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { supabase, response } = createMiddlewareClient(request);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
