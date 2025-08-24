import 'css/prism.css'
import 'katex/dist/katex.css'

import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { sortPosts, coreContent, allCoreContent } from 'pliny/utils/contentlayer'
import { allAlmanacs } from 'contentlayer/generated'
import type { Almanac } from 'contentlayer/generated'
import AlmanacLayout from '@/layouts/AlmanacLayout'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] }
}): Promise<Metadata | undefined> {
  const slug = decodeURI(params.slug.join('/'))
  const post = allAlmanacs.find((p) => p.slug === slug)
  
  if (!post) {
    return
  }

  const publishedAt = new Date(post.date).toISOString()
  const title = post.title || `Thought from ${new Date(post.date).toLocaleDateString()}`

  return {
    title,
    description: post.summary,
    openGraph: {
      title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      url: './',
      authors: [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: post.summary,
    },
  }
}

export const generateStaticParams = async () => {
  const paths = allAlmanacs.map((p) => ({ slug: p.slug.split('/') }))
  return paths
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  const slug = decodeURI(params.slug.join('/'))
  const sortedCoreContents = allCoreContent(sortPosts(allAlmanacs))
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)
  
  if (postIndex === -1) {
    return notFound()
  }

  const prev = sortedCoreContents[postIndex + 1]
  const next = sortedCoreContents[postIndex - 1]
  const post = allAlmanacs.find((p) => p.slug === slug) as Almanac
  const mainContent = coreContent(post)
  const jsonLd = post.structuredData

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AlmanacLayout content={mainContent} next={next} prev={prev}>
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </AlmanacLayout>
    </>
  )
}