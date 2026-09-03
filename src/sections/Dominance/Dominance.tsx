import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ChapterMark from '../../components/ChapterMark'

gsap.registerPlugin(ScrollTrigger)

const era = [
  { name: 'Cristiano', surname: 'Ronaldo', role: '450 GOALS', detail: 'THE STANDARD', image: '/assets/legacy/2014.webp' },
  { name: 'Sergio', surname: 'Ramos', role: '92:48', detail: 'THE SECOND THAT CHANGED EVERYTHING' },
  { name: 'Marcelo', surname: 'Vieira', role: 'NO. 12', detail: 'JOY WITH AN EDGE' },
  { name: 'Karim', surname: 'Benzema', role: '354 GOALS', detail: 'FROM SHADOW TO CROWN', image: '/assets/legacy/2022.webp' },
  { name: 'Luka', surname: 'Modrić', role: 'THE PAUSE', detail: 'TIME MOVED AROUND HIM' },
  { name: 'Toni', surname: 'Kroos', role: 'THE PASS', detail: 'PRECISION WITHOUT NOISE' },
]

function formatMatchClock(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export default function Dominance() {
  const root = useRef<HTMLElement>(null)
  const goals = useRef<HTMLSpanElement>(null)
  const clock = useRef<HTMLSpanElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const goalState = { value: 0 }
      gsap
        .timeline({
          scrollTrigger: { trigger: '[data-dom-cr7]', start: 'top top', end: '+=300%', pin: true, scrub: 0.8 },
        })
        .fromTo('[data-dom-photo]', { opacity: 0, scale: 1.16 }, { opacity: 0.72, scale: 1, duration: 0.35, ease: 'power2.out' }, 0)
        .fromTo('[data-dom-kicker]', { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.05)
        .to(goalState, {
          value: 450,
          duration: 0.38,
          ease: 'power4.out',
          onUpdate: () => {
            if (goals.current) goals.current.textContent = String(Math.round(goalState.value)).padStart(3, '0')
          },
        }, 0.12)
        .fromTo('[data-dom-name] .mask-line > span', { yPercent: 110 }, { yPercent: 0, duration: 0.09, ease: 'expo.out' }, 0.3)
        .fromTo('[data-dom-meta]', { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.38)
        .to('[data-dom-photo]', { xPercent: 5, ease: 'none', duration: 0.62 }, 0.38)
        .to('[data-dom-scene]', { opacity: 0, duration: 0.08 }, 0.92)

      const clockState = { value: 90 * 60 }
      gsap
        .timeline({
          scrollTrigger: { trigger: '[data-dom-ramos]', start: 'top top', end: '+=320%', pin: true, scrub: 0.75 },
        })
        .fromTo('[data-dom-match]', { opacity: 0, scale: 1.12 }, { opacity: 0.34, scale: 1.04, duration: 0.3, ease: 'power2.out' }, 0.02)
        .fromTo('[data-dom-clock]', { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.04)
        .to(clockState, {
          value: 92 * 60 + 48,
          duration: 0.38,
          ease: 'power2.in',
          onUpdate: () => {
            if (clock.current) clock.current.textContent = formatMatchClock(clockState.value)
          },
        }, 0.12)
        .to('[data-dom-clock]', { color: '#b89b5e', duration: 0.02 }, 0.5)
        .fromTo('[data-dom-flash]', { opacity: 0 }, { opacity: 1, duration: 0.018, repeat: 1, yoyo: true }, 0.51)
        .to('[data-dom-match]', { opacity: 0, scale: 1, duration: 0.035, ease: 'power2.in' }, 0.515)
        .fromTo(
          '[data-dom-aftermath]',
          { opacity: 0, scale: 1.12, clipPath: 'inset(0 0 100% 0)' },
          { opacity: 0.48, scale: 1.02, clipPath: 'inset(0 0 0% 0)', duration: 0.13, ease: 'expo.out' },
          0.53,
        )
        .fromTo('[data-dom-moment]', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.05, ease: 'power3.out' }, 0.57)
        .fromTo('[data-dom-ramos-name] .mask-line > span', { yPercent: 115 }, { yPercent: 0, duration: 0.07, ease: 'expo.out' }, 0.59)
        .fromTo('[data-dom-ramos-copy]', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.08, ease: 'power3.out' }, 0.68)
        .fromTo('[data-dom-ramos-rule]', { scaleX: 0 }, { scaleX: 1, duration: 0.12, ease: 'power3.inOut' }, 0.7)

      const reel = track.current!
      const distance = () => reel.scrollWidth - window.innerWidth
      const horizontal = gsap.to(reel, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-dom-era]',
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.85,
          invalidateOnRefresh: true,
        },
      })
      gsap.utils.toArray<HTMLElement>('[data-dom-member]').forEach((member) => {
        const photo = member.querySelector('[data-member-photo]')
        if (photo) {
          gsap.fromTo(photo, { xPercent: -8 }, {
            xPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: member, containerAnimation: horizontal, start: 'left right', end: 'right left', scrub: true },
          })
        }
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="dominance" className="relative bg-black text-white">
      <div data-dom-cr7 data-cursor="view" className="relative h-screen overflow-hidden bg-black">
        <ChapterMark n="04" title="THE ERA OF DOMINANCE" right="2009 — 2018" />
        <div data-dom-photo className="absolute inset-y-0 right-0 w-[48vw] opacity-0">
          <img src="/assets/legacy/2014.webp" alt="Cristiano Ronaldo" className="img-dominance h-full w-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        </div>
        <div data-dom-scene className="absolute inset-0">
          <p data-dom-kicker className="t-serif-i absolute left-[6vw] top-[22vh] text-[4.8vw] text-silver opacity-0">
            One man raised
            <br />
            the ceiling.
          </p>
          <div className="absolute bottom-[6vh] left-[6vw] z-10">
            <div className="flex items-end gap-6">
              <span ref={goals} data-stretch className="t-num text-[25vw] text-gold">000</span>
              <span className="t-label mb-[3.8vw]">GOALS<br />FOR REAL MADRID</span>
            </div>
            <h2 data-dom-name className="t-display -mt-[1vw] text-[9vw] text-pure">
              <span className="mask-line block"><span className="block">Cristiano Ronaldo.</span></span>
            </h2>
            <div data-dom-meta className="mt-5 flex gap-10 opacity-0">
              <span className="t-label">438 MATCHES</span>
              <span className="t-label">4 EUROPEAN CUPS</span>
              <span className="t-label">THE STANDARD</span>
            </div>
          </div>
        </div>
      </div>

      <div data-dom-ramos className="relative h-screen overflow-hidden bg-black">
        <ChapterMark n="04" title="THE OBSESSION" right="24 · 05 · 2014 · LISBON" />

        {/* O palco aparece enquanto o relógio avança; o flash em 92:48 troca o jogo pela consequência. */}
        <div data-dom-match className="absolute inset-0 z-0 opacity-0">
          <img
            src="/assets/dominance/lisbon-final.webp"
            alt="2014 Champions League final in Lisbon"
            className="img-dominance h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_52%,rgba(8,8,8,0.12),#080808_82%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />
        </div>

        <div data-dom-aftermath className="absolute inset-y-0 right-0 z-[5] w-[58vw] overflow-hidden opacity-0">
          <img
            src="/assets/dominance/ramos-9248.webp"
            alt="Real Madrid celebrating La Décima after the 2014 final"
            className="img-flash h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/25 to-black/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/55" />
          <div className="absolute inset-0 crt" />
        </div>

        <p data-dom-moment className="t-label absolute right-[6vw] top-[13vh] z-20 text-right opacity-0">
          THE CONSEQUENCE · LA DÉCIMA
        </p>

        <span ref={clock} data-dom-clock data-stretch className="t-num absolute left-[5vw] top-[16vh] z-10 text-[29vw] text-silver opacity-0">
          90:00
        </span>
        <div data-dom-flash className="pointer-events-none absolute inset-0 z-30 bg-pure opacity-0" />
        <div className="absolute bottom-[7vh] left-[6vw] right-[6vw] z-20">
          <h2 data-dom-ramos-name className="t-display text-[13vw] text-pure">
            <span className="mask-line block"><span className="block">Ramos.</span></span>
          </h2>
          <div data-dom-ramos-rule className="rule origin-left" />
          <div data-dom-ramos-copy className="mt-5 flex items-start justify-between opacity-0">
            <p className="t-serif-i text-[3.8vw] text-gold">One second. Ten years erased.</p>
            <p className="t-label max-w-[28vw] text-right leading-[1.8]">THE EQUALISER · LA DÉCIMA · THE MOMENT BELIEF BECAME INEVITABLE</p>
          </div>
        </div>
      </div>

      <div data-dom-era className="relative h-screen overflow-hidden bg-black">
        <div ref={track} className="flex h-full w-max">
          {era.map((member, i) => (
            <article key={member.surname} data-dom-member className="relative h-screen w-[72vw] shrink-0 overflow-hidden border-r border-silver/20 px-[6vw]">
              <p className="t-label absolute left-[6vw] top-[5vh]">04.{String(i + 1).padStart(2, '0')} — THE ERA</p>
              <p className="t-num outline-text absolute -right-[2vw] top-[4vh] text-[34vw] text-transparent opacity-30">{String(i + 1).padStart(2, '0')}</p>
              {member.image && (
                <div className="absolute bottom-0 right-[4vw] h-[78vh] w-[30vw] overflow-hidden">
                  <img data-member-photo src={member.image} alt={`${member.name} ${member.surname}`} className="img-dominance h-full w-[116%] max-w-none object-cover object-top" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
              )}
              <div className="absolute bottom-[9vh] left-[6vw] z-10">
                <p className="t-label mb-5 text-gold">{member.role}</p>
                <h3 data-stretch className={`${i % 2 ? 't-serif' : 't-display'} text-[9.5vw] leading-[0.82] text-pure`}>
                  {member.name}<br />
                  <span className={i % 2 ? 't-serif-i' : ''}>{member.surname}</span>
                </h3>
                <div className="rule mt-6 w-[36vw]" />
                <p className="t-label mt-4">{member.detail}</p>
              </div>
            </article>
          ))}
          <div className="flex h-screen w-[52vw] shrink-0 items-center justify-center px-[6vw]">
            <p className="t-display-thin text-[5vw] text-silver">Not a team.<br /><span className="text-gold">An era.</span></p>
          </div>
        </div>
      </div>
    </section>
  )
}
