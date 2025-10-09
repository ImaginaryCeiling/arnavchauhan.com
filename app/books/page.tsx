import type { Metadata } from 'next'
import Image from 'next/image'
import booksData, { currentlyReading, type BookEntry } from '@/data/booksData'
import { genPageMetadata } from 'app/seo'

export const metadata: Metadata = genPageMetadata({ title: 'Books' })

interface BookInfo {
  title: string
  author: string
  coverUrl: string
}

async function fetchBookInfo(entry: string | BookEntry): Promise<BookInfo | null> {
  // If entry has custom cover and author, use it directly
  if (typeof entry === 'object' && entry.coverUrl && entry.author) {
    return {
      title: entry.title,
      author: entry.author,
      coverUrl: entry.coverUrl,
    }
  }

  // If entry has edition ID, fetch from edition endpoint
  if (typeof entry === 'object' && entry.editionId) {
    try {
      const response = await fetch(`https://openlibrary.org/books/${entry.editionId}.json`, {
        next: { revalidate: 86400 },
      })
      const data = await response.json()

      // Use hardcoded author if provided, otherwise fetch from API
      let authorName = 'Unknown Author'
      if (entry.author) {
        authorName = entry.author
      } else if (data.authors && data.authors.length > 0) {
        try {
          const authorResponse = await fetch(`https://openlibrary.org${data.authors[0].key}.json`, {
            next: { revalidate: 86400 },
          })
          const authorData = await authorResponse.json()
          authorName = authorData.name || authorName
        } catch {
          // Keep default author name if fetch fails
        }
      }

      return {
        title: data.title || entry.title,
        author: authorName,
        coverUrl: `https://covers.openlibrary.org/b/olid/${entry.editionId}-L.jpg`,
      }
    } catch (error) {
      console.error(`Error fetching edition: ${entry.editionId}`, error)
      // Fall through to title search
    }
  }

  // Otherwise, fetch from API by title search
  const title = typeof entry === 'string' ? entry : entry.title
  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=1`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    )
    const data = await response.json()

    if (data.docs && data.docs.length > 0) {
      const book = data.docs[0]
      return {
        title: book.title || title,
        author: book.author_name ? book.author_name[0] : 'Unknown Author',
        coverUrl: book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
          : '/static/images/book-placeholder.jpg',
      }
    }
    return null
  } catch (error) {
    console.error(`Error fetching book: ${title}`, error)
    return null
  }
}

export default async function BooksPage() {
  const [currentBooks, completedBooks] = await Promise.all([
    Promise.all(currentlyReading.map((entry) => fetchBookInfo(entry))),
    Promise.all(booksData.map((entry) => fetchBookInfo(entry))),
  ])

  const validCurrentBooks = currentBooks.filter((book): book is BookInfo => book !== null)
  const validCompletedBooks = completedBooks.filter((book): book is BookInfo => book !== null)

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          Books
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          Books I've read and am currently reading
        </p>
      </div>

      <div className="container py-12">
        {validCurrentBooks.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Currently Reading
            </h2>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {validCurrentBooks.map((book, index) => (
                <div key={index} className="flex flex-col">
                  <div className="mb-3 overflow-hidden rounded-lg shadow-lg ring-2 ring-primary-500 transition-transform hover:scale-105">
                    <Image
                      src={book.coverUrl}
                      alt={`${book.title} cover`}
                      width={200}
                      height={300}
                      className="h-auto w-full object-cover"
                    />
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{book.author}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Completed Books
          </h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {validCompletedBooks.map((book, index) => (
              <div key={index} className="flex flex-col">
                <div className="mb-3 overflow-hidden rounded-lg shadow-md transition-transform hover:scale-105">
                  <Image
                    src={book.coverUrl}
                    alt={`${book.title} cover`}
                    width={200}
                    height={300}
                    className="h-auto w-full object-cover"
                  />
                </div>
                <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{book.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
