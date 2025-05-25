'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import SideNav from '@/components/SideNav';
import { personalInfo, projects, skills } from '@/data/portfolio';

export default function HomePage() {
  const featuredProjects = projects.filter((project) => project.featured);
  const frontendSkills = skills
    .filter((skill) => skill.category === 'frontend')
    .slice(0, 6);

  return (
    <>
      <SideNav />

      <div className='flex flex-col items-center pt-12 pb-32 relative'>
        {/* Date indicator */}
        <motion.div
          className='date-marker top-8 right-0'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {new Date().toISOString().split('T')[0]}
        </motion.div>

        {/* Profile Header */}
        <motion.div
          className='flex flex-col items-center mb-16 relative'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className='w-32 h-32 rounded-full overflow-hidden border-2 border-[var(--primary)] p-1 mb-6 relative'
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Image
              src={personalInfo.avatar}
              alt={personalInfo.name}
              fill
              className='rounded-full object-cover'
            />
            <motion.div
              className='absolute -z-10 w-40 h-40 bg-[var(--primary)] opacity-20 blur-xl'
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            ></motion.div>
          </motion.div>

          <motion.h1
            className='text-4xl font-bold mb-2 title-gradient'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {personalInfo.name}
          </motion.h1>

          <motion.div
            className='font-mono text-[var(--text-secondary)] mb-6 flex items-center'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <span>{personalInfo.title}</span>
            <span className='mx-2 text-xs'>•</span>
            <span className='text-sm flex items-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4 mr-1'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                />
              </svg>
              {personalInfo.location}
            </span>
          </motion.div>

          <motion.p
            className='text-[var(--text-secondary)] text-center max-w-md mb-8'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {personalInfo.bio}
          </motion.p>

          <motion.div
            className='flex space-x-4 mb-6'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {/* Social Links */}
            {personalInfo.github && (
              <a
                href={personalInfo.github}
                target='_blank'
                rel='noopener noreferrer'
                className='bg-[var(--card-bg)] hover:bg-[var(--primary)] hover:text-white border border-[var(--card-border)] w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22'></path>
                </svg>
              </a>
            )}

            {personalInfo.linkedin && (
              <a
                href={personalInfo.linkedin}
                target='_blank'
                rel='noopener noreferrer'
                className='bg-[var(--card-bg)] hover:bg-[var(--primary)] hover:text-white border border-[var(--card-border)] w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z'></path>
                  <rect x='2' y='9' width='4' height='12'></rect>
                  <circle cx='4' cy='4' r='2'></circle>
                </svg>
              </a>
            )}

            {personalInfo.twitter && (
              <a
                href={personalInfo.twitter}
                target='_blank'
                rel='noopener noreferrer'
                className='bg-[var(--card-bg)] hover:bg-[var(--primary)] hover:text-white border border-[var(--card-border)] w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z'></path>
                </svg>
              </a>
            )}

            {personalInfo.email && (
              <a
                href={`mailto:${personalInfo.email}`}
                className='bg-[var(--card-bg)] hover:bg-[var(--primary)] hover:text-white border border-[var(--card-border)] w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'></path>
                  <polyline points='22,6 12,13 2,6'></polyline>
                </svg>
              </a>
            )}
          </motion.div>

          {/* Skills showcase */}
          {frontendSkills.length > 0 && (
            <motion.div
              className='flex flex-wrap justify-center gap-2 mt-8'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {frontendSkills.map((skill, index) => (
                <motion.span
                  key={skill.name}
                  className='px-3 py-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full text-xs'
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.05, duration: 0.3 }}
                >
                  {skill.name}
                </motion.span>
              ))}
            </motion.div>
          )}

          {/* Index marker */}
          <motion.div
            className='absolute -right-4 top-0 text-xs font-mono text-[var(--text-secondary)] opacity-70'
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            #01
          </motion.div>
        </motion.div>

        {/* Featured Projects Section */}
        <motion.div
          className='w-full mb-16'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <h2 className='section-heading'>Featured Projects</h2>
          <div className='mb-6'></div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 relative'>
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className='card hover:scale-[1.02] group'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.1, duration: 0.5 }}
              >
                {/* Project number tag */}
                <motion.div
                  className='absolute top-4 right-4 text-xs font-mono text-[var(--text-secondary)] opacity-70'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                >
                  #{String(index + 1).padStart(2, '0')}
                </motion.div>

                <div className='mb-4'>
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={600}
                    height={300}
                    className='w-full h-48 object-cover rounded-md mb-4'
                  />
                </div>

                <motion.div
                  className='mb-2'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                >
                  <div className='flex items-center gap-2'>
                    <h3 className='font-bold text-xl hover:text-[var(--primary)] transition-colors'>
                      {project.title}
                    </h3>
                  </div>

                  <div className='flex items-center gap-2 text-xs text-[var(--text-secondary)] mt-1'>
                    <span className='date-indicator'>{project.year}</span>
                    <span className='bg-[var(--background)] px-2 py-0.5 rounded-full'>
                      {project.category}
                    </span>
                  </div>
                </motion.div>

                <motion.p
                  className='text-[var(--text-secondary)] text-sm mb-5 line-clamp-2 min-h-[40px]'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                >
                  {project.description}
                </motion.p>

                <motion.div
                  className='flex items-center justify-between mt-auto'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + index * 0.1 }}
                >
                  <div className='flex items-center gap-3'>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-[var(--primary)] text-sm flex items-center gap-1 relative overflow-hidden group-hover:underline'
                      >
                        <span>Code</span>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-4 w-4'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path
                            fillRule='evenodd'
                            d='M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z'
                            clipRule='evenodd'
                          />
                        </svg>
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
                            d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                            clipRule='evenodd'
                          />
                        </svg>
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </motion.div>

                {/* Technologies */}
                <motion.div
                  className='flex flex-wrap gap-2 mt-4 pt-4 border-t border-[var(--card-border)]'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 + index * 0.1 }}
                >
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className='px-2 py-1 bg-[var(--background)] rounded-full text-xs text-[var(--text-secondary)]'
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className='px-2 py-1 bg-[var(--background)] rounded-full text-xs text-[var(--text-secondary)]'>
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </motion.div>
              </motion.div>
            ))}

            {/* View all link */}
            <motion.div
              className='md:col-span-2 text-center mt-4'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 }}
            >
              <Link
                href='/projects'
                className='inline-flex items-center justify-center px-4 py-2 border border-[var(--card-border)] rounded-lg text-sm text-[var(--text-primary)] hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-colors group'
              >
                <span>View All Projects</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Access Section */}
        <motion.div
          className='w-full'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.5 }}
        >
          <h2 className='section-heading'>Quick Access</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <Link href='/experience' className='card group'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-10 h-10 bg-[var(--primary)] bg-opacity-10 rounded-lg flex items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-5 h-5 text-[var(--primary)]'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0h1a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2h1m8 0h1a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2h1'
                    />
                  </svg>
                </div>
                <h3 className='font-bold group-hover:text-[var(--primary)] transition-colors'>
                  Experience
                </h3>
              </div>
              <p className='text-[var(--text-secondary)] text-sm'>
                Explore my professional journey and work experience
              </p>
            </Link>

            <Link href='/blogs' className='card group'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-10 h-10 bg-[var(--primary)] bg-opacity-10 rounded-lg flex items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-5 h-5 text-[var(--primary)]'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'
                    />
                  </svg>
                </div>
                <h3 className='font-bold group-hover:text-[var(--primary)] transition-colors'>
                  Blog
                </h3>
              </div>
              <p className='text-[var(--text-secondary)] text-sm'>
                Read my thoughts on development and technology
              </p>
            </Link>

            <Link href='/contact' className='card group'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-10 h-10 bg-[var(--primary)] bg-opacity-10 rounded-lg flex items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-5 h-5 text-[var(--primary)]'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                    />
                  </svg>
                </div>
                <h3 className='font-bold group-hover:text-[var(--primary)] transition-colors'>
                  Get in Touch
                </h3>
              </div>
              <p className='text-[var(--text-secondary)] text-sm'>
                Let's discuss opportunities and collaborations
              </p>
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
