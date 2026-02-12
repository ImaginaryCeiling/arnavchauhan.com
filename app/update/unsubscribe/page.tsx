'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'

type FormState = 'idle' | 'loading' | 'success' | 'error'

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const prefilled = searchParams.get('email') ?? ''

  const [email, setEmail] = useState(prefilled)
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/update/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }

      setState('success')
    } catch (err) {
      setState('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          Unsubscribe
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          Sorry to see you go. Enter your email to unsubscribe from investor updates.
        </p>
      </div>

      <div className="pt-8">
        {state === 'success' ? (
          <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
            <p className="text-green-800 dark:text-green-300">
              You've been unsubscribed. You won't receive any more updates.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email address
            </label>
            <div className="flex gap-2">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                disabled={state === 'loading'}
              />
              <button
                type="submit"
                disabled={state === 'loading'}
                className="rounded-md bg-red-500 px-6 py-2 font-medium text-white hover:bg-red-600 disabled:opacity-50"
              >
                {state === 'loading' ? 'Unsubscribing...' : 'Unsubscribe'}
              </button>
            </div>
            {state === 'error' && (
              <p className="text-sm text-red-600 dark:text-red-400">{errorMsg}</p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={<p className="py-12 text-center text-gray-500 dark:text-gray-400">Loading...</p>}
    >
      <UnsubscribeContent />
    </Suspense>
  )
}
