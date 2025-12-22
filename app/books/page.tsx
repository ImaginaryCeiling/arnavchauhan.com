import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import booksData, { type BookEntry } from '@/data/booksData'
import { genPageMetadata } from 'app/seo'

export const metadata: Metadata = genPageMetadata({ title: 'Books' })

interface BookInfo {
  title: string
  author: string
  coverUrl: string
  bookUrl: string
}

async function fetchBookInfo(entry: string | BookEntry): Promise<BookInfo | null> {
  // Helper function to get Goodreads URL from ISBN or fallback to search
  const getGoodreadsUrl = (isbn: string | null, title: string, author: string): string => {
    if (isbn) {
      return `https://www.goodreads.com/book/isbn/${isbn}`
    }
    const searchQuery = `${title} ${author}`
    return `https://www.goodreads.com/search?q=${encodeURIComponent(searchQuery)}`
  }

  // If entry has custom cover and author, use it directly
  if (typeof entry === 'object' && entry.coverUrl && entry.author) {
    // Check for manual Goodreads URL first
    const bookUrl = entry.goodreadsUrl || getGoodreadsUrl(null, entry.title, entry.author)

    return {
      title: entry.title,
      author: entry.author,
      coverUrl: entry.coverUrl,
      bookUrl,
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

      const bookTitle = data.title || entry.title

      // Extract ISBN from Open Library data (prefer ISBN-13, then ISBN-10)
      const isbn =
        data.isbn_13?.[0] ||
        data.isbn_10?.[0] ||
        data.identifiers?.isbn_13?.[0] ||
        data.identifiers?.isbn_10?.[0] ||
        null

      // Check for manual Goodreads URL, otherwise use ISBN or search
      const bookUrl = entry.goodreadsUrl || getGoodreadsUrl(isbn, bookTitle, authorName)

      return {
        title: bookTitle,
        author: authorName,
        coverUrl: `https://covers.openlibrary.org/b/olid/${entry.editionId}-L.jpg`,
        bookUrl,
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
      const bookTitle = book.title || title
      const authorName = book.author_name ? book.author_name[0] : 'Unknown Author'

      // Extract ISBN from search results (prefer ISBN-13, then ISBN-10)
      const isbn = book.isbn?.[0] || null

      const bookUrl = getGoodreadsUrl(isbn, bookTitle, authorName)

      return {
        title: bookTitle,
        author: authorName,
        coverUrl: book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
          : '/static/images/book-placeholder.jpg',
        bookUrl,
      }
    }
    return null
  } catch (error) {
    console.error(`Error fetching book: ${title}`, error)
    return null
  }
}

export default async function BooksPage() {
  const readingList = booksData.filter(
    (entry) => typeof entry === 'object' && entry.currentlyReading
  )
  const toReadList = booksData.filter((entry) => typeof entry === 'object' && entry.toRead)
  const completedList = booksData.filter(
    (entry) => typeof entry === 'string' || (!entry.currentlyReading && !entry.toRead)
  )

  const [currentBooks, toReadBooks, completedBooks] = await Promise.all([
    Promise.all(readingList.map((entry) => fetchBookInfo(entry))),
    Promise.all(toReadList.map((entry) => fetchBookInfo(entry))),
    Promise.all(completedList.map((entry) => fetchBookInfo(entry))),
  ])

  const validCurrentBooks = currentBooks.filter((book): book is BookInfo => book !== null)
  const validToReadBooks = toReadBooks.filter((book): book is BookInfo => book !== null)
  const validCompletedBooks = completedBooks.filter((book): book is BookInfo => book !== null)

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          Books
        </h1>
      </div>

      <div className="container py-12">
        {validToReadBooks.length > 0 && (
          <div className="mb-8">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center text-2xl font-bold text-gray-900 dark:text-gray-100">
                Want to Read
                <span className="ml-2 transition-transform group-open:rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </summary>
              <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {validToReadBooks.map((book, index) => (
                  <Link
                    key={index}
                    href={book.bookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col transition-opacity hover:opacity-80"
                  >
                    <div className="mb-3 overflow-hidden rounded-lg shadow-lg ring-1 ring-gray-400 transition-transform hover:scale-105">
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
                  </Link>
                ))}
              </div>
            </details>
          </div>
        )}

        {validCurrentBooks.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Currently Reading
            </h2>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {validCurrentBooks.map((book, index) => (
                <Link
                  key={index}
                  href={book.bookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col transition-opacity hover:opacity-80"
                >
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
                </Link>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Books I've Read
          </h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {validCompletedBooks.map((book, index) => (
              <Link
                key={index}
                href={book.bookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col transition-opacity hover:opacity-80"
              >
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
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
