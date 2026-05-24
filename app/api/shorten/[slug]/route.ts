import { NextRequest } from 'next/server'
import { deleteLink, getLink, requireAuth } from '@/lib/shortener'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const unauth = requireAuth(req)
  if (unauth) return unauth
  const { slug } = await params
  const link = await getLink(slug)
  if (!link) return Response.json({ error: 'not found' }, { status: 404 })
  return Response.json(link)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const unauth = requireAuth(req)
  if (unauth) return unauth
  const { slug } = await params
  const ok = await deleteLink(slug)
  if (!ok) return Response.json({ error: 'not found' }, { status: 404 })
  return Response.json({ deleted: slug })
}
