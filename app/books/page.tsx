import type { Metadata } from 'next'
import Image from 'next/image'
import booksData from '@/data/booksData'
import { genPageMetadata } from 'app/seo'

export const metadata: Metadata = genPageMetadata({ title: 'Books' })

interface BookInfo {
  title: string
  author: string
  coverUrl: string
}

async function fetchBookInfo(title: string): Promise<BookInfo | null> {
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
  const books = await Promise.all(booksData.map((title) => fetchBookInfo(title)))

  const validBooks = books.filter((book): book is BookInfo => book !== null)

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          Books
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">My reading list</p>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {validBooks.map((book, index) => (
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
  )
}
