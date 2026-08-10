# REAL MADRID — THE LEGACY · Design Spec

**Data:** 2026-08-10
**Tipo:** Concept não-oficial de portfólio (case de direção de experiência digital)
**Escopo:** One-page desktop-only, feita para gravação em 1920×1080

## Posicionamento do case

Não é "o site oficial é ruim". O argumento é:

> "O site atual funciona como um portal institucional e de notícias. Este concept explora como a mesma marca poderia transformar sua história, futebol e estádio em uma experiência digital mais imersiva."

O objetivo do usuário final da página é **sentir que entrou no universo do Real Madrid**, não navegar por notícias. O objetivo do case é demonstrar direção de experiência: cada seção tem linguagem própria subordinada a uma narrativa única, e o motion serve à narrativa — não o contrário.

## Decisões estruturais (fechadas em brainstorm)

| Decisão | Escolha |
|---|---|
| Escopo | One-page única, 10 seções, sem rotas adicionais |
| Stack | Vite + React + TypeScript + Tailwind CSS v4 |
| Motion | Lenis (smooth scroll) + GSAP/ScrollTrigger |
| Bernabéu | Three.js via React Three Fiber, isolado na seção |
| Assets | Fotos reais tratadas + IA só para texturas/atmosferas |
| Direção visual | Híbrido claro→escuro (arco de luz) |
| Responsivo | Não. Layout fixo p/ desktop; aviso abaixo de 1024px |
| Backend/dados | Nenhum backend. Dados reais estáticos (snapshot) |

## Arquitetura da página

```
HERO          → monumental claro
MATCHDAY      → interface esportiva
SQUAD         → editorial/fotografia
LEGACY        → storytelling escuro
TROPHIES      → monumental escuro
BERNABÉU      → espacial/3D
LATEST        → editorial de notícias
SHOP          → e-commerce premium
MADRIDISTA    → comunidade
FOOTER        → minimalista
```

### Arco de luz

A página narra um dia de jogo: **dia → entardecer → noite → amanhecer**. O fundo é interpolado continuamente pelo scroll (sem cortes secos) — é o fio que costura as linguagens distintas das seções.

| Fase | Seções | Atmosfera |
|---|---|---|
| Dia | Hero, Matchday | Branco monumental, tipografia preta gigante, dourado como acento |
| Entardecer | Squad | Editorial, fotos duotone escurecendo progressivamente |
| Noite | Legacy, Trophies, Bernabéu | Preto/azul-noite, dourado dominante, luz de estádio |
| Amanhecer | Latest, Shop, Madridista, Footer | Retorno gradual ao branco premium |

### Direção tipográfica

- **Display condensada** (estilo esportivo) para números e títulos monumentais.
- **Grotesk limpa** para corpo, labels e interface.
- Dourado é acento, nunca cor dominante fora da fase noturna.

## Seções

### 1. HERO — THE CLUB
Tela cheia branca. `REAL MADRID / THE LEGACY NEVER STOPS.` em display gigante. Escudo, partículas douradas sutis, data do próximo jogo. `NEXT MATCH →` ancorado no bottom com scroll-to para MATCHDAY. Nada de notícia.

### 2. MATCHDAY
Interface esportiva: escudos grandes (`REAL MADRID vs OPONENTE`), data/hora, estádio, competição, contagem regressiva real, mini-classificação e últimos resultados. **Dados reais estáticos** — snapshot do calendário e tabela 2025-26. Nenhum dado inventado (princípio: sem dado falso).

### 3. THE SQUAD
Editorial horizontal pinado: um jogador por vez em foto quase full-screen, numeração `01 — MBAPPÉ — FORWARD`. Hover revela número, posição, nacionalidade, stats e `VIEW PLAYER` (âncora visual, sem rota). Scroll avança lateralmente para o próximo jogador. Elenco real 2025-26 (6–8 jogadores selecionados, não o elenco inteiro).

### 4. THE LEGACY
Storytelling escuro pinado com scrub: anos centrais gigantes — `1902 → 1956 → 1998 → 2002 → 2014 → 2024`. Cada era troca fotografia, textura, estatística e um acontecimento-chave. Fotos históricas em tratamento consistente com a fase noturna.

### 5. TROPHIES
Monumental: `15 / EUROPEAN CUPS` com troféu gigante em cena; scroll troca para `36 / LA LIGA` e `20 / COPA DEL REY`. Números reais do clube. A estatística é o elemento visual, não informação secundária.

### 6. THE BERNABÉU
Única seção WebGL. Modelo 3D do estádio com câmera coreografada pelo scroll: aérea → aproximação → interior. O 3D tem função — é a seção sobre *espaço*.

- Canvas montado por lazy import quando a seção se aproxima do viewport.
- `dpr` limitado a 1.5; `frameloop` pausado fora do viewport.
- **Fallback:** se WebGL falhar ou o modelo não carregar, sequência estática de imagens com zoom ScrollTrigger.
- Fonte do modelo: Sketchfab/similar com licença adequada; se não houver modelo bom, geometria low-poly estilizada própria (estádio abstrato iluminado).

### 7. LATEST
Hierarquia editorial: 1 manchete principal grande + 3 secundárias. Conteúdo real de notícias recentes do clube (snapshot). Sem parede de cards iguais.

### 8. SHOP
E-commerce premium: `THE NEW KIT` com produto gigante e zoom, depois trilha `Home Kit / Away Kit / Training / Lifestyle`. Sem preços falsos — CTA `EXPLORE COLLECTION →`.

### 9. MADRIDISTA
`MADRIDISTA — The club. The people. The legacy.` CTA de comunidade/app. Não copiar "More than a club".

### 10. FOOTER
Minimalista: Club / Squad / Matches / History / Bernabéu / Shop. Patrocinadores em área própria discreta. Disclaimer obrigatório:

> "Unofficial concept for portfolio purposes. All imagery and trademarks belong to Real Madrid CF."

## Arquitetura técnica

### Estrutura de componentes

```
src/
  main.tsx
  App.tsx                 — monta Lenis, orquestra seções em ordem
  lib/
    lenis.ts              — instância única Lenis ↔ GSAP ticker
    scroll.ts             — helpers ScrollTrigger (pin, scrub, interpolação de fundo)
  data/
    match.ts              — próximo jogo, tabela, resultados (snapshot real)
    squad.ts              — jogadores selecionados (reais)
    legacy.ts             — eras/anos/eventos
    trophies.ts           — contagens reais
    news.ts               — notícias reais (snapshot)
  sections/
    Hero/  Matchday/  Squad/  Legacy/  Trophies/
    Bernabeu/             — lazy; Canvas R3F + fallback
    Latest/  Shop/  Madridista/  Footer/
  components/             — primitivas compartilhadas (SectionTitle, Marquee, etc.)
```

Cada seção é um módulo isolado: recebe dados de `data/`, registra seus próprios ScrollTriggers no mount e os limpa no unmount. Nenhuma seção conhece outra; a costura (arco de luz) vive em `lib/scroll.ts` lendo o progresso global.

### Regras de performance (inegociáveis)

1. Um único `requestAnimationFrame`: Lenis dirige o ticker do GSAP (`lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker`). Nunca dois loops.
2. Animações somente com `transform` e `opacity`. Nada de animar layout (top/left/width/height).
3. WebGL existe apenas dentro da seção Bernabéu.
4. Imagens AVIF/WebP, pré-carregadas por proximidade de seção; code-splitting por seção (React.lazy).
5. `will-change` aplicado e removido pelo GSAP, não fixado em CSS.

### Dados

Todos estáticos em `src/data/`, tipados, com valores **reais** (elenco 2025-26, calendário, troféus, notícias). Snapshot datado — o case é gravado, não mantido vivo. Comentário no topo de cada arquivo com a data do snapshot.

## Assets

- **Fotos reais** de imprensa/site do clube, tratadas com linguagem única: duotone azul-noite/dourado + grain. O tratamento é o que evita cara de colagem.
- **IA (Higgsfield)** somente para atmosferas: texturas, luzes de estádio, fundos abstratos. Nunca para rostos/jogadores.
- **Modelo 3D**: ver seção Bernabéu.
- Naming: `public/assets/<secao>/<nome>.avif`.

## Riscos e mitigações

| Risco | Mitigação |
|---|---|
| Modelo 3D pesado ou de baixa qualidade | Seção isolada + fallback de imagens + opção low-poly própria |
| Três seções pinadas seguidas (Squad→Legacy→Trophies) cansarem | Durações de scrub curtas; calibrar ritmo pensando na gravação |
| Fotos reais sem tratamento = colagem | Pipeline de tratamento único (duotone+grain) antes de entrar no site |
| Jank no scroll | Regras de performance acima; testar com DevTools performance a cada seção |

## Fora de escopo

- Responsivo mobile/tablet (só o aviso <1024px)
- Rotas adicionais (página de jogador, calendário completo)
- Backend, CMS, dados vivos
- SEO (projeto para gravação, não para tráfego)
- Acessibilidade completa (manter o básico: alt, contraste legível, `prefers-reduced-motion` desliga scrubs)

## Critérios de sucesso

1. Scroll a 60fps constante em 1920×1080 durante a gravação (sem quedas visíveis no frame timing).
2. As 10 seções são visualmente distinguíveis entre si, mas o arco de luz as costura sem cortes.
3. Nenhum dado falso em tela.
4. A seção Bernabéu funciona com 3D e degrada para o fallback sem quebrar a página.
5. O case pode ser apresentado com a narrativa problema→proposta→resultado definida no posicionamento.
