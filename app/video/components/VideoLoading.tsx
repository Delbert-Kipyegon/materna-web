export function VideoLoading() {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 py-8">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-200 border-t-violet-600" />
      <p className="text-sm tracking-wide text-zinc-500">Loading care team…</p>
    </div>
  );
}
