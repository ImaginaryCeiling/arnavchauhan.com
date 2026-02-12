import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const audienceId = process.env.RESEND_AUDIENCE_ID!

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    await resend.contacts.create({
      email,
      audienceId,
    })

    await resend.emails.send({
      from: 'Arnav Chauhan <updates@arnavchauhan.com>',
      to: email,
      subject: "Arnav's Investor Updates",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Thanks for signing up!</h2>
          <p>You'll receive periodic updates on what I've been up to. Investments in me are not limited to capital but include time, energy, and attention. </p>
          <p>I am truly grateful for all the support I've recieved up to this point in time. Thanks for all the help!</p>
          <p>— Arnav Chauhan</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
