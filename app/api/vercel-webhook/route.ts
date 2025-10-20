// app/api/vercel-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export const runtime = 'nodejs'

const VERCEL_WEBHOOK_SECRET = process.env.VERCEL_WEBHOOK_SECRET!
const NTFY_TOPIC = process.env.NTFY_TOPIC!
const NTFY_URL = `https://ntfy.sh/${NTFY_TOPIC}`

function safeEq(a: string, b: string) {
  const A = Buffer.from(a),
    B = Buffer.from(b)
  return A.length === B.length && crypto.timingSafeEqual(A, B)
}
function verify(raw: Buffer, header: string | null) {
  if (!header) return false
  const h = crypto.createHmac('sha256', VERCEL_WEBHOOK_SECRET).update(raw).digest('hex')
  return safeEq(header, h) || safeEq(header, `sha256=${h}`)
}

export async function POST(req: NextRequest) {
  const raw = Buffer.from(await req.arrayBuffer())
  if (!verify(raw, req.headers.get('x-vercel-signature'))) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 403 })
  }

  const p = JSON.parse(raw.toString('utf8'))
  const name = p?.name ?? 'unknown'
  const env = p?.environment ?? p?.target ?? 'production'
  const url = p?.url ?? p?.aliases?.[0] ?? ''
  const branch = p?.meta?.githubCommitRef ?? p?.gitSource?.ref ?? ''
  const sha = (p?.meta?.githubCommitSha ?? p?.gitSource?.sha ?? '').slice(0, 7)
  const when = new Date(p?.createdAt ?? Date.now()).toLocaleString()

  const title = `✅ Deploy: ${name}`
  const body = [
    `Env: ${env}`,
    branch && `Branch: ${branch}`,
    sha && `Commit: ${sha}`,
    url && `URL: ${url}`,
    `At: ${when}`,
  ]
    .filter(Boolean)
    .join('\n')

  const r = await fetch(NTFY_URL, {
    method: 'POST',
    headers: { Title: title, ...(url ? { Click: url } : {}), Tags: 'rocket,white_check_mark' },
    body,
  })

  return r.ok ? NextResponse.json({ ok: true }) : NextResponse.json({ ok: false }, { status: 502 })
}
