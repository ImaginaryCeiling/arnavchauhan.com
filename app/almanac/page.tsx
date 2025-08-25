import AlmanacListLayout from '@/layouts/AlmanacListLayout'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allAlmanacs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Almanac' })

export default function AlmanacPage() {
  const sortedPosts = sortPosts(allAlmanacs)
  // Filter out drafts in production
  const filteredPosts = process.env.NODE_ENV === 'production' 
    ? sortedPosts.filter(post => post.draft !== true)
    : sortedPosts
  const posts = allCoreContent(filteredPosts)

  return (
    <AlmanacListLayout
      posts={posts}
      title="Almanac"
    />
  )
}