import { NextRequest } from 'next/server'
import { redis, requireAuth } from '@/lib/shortener'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const unauth = requireAuth(req)
  if (unauth) return unauth

  const env = {
    LINKSHORTENER_KV_REST_API_URL: Boolean(
      process.env.LINKSHORTENER_KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
    ),
    LINKSHORTENER_KV_REST_API_TOKEN: Boolean(
      process.env.LINKSHORTENER_KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
    ),
    SHORTNER_TOKEN: Boolean(process.env.SHORTNER_TOKEN),
    SHORTENER_BASE_URL: process.env.SHORTENER_BASE_URL || '(default: https://arnv.ch)',
  }

  let redisStatus: { ok: boolean; latencyMs?: number; error?: string; linkCount?: number }
  try {
    const start = Date.now()
    const pong = await redis().ping()
    const latencyMs = Date.now() - start
    if (pong !== 'PONG') throw new Error(`unexpected ping response: ${pong}`)
    const linkCount = await redis().scard('slugs')
    redisStatus = { ok: true, latencyMs, linkCount }
  } catch (err) {
    redisStatus = { ok: false, error: err instanceof Error ? err.message : String(err) }
  }

  const ok =
    env.LINKSHORTENER_KV_REST_API_URL && env.LINKSHORTENER_KV_REST_API_TOKEN && redisStatus.ok
  return Response.json({ ok, env, redis: redisStatus }, { status: ok ? 200 : 503 })
}
