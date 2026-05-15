import clsx from 'clsx';

export function LoadingSkeleton({
  className = '',
  width,
  height,
}: {
  className?: string;
  width?: string | number;
  height?: string | number;
}) {
  return (
    <div
      className={clsx('animate-pulse bg-line rounded-bartal', className)}
      style={{ width, height }}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-line rounded-bartal overflow-hidden">
      <LoadingSkeleton className="rounded-none" height={140} />
      <div className="p-3 space-y-2">
        <LoadingSkeleton height={10} width="40%" />
        <LoadingSkeleton height={14} width="80%" />
        <LoadingSkeleton height={18} width="50%" />
      </div>
    </div>
  );
}
