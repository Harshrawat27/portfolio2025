'use client';

import { motion } from 'framer-motion';

interface TimelineItem {
  period: string;
  description: string;
  icon?: string;
}

interface TimelineProps {
  title?: string;
  items?: TimelineItem[];
}

const defaultItems: TimelineItem[] = [
  {
    period: '2020 - 2021',
    description: 'Book and tshirt designing',
    icon: '🎨',
  },
  {
    period: '2021 - 2022',
    description: 'UI/UX design',
    icon: '💻',
  },
  {
    period: '2023 - 2024',
    description: 'Freelancer as web designer',
    icon: '🚀',
  },
  {
    period: '2025 - forever',
    description: 'On a path of doing great work',
    icon: '✨',
  },
];

export default function Timeline({
  title = 'Journey',
  items = defaultItems,
}: TimelineProps) {
  return (
    <div className='w-full m-10 mb-20'>
      {/* Section Header */}
      <motion.h2
        className='section-heading text-xl mb-15'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>

      {/* Timeline Container */}
      <div className='relative mt-10'>
        {/* Vertical Line */}
        <div className='absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--primary)] via-[var(--card-border)] to-transparent opacity-60'></div>

        {/* Timeline Items */}
        <div className='space-y-8'>
          {items.map((item, index) => (
            <motion.div
              key={index}
              className='relative flex items-start'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.2,
                duration: 0.6,
                ease: 'easeOut',
              }}
            >
              {/* Timeline Dot */}
              <div className='relative z-10 flex items-center justify-center w-12 h-12 bg-[var(--card-bg)] border-2 border-[var(--primary)] rounded-full shadow-lg mr-6 flex-shrink-0'>
                {/* Icon or Index */}
                {item.icon ? (
                  <span className='text-lg'>{item.icon}</span>
                ) : (
                  <span className='text-sm font-bold text-[var(--primary)]'>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                )}

                {/* Pulsing Effect for Current/Last Item */}
                {index === items.length - 1 && (
                  <div className='absolute inset-0 rounded-full border-2 border-[var(--primary)] animate-ping opacity-30'></div>
                )}
              </div>

              {/* Content Card */}
              <motion.div
                className='flex-1 card min-h-[80px] flex flex-col justify-center'
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 8px 30px rgba(137, 118, 234, 0.15)',
                }}
                transition={{ duration: 0.2 }}
              >
                {/* Period */}
                <div className='flex items-center gap-3 mb-2'>
                  <span className='text-sm font-mono text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded-full'>
                    {item.period}
                  </span>

                  {/* Terminal-style indicator */}
                  <div className='flex items-center gap-1'>
                    <div className='w-2 h-2 rounded-full bg-[var(--primary)] opacity-60'></div>
                    <div className='w-1 h-1 rounded-full bg-[var(--text-secondary)] opacity-40'></div>
                  </div>
                </div>

                {/* Description */}
                <p className='text-[var(--text-primary)] font-medium leading-relaxed'>
                  {item.description}
                </p>

                {/* Subtle decoration */}
                <div className='mt-3 flex items-center gap-2'>
                  <div className='h-px bg-gradient-to-r from-[var(--primary)]/20 to-transparent flex-1'></div>
                  <span className='text-xs text-[var(--text-secondary)] opacity-50 font-mono'>
                    #{String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Terminal-style footer */}
        <motion.div
          className='mt-8 ml-6 pl-6 border-l border-dashed border-[var(--card-border)] opacity-60'
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: items.length * 0.2 + 0.5, duration: 0.5 }}
        >
          <div className='flex items-center gap-2 text-xs text-[var(--text-secondary)] font-mono'>
            <span className='text-[var(--primary)]'>$</span>
            <span>journey --continue</span>
            <div className='w-2 h-3 bg-[var(--primary)] animate-pulse ml-1'></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
