# REAL MADRID — THE ETERNAL CLUB · design spec

Data: 2026-08-27 · Substitui `2026-08-10-real-madrid-legacy-design.md` (v1 arquivada em `src/archive-v1/`).

Experiência conceitual, **1920×1080 fixo**, executada localmente para gravação de tela.
Fora de escopo por decisão: responsivo, SEO, 404, backend, analytics, formulários, mobile.
Critério único: cada frame pausado tem de servir de poster de campanha.

## 1. Design system

### Cor
| token | hex | uso |
|---|---|---|
| `--c-white` | #F5F5F2 | fundo dos capítulos "presente" e de silêncio |
| `--c-pure` | #FFFFFF | tipografia sobre preto |
| `--c-black` | #080808 | fundo padrão dos capítulos cinematográficos |
| `--c-graphite` | #181818 | segundo plano, linhas sobre preto |
| `--c-silver` | #BFC1C4 | labels, linhas finas, numeração |
| `--c-gold` | #B89B5E | **recompensa**: Champions, títulos, momentos históricos. Nunca decorativo. |
| `--c-blue` | #152E91 | pontual (um detalhe por capítulo no máximo) |

Regra: 90% da experiência é branco/preto/prata. Dourado aparece só quando a narrativa entrega glória.

### Tipografia
- **Display monumental**: `Archivo Variable` (wdth 62–125, wght 100–900). Headlines em `wdth 125 / wght 800`, tracking −0.04em, leading 0.82. Ocupa a viewport.
- **Serif editorial**: `Instrument Serif` (itálico para momentos históricos: Era I, Zidane).
- **Labels / coordenadas**: `Space Grotesk` 11px, tracking 0.35em, uppercase, prata. Formato `EST. 1902 · MADRID, ESP · 40.4531° N`.
- Escala: `--t-mono` 11px · `--t-body` 16px · `--t-h3` 2.2vw · `--t-h2` 6vw · `--t-h1` 13–18vw · `--t-giant` 34vw (números).

### Layout
Grid editorial 12 col, margens `6vw`. Linhas de 1px em prata a 25% de opacidade. Numeração de capítulo (`01 — MADRID`) no canto superior esquerdo, coordenadas no superior direito, ambos fixos por capítulo.
Proibido: border-radius > 2px, cards, glass, gradientes coloridos, sombras, botões SaaS.

### Tratamento de imagem (por era)
| era | tratamento CSS/shader |
|---|---|
| Foundations (50s–60s) | grayscale, contraste −10%, grain forte, leve sépia quente, vinheta de papel |
| Madridistas (90s–2000s) | cor dessaturada 40%, contraste +20%, flash frontal (highlight clipping), scanline CRT sutil |
| Dominance (2009–2018) | P&B contraste +35%, prata, preto puro |
| Present | cor limpa, fundo branco, high-fashion |

### Motion (4 estados)
TENSION (lento, 2–4s, `power1.inOut`) · IMPACT (< 0.25s, `expo.out`) · SILENCE (nada se move, ≥ 1.5s de scroll) · RELEASE (reveal grande, 1–1.5s, `power4.out`).
Scroll velocity global: `|v|` mapeado para skewY / stretch em headlines e distorção de imagem (WebGL). Scroll lento estabiliza tudo.

### Cursor
Ponto de 6px prata + anel de 36px. Estados: `EXPLORE` (padrão), `VIEW` (sobre imagem), `DRAG`, `ENTER` (sobre "SCROLL TO ENTER"). Em cenas de vídeo o cursor some.

## 2. Arquitetura narrativa (8 capítulos)

| # | capítulo | cena | status v0 |
|---|---|---|---|
| 01 | MADRID | preto · `1902` · `MADRID` · filme do Bernabéu (aéreo → túnel → gramado) · REAL MADRID interage com a arquitetura · THE ETERNAL CLUB · SCROLL TO ENTER | **agora** |
| 02 | THE BERNABÉU | THIS IS NOT A STADIUM. / IT'S THE BERNABÉU. · macros de fachada, luz, gramado, túnel | **agora** |
| 03 | BUILT BY LEGENDS | A CLUB IS NOTHING WITHOUT MEMORY. · contador de anos · Di Stéfano · Puskás · Gento · Raúl · Roberto Carlos · Zidane (2002 Glasgow) | **agora (preview)** |
| 04 | THE ERA OF DOMINANCE | Cristiano (450) · Ramos (92:48) · Marcelo · Benzema · Modrić · Kroos | depois |
| 05 | KINGS OF EUROPE | uma Champions isolada · EUROPE IS OUR STAGE · número | depois |
| 06 | 90 MINUTES ARE NOT ENOUGH | 90:00 → 90:05 · flash · assinatura | depois |
| 07 | THE PRESENT | LEGENDS LEAVE. THE CLUB REMAINS. · Mbappé, Vini, Bellingham, Valverde, Arda, Courtois | depois |
| 08 | ETERNAL | Bernabéu vazio · THE BADGE REMAINS · 1902 — ∞ · HALA MADRID · assinatura MILWEB | depois |

### Hero — mecânica da profundidade
O filme túnel→gramado é convertido em sequência de frames (ffmpeg → webp) e desenhado num canvas WebGL scrubado pelo scroll. A tipografia `REAL MADRID` vive numa textura separada, "no fundo do túnel": o shader só a revela onde a luminância do frame indica abertura (a boca do túnel). Enquanto a câmera avança, as paredes escuras ocluem as letras e a abertura cresce até o nome ficar inteiro na frente do estádio. Sem depth map real — a luminância da cena É o depth map, o que funciona porque o túnel foi gerado exatamente para isso (paredes pretas, abertura branca).

### Built by Legends — mecânica
Ano fixo em `--t-giant` no centro; scroll acelera o contador (1953 → … → 2002) com easing exponencial e as fotos passam pelo shader de displacement (reaproveitado de v1, `LegendsFrame`). Para em 1956 (Di Stéfano), 1960 (Puskás/Gento), 1998 (Raúl), 2002 (Roberto Carlos → Zidane). Cada parada é uma composição própria, não um slide.

## 3. Assets

### Fotos reais (Wikimedia Commons, licenças em `public/assets/ASSETS.md`)
`legends/di-stefano.webp` (Anefo 1959, CC0) · `legends/puskas.webp` (Anefo 1965 Feyenoord–Real, CC0) · `legends/gento.webp` (Bogaerts, CC BY 2.0) · `legends/raul.webp` (Takasu 2008, CC BY 2.0) · `legends/zidane.webp` (Papetti 2013, CC BY-SA 2.0) · `legends/roberto-carlos.webp` (LS3 2023, CC BY 2.0 — retrato moderno; não existe foto de época com licença livre).

### Higgsfield — plano (função → composição → frame inicial → final)
| id | função | modelo | status |
|---|---|---|---|
| S04 tunnel | hero, frame inicial do filme | cinematic_studio_2_5 2k | ✓ |
| S05 pitch reveal | hero, frame final + poster | cinematic_studio_2_5 2k | ✓ |
| V10 tunnel→pitch | hero, 8s 1080p, scrub por scroll | flux_3_video start+end | gerando |
| S07/S08 aerial silver | cap. 01 abertura / cap. 02 | cinematic_studio_2_5 | gerando |
| S09/S11 facade macro | cap. 02 | cinematic_studio_2_5 | gerando |
| V aerial push · V facade travelling | cap. 01/02 loops | flux_3_video | após validar stills |

Linguagem fixa de prompt: *cinematic sports campaign · architectural cinematography · Madrid at night · silver metallic architecture · deep blacks · cold white stadium light · high contrast · subtle film grain · 35mm · photorealistic · no text / logos / people / lens flare*.
