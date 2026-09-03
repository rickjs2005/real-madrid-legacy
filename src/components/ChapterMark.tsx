// Marca editorial fixa de cada capítulo: numeração à esquerda, coordenadas à direita.
// Tipografia como elemento gráfico — nunca um "header".
export default function ChapterMark({
  n,
  title,
  right = '40.4531° N · 3.6883° W',
  tone = 'silver',
}: {
  n: string
  title: string
  right?: string
  tone?: 'silver' | 'black'
}) {
  const color = tone === 'black' ? 'text-black/70' : 'text-silver'
  return (
    <>
      <p className={`t-label absolute left-[6vw] top-[5vh] z-20 ${color}`}>
        {n} — {title}
      </p>
      <p className={`t-label absolute right-[6vw] top-[5vh] z-20 ${color}`}>{right}</p>
    </>
  )
}
