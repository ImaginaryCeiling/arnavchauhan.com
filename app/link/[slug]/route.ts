import { NextRequest, NextResponse } from 'next/server'
import { recordClick } from '@/lib/shortener'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const link = await recordClick(slug)
  if (!link) {
    return new NextResponse('Not found', { status: 404 })
  }
  return NextResponse.redirect(link.url, 302)
}
