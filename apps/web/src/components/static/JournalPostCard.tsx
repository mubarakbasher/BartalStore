import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import {
  ProductPlaceholder,
  type PlaceholderHue,
} from '@/components/ProductPlaceholder';

type Post = Dictionary['web']['journal']['posts'][number];

interface Props {
  post: Post;
  locale: Locale;
  dict: Dictionary;
}

export function JournalPostCard({ post, dict }: Pick<Props, 'post' | 'dict'>) {
  const t = dict.web.journal;
  return (
    <article className="cursor-pointer group">
      <div className="h-[200px] rounded-bartal overflow-hidden mb-3.5 relative">
        <ProductPlaceholder label={post.title} hue={post.hue as PlaceholderHue} />
        <div className="absolute top-3 start-3 px-2.5 py-1 bg-white text-ink rounded-full text-[10px] font-bold tracking-wider uppercase">
          {post.categoryLabel}
        </div>
      </div>
      <div className="text-[11px] text-ink-mute mb-1.5">
        {post.date} · {post.read} {t.readSuffix}
      </div>
      <h3 className="text-ink font-bold leading-snug mb-2 text-balance group-hover:text-amber transition-colors" style={{ fontSize: 18 }}>
        {post.title}
      </h3>
      <p className="text-ink-mute leading-relaxed mb-2.5" style={{ fontSize: 13 }}>
        {post.excerpt}
      </p>
      <div className="text-[12px] text-ink-mute">
        {t.byPrefix} {post.author}
      </div>
    </article>
  );
}
