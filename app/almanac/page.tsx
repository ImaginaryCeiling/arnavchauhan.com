import AlmanacListLayout from '@/layouts/AlmanacListLayout'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allAlmanacs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Almanac' })

export default function AlmanacPage() {
  const posts = allCoreContent(sortPosts(allAlmanacs))

  return (
    <AlmanacListLayout
      posts={posts}
      title="Almanac"
    />
  )
}