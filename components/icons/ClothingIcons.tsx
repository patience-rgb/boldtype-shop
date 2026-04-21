export function TShirtIcon({ className = 'w-10 h-10', stroke = 'currentColor' }: { className?: string; stroke?: string }) {
  return (
    <svg className={className} viewBox="0 0 56 56" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 8C19 11 16 14 10 16L4 19L10 29L16 26V48H40V26L46 29L52 19L46 16C40 14 37 11 36 8C34 12 31 15 28 15C25 15 22 12 20 8Z" />
    </svg>
  )
}

export function HoodieIcon({ className = 'w-10 h-10', stroke = 'currentColor' }: { className?: string; stroke?: string }) {
  return (
    <svg className={className} viewBox="0 0 56 56" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 8C18 11 14 14 8 16L4 18L10 28L16 25V48H40V25L46 28L52 18L48 16C42 14 38 11 36 8C34 11 31 14 28 14C25 14 22 11 20 8Z" />
      <path d="M20 8C21 14 22 20 22 28H34C34 20 35 14 36 8" />
      <line x1="22" y1="36" x2="34" y2="36" />
    </svg>
  )
}

export function SweatshirtIcon({ className = 'w-10 h-10', stroke = 'currentColor' }: { className?: string; stroke?: string }) {
  return (
    <svg className={className} viewBox="0 0 56 56" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10C19 13 16 15 10 17L4 20L10 30L16 27V48H40V27L46 30L52 20L46 17C40 15 37 13 36 10C34 13 31 16 28 16C25 16 22 13 20 10Z" />
      <path d="M22 10C22 13 25 16 28 16C31 16 34 13 34 10" />
    </svg>
  )
}
