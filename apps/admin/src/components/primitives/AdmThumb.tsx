import { useState } from 'react';
import clsx from 'clsx';

export function AdmThumb({
  url,
  alt,
  className,
}: {
  url?: string | null;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!url || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={clsx(
          'flex items-center justify-center bg-sand dark:bg-d-raised text-ink-mute dark:text-d-textMute',
          className,
        )}
      >
        <svg
          width="40%"
          height="40%"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      </div>
    );
  }
  return <img src={url} alt={alt} className={className} onError={() => setFailed(true)} />;
}
