import { NextResponse } from 'next/server'
import { allBlogs } from 'contentlayer/generated'

const adminKey = process.env.UPDATE_ADMIN_KEY!

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')

  if (key !== adminKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const updatePosts = allBlogs
    .filter((post) => post.tags?.includes('update') && !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(({ slug, title, date, summary }) => ({ slug, title, date, summary }))

  return NextResponse.json({ posts: updatePosts })
}
