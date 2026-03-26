import { AlertCircle, RefreshCw } from "lucide-react";

export function VideoErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div>
            <p className="font-medium">Couldn&apos;t load clinicians</p>
            <p className="mt-1 text-sm text-red-800/90">{message}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 rounded-xl border border-red-200 bg-white p-2.5 text-red-700 transition-colors hover:bg-red-100"
          title="Retry"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
