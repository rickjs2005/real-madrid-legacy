import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ChapterMark from '../../components/ChapterMark'
import { newsItems, type NewsCategory, type NewsItem } from '../../data/newsroom'

gsap.registerPlugin(ScrollTrigger)

type CategoryFilter = 'ALL' | NewsCategory
const categories: CategoryFilter[] = ['ALL', 'MATCHDAY', 'TEAM', 'CHAMPIONS', 'CLUB']

export default function Newsroom() {
  const root = useRef<HTMLElement>(null)
  const [category, setCategory] = useState<CategoryFilter>('ALL')
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedNews(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-news-reveal]',
        { y: 54, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 70%' },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  const filteredNews = useMemo(
    () => newsItems.filter((item) => category === 'ALL' || item.category === category),
    [category],
  )
  const featured = filteredNews[0]
  const secondary = filteredNews.slice(1)

  return (
    <section ref={root} id="newsroom" className="relative min-h-screen overflow-hidden bg-black px-[6vw] pb-[10vh] pt-[15vh] text-white">
      <ChapterMark n="09" title="NEWSROOM" right="THE CLUB · RIGHT NOW" />

      <header data-news-reveal className="flex items-end justify-between border-b border-silver/25 pb-7 opacity-0">
        <h2 className="t-display text-[8.8vw]">MORE THAN<br /><span className="text-gold">MEMORY.</span></h2>
        <p className="t-serif-i mb-3 max-w-[27vw] text-[2.8vw] text-silver">A living club never stops writing its story.</p>
      </header>

      <nav data-news-reveal className="flex gap-8 border-b border-silver/20 py-6 opacity-0" aria-label="News categories">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            data-cursor="view"
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
            className={`t-label transition-colors ${category === item ? 'text-gold' : 'hover:text-white'}`}
          >
            {item}
          </button>
        ))}
      </nav>

      {featured && (
        <div className="mt-8 grid grid-cols-[1.2fr_0.8fr] border-b border-silver/25 pb-8" aria-live="polite">
          <button
            type="button"
            data-cursor="view"
            onClick={() => setSelectedNews(featured)}
            className="group relative h-[54vh] overflow-hidden text-left"
          >
            <img
              src={featured.image}
              alt=""
              style={{ objectPosition: featured.imagePosition }}
              className="img-dominance h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
            <div className="absolute bottom-0 left-0 max-w-[85%] p-8">
              <p className="t-label text-gold">{featured.category} · {featured.date}</p>
              <h3 className="t-display-thin mt-4 text-[3.4vw] leading-[0.95]">{featured.title}</h3>
            </div>
          </button>

          <div className="flex flex-col justify-between border-l border-silver/25 pl-[4vw]">
            <div>
              <p className="t-label">LATEST DISPATCH</p>
              <p className="t-serif-i mt-8 text-[3vw] text-silver">{featured.excerpt}</p>
            </div>
            <button
              type="button"
              data-cursor="view"
              onClick={() => setSelectedNews(featured)}
              className="t-label flex items-center justify-between border-t border-silver/25 py-6 text-left text-white hover:text-gold"
            >
              READ STORY <span className="text-xl">↗</span>
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3" aria-live="polite">
        {secondary.map((item, index) => (
          <button
            key={item.id}
            type="button"
            data-cursor="view"
            onClick={() => setSelectedNews(item)}
            className={`group border-b border-silver/20 py-8 text-left ${index % 3 !== 0 ? 'border-l pl-8' : 'pr-8'}`}
          >
            <div className="h-[25vh] overflow-hidden">
              <img
                src={item.image}
                alt=""
                style={{ objectPosition: item.imagePosition }}
                className="img-dominance h-full w-full object-cover transition duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
              />
            </div>
            <p className="t-label mt-6 text-gold">{item.category} · {item.date}</p>
            <h3 className="t-display-thin mt-4 text-[2.2vw] leading-none transition-colors group-hover:text-gold">{item.title}</h3>
          </button>
        ))}
      </div>

      <div className="mt-7 flex justify-between">
        <p className="t-label">EDITORIAL SNAPSHOT · 03 SEP 2026</p>
        <p className="t-label">INTERACTIVE FILTERS · STORY VIEW</p>
      </div>

      {selectedNews && (
        <div
          className="fixed inset-0 z-[120] flex items-end bg-black/80 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedNews(null)
          }}
        >
          <article role="dialog" aria-modal="true" aria-label={selectedNews.title} className="grid h-[78vh] w-full grid-cols-[0.85fr_1.15fr] bg-pure text-black">
            <div className="relative overflow-hidden">
              <img
                src={selectedNews.image}
                alt=""
                style={{ objectPosition: selectedNews.imagePosition }}
                className="img-dominance h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              <p className="t-label absolute bottom-8 left-8 text-white">{selectedNews.category} · {selectedNews.date}</p>
            </div>
            <div className="relative flex flex-col justify-between p-[5vw]">
              <button
                type="button"
                data-cursor="view"
                onClick={() => setSelectedNews(null)}
                className="t-label absolute right-[4vw] top-[4vh] border-b border-black pb-2 text-black"
              >
                CLOSE ×
              </button>
              <div className="mt-[5vh]">
                <p className="t-label text-black/50">THE LATEST · REAL MADRID</p>
                <h3 className="t-display mt-7 text-[4.8vw] leading-[0.9]">{selectedNews.title}</h3>
                <p className="t-serif-i mt-9 max-w-[42vw] text-[2.4vw] text-black/65">{selectedNews.excerpt}</p>
              </div>
              <a
                href={selectedNews.sourceUrl}
                target="_blank"
                rel="noreferrer"
                data-cursor="view"
                className="t-label flex items-center justify-between border-y border-black/25 py-6 text-black transition-colors hover:text-gold"
              >
                READ AT REALMADRID.COM <span className="text-xl">↗</span>
              </a>
            </div>
          </article>
        </div>
      )}
    </section>
  )
}

