const SPAM_KEYWORDS = ['defective', 'broken', 'fake', 'scam', 'refund'] as const;
const URL_REGEX = /\b(?:https?:\/\/|www\.)\S+/i;

export function runAutoFlag(rating: number, comment: string | null | undefined): string | null {
  if (!comment) return null;
  const text = comment.toLowerCase();

  const hasUrl = URL_REGEX.test(comment);
  const matchedKeyword = SPAM_KEYWORDS.find((kw) => text.includes(kw));

  if (hasUrl && matchedKeyword) return 'Auto-flag: spam keywords + URL';
  if (hasUrl) return 'Auto-flag: contains URL';
  if (matchedKeyword) return `Auto-flag: contains "${matchedKeyword}"`;
  return null;
}
