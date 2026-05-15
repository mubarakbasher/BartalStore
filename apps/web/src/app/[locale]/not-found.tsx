import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-6 py-20 text-center">
      <div className="text-display font-bold text-amber mb-3">404</div>
      <div className="text-h2 text-ink font-bold mb-2">Page not found</div>
      <p className="text-body text-ink-mute mb-6 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center h-11 px-5 bg-amber text-white rounded-bartal font-semibold hover:bg-[#B57208]"
      >
        Back to home
      </Link>
    </div>
  );
}
