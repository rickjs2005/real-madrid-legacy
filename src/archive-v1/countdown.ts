export function countdownParts(targetISO: string, now: Date) {
  const diff = Date.parse(targetISO) - now.getTime()
  if (diff <= 0) return null
  const pad = (n: number) => String(n).padStart(2, '0')
  const minutes = Math.floor(diff / 60000)
  return {
    days: pad(Math.floor(minutes / 1440)),
    hours: pad(Math.floor((minutes % 1440) / 60)),
    minutes: pad(minutes % 60),
  }
}
