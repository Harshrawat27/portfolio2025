'use client';

import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import HeadFollow from '@/components/HeadFollow';
import { personalInfo, projects } from '@/data/portfolio';
import { blogPosts } from '@/data/blog';

function formatDate(date: string) {
  return new Date(date)
    .toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    .toUpperCase();
}

export default function HomePage() {
  const posts = [...blogPosts]
    .sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    )
    .slice(0, 4);

  return (
    <div className='pb-24'>
      <SiteHeader />

      {/* Hero */}
      <section className='mb-24'>
        <div className='mb-10 rise' style={{ animationDelay: '40ms' }}>
          <div className='inline-block overflow-hidden rounded-full'>
            <HeadFollow size={150} />
          </div>
        </div>
        <h1
          className='text-[2.5rem] sm:text-[3.25rem] leading-[1.1] tracking-[-0.015em] font-medium mb-8 rise'
          style={{ animationDelay: '80ms' }}
        >
          Experimenting <em className='font-normal'>without expectation.</em>
        </h1>
        <div
          className='space-y-4 text-[1.0625rem] leading-[1.7] text-[var(--text-secondary)] rise'
          style={{ animationDelay: '160ms' }}
        >
          <p>
            I&apos;m Harsh — a self-taught developer in Delhi. Never been to
            college. I went from designing books, to freelancing as a web
            developer, to building my own small products on the internet.
          </p>
          <p>
            These days I ship side projects, write about what happens next, and
            wait for AGI.
          </p>
        </div>
      </section>

      {/* Projects */}
      <section className='mb-24 rise' style={{ animationDelay: '240ms' }}>
        <div className='rule pt-4 mb-10 flex items-baseline justify-between'>
          <h2 className='meta'>Projects</h2>
          <Link href='/projects' className='meta ink-link'>
            All projects
          </Link>
        </div>

        <div className='space-y-12'>
          {projects.map((project) => (
            <article key={project.id}>
              <div className='flex items-baseline justify-between gap-4 mb-2'>
                <h3 className='text-xl font-semibold tracking-tight'>
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='ink-link'
                    >
                      {project.title}
                    </a>
                  ) : (
                    project.title
                  )}
                </h3>
                <span className='meta shrink-0'>{project.year}</span>
              </div>
              <p className='text-[var(--text-secondary)] leading-[1.7] mb-3'>
                {project.description}
              </p>
              <div className='flex gap-5'>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='meta ink-link'
                  >
                    Visit
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='meta ink-link'
                  >
                    Source
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Writing */}
      <section className='mb-24 rise' style={{ animationDelay: '320ms' }}>
        <div className='rule pt-4 mb-10 flex items-baseline justify-between'>
          <h2 className='meta'>Writing</h2>
          <Link href='/blogs' className='meta ink-link'>
            All posts
          </Link>
        </div>

        <div className='space-y-7'>
          {posts.map((post) => (
            <article
              key={post.id}
              className='flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6'
            >
              <span className='meta shrink-0 sm:w-24'>
                {formatDate(post.publishDate)}
              </span>
              <h3 className='text-lg leading-snug'>
                <Link href={`/blogs/${post.id}`} className='ink-link'>
                  {post.title}
                </Link>
              </h3>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className='rule pt-6 rise' style={{ animationDelay: '400ms' }}>
        <div className='flex flex-wrap items-baseline justify-between gap-4'>
          <div className='flex gap-5'>
            <a
              href={personalInfo.github}
              target='_blank'
              rel='noopener noreferrer'
              className='meta ink-link'
            >
              GitHub
            </a>
            <a
              href={personalInfo.twitter}
              target='_blank'
              rel='noopener noreferrer'
              className='meta ink-link'
            >
              X
            </a>
            <a
              href={personalInfo.linkedin}
              target='_blank'
              rel='noopener noreferrer'
              className='meta ink-link'
            >
              LinkedIn
            </a>
            <a href={`mailto:${personalInfo.email}`} className='meta ink-link'>
              Email
            </a>
          </div>
          <span className='meta'>{personalInfo.location}</span>
        </div>
      </footer>
    </div>
  );
}
