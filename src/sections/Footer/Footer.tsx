import { initSmoothScroll } from '../../lib/lenis'

const LINKS = [
  { label: 'Club', target: '#hero' },
  { label: 'Matches', target: '#matchday' },
  { label: 'Squad', target: '#squad' },
  { label: 'History', target: '#legacy' },
  { label: 'Bernabéu', target: '#bernabeu' },
  { label: 'Shop', target: '#shop' },
]

export default function Footer() {
  return (
    <footer className="px-[8vw] pb-10 pt-[10vh]">
      <div className="flex items-start justify-between border-t border-current/15 pt-10">
        <p className="font-display text-3xl">REAL MADRID</p>
        <nav className="grid grid-cols-3 gap-x-16 gap-y-3">
          {LINKS.map((l) => (
            <button
              key={l.label}
              onClick={() => initSmoothScroll().scrollTo(l.target)}
              className="text-left text-sm opacity-70 hover:opacity-100 hover:text-gold transition-all"
            >
              {l.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-16 flex items-end justify-between text-xs opacity-40">
        <p>Partners: Emirates · adidas</p>
        <p className="max-w-md text-right">
          Unofficial concept for portfolio purposes. All imagery and trademarks belong to Real Madrid CF.
        </p>
      </div>
    </footer>
  )
}
