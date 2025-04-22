import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, Phone } from "lucide-react"
import SocialIcon from "../../components/social-icons"
import siteMetadata from '@/data/siteMetadata'

export const metadata: Metadata = {
  title: "Meet Arnav Chauhan",
  description: "Contact information and social profiles for Arnav Chauhan",
}

export default function MeetPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 md:py-24">
      <div className="w-full max-w-3xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
            Meet Arnav Chauhan
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Thanks for scanning my business card. Here's how you can reach me.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ContactCard
            icon={<Phone className="h-5 w-5" />}
            title="Phone"
            value= {siteMetadata.phone}
            href= {`tel:${siteMetadata.phone}`}
          />

          <ContactCard
            icon={<SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} />}
            title="Email"
            value={siteMetadata.email}
            href={`mailto:${siteMetadata.email}`}
            hideIcon
          />

          <ContactCard
            icon={<SocialIcon kind="linkedin" href={siteMetadata.linkedin} />}
            title="LinkedIn"
            value= "Arnav Chauhan"
            href={siteMetadata.linkedin as string}
            hideIcon
          />

          <ContactCard
            icon={<SocialIcon kind="github" href="https://github.com/arnavchauhan" />}
            title="GitHub"
            value="Imaginary Ceiling"
            href={siteMetadata.github as string}
            hideIcon
          />

          <ContactCard
            icon={<SocialIcon kind="twitter" href="https://x.com/arnavchauhan"  />}
            title="X (Twitter)"
            value="@arnavc08"
            href={siteMetadata.twitter as string}
            hideIcon
          />

          <ContactCard
            icon={<SocialIcon kind="instagram" href="https://instagram.com/arnavchauhan" size={5} />}
            title="Instagram"
            value="@arnavc2"
            href="https://instagram.com/arnavc2"
            hideIcon
          />
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          >
            Back to homepage
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

interface ContactCardProps {
  icon: React.ReactNode
  title: string
  value: string
  href: string
  hideIcon?: boolean
}

function ContactCard({ icon, title, value, href, hideIcon = false }: ContactCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center p-4 transition-colors border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-center w-10 h-10 mr-4 rounded-full bg-primary-100 dark:bg-primary-900">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{value}</p>
      </div>
      <ArrowUpRight className="ml-auto h-4 w-4 text-gray-400" />
    </a>
  )
}
