'use client'

import { useEffect, useState } from 'react'

type Link = {
  slug: string
  url: string
  recipient: string | null
  group: string | null
  createdAt: string
  clickedAt: string | null
  clickCount: number
}

type ListResponse = { links: Link[]; baseUrl: string }

const TOKEN_KEY = 'shortener_admin_token'

export default function AdminLinksPage() {
  const [token, setToken] = useState('')
  const [tokenInput, setTokenInput] = useState('')
  const [data, setData] = useState<ListResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : ''
    if (stored) {
      setToken(stored)
      setTokenInput(stored)
    }
  }, [])

  async function load(t: string) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/shorten', {
        headers: { Authorization: `Bearer ${t}` },
        cache: 'no-store',
      })
      if (res.status === 401) {
        setError('Invalid token')
        setData(null)
        return
      }
      if (!res.ok) {
        setError(`Error ${res.status}`)
        setData(null)
        return
      }
      const json = (await res.json()) as ListResponse
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'fetch failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) load(token)
  }, [token])

  function saveToken() {
    localStorage.setItem(TOKEN_KEY, tokenInput)
    setToken(tokenInput)
  }

  function clearToken() {
    localStorage.removeItem(TOKEN_KEY)
    setToken('')
    setTokenInput('')
    setData(null)
  }

  async function deleteLink(slug: string) {
    if (!confirm(`Delete ${slug}?`)) return
    const res = await fetch(`/api/shorten/${slug}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) load(token)
    else alert(`Delete failed: ${res.status}`)
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text)
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-md py-16">
        <h1 className="mb-4 text-2xl font-bold">Link admin</h1>
        <p className="mb-4 text-sm text-gray-500">Enter your API token to continue.</p>
        <input
          type="password"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="SHORTNER_TOKEN"
          className="mb-3 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
          onKeyDown={(e) => e.key === 'Enter' && saveToken()}
        />
        <button
          onClick={saveToken}
          disabled={!tokenInput}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          Sign in
        </button>
      </div>
    )
  }

  const links = data?.links ?? []
  const filtered = filter
    ? links.filter((l) =>
        [l.slug, l.url, l.recipient ?? '', l.group ?? '']
          .join(' ')
          .toLowerCase()
          .includes(filter.toLowerCase())
      )
    : links

  const total = links.length
  const clicked = links.filter((l) => l.clickedAt).length
  const totalClicks = links.reduce((s, l) => s + (l.clickCount ?? 0), 0)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Links</h1>
          <p className="text-sm text-gray-500">
            {total} total · {clicked} clicked · {totalClicks} total clicks
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => load(token)}
            disabled={loading}
            className="rounded border border-gray-300 px-3 py-1 text-sm dark:border-gray-700"
          >
            {loading ? 'Loading…' : 'Refresh'}
          </button>
          <button
            onClick={clearToken}
            className="rounded border border-gray-300 px-3 py-1 text-sm dark:border-gray-700"
          >
            Sign out
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}

      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter by slug, url, recipient, group…"
        className="mb-4 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
      />

      <CreateForm token={token} onCreated={() => load(token)} />

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 text-left dark:border-gray-800">
            <tr>
              <th className="py-2 pr-3">Slug</th>
              <th className="py-2 pr-3">Destination</th>
              <th className="py-2 pr-3">Recipient</th>
              <th className="py-2 pr-3">Group</th>
              <th className="py-2 pr-3">Clicks</th>
              <th className="py-2 pr-3">First click</th>
              <th className="py-2 pr-3">Created</th>
              <th className="py-2 pr-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => {
              const shortUrl = `${data?.baseUrl}/link/${l.slug}`
              return (
                <tr key={l.slug} className="border-b border-gray-100 dark:border-gray-900">
                  <td className="py-2 pr-3 font-mono">
                    <button
                      onClick={() => copy(shortUrl)}
                      title="Copy short URL"
                      className="hover:underline"
                    >
                      {l.slug}
                    </button>
                  </td>
                  <td className="max-w-xs truncate py-2 pr-3">
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {l.url}
                    </a>
                  </td>
                  <td className="py-2 pr-3">{l.recipient ?? '—'}</td>
                  <td className="py-2 pr-3">{l.group ?? '—'}</td>
                  <td className="py-2 pr-3">
                    <span
                      className={
                        l.clickCount > 0
                          ? 'font-semibold text-green-600 dark:text-green-400'
                          : 'text-gray-400'
                      }
                    >
                      {l.clickCount}
                    </span>
                  </td>
                  <td className="py-2 pr-3 text-gray-500">{fmt(l.clickedAt)}</td>
                  <td className="py-2 pr-3 text-gray-500">{fmt(l.createdAt)}</td>
                  <td className="py-2 pr-3">
                    <button
                      onClick={() => deleteLink(l.slug)}
                      className="text-red-600 hover:underline dark:text-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-500">
                  No links {filter && 'match the filter'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CreateForm({ token, onCreated }: { token: string; onCreated: () => void }) {
  const [url, setUrl] = useState('')
  const [slug, setSlug] = useState('')
  const [recipients, setRecipients] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    try {
      const body: Record<string, unknown> = { url }
      if (slug.trim()) body.slug = slug.trim()
      const recipientList = recipients
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      if (recipientList.length) body.recipients = recipientList

      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) {
        setMsg(`Error: ${json.error ?? res.status}`)
        return
      }
      setMsg('Created')
      setUrl('')
      setSlug('')
      setRecipients('')
      onCreated()
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="rounded border border-gray-200 p-4 dark:border-gray-800">
      <div className="mb-3 font-medium">Create link</div>
      <div className="grid gap-3 sm:grid-cols-3">
        <input
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Destination URL *"
          className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900 sm:col-span-3"
        />
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Custom slug (optional)"
          className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
        />
        <input
          type="text"
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          placeholder="Recipients, comma-separated (optional)"
          className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900 sm:col-span-2"
        />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="submit"
          disabled={busy || !url}
          className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {busy ? 'Creating…' : 'Create'}
        </button>
        {msg && <span className="text-sm text-gray-500">{msg}</span>}
      </div>
    </form>
  )
}

function fmt(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
}
