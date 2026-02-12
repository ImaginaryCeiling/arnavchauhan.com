import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'

const resend = new Resend(process.env.RESEND_API_KEY)
const audienceId = process.env.RESEND_AUDIENCE_ID!
const adminKey = process.env.UPDATE_ADMIN_KEY!

export async function POST(request: Request) {
  try {
    const { slug, adminKey: providedKey } = await request.json()

    if (providedKey !== adminKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const post = allBlogs.find((p) => p.slug === slug)
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const { data: contactsData } = await resend.contacts.list({ audienceId })
    const contacts = contactsData?.data ?? []

    if (contacts.length === 0) {
      return NextResponse.json({ error: 'No subscribers found' }, { status: 400 })
    }

    const postUrl = `${siteMetadata.siteUrl}/blog/${post.slug}`

    const emails = contacts.map((contact) => ({
      from: 'Arnav Chauhan <updates@arnavchauhan.com>',
      to: contact.email,
      subject: `Arnav Chauhan's Investor Update: ${post.title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>${post.title}</h2>
          ${post.summary ? `<p>${post.summary}</p>` : ''}
          <p><a href="${postUrl}">Read the full update &rarr;</a></p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="color: #6b7280; font-size: 14px;">You're receiving this because you subscribed to investor updates from Arnav Chauhan.</p>
        </div>
      `,
    }))

    await resend.batch.send(emails)

    return NextResponse.json({ success: true, count: emails.length })
  } catch (error) {
    console.error('Send error:', error)
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 })
  }
}
