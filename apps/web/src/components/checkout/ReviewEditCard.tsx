import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Dictionary } from '@/lib/i18n/dictionary';

interface ReviewEditCardProps {
  title: string;
  editLabel: string;
  editHref: string;
  dict: Dictionary;
  children: ReactNode;
}

export function ReviewEditCard({
  title,
  editLabel,
  editHref,
  dict,
  children,
}: ReviewEditCardProps) {
  const editPrefix = dict.web.checkout.review.editPrefix;
  return (
    <div className="bg-white border border-line rounded-bartal p-4">
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="text-small font-bold text-ink uppercase tracking-wider">
          {title}
        </div>
        <Link
          href={editHref}
          className="text-micro text-amber font-semibold hover:underline normal-case tracking-normal"
        >
          {editPrefix} {editLabel}
        </Link>
      </div>
      {children}
    </div>
  );
}
