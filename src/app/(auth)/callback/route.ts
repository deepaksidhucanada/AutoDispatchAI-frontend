// src/app/(auth)/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/onboarding/create-company";

  // auth-helpers handles cookies types internally (no TS 7006)
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(`${url.origin}/login?error=${encodeURIComponent(error.message)}`);
    }
    return NextResponse.redirect(`${url.origin}${next}`);
  }

  return NextResponse.redirect(`${url.origin}/login?error=NoCode`);
}
