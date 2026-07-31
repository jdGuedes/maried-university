export function Spinner() {
  return (
    <span
      aria-label="Carregando"
      className="inline-block size-5 rounded-full border-2 border-[rgba(168,121,53,0.22)] border-t-[var(--maried-color-brand-primary)] motion-safe:animate-spin"
      role="status"
    />
  );
}
