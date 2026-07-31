export function Skeleton({ label = "Carregando conteudo" }: { label?: string }) {
  return (
    <div aria-label={label} className="h-4 w-full overflow-hidden rounded-[var(--maried-radius-full)] bg-[rgba(168,121,53,0.12)]" role="status">
      <span className="block h-full w-1/2 bg-gradient-to-r from-transparent via-white/65 to-transparent motion-safe:animate-pulse" />
    </div>
  );
}
