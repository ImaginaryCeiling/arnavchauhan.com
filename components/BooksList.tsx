import Image from 'next/image'
import Link from 'next/link'

interface BookInfo {
  title: string
  author: string
  coverUrl: string
  bookUrl: string
  rating?: number
}

interface BooksListProps {
  books: BookInfo[]
}

export default function BooksList({ books }: BooksListProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Books I've Read</h2>
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {books.map((book, index) => (
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
            <div className="mb-1 flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{book.author}</p>
              </div>
              {book.rating && (
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                    {book.rating}/5
                  </span>
                  <svg
                    className="h-3 w-3 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
