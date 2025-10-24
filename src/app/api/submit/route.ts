// src/app/api/submit/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

// ⚠️ Server-side admin client (uses SERVICE_ROLE key)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE! // must be set in .env.local
)

export async function POST(req: Request) {
  try {
    // ---- Auth: read Bearer token from Authorization header
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) {
      return NextResponse.json({ ok: false, error: 'Unauthorized (no token)' }, { status: 401 })
    }

    // Verify the token and get the user
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token)
    if (userErr || !userData?.user) {
      return NextResponse.json({ ok: false, error: 'Invalid or expired session' }, { status: 401 })
    }
    const userId = userData.user.id

    // ---- Parse body
    const body = await req.json()
    const {
      companyName,
      legalName,
      email,
      phone,
      mcNumber,
      dotNumber,
      cvorNumber,
      address,
      city,
      state,
      country,
      postalCode,
    } = body || {}

    // Basic validation
    if (!legalName || !email || !address || !city || !state || !country || !postalCode) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 })
    }

    // ---- Insert into your table (adjust table/columns if yours differ)
    // Example table: companies
    const insertRow = {
      owner_user_id: userId,          // link company to the signed-in user
      company_name: companyName ?? legalName,
      legal_name: legalName,
      email,
      phone: phone ?? null,
      mc_number: mcNumber ?? null,
      dot_number: dotNumber ?? null,
      cvor_number: cvorNumber ?? null,
      address_line1: address,
      city,
      state_province: state,
      country,
      postal_code: postalCode,
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabaseAdmin
      .from('companies')
      .insert(insertRow)
      .select('id')
      .single()

    if (error) {
      // Surface DB error in JSON
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    // ✅ JSON response (no HTML)
    return NextResponse.json({ ok: true, companyId: data.id }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || 'Server error' },
      { status: 500 }
    )
  }
}
