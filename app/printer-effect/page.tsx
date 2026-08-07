'use client';

import SiteHeader from '@/components/SiteHeader';
import PrinterEffect from '@/components/PrinterEffect';

export default function PrinterEffectPage() {
  return (
    <div className="pb-24">
      <SiteHeader />

      <section className="mb-8 rise" style={{ animationDelay: '80ms' }}>
        <h1 className="text-[2rem] sm:text-[2.5rem] leading-[1.1] tracking-[-0.015em] font-medium mb-5">
          The machine
        </h1>
        <p className="text-[1.0625rem] leading-[1.7] text-[var(--text-secondary)]">
          An isometric blueprint of a printer — drawn in crisp line-work on a
          grid, dimensioned and labelled. Scroll, and it starts printing.
        </p>
      </section>

      <PrinterEffect />
    </div>
  );
}
