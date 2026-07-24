'use client';

import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { projects } from '@/data/portfolio';

export default function ProjectsPage() {
  const sortedProjects = [...projects].sort((a, b) => b.year - a.year);

  return (
    <div className='pb-24'>
      <SiteHeader />

      <section className='mb-24'>
        <h1
          className='text-[2.5rem] leading-[1.1] tracking-[-0.015em] font-medium mb-16 rise'
          style={{ animationDelay: '80ms' }}
        >
          Projects
        </h1>

        <div className='space-y-16 rise' style={{ animationDelay: '160ms' }}>
          {sortedProjects.map((project) => (
            <article key={project.id}>
              <div className='flex items-baseline justify-between gap-4 mb-2'>
                <h2 className='text-2xl font-semibold tracking-tight'>
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
                </h2>
                <span className='meta shrink-0'>{project.year}</span>
              </div>
              <p className='text-[var(--text-secondary)] leading-[1.7] mb-4'>
                {project.description}
              </p>
              <div className='flex flex-wrap items-baseline gap-x-5 gap-y-2'>
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
                <span className='meta'>
                  {project.technologies.join(' · ')}
                </span>
              </div>
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
