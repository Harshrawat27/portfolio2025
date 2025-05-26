'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SideNav from '@/components/SideNav';
import { blogPosts } from '@/data/blog';
import { notFound } from 'next/navigation';

interface BlogDetailPageProps {
  params: {
    id: string;
  };
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = blogPosts.find((p) => p.id === params.id);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const relatedPosts = blogPosts
    .filter(
      (p) => p.id !== post.id && p.tags.some((tag) => post.tags.includes(tag))
    )
    .slice(0, 2);

  return (
    <>
      <SideNav />

      <div className='flex flex-col pb-32 relative max-w-4xl mx-auto'>
        {/* Back Navigation */}
        <motion.div
          className='mb-8'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href='/blogs'
            className='inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors font-mono text-sm'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
            cd ../blogs
          </Link>
        </motion.div>

        {/* Terminal Header */}
        <motion.div
          className='mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <div className='bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden'>
            {/* Terminal Title Bar */}
            <div className='flex items-center justify-between px-4 py-3 bg-[#2a2a2a] border-b border-[#333]'>
              <div className='flex items-center gap-2'>
                <div className='flex gap-2'>
                  <div className='w-3 h-3 rounded-full bg-[#ff5f57]'></div>
                  <div className='w-3 h-3 rounded-full bg-[#ffbd2e]'></div>
                  <div className='w-3 h-3 rounded-full bg-[#28ca42]'></div>
                </div>
                <span className='ml-3 text-sm text-gray-400 font-mono'>
                  {post.title.toLowerCase().replace(/\s+/g, '-')}.md
                </span>
              </div>

              {post.featured && (
                <span className='text-xs bg-[var(--primary)] text-white px-2 py-1 rounded'>
                  Featured
                </span>
              )}
            </div>

            {/* Terminal Content - Article Header */}
            <div className='p-6 font-mono text-sm'>
              <div className='flex items-center gap-2 mb-6'>
                <span className='text-purple-400'>$</span>
                <span className='text-gray-300'>
                  cat {post.title.toLowerCase().replace(/\s+/g, '-')}.md
                </span>
                <div className='ml-2 w-2 h-4 bg-green-400 animate-pulse'></div>
              </div>

              {/* Article Metadata */}
              <div className='mb-6 space-y-2'>
                <div className='flex items-center gap-4 text-xs text-gray-500'>
                  <span>📅 Published: {formatDate(post.publishDate)}</span>
                  <span>⏱️ Read time: {post.readTime} minutes</span>
                </div>

                {/* <div className='flex flex-wrap gap-2'>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className='text-xs px-2 py-1 bg-[#333] text-gray-300 rounded border border-[#444]'
                    >
                      #{tag}
                    </span>
                  ))}
                </div> */}
              </div>

              {/* Title */}
              <h1 className='text-2xl md:text-3xl font-bold text-white mb-4 leading-tight'>
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className='text-gray-400 text-base leading-relaxed mb-6 border-l-2 border-[var(--primary)] pl-4'>
                {post.excerpt}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          className='mb-12'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className='bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg overflow-hidden'>
            <div className='prose prose-lg max-w-none p-8'>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className='text-2xl font-bold mb-4 text-[var(--text-primary)] border-b border-[var(--card-border)] pb-2'>
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className='text-xl font-bold mb-3 mt-8 text-[var(--text-primary)]'>
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className='text-lg font-bold mb-2 mt-6 text-[var(--text-primary)]'>
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className='mb-4 leading-relaxed text-[var(--text-secondary)]'>
                      {children}
                    </p>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className='bg-[var(--background)] text-[var(--primary)] px-1 py-0.5 rounded text-sm font-mono'>
                        {children}
                      </code>
                    ) : (
                      <code className='block bg-[#1a1a1a] text-gray-300 p-4 rounded-lg overflow-x-auto font-mono text-sm border border-[#333]'>
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre className='bg-[#1a1a1a] text-gray-300 p-4 rounded-lg overflow-x-auto mb-4 border border-[#333]'>
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className='border-l-4 border-[var(--primary)] pl-4 my-4 italic text-[var(--text-secondary)]'>
                      {children}
                    </blockquote>
                  ),
                  ul: ({ children }) => (
                    <ul className='list-disc list-inside mb-4 space-y-1 text-[var(--text-secondary)]'>
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className='list-decimal list-inside mb-4 space-y-1 text-[var(--text-secondary)]'>
                      {children}
                    </ol>
                  ),
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      className='text-[var(--primary)] hover:underline'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className='bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden'>
              <div className='flex items-center gap-2 px-4 py-3 bg-[#2a2a2a] border-b border-[#333]'>
                <div className='flex gap-2'>
                  <div className='w-3 h-3 rounded-full bg-[#ff5f57]'></div>
                  <div className='w-3 h-3 rounded-full bg-[#ffbd2e]'></div>
                  <div className='w-3 h-3 rounded-full bg-[#28ca42]'></div>
                </div>
                <span className='ml-3 text-sm text-gray-400 font-mono'>
                  related.md
                </span>
              </div>

              <div className='p-6'>
                <div className='flex items-center gap-2 mb-4 font-mono text-sm'>
                  <span className='text-purple-400'>$</span>
                  <span className='text-gray-300'>
                    find . -name "*.md" -exec grep -l "{post.tags[0]}" {} \;
                  </span>
                </div>

                <h3 className='text-lg font-bold text-white mb-4'>
                  Related Posts
                </h3>

                <div className='space-y-4'>
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/blogs/${relatedPost.id}`}
                      className='block p-4 bg-[#2a2a2a] rounded border border-[#333] hover:border-[var(--primary)] transition-colors group'
                    >
                      <div className='flex items-start justify-between'>
                        <div className='flex-1'>
                          <h4 className='font-bold text-white group-hover:text-[var(--primary)] transition-colors mb-1'>
                            {relatedPost.title}
                          </h4>
                          <p className='text-sm text-gray-400 mb-2 line-clamp-2'>
                            {relatedPost.excerpt}
                          </p>
                          <div className='flex items-center gap-3 text-xs text-gray-500'>
                            <span>{formatDate(relatedPost.publishDate)}</span>
                            <span>{relatedPost.readTime} min read</span>
                          </div>
                        </div>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5 text-gray-400 group-hover:text-[var(--primary)] transition-colors'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path
                            fillRule='evenodd'
                            d='M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Footer */}
        <motion.div
          className='mt-12 flex justify-between items-center'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Link
            href='/blogs'
            className='inline-flex items-center gap-2 px-4 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-[var(--text-primary)] hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-colors'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
            All Posts
          </Link>

          <div className='flex gap-2'>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className='px-4 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors'
            >
              ↑ Top
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
