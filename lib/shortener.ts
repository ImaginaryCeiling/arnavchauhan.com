import { Redis } from '@upstash/redis'

export type Link = {
  slug: string
  url: string
  recipient: string | null
  group: string | null
  createdAt: string
  clickedAt: string | null
  clickCount: number
}

let _redis: Redis | null = null
export function redis(): Redis {
  if (_redis) return _redis
  const url = process.env.LINKSHORTENER_KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.LINKSHORTENER_KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    throw new Error(
      'Missing LINKSHORTENER_KV_REST_API_URL / LINKSHORTENER_KV_REST_API_TOKEN env vars'
    )
  }
  _redis = new Redis({ url, token })
  return _redis
}

const ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789' // no 1,l,o,0 to avoid confusion
export function randomSlug(len = 3): string {
  const bytes = new Uint8Array(len)
  crypto.getRandomValues(bytes)
  let out = ''
  for (let i = 0; i < len; i++) out += ALPHABET[bytes[i] % ALPHABET.length]
  return out
}

const SLUG_RE = /^[a-zA-Z0-9_-]{1,64}$/
export function isValidSlug(s: string): boolean {
  return SLUG_RE.test(s)
}

export function isValidUrl(u: string): boolean {
  try {
    const parsed = new URL(u)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export async function getLink(slug: string): Promise<Link | null> {
  const data = await redis().get<Link>(`link:${slug}`)
  return data ?? null
}

export async function putLink(link: Link): Promise<void> {
  const r = redis()
  await r.set(`link:${link.slug}`, link)
  await r.sadd('slugs', link.slug)
  if (link.group) await r.sadd(`group:${link.group}`, link.slug)
}

export async function deleteLink(slug: string): Promise<boolean> {
  const r = redis()
  const existing = await getLink(slug)
  if (!existing) return false
  await r.del(`link:${slug}`)
  await r.srem('slugs', slug)
  if (existing.group) await r.srem(`group:${existing.group}`, slug)
  return true
}

export async function listLinks(): Promise<Link[]> {
  const r = redis()
  const slugs = await r.smembers('slugs')
  if (!slugs.length) return []
  const keys = slugs.map((s) => `link:${s}`)
  const values = await r.mget<Link[]>(...keys)
  return values.filter((v): v is Link => v != null)
}

export async function recordClick(slug: string): Promise<Link | null> {
  const link = await getLink(slug)
  if (!link) return null
  const updated: Link = {
    ...link,
    clickedAt: link.clickedAt ?? new Date().toISOString(),
    clickCount: (link.clickCount ?? 0) + 1,
  }
  await redis().set(`link:${slug}`, updated)
  return updated
}

export function requireAuth(req: Request): Response | null {
  const token = process.env.SHORTNER_TOKEN
  if (!token) {
    return Response.json({ error: 'SHORTNER_TOKEN not configured' }, { status: 500 })
  }
  const header = req.headers.get('authorization') || ''
  const provided = header.replace(/^Bearer\s+/i, '')
  if (provided !== token) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }
  return null
}

export function baseUrl(): string {
  return process.env.SHORTNER_BASE_URL || 'https://arnv.ch'
}
