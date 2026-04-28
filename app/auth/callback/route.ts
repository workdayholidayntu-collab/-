import { NextResponse } from "next/server"
import type { EmailOtpType } from "@supabase/supabase-js"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { buildUrl } from "@/lib/utils"

// Supabase sends two flavours of auth callback:
//  - OAuth (Google) returns ?code=...           → exchangeCodeForSession
//  - Email confirm / magic link / recovery
//    returns ?token_hash=...&type=signup|...    → verifyOtp
// We must handle both, otherwise the email verification click silently
// fails and the user lands on /profile → bounced to /login with no banner.

const VALID_OTP_TYPES: ReadonlyArray<EmailOtpType> = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
]

function isOtpType(value: string | null): value is EmailOtpType {
  return value !== null && (VALID_OTP_TYPES as readonly string[]).includes(value)
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const tokenHash = requestUrl.searchParams.get("token_hash")
  const type = requestUrl.searchParams.get("type")
  const next = requestUrl.searchParams.get("next") ?? "/profile?welcome=1"

  const supabase = await createSupabaseServerClient()

  if (tokenHash && isOtpType(type)) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    if (error) {
      return NextResponse.redirect(
        buildUrl(`/login?error=${encodeURIComponent(error.message)}`),
      )
    }
    return NextResponse.redirect(buildUrl(next))
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return NextResponse.redirect(
        buildUrl(`/login?error=${encodeURIComponent(error.message)}`),
      )
    }
    return NextResponse.redirect(buildUrl(next))
  }

  // No params: most likely Supabase's hosted /auth/v1/verify already confirmed
  // the email server-side and redirected back here without carrying a session.
  // Surface a positive "please login" hint rather than a hard error.
  return NextResponse.redirect(
    buildUrl("/login?notice=" + encodeURIComponent("信箱已驗證，請以你的 email 與密碼登入。")),
  )
}
