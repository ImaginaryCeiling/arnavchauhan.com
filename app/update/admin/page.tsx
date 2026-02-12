'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface UpdatePost {
  slug: string
  title: string
  date: string
  summary?: string
}

function AdminContent() {
  const searchParams = useSearchParams()
  const key = searchParams.get('key')

  const [authorized, setAuthorized] = useState(false)
  const [posts, setPosts] = useState<UpdatePost[]>([])
  const [sending, setSending] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, { success: boolean; message: string }>>({})

  useEffect(() => {
    if (!key) return

    fetch(`/api/update/admin/posts?key=${encodeURIComponent(key)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized')
        return res.json()
      })
      .then((data) => {
        setAuthorized(true)
        setPosts(data.posts)
      })
      .catch(() => setAuthorized(false))
  }, [key])

  async function handleSend(slug: string) {
    setSending(slug)
    try {
      const res = await fetch('/api/update/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, adminKey: key }),
      })
      const data = await res.json()

      if (!res.ok) {
        setResults((prev) => ({ ...prev, [slug]: { success: false, message: data.error } }))
      } else {
        setResults((prev) => ({
          ...prev,
          [slug]: { success: true, message: `Sent to ${data.count} subscriber(s)` },
        }))
      }
    } catch {
      setResults((prev) => ({
        ...prev,
        [slug]: { success: false, message: 'Failed to send' },
      }))
    } finally {
      setSending(null)
    }
  }

  if (!key) {
    return <p className="py-12 text-center text-gray-500 dark:text-gray-400">Missing admin key.</p>
  }

  if (!authorized) {
    return <p className="py-12 text-center text-gray-500 dark:text-gray-400">Unauthorized.</p>
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          Send Updates
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          Send an update post to all subscribers.
        </p>
      </div>

      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {posts.length === 0 && (
          <li className="py-8 text-center text-gray-500 dark:text-gray-400">
            No posts tagged "update" found.
          </li>
        )}
        {posts.map((post) => (
          <li key={post.slug} className="flex items-center justify-between py-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{post.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              {post.summary && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{post.summary}</p>
              )}
              {results[post.slug] && (
                <p
                  className={`mt-2 text-sm ${
                    results[post.slug].success
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {results[post.slug].message}
                </p>
              )}
            </div>
            <button
              onClick={() => handleSend(post.slug)}
              disabled={sending === post.slug}
              className="ml-4 shrink-0 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50"
            >
              {sending === post.slug ? 'Sending...' : 'Send to subscribers'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={<p className="py-12 text-center text-gray-500 dark:text-gray-400">Loading...</p>}
    >
      <AdminContent />
    </Suspense>
  )
}
