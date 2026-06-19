import { allBlogs } from 'contentlayer/generated'
import { notFound, redirect } from 'next/navigation'

export const generateStaticParams = async () => {
  return allBlogs.map((post) => ({ slug: post.slug }))
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = allBlogs.find((post) => post.slug === slug)

  if (!post) {
    notFound()
  }

  redirect(`/blog/${slug}`)
}
