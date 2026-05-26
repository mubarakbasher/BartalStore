'use client';
import { useMemo, useState } from 'react';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { Accordion, type AccordionItem } from '@/components/static/Accordion';
import { SearchIcon } from '@/components/Icons';
import { BARTAL } from '@/design/tokens';

interface FaqSearchAccordionProps {
  dict: Dictionary;
}

export function FaqSearchAccordion({ dict }: FaqSearchAccordionProps) {
  const f = dict.web.faq;
  const [query, setQuery] = useState('');

  const items: AccordionItem[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    const all = f.questions.map((it) => ({
      id: it.id,
      question: it.q,
      answer: it.a,
    }));
    if (!q) return all;
    return all.filter(
      (it) =>
        it.question.toLowerCase().includes(q) ||
        it.answer.toLowerCase().includes(q),
    );
  }, [query, f.questions]);

  return (
    <div className="max-w-[800px]">
      <div className="bg-white border border-line rounded-bartal flex items-center gap-2.5 px-4 py-3 mb-4">
        <SearchIcon size={16} color={BARTAL.textMute} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={f.searchPlaceholder}
          className="flex-1 bg-transparent text-body text-ink placeholder:text-ink-mute focus:outline-none"
        />
      </div>

      <Accordion
        items={items}
        defaultOpenId={items[0]?.id}
        emptyText={f.noResults}
      />
    </div>
  );
}
