// Snapshot real: 2026-08-10 — fonte: realmadrid.com (case gravado, não mantido vivo)
//
// Fatos históricos estáveis do clube (fundação, títulos europeus marcantes) —
// não sujeitos a mudança, não carecem de reverificação além do conhecimento
// factual já consolidado sobre a história do Real Madrid.
//
// A fundação (1902) vive na tela de abertura da seção ("124 YEARS"), não como era.

export const founded = 1902
export const yearsOfHistory = 2026 - founded // 124

// Arco narrativo: o reinado começa nos anos 50 → era dourada → Galácticos →
// La Décima → o tricampeonato → o herói Benzema → o herói Vinícius.
// Cada capítulo tem um protagonista nomeado — história de gerações, não Wikipedia.
export const eras = [
  { year: '1956', title: 'THE REIGN BEGINS', text: 'La Saeta Rubia — Di Stéfano — leads Madrid to the first of everything.', stat: '1ST EUROPEAN CUP', place: 'PARC DES PRINCES, PARIS' },
  { year: '1960', title: 'FIVE IN A ROW', text: 'Puskás and Di Stéfano dismantle Eintracht 7–3 at Hampden Park. A fifth straight European Cup.', stat: '5TH EUROPEAN CUP', place: 'HAMPDEN PARK, GLASGOW' },
  { year: '2002', title: 'THE GALÁCTICOS', text: 'Zidane volleys the most beautiful goal in a final. Glasgow, La Novena.', stat: '9TH EUROPEAN CUP', place: 'HAMPDEN PARK, GLASGOW' },
  { year: '2014', title: 'LA DÉCIMA', text: 'Ramos, minute 92:48. Lisbon. The obsession is over.', stat: '10TH EUROPEAN CUP', place: 'ESTÁDIO DA LUZ, LISBON' },
  { year: '2018', title: 'THREE IN A ROW', text: '2016. 2017. 2018. Bale’s overhead kick in Kyiv seals the only three-peat of the Champions League era.', stat: '13TH EUROPEAN CUP', place: 'NSC OLIMPIYSKIY, KYIV' },
  { year: '2022', title: 'LA DECIMOCUARTA', text: 'Benzema drags Madrid back from the dead — PSG, Chelsea, City. The remontada made flesh.', stat: '14TH EUROPEAN CUP', place: 'STADE DE FRANCE, PARIS' },
  { year: '2024', title: 'THE LEGACY CONTINUES', text: 'Vinícius strikes at Wembley. A fifteenth European Cup and a reborn Bernabéu.', stat: '15TH EUROPEAN CUP', place: 'WEMBLEY, LONDON' },
]
