import { NextRequest } from 'next/server'
import {
  baseUrl,
  getLink,
  isValidSlug,
  isValidUrl,
  listLinks,
  putLink,
  randomSlug,
  requireAuth,
  type Link,
} from '@/lib/shortener'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

type CreateBody = {
  url?: string
  slug?: string
  recipients?: string[]
  group?: string | null
}

async function uniqueSlug(preferred?: string): Promise<string> {
  if (preferred) {
    if (!isValidSlug(preferred)) throw new Error(`invalid slug: ${preferred}`)
    if (await getLink(preferred)) throw new Error(`slug already exists: ${preferred}`)
    return preferred
  }
  for (let i = 0; i < 8; i++) {
    const s = randomSlug(3)
    if (!(await getLink(s))) return s
  }
  throw new Error('failed to generate unique slug')
}

export async function GET(req: NextRequest) {
  const unauth = requireAuth(req)
  if (unauth) return unauth
  const links = await listLinks()
  links.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  return Response.json({ links, baseUrl: baseUrl() })
}

export async function POST(req: NextRequest) {
  const unauth = requireAuth(req)
  if (unauth) return unauth

  let body: CreateBody
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'invalid JSON body' }, { status: 400 })
  }

  const { url, slug, recipients, group } = body
  if (!url || !isValidUrl(url)) {
    return Response.json({ error: 'url is required and must be http(s)' }, { status: 400 })
  }

  const now = new Date().toISOString()
  const base = baseUrl()
  const groupId = group || (recipients?.length ? slug || randomSlug(3) : null)

  try {
    if (recipients && recipients.length > 0) {
      const created: Array<{ recipient: string; slug: string; shortUrl: string }> = []
      for (const recipient of recipients) {
        let variant = ''
        for (let i = 0; i < 16; i++) {
          const candidate = randomSlug(3)
          if (!(await getLink(candidate))) {
            variant = candidate
            break
          }
        }
        if (!variant) throw new Error('failed to allocate variant slug')

        const link: Link = {
          slug: variant,
          url,
          recipient,
          group: groupId,
          createdAt: now,
          clickedAt: null,
          clickCount: 0,
        }
        await putLink(link)
        created.push({ recipient, slug: variant, shortUrl: `${base}/link/${variant}` })
      }
      return Response.json({ group: groupId, links: created }, { status: 201 })
    }

    const finalSlug = await uniqueSlug(slug)
    const link: Link = {
      slug: finalSlug,
      url,
      recipient: null,
      group: groupId,
      createdAt: now,
      clickedAt: null,
      clickCount: 0,
    }
    await putLink(link)
    return Response.json({ slug: finalSlug, shortUrl: `${base}/s/${finalSlug}` }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error'
    return Response.json({ error: message }, { status: 400 })
  }
}
