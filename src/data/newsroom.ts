export type NewsCategory = 'MATCHDAY' | 'CLUB' | 'CHAMPIONS' | 'TEAM'

export type NewsItem = {
  id: string
  category: NewsCategory
  date: string
  title: string
  excerpt: string
  image: string
  imagePosition?: string
  sourceUrl: string
}

export const newsItems: NewsItem[] = [
  {
    id: 'mourinho-betis',
    category: 'MATCHDAY',
    date: '03 SEP 2026',
    title: 'Mourinho: “To beat Betis, you have to be at your best.”',
    excerpt: 'The coach previews LaLiga matchday four and the trip to La Cartuja after three consecutive league wins.',
    image: '/assets/film/tunnel.webp',
    sourceUrl: 'https://www.realmadrid.com/en-US/news/football/first-team/press-conference/mourinho-03-09-2026',
  },
  {
    id: 'last-session-betis',
    category: 'TEAM',
    date: '03 SEP 2026',
    title: 'Final session before the match against Betis',
    excerpt: 'Activation, tactical work, pressing and possession shaped the final training session at Real Madrid City.',
    image: '/assets/squad/p04.webp',
    imagePosition: '50% 22%',
    sourceUrl: 'https://www.realmadrid.com/en-US/news/football/first-team/trainings/el-equipo-se-esta-entrenando-03-09-2026',
  },
  {
    id: 'champions-calendar',
    category: 'CHAMPIONS',
    date: '29 AUG 2026',
    title: 'The road through Europe is set',
    excerpt: 'Inter opens the campaign at the Bernabéu before trips to Rome, Athens, London and the decisive January nights.',
    image: '/assets/trophies/room.webp',
    sourceUrl: 'https://www.realmadrid.com/en-US/news/football/first-team/latest-news/calendarios-del-real-madrid-en-la-primera-fase-de-la-champions-2026-27-29-08-2026',
  },
  {
    id: 'ten-goals',
    category: 'TEAM',
    date: '31 AUG 2026',
    title: 'Ten goals. Three matches. A perfect start.',
    excerpt: 'Madrid begins the league season with nine points, ten goals scored and a statement of attacking intent.',
    image: '/assets/squad/p01.webp',
    imagePosition: '50% 18%',
    sourceUrl: 'https://www.realmadrid.com/en-US/',
  },
  {
    id: 'ancelotti-visit',
    category: 'CLUB',
    date: '03 SEP 2026',
    title: 'Carlo Ancelotti returns to Real Madrid City',
    excerpt: 'The former Madrid coach visited Valdebebas and greeted José Mourinho and the squad before training.',
    image: '/assets/bernabeu/aerial.webp',
    sourceUrl: 'https://www.realmadrid.com/en-US/news/football/first-team/latest-news/carlo-ancelotti-en-la-ciudad-real-madrid-03-09-2026',
  },
  {
    id: 'clasico-date',
    category: 'MATCHDAY',
    date: '01 SEP 2026',
    title: 'A date for El Clásico: 25 October',
    excerpt: 'Barcelona and Real Madrid meet at the Spotify Camp Nou on matchday ten, with kick-off set for 9:00 pm CEST.',
    image: '/assets/film/lights.webp',
    sourceUrl: 'https://www.realmadrid.com/en-US/news/football/first-team/latest-news/el-barcelona-real-madrid-se-jugara-el-domingo-25-de-octubre-a-las-21-00-h-01-09-2026',
  },
]

