export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M57 18v18m0 24v8c0 14 9 23 22 23s22-9 22-23V18"
        stroke="currentColor"
        strokeWidth="16"
      />
      <g stroke="var(--blue, #2563eb)" strokeWidth="5">
        <path d="M2 48h70M8 9l25 26c8 9 16 13 29 13M8 87l25-26c8-9 16-13 29-13M31 1c5 16 10 25 20 31M31 95c5-16 10-25 20-31" />
      </g>
      <path
        d="m69 35 17 13-17 13zM47 24l9 13-16-3zM47 72l9-13-16 3z"
        fill="var(--blue, #2563eb)"
      />
    </svg>
  );
}

export function Logo({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand ${small ? "brand-small" : ""}`} aria-label="UWAS">
      <LogoMark />
      <span>WAS</span>
    </span>
  );
}
