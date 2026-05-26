import type { ReactNode } from 'react';

interface WebStaticShellProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/**
 * Shared shell for static-content pages (Privacy, ToS, FAQ, About, Contact).
 * Provides the eyebrow + h1 + subtitle hero and the max-width body container.
 * Header / Footer come from the root layout — this is the in-main wrapper.
 *
 * Mirrors docs/design/bartal/project/system-kit.jsx::WebStaticShell.
 */
export function WebStaticShell({
  eyebrow,
  title,
  subtitle,
  children,
}: WebStaticShellProps) {
  return (
    <div className="max-w-[980px] mx-auto px-5 md:px-10 pt-12 pb-20">
      <div className="text-[11px] font-bold text-amber uppercase tracking-[2px] mb-3.5">
        {eyebrow}
      </div>
      <h1
        className="text-ink font-bold text-balance"
        style={{ fontSize: 40, lineHeight: 1.15 }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className="text-ink-mute mt-3.5 leading-relaxed max-w-[680px]"
          style={{ fontSize: 16 }}
        >
          {subtitle}
        </p>
      )}
      <div className="mt-10">{children}</div>
    </div>
  );
}
