import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionLabel from '../../components/SectionLabel'

gsap.registerPlugin(ScrollTrigger)

export default function Madridista() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-word]', {
        scrollTrigger: { trigger: root.current, start: 'top 60%' },
        yPercent: 110,
        stagger: 0.15,
        duration: 1,
        ease: 'power4.out',
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="madridista" className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <SectionLabel n="08" title="MADRIDISTA" />
      <div className="mt-8 overflow-hidden">
        <h2 data-word className="font-display text-[10vw] leading-none">MADRIDISTA</h2>
      </div>
      <div className="overflow-hidden">
        <p data-word className="font-display text-[2vw] text-gold mt-2">The club. The people. The legacy.</p>
      </div>
      <p className="mt-10 inline-block border-b border-current pb-1 text-sm tracking-[0.3em] hover:text-gold hover:border-gold transition-colors cursor-pointer">
        JOIN THE COMMUNITY →
      </p>
    </section>
  )
}
