import { Skeleton } from '@/components/ui/skeleton';

function LoadingView() {
  return (
    <div className="ring-1 ring-slate-200 rounded-lg p-1">
      <Skeleton className="h-8 w-full" />
    </div>
  );
}

export default LoadingView;
