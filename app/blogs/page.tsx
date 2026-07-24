'use client';

import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { blogPosts } from '@/data/blog';

function formatDate(date: string) {
  return new Date(date)
    .toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    .toUpperCase();
}

export default function BlogsPage() {
  const posts = [...blogPosts].sort(
    (a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  return (
    <div className='pb-24'>
      <SiteHeader />

      <section className='mb-24'>
        <h1
          className='text-[2.5rem] leading-[1.1] tracking-[-0.015em] font-medium mb-16 rise'
          style={{ animationDelay: '80ms' }}
        >
          Writing
        </h1>

        <div className='space-y-14 rise' style={{ animationDelay: '160ms' }}>
          {posts.map((post) => (
            <article key={post.id}>
              <div className='flex items-baseline gap-4 mb-2'>
                <span className='meta'>{formatDate(post.publishDate)}</span>
                <span className='meta'>{post.readTime} min read</span>
              </div>
              <h2 className='text-2xl leading-snug tracking-tight font-semibold mb-3'>
                <Link href={`/blogs/${post.id}`} className='ink-link'>
                  {post.title}
                </Link>
              </h2>
              <p className='text-[var(--text-secondary)] leading-[1.7]'>
                {post.excerpt}
              </p>
            </article>
          ))}
        </div>
      </section>

      <footer className='rule pt-6 rise' style={{ animationDelay: '240ms' }}>
        <Link href='/' className='meta ink-link'>
          Back home
        </Link>
      </footer>
    </div>
  );
}
