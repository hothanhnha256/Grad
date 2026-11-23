export function Mortarboard({ className = "", tassel = "#ffd34d" }: { className?: string; tassel?: string }) {
  return (
    <svg viewBox="0 0 120 96" className={className} aria-hidden="true">
      <path d="M30 44 v22 q30 18 60 0 v-22" fill="#13235b" stroke="#13235b" strokeWidth="5" strokeLinejoin="round" />
      <path d="M60 8 L114 34 L60 60 L6 34 Z" fill="#2348c7" stroke="#13235b" strokeWidth="5" strokeLinejoin="round" />
      <circle cx="60" cy="34" r="5" fill={tassel} stroke="#13235b" strokeWidth="3" />
      <path d="M60 34 Q92 40 96 58" fill="none" stroke={tassel} strokeWidth="4" strokeLinecap="round" />
      <path d="M92 56 l8 0 l-2 22 l-4 0 Z" fill={tassel} stroke="#13235b" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

export function Star({ className = "", fill = "#ffd34d" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path
        d="M20 3 L25 14.5 L37 15.6 L28 23.7 L30.6 35.6 L20 29.4 L9.4 35.6 L12 23.7 L3 15.6 L15 14.5 Z"
        fill={fill}
        stroke="#13235b"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Diploma({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" className={className} aria-hidden="true">
      <rect x="10" y="14" width="100" height="32" rx="16" fill="#fff4c7" stroke="#13235b" strokeWidth="5" />
      <ellipse cx="18" cy="30" rx="8" ry="16" fill="#fff" stroke="#13235b" strokeWidth="5" />
      <rect x="56" y="12" width="12" height="36" fill="#ff7a7a" stroke="#13235b" strokeWidth="4" />
    </svg>
  );
}
