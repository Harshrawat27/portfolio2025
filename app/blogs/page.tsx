'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import SideNav from '@/components/SideNav';
import { blogPosts } from '@/data/portfolio';

export default function BlogsPage() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  return (
    <>
      <SideNav />

      <div className='flex flex-col pb-32 relative'>
        {/* Simple Header */}
        <motion.div
          className='mb-12'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className='section-heading text-2xl'>Thoughts</h1>
        </motion.div>

        {/* Blog Posts as Terminal Cards */}
        <div className='space-y-6'>
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className='group'
            >
              <Link href={`/blogs/${post.id}`}>
                <div className='bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden hover:border-[var(--primary)] transition-all duration-300 hover:shadow-lg hover:shadow-[var(--primary)]/10'>
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

                  {/* Terminal Content */}
                  <div className='p-6 font-mono text-sm'>
                    {/* Command Line */}
                    <div className='flex items-center gap-2 mb-4'>
                      <span className='text-purple-400'>$</span>
                      <span className='text-gray-300'>
                        cat {post.title.toLowerCase().replace(/\s+/g, '-')}.md
                      </span>
                    </div>

                    {/* Article Info */}
                    <div className='mb-4 space-y-1'>
                      <div className='flex items-center gap-4 text-xs text-gray-500'>
                        <span>📅 {formatDate(post.publishDate)}</span>
                        <span>⏱️ {post.readTime} min read</span>
                        <span>#{String(index + 1).padStart(2, '0')}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className='text-lg font-bold text-white mb-3 group-hover:text-[var(--primary)] transition-colors'>
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className='text-gray-400 text-sm leading-relaxed mb-4'>
                      {post.excerpt}
                    </p>

                    {/* Read More */}
                    <div className='flex items-center gap-2 text-[var(--primary)] text-sm'>
                      <span>cat</span>
                      <span className='group-hover:underline'>Read more</span>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4 transition-transform group-hover:translate-x-1'
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
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
