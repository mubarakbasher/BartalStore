interface TocEntry {
  id: string;
  label: string;
}

interface TableOfContentsProps {
  heading: string;
  entries: TocEntry[];
  variant?: 'inline' | 'sticky';
}

/**
 * Two-column grid of anchor links jumping to in-page sections.
 * `inline` variant: bordered card in the body flow (Privacy).
 * `sticky` variant: left rail with sticky position (ToS — used later).
 *
 * Mirrors docs/design/bartal/project/system-kit.jsx::WebPrivacy TOC + web-extras.jsx::WebToS.
 */
export function TableOfContents({
  heading,
  entries,
  variant = 'inline',
}: TableOfContentsProps) {
  if (variant === 'sticky') {
    return (
      <nav aria-label={heading} className="sticky top-32 w-60 hidden lg:block">
        <div className="text-[11px] text-ink-mute font-semibold uppercase tracking-wider mb-2.5">
          {heading}
        </div>
        <ul className="flex flex-col gap-1.5">
          {entries.map((e) => (
            <li key={e.id}>
              <a
                href={`#${e.id}`}
                className="text-small text-ink hover:text-amber transition-colors"
              >
                {e.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav
      aria-label={heading}
      className="bg-white border border-line rounded-bartal p-5"
    >
      <div className="text-[11px] text-ink-mute font-semibold uppercase tracking-wider mb-2.5">
        {heading}
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
        {entries.map((e) => (
          <li key={e.id}>
            <a
              href={`#${e.id}`}
              className="text-small text-amber font-semibold hover:underline normal-case tracking-normal"
            >
              <span aria-hidden className="me-1">→</span>
              {e.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
