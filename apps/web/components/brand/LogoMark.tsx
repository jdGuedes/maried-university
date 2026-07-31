export function LogoMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="inline-flex items-center gap-3" aria-label="MARIED UNIVERSITY">
      <span className="grid size-12 place-items-center rounded-[var(--maried-radius-xl)] bg-[image:var(--maried-gradient-primary)] text-lg font-bold text-[var(--maried-color-text-inverse)] shadow-[var(--maried-shadow-soft)]">
        M
      </span>
      {!compact ? (
        <span className="leading-tight">
          <span className="block font-[var(--maried-font-display)] text-xl font-semibold text-[var(--maried-color-text-primary)]">MARIED</span>
          <span className="block text-xs font-semibold tracking-normal text-[var(--maried-color-text-secondary)]">UNIVERSITY</span>
        </span>
      ) : null}
    </div>
  );
}
