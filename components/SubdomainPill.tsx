import Link from '@/components/Link'

interface SubdomainPillProps {
  href: string
  emoji: string
  text: string
}

const SubdomainPill = ({ href, emoji, text }: SubdomainPillProps) => {
  return (
    <Link
      href={href}
      className="rounded-full border border-sky-400 bg-gray-100 px-6 py-3 text-lg font-medium text-gray-900 hover:bg-gray-200 dark:border-sky-500 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
    >
      <span className="mr-2">{emoji}</span>
      {text}
    </Link>
  )
}

export default SubdomainPill
