'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SiteHeader from '@/components/SiteHeader';
import { blogPosts } from '@/data/blog';
import { notFound } from 'next/navigation';

interface BlogDetailPageProps {
  params: {
    id: string;
  };
}

function formatDate(date: string) {
  return new Date(date)
    .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    .toUpperCase();
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = blogPosts.find((p) => p.id === params.id);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts
    .filter(
      (p) => p.id !== post.id && p.tags.some((tag) => post.tags.includes(tag))
    )
    .slice(0, 2);

  return (
    <div className='pb-24'>
      <SiteHeader />

      {/* Article header */}
      <header className='mb-14 rise' style={{ animationDelay: '80ms' }}>
        <div className='flex items-baseline gap-4 mb-6'>
          <span className='meta'>{formatDate(post.publishDate)}</span>
          <span className='meta'>{post.readTime} min read</span>
        </div>
        <h1 className='text-[2.25rem] sm:text-[2.75rem] leading-[1.15] tracking-[-0.015em] font-medium'>
          {post.title}
        </h1>
      </header>

      {/* Article body */}
      <article
        className='text-[1.125rem] leading-[1.75] rise'
        style={{ animationDelay: '160ms' }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className='text-3xl font-semibold tracking-tight mt-12 mb-4'>
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className='text-2xl font-semibold tracking-tight mt-12 mb-4'>
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className='text-xl font-semibold tracking-tight mt-8 mb-3'>
                {children}
              </h3>
            ),
            p: ({ children }) => <p className='mb-6'>{children}</p>,
            code: ({ children, className }) => {
              const isInline = !className;
              return isInline ? (
                <code className='font-mono text-[0.85em] bg-[var(--card-bg)] border border-[var(--card-border)] rounded px-1.5 py-0.5'>
                  {children}
                </code>
              ) : (
                <code className='font-mono text-sm'>{children}</code>
              );
            },
            pre: ({ children }) => (
              <pre className='bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md p-5 overflow-x-auto mb-6 leading-relaxed'>
                {children}
              </pre>
            ),
            blockquote: ({ children }) => (
              <blockquote className='border-l-2 border-[var(--text-primary)] pl-5 my-8 italic text-[var(--text-secondary)]'>
                {children}
              </blockquote>
            ),
            ul: ({ children }) => (
              <ul className='list-disc pl-6 mb-6 space-y-2'>{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className='list-decimal pl-6 mb-6 space-y-2'>{children}</ol>
            ),
            a: ({ children, href }) => (
              <a
                href={href}
                className='ink-link'
                target='_blank'
                rel='noopener noreferrer'
              >
                {children}
              </a>
            ),
            hr: () => <hr className='rule border-0 my-10' />,
          }}
        >
          {post.content}
        </ReactMarkdown>
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className='mt-24 rise' style={{ animationDelay: '240ms' }}>
          <div className='rule pt-4 mb-10'>
            <h2 className='meta'>Keep reading</h2>
          </div>
          <div className='space-y-7'>
            {relatedPosts.map((relatedPost) => (
              <article
                key={relatedPost.id}
                className='flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6'
              >
                <span className='meta shrink-0 sm:w-28'>
                  {new Date(relatedPost.publishDate)
                    .toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })
                    .toUpperCase()}
                </span>
                <h3 className='text-lg leading-snug'>
                  <Link href={`/blogs/${relatedPost.id}`} className='ink-link'>
                    {relatedPost.title}
                  </Link>
                </h3>
              </article>
            ))}
          </div>
        </section>
      )}

      <footer className='rule mt-24 pt-6 flex items-baseline justify-between'>
        <Link href='/blogs' className='meta ink-link'>
          All posts
        </Link>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className='meta ink-link'
        >
          Back to top
        </button>
      </footer>
    </div>
  );
}
