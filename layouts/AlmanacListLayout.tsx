import { CoreContent } from 'pliny/utils/contentlayer'
import type { Almanac } from 'contentlayer/generated'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'

interface AlmanacListLayoutProps {
  posts: CoreContent<Almanac>[]
  title: string
}

export default function AlmanacListLayout({ posts, title }: AlmanacListLayoutProps) {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Random thoughts, observations, and ideas
          </p>
        </div>
        <div className="grid gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
          {!posts.length && 'No thoughts found.'}
          {posts.map((post) => {
            const { slug, date, title, summary, tags } = post
            return (
              <Link
                key={slug}
                href={`/almanac/${slug}`}
                className="group block"
                aria-label={`Read "${title || 'thought'}"`}
              >
                <article className="h-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-primary-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-500">
                  <div className="space-y-3">
                    <div>
                      <time
                        dateTime={date}
                        className="text-sm text-gray-500 dark:text-gray-400"
                      >
                        {formatDate(date, siteMetadata.locale)}
                      </time>
                    </div>
                    
                    {title && (
                      <h2 className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {title}
                      </h2>
                    )}
                    
                    {summary && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                        {summary}
                      </p>
                    )}
                    
                    {tags && tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tags.slice(0, 3).map((tag) => (
                          <span 
                            key={tag}
                            className="mr-3 text-sm font-medium uppercase text-primary-500 rounded px-2 py-1 bg-primary-50 dark:bg-primary-900/20"
                          >
                            {tag.split(' ').join('-')}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="pt-2">
                      <span className="text-sm font-medium text-primary-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        Read more →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}