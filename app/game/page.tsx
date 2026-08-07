'use client';

import SiteHeader from '@/components/SiteHeader';
import DragonGame from '@/components/DragonGame';

export default function GamePage() {
  return (
    <div className='pb-24'>
      <SiteHeader />

      <section className='mb-10 rise' style={{ animationDelay: '80ms' }}>
        <h1 className='text-[2rem] sm:text-[2.5rem] leading-[1.1] tracking-[-0.015em] font-medium mb-5'>
          Dragon Run
        </h1>
        <p className='text-[1.0625rem] leading-[1.7] text-[var(--text-secondary)]'>
          A little game I used to play as a kid — a baby dragon racing home
          across the hills while mom chases from behind. Dive down the slopes to
          gather momentum, launch off the crests to fly, and land the next
          downhill just right to fly even further. It plays fullscreen; press
          start and go.
        </p>
      </section>

      <section className='rise' style={{ animationDelay: '160ms' }}>
        <DragonGame />
      </section>

      <section
        className='mt-8 rise text-[var(--text-secondary)]'
        style={{ animationDelay: '240ms' }}
      >
        <p className='text-[0.95rem] leading-[1.7]'>
          <span className='meta'>How to play</span> — There&apos;s no free
          speed: everything comes from the hills. Hold the mouse (or{' '}
          <kbd className='font-mono text-[0.85em]'>Space</kbd> /{' '}
          <kbd className='font-mono text-[0.85em]'>↓</kbd>) to dive down a slope
          and gather momentum, then <em>let go at the crest</em> to launch into
          the sky. Hold again to dive back down — land on the <em>next</em>{' '}
          downslope for a <strong>perfect landing</strong> that boosts your speed
          and builds a combo; hit an uphill and you lose it all. Mom starts right
          on your tail and only gets faster, so keep the chain alive, grab gems,
          and fly home.
        </p>
      </section>
    </div>
  );
}
