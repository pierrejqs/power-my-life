export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#05080c]">
      <div className="flex flex-col items-center gap-4 text-center text-white">
        <div className="animate-pulse text-7xl">⚡</div>
        <div className="text-xs uppercase tracking-[0.35em] text-white/60">
          Power My Life
        </div>
      </div>
    </div>
  );
}
