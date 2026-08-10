// Sistema editorial de numeração: mesma voz tipográfica em todas as seções.
export default function SectionLabel({ n, title, className = '' }: { n: string; title: string; className?: string }) {
  return (
    <p className={`text-xs tracking-[0.35em] opacity-50 ${className}`}>
      {n} — {title}
    </p>
  )
}
