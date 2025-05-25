'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import SideNav from '@/components/SideNav';
import { projects } from '@/data/portfolio';
import { Project } from '@/types';

export default function ProjectsPage() {
  const [filter, setFilter] = useState<
    'all' | 'web' | 'mobile' | 'design' | 'other'
  >('all');
  const [sortBy, setSortBy] = useState<'year' | 'title'>('year');

  // Filter and sort projects
  const filteredProjects = projects
    .filter((project) => filter === 'all' || project.category === filter)
    .sort((a, b) => {
      if (sortBy === 'year') {
        return b.year - a.year;
      }
      return a.title.localeCompare(b.title);
    });

  const getLanguageColor = (tech: string): string => {
    const colors: Record<string, string> = {
      React: '#61DAFB',
      'Next.js': '#000000',
      TypeScript: '#3178C6',
      JavaScript: '#F7DF1E',
      'Node.js': '#339933',
      'Vue.js': '#4FC08D',
      Python: '#3776AB',
      'Express.js': '#000000',
      MongoDB: '#47A248',
      PostgreSQL: '#336791',
      'Tailwind CSS': '#06B6D4',
      'Material-UI': '#007FFF',
      'Styled Components': '#DB7093',
      Redux: '#764ABC',
      'Socket.io': '#010101',
      'Chart.js': '#FF6384',
      'OpenWeather API': '#EB6E4B',
      Stripe: '#008CDD',
      'React Native': '#61DAFB',
      SQLite: '#003B57',
      HTML: '#E34F26',
      CSS: '#1572B6',
      PHP: '#777BB4',
      MySQL: '#4479A1',
    };
    return colors[tech] || '#8b949e';
  };

  return (
    <>
      <SideNav />

      <div className='flex flex-col pb-32 relative'>
        {/* Date indicator */}
        <div className='date-marker top-8 right-0'>
          {new Date().toISOString().split('T')[0]}
        </div>

        {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <Link
            href='/'
            className='text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
            Back to home
          </Link>

          <h1 className='text-xl font-bold title-gradient'>All Projects</h1>
        </div>

        {/* Filters */}
        <div className='mb-8 space-y-4'>
          <div className='flex flex-wrap gap-3'>
            <div className='flex rounded-lg overflow-hidden border border-[var(--card-border)]'>
              {['all', 'web', 'mobile', 'design', 'other'].map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category as any)}
                  className={`px-3 py-1.5 text-sm capitalize ${
                    filter === category
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-[var(--card-bg)] text-[var(--text-secondary)] hover:bg-[var(--background)]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className='flex rounded-lg overflow-hidden border border-[var(--card-border)]'>
              <button
                onClick={() => setSortBy('year')}
                className={`px-3 py-1.5 text-sm ${
                  sortBy === 'year'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--card-bg)] text-[var(--text-secondary)] hover:bg-[var(--background)]'
                }`}
              >
                Year
              </button>
              <button
                onClick={() => setSortBy('title')}
                className={`px-3 py-1.5 text-sm ${
                  sortBy === 'title'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--card-bg)] text-[var(--text-secondary)] hover:bg-[var(--background)]'
                }`}
              >
                Name
              </button>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className='card text-center py-12'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-16 w-16 mx-auto text-[var(--text-secondary)] opacity-50 mb-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01'
              />
            </svg>
            <h2 className='text-xl font-bold mb-2'>No projects found</h2>
            <p className='text-[var(--text-secondary)]'>
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className='card hover:scale-[1.02] group relative'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                {/* Featured badge */}
                {project.featured && (
                  <div className='absolute top-4 left-4 bg-[var(--primary)] text-white text-xs px-2 py-1 rounded-full z-10'>
                    Featured
                  </div>
                )}

                {/* Project number */}
                <div className='absolute top-4 right-4 text-xs font-mono text-[var(--text-secondary)] opacity-70'>
                  #{String(index + 1).padStart(2, '0')}
                </div>

                {/* Project Image */}
                <div className='mb-4 overflow-hidden rounded-md'>
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={400}
                    height={250}
                    className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300'
                  />
                </div>

                {/* Project Content */}
                <div className='flex flex-col flex-grow'>
                  <div className='mb-2'>
                    <h3 className='text-lg font-bold mb-1 group-hover:text-[var(--primary)] transition-colors'>
                      {project.title}
                    </h3>
                    <div className='flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-2'>
                      <span className='date-indicator'>{project.year}</span>
                      <span className='bg-[var(--background)] px-2 py-0.5 rounded-full capitalize'>
                        {project.category}
                      </span>
                    </div>
                  </div>

                  <p className='text-[var(--text-secondary)] text-sm mb-4 line-clamp-3 flex-grow'>
                    {project.description}
                  </p>

                  {/* Actions */}
                  <div className='flex items-center gap-3 mb-4'>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-[var(--primary)] text-sm flex items-center gap-1 hover:underline'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-4 w-4'
                          fill='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                        </svg>
                        <span>Code</span>
                      </a>
                    )}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-[var(--text-secondary)] hover:text-[var(--primary)] text-sm flex items-center gap-1 transition-colors'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-4 w-4'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path
                            fillRule='evenodd'
                            d='M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z'
                            clipRule='evenodd'
                          />
                        </svg>
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>

                  {/* Technologies */}
                  <div className='flex flex-wrap gap-1'>
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className='inline-flex items-center gap-1 px-2 py-1 bg-[var(--background)] rounded-full text-xs text-[var(--text-secondary)]'
                      >
                        <span
                          className='w-2 h-2 rounded-full'
                          style={{ backgroundColor: getLanguageColor(tech) }}
                        ></span>
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className='px-2 py-1 bg-[var(--background)] rounded-full text-xs text-[var(--text-secondary)]'>
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats */}
        <motion.div
          className='mt-12 grid grid-cols-2 md:grid-cols-4 gap-4'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className='card text-center'>
            <div className='text-2xl font-bold text-[var(--primary)]'>
              {projects.length}
            </div>
            <div className='text-sm text-[var(--text-secondary)]'>
              Total Projects
            </div>
          </div>
          <div className='card text-center'>
            <div className='text-2xl font-bold text-[var(--primary)]'>
              {projects.filter((p) => p.category === 'web').length}
            </div>
            <div className='text-sm text-[var(--text-secondary)]'>Web Apps</div>
          </div>
          <div className='card text-center'>
            <div className='text-2xl font-bold text-[var(--primary)]'>
              {projects.filter((p) => p.category === 'mobile').length}
            </div>
            <div className='text-sm text-[var(--text-secondary)]'>
              Mobile Apps
            </div>
          </div>
          <div className='card text-center'>
            <div className='text-2xl font-bold text-[var(--primary)]'>
              {projects.filter((p) => p.featured).length}
            </div>
            <div className='text-sm text-[var(--text-secondary)]'>Featured</div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
