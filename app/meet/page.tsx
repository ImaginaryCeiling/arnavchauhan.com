import type React from "react"
import type { Metadata } from "next"
import Image from "next/image"
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
    <div className="flex flex-col items-center justify-center px-4 py-4 md:py-4">
      <div className="w-full max-w-3xl">
      <div className="flex items-center justify-between mt-4 mb-10">
            <div className="space-y-4">
                <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
                <span className="wave">👋</span> Hi, <span>I'm </span>
                <span className="text-sky-500 dark:text-sky-400">Arnav Chauhan</span>
                </h1>
                <p className="text-2xl text-gray-700 dark:text-gray-300 p-1">
                Let's stay in touch — here's how to reach me.
                </p>
            </div>

            <div className="rounded-full shadow-lg">
                <Image
                src="/static/images/IMG_7084.png"
                alt="Arnav's profile"
                width={250}
                height={250}
                className="h-50 w-50 rounded-full shadow-gray-300"
                />
            </div>
            </div>


        <div className="grid gap-6 md:grid-cols-2">
          <ContactCard
            icon={<Phone className="h-5 w-5" />}
            title="Phone"
            value= {siteMetadata.phone}
            href= {`tel:${siteMetadata.phone}`}
          />

          <ContactCard
            icon={<SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={6}/>}
            title="Email"
            value={siteMetadata.email}
            href={`mailto:${siteMetadata.email}`}
            hideIcon
          />

          <ContactCard
            icon={<SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6}/>}
            title="LinkedIn"
            value= "Arnav Chauhan"
            href={siteMetadata.linkedin as string}
            hideIcon
          />

          <ContactCard
            icon={<SocialIcon kind="github" href="https://github.com/arnavchauhan" size={7}/>}
            title="GitHub"
            value="ImaginaryCeiling"
            href={siteMetadata.github as string}
            hideIcon
          />

          <ContactCard
            icon={<SocialIcon kind="twitter" href="https://x.com/arnavchauhan"  size={6}/>}
            title="X"
            value="@arnavc08"
            href={siteMetadata.twitter as string}
            hideIcon
          />

          <ContactCard
            icon={<SocialIcon kind="instagram" href="https://instagram.com/arnavchauhan" size={6} />}
            title="Instagram"
            value="@arnavc2"
            href="https://instagram.com/arnavc2"
            hideIcon
          />
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
