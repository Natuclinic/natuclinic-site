# NATUCLINIC SITE — ANALYSIS LOG
**Gerado em:** 2026-05-28  
**Projeto:** natuclinic-web  
**Branch:** main  
**Stack:** React 19.2 + Vite 7.2 + Tailwind CSS v4  

---

## 1. ESTRUTURA DO PROJETO

```
natuclinic-site/
├── src/
│   ├── App.jsx                   # Router, Lenis init, layout global
│   ├── main.jsx                  # Entry point React + BrowserRouter
│   ├── index.css                 # Tailwind v4, design tokens, componentes CSS
│   ├── components/               # 28 componentes reutilizáveis
│   ├── pages/                    # 14 páginas/landings
│   ├── hooks/                    # 2 hooks customizados
│   ├── services/                 # Cliente Supabase
│   ├── constants/                # Links, phones, API URLs
│   ├── data/                     # Fallback de artigos (gerado)
│   ├── styles/                   # CSS do sistema de blog
│   └── assets/                   # Imagens estáticas
├── public/
│   ├── fonts/                    # Suisse Intl (woff2), Playfair Display
│   └── sitemap.xml               # Auto-gerado pelo script
├── api/                          # Serverless functions Vercel
├── functions/                    # Cloudflare Pages Functions
│   ├── api/articles.js
│   └── api/leads.js
├── cloudflare-worker/
├── vite.config.js
├── vercel.json
├── package.json
├── sync-articles.js              # Sincroniza artigos da API → local
└── generate-sitemap.js           # Gera sitemap.xml
```

---

## 2. INVENTÁRIO DE COMPONENTES

### src/components/ (28 arquivos)

| Componente | Linhas | Tipo | Lazy? |
|-----------|--------|------|-------|
| VideoFeedbacks.jsx | ~384 | Feature | Sim |
| Navbar.jsx | ~322 | Layout | Não |
| InfiniteSlider.jsx | ~317 | Feature | Não |
| ResultsSection.jsx | ~294 | Feature | Sim |
| ScrollStack.jsx | ~248 | Feature | Não |
| BlogHighlights.jsx | ~248 | Feature | Sim |
| FooterNew.jsx | ~228 | Layout | Sim |
| LeadCapture.jsx | ~214 | Feature | Sim |
| ClinicGallery.jsx | ~203 | Feature | Sim |
| CookieConsent.jsx | ~183 | Feature | Não |
| ImageUpload.jsx | ~167 | Util | Não |
| ImageComparisonSlider.jsx | ~146 | Feature | Não |
| Unicon.jsx | ~140 | Util | Não |
| CurvedLoop.jsx | ~135 | Visual | Não |
| StatsSection.jsx | ~132 | Feature | Sim |
| FeedbackSection.jsx | ~120 | Feature | Não |
| ProceduresSection.jsx | ~117 | Feature | Não |
| Silk.jsx | ~116 | Visual/3D | Sim |
| GlareHover.jsx | ~101 | Util | Não |
| HomeIntro.jsx | ~98 | Feature | Não |
| HomeManifesto.jsx | ~95 | Feature | Não |
| ResultsCTA.jsx | ~89 | Feature | Sim |
| QuietCTA.jsx | ~85 | Feature | Não |
| CircularText.jsx | ~81 | Visual | Não |
| LocationsSection.jsx | ~80 | Feature | Sim |
| CountUp.jsx | ~66 | Util | Não |
| SEO.jsx | ~39 | Util | Não |
| BlogFAQ.jsx | ~18 | Util | Não |

### src/pages/ (14 arquivos)

| Página | Linhas | Lazy? | Rota |
|--------|--------|-------|------|
| NutricaoOrtomolecular.jsx | ~994 | Sim | /procedimentos/nutricao-ortomolecular |
| HarmonizacaoCorporal.jsx | ~779 | Sim | /procedimentos/harmonizacao-corporal |
| BlogPostGeneric.jsx | ~561 | Sim | /blog/:id |
| GluteoLanding.jsx | ~541 | Sim | /gluteo-dos-sonhos |
| AdminPost.jsx | ~504 | Sim | /adminblogpost |
| Ninfoplastia.jsx | ~323 | Sim | /procedimentos/ninfoplastia |
| VideoFeedbacks.jsx | ~384 | Sim | (componente) |
| BlogPostDemo.jsx | ~167 | Sim | /blog-post-demo (legacy) |
| Blog.jsx | ~155 | Sim | /blog |
| BlogPostNutricao.jsx | ~152 | Sim | /blog-post-nutricao (legacy) |
| Contato.jsx | ~163 | Sim | /contato |
| PrivacyPolicy.jsx | ~127 | Sim | /politica-de-privacidade |
| Endolaser.jsx | ~106 | Sim | /procedimentos/endolaser |
| HarmonizacaoFacial.jsx | ~99 | Sim | /procedimentos/harmonizacao-facial |
| HarmonizacaoGluteos.jsx | ~84 | Sim | /procedimentos/harmonizacao |

---

## 3. DEPENDÊNCIAS

### Production (19 pacotes)

| Pacote | Versão | Uso |
|--------|--------|-----|
| react | ^19.2.0 | Framework principal |
| react-dom | ^19.2.0 | Renderização DOM |
| react-router-dom | ^7.13.0 | Roteamento SPA |
| react-helmet-async | ^3.0.0 | Meta tags SEO |
| react-markdown | ^10.1.0 | Renderização de Markdown |
| gsap | ^3.14.2 | Animações scroll/timeline |
| motion | ^12.30.0 | Transições de componentes |
| lenis | ^1.3.17 | Smooth scroll |
| three | ^0.182.0 | 3D / WebGL |
| @react-three/fiber | ^9.5.0 | React wrapper Three.js |
| @react-spring/web | ^10.0.3 | Animações spring |
| @supabase/supabase-js | ^2.94.1 | Backend / banco de dados |
| @vercel/speed-insights | ^1.3.1 | Monitoramento Vercel |
| clsx | ^2.1.1 | Classes condicionais |
| tailwind-merge | ^3.4.0 | Merge de classes Tailwind |
| lucide-react | ^0.563.0 | Ícones SVG |
| piexifjs | ^1.0.6 | Manipulação EXIF (imagens) |
| rehype-raw | ^7.0.0 | HTML em Markdown |
| remark-gfm | ^4.0.1 | GitHub Flavored Markdown |

### Dev (14 pacotes)
Vite 7.2, ESLint 9, Tailwind v4 PostCSS, TypeScript types para React.

---

## 4. ARQUITETURA E ROTEAMENTO

### Roteamento (App.jsx)
- **Biblioteca:** React Router v7 com `BrowserRouter` em `main.jsx`
- **Total de rotas:** 20 (incluindo fallback `*`)
- **Padrão:** `<Routes>` + `<Route>` sem loader server-side

```
/                          → Home (composição de ~12 componentes)
/procedimentos             → ProceduresSection standalone
/procedimentos/ninfoplastia
/procedimentos/endolaser
/procedimentos/harmonizacao
/procedimentos/harmonizacao-facial
/procedimentos/harmonizacao-corporal
/procedimentos/nutricao-ortomolecular
/blog                      → Listagem de artigos
/blog/:id                  → BlogPostWrapper → BlogPostGeneric
/gluteo-dos-sonhos         → GluteoLanding
/contato                   → Contato
/adminblogpost             → AdminPost (sem proteção de autenticação)
/politica-de-privacidade   → PrivacyPolicy
/blog-post-demo            → Legacy
/blog-post-nutricao        → Legacy
*                          → Navigate to "/"
```

### Lazy Loading
- 26 componentes com `React.lazy()`
- Suspense com `fallback={null}` — carregamento silencioso (sem spinner)
- Componentes da Home (Navbar, HomeIntro, etc.) são importados **estaticamente**

### Scroll
- Lenis instanciado inline em `useSmoothScroll()` dentro de App.jsx
- Sincronizado com `ScrollTrigger.update` e `gsap.ticker`
- Hook também existe em `src/hooks/useSmoothScroll.js` (arquivo separado, não usado)

### Dados (artigos)
- `useArticles()` → Fetch de `https://natuclinic-api.fabriccioarts.workers.dev/articles`
- Fallback: `src/data/articles.jsx` (gerado por `sync-articles.js`)
- `useRef(false)` previne double-fetch em StrictMode

---

## 5. DESIGN TOKENS

```css
/* src/index.css — @theme */
--color-natu-brown:  #4C261A   /* Primary brand */
--color-natu-pink:   #FFC2C2   /* Accent */
--color-natu-ivory:  #F9F7F5   /* Background */
--color-whatsapp:    #25D366
--color-whatsapp-dark: #075E54
--font-serif: "Playfair Display", serif   /* Títulos */
--font-sans:  "Suisse Intl", sans-serif   /* Corpo */
```

---

## 6. ERROS E PROBLEMAS IDENTIFICADOS

### 🔴 CRÍTICO

#### E001 — Chave Supabase exposta no código-fonte
**Arquivo:** `src/services/supabase.js:6`  
**Problema:** A `supabaseAnonKey` está hardcoded como fallback. Embora seja uma `anon key` (leitura pública), sua presença no código versionado no git significa que qualquer pessoa com acesso ao repositório pode usá-la diretamente.  
**Impacto:** Abuso de quota, scraping de dados, possível bypass de RLS (Row Level Security) mal configurado.  
**Correção:** Remover o fallback hardcoded. As variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` devem existir obrigatoriamente no `.env` e no painel Vercel.

```js
// ANTES (inseguro)
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGci...';

// DEPOIS (seguro)
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) throw new Error('Supabase env vars não definidas');
```

---

#### E002 — Rota `/adminblogpost` sem autenticação
**Arquivo:** `src/App.jsx:169`  
**Problema:** A rota do painel de administração (`AdminPost`) é acessível por qualquer pessoa que saiba a URL.  
**Impacto:** Qualquer pessoa pode criar, editar ou excluir posts do blog.  
**Correção:** Adicionar uma `ProtectedRoute` com verificação de sessão Supabase antes de renderizar `AdminPost`.

---

### 🟠 ALTO

#### E003 — Lenis RAF rodando em duplo
**Arquivo:** `src/App.jsx:66-86`  
**Problema:** Lenis é ativado tanto pelo `requestAnimationFrame(raf)` manual (linha 68-71) **quanto** pelo `gsap.ticker.add` (linha 76-78). Isso faz o Lenis executar `raf()` duas vezes por frame.  
**Impacto:** CPU/GPU desnecessariamente sobrecarregados, possível jank em animações, consumo de bateria em mobile.  
**Correção:** Usar **apenas** o `gsap.ticker` ou **apenas** o `requestAnimationFrame`, não os dois.

```js
// CORRETO: somente gsap.ticker
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
// Remover o requestAnimationFrame manual
```

#### E004 — Cleanup do gsap.ticker incorreto
**Arquivo:** `src/App.jsx:84`  
**Problema:** `gsap.ticker.remove((time) => lenis.raf(time * 1000))` cria uma **nova função anônima** que não é a mesma referência adicionada na linha 76. O cleanup nunca funciona — o ticker continua rodando mesmo após o componente ser destruído.  
**Impacto:** Memory leak ao reinicializar o app (ex: hot reload, StrictMode).  
**Correção:**

```js
const tickerFn = (time) => lenis.raf(time * 1000);
gsap.ticker.add(tickerFn);
// ...
return () => {
  lenis.destroy();
  gsap.ticker.remove(tickerFn); // mesma referência
};
```

#### E005 — Hook `useSmoothScroll.js` duplicado e não usado
**Arquivo:** `src/hooks/useSmoothScroll.js`  
**Problema:** Existe um hook separado mas o App.jsx define seu próprio `useSmoothScroll` inline. O arquivo `src/hooks/useSmoothScroll.js` nunca é importado.  
**Impacto:** Confusão de manutenção, possível instância dupla de Lenis se alguém importar o hook errado.  
**Correção:** Deletar o arquivo duplicado ou mover a definição inline para o hook reutilizável.

#### E006 — `isServicePage` exclui páginas importantes da lógica
**Arquivo:** `src/App.jsx:123-127`  
**Problema:** A lógica que controla exibição do Navbar tem uma lista manual de exceções (`!== '/procedimentos/nutricao-ortomolecular'`, etc.). Adicionar novas páginas requer atualizar manualmente essa lógica.  
**Impacto:** Risco de regressão — nova página de procedimento pode ficar sem Navbar sem perceber.  
**Correção:** Usar uma constante de configuração com as páginas que **têm** Navbar ao invés de exceções.

---

### 🟡 MÉDIO

#### E007 — `error` nunca é setado em `useArticles` ✅ CORRIGIDO
**Arquivo:** `src/hooks/useArticles.js:38`  
**Fix:** `setError(err)` adicionado no bloco `catch`. O estado `error` agora é populado corretamente em caso de falha de rede.

#### E008 — Suspense sem ErrorBoundary (tela branca em falha) ✅ CORRIGIDO
**Arquivo:** `src/App.jsx`  
**Fix:** Criado `src/components/ErrorBoundary.jsx` (class component com `getDerivedStateFromError`). O `ErrorBoundary` foi adicionado envolvendo o `Suspense` — exibe mensagem amigável e botão de retorno ao início caso qualquer chunk lazy falhe ao carregar.

#### E009 — `@react-spring/web` — EM USO
**Arquivo:** `src/components/CountUp.jsx`, `src/components/BlurText.jsx`  
**Status:** Confirmado em uso. `useSpring` em CountUp e `useSprings` em BlurText. Dependência necessária, não remover.

#### E010 — `piexifjs` somente para AdminPost
**Arquivo:** `package.json`  
**Problema:** `piexifjs` (~25KB) é carregado globalmente, mas é usado apenas em `src/pages/AdminPost.jsx`. Sendo uma rota de admin raramente acessada, deveria ser uma importação dinâmica dentro deste componente.

#### E011 — Rotas legacy sem redirecionamento 301
**Arquivo:** `src/App.jsx:172-173`  
**Rotas:** `/blog-post-demo` e `/blog-post-nutricao`  
**Problema:** Estas rotas existem como fallback estático mas devem ter redirecionamentos permanentes (301) no `vercel.json` apontando para os slugs corretos no blog dinâmico. Manter páginas estáticas duplicadas prejudica SEO (conteúdo duplicado).

---

### 🔵 BAIXO / MELHORIA

#### E012 — `footerNew` aparece em todas as páginas menos as de serviço
**Arquivo:** `src/App.jsx:183`  
**Problema:** `FooterNew` recebe `isStatic` baseado em `location.pathname.startsWith('/blog')` mas FooterNew com `isStatic={false}` pode ter comportamento de scroll desnecessário em páginas que não são blog.

#### E013 — `window.scrollTo` pode conflitar com Lenis
**Arquivo:** `src/App.jsx:120`  
**Problema:** `window.scrollTo({ top: 0, behavior: 'instant' })` ao mudar de rota pode conflitar com o scroll gerenciado pelo Lenis.  
**Correção:** Usar `lenis.scrollTo(0, { immediate: true })` passando a instância Lenis via context ou ref.

#### E014 — Sem `React.memo` em componentes estáticos
Componentes como `Navbar`, `HomeManifesto`, `QuietCTA` não possuem `React.memo`. Como são renderizados na Home que re-renderiza ao mudar artigos (`useArticles`), eles são re-renderizados desnecessariamente.

---

## 7. ANÁLISE DE PERFORMANCE

### Build e Chunking

| Chunk | Conteúdo | Tamanho Estimado |
|-------|----------|-----------------|
| `react-vendor` | react, react-dom | ~130 KB |
| `animation-vendor` | gsap, motion, lenis | ~350 KB |
| `three-vendor` | three, @react-three/fiber | ~700 KB |
| `index` (main) | App + componentes estáticos | ~150 KB |
| Chunks lazy | Páginas individuais | ~20-80 KB cada |

**Ponto positivo:** Three.js isolado — só carrega quando o componente `Silk` é necessário.  
**Problema:** O chunk `animation-vendor` (gsap + motion + lenis) é carregado mesmo antes de qualquer animação ser iniciada.

### Carregamento Inicial (estimativa)

- Recursos bloqueantes na Home: `react-vendor`, `animation-vendor`, `index`
- Three.js: lazy (só carrega com `Silk`)
- Fontes: `Suisse Intl` e `Playfair Display` via `@font-face` — verificar se têm `font-display: swap`

### Pontos Positivos de Performance

1. **Code splitting** com `React.lazy()` em 26 componentes
2. **Manual chunks** no Vite separando bibliotecas pesadas
3. **Lenis** para scroll suave sem jank (melhor que CSS `scroll-behavior: smooth`)
4. **GSAP Context** com `ctx.revert()` — sem vazamento de animações
5. **`useRef(false)`** evitando double-fetch em StrictMode
6. **Vercel SpeedInsights** para monitoramento real de Core Web Vitals
7. **will-change** e `translateZ` em componentes de scroll (GPU acceleration)
8. **Noise background** em SVG inline (zero request HTTP)

### Riscos de Performance

| Risco | Impacto | Detalhe |
|-------|---------|---------|
| Lenis RAF duplo | Alto | CPU double-tick por frame |
| Sem `preload` de fontes críticas | Médio | FOUT/FOIT ao carregar |
| `articles.jsx` muito grande | Médio | +100 artigos como módulo JS carregado em memória |
| Sem virtualização em listas longas | Médio | Blog com muitos artigos renderiza todos |
| Sem `loading="lazy"` verificado | Médio | Imagens fora da viewport podem carregar cedo |
| `@react-spring/web` possivelmente desnecessário | Baixo | ~80KB extra no bundle |

---

## 8. ANÁLISE DE SEO

### Pontos Positivos
- `react-helmet-async` com `HelmetProvider` para meta tags dinâmicas
- `sitemap.xml` gerado automaticamente com script
- `vercel.json` com redirect 301 para slug canônico de blog
- Fallback `*` → `/` (não 404 para rotas desconhecidas)

### Problemas
- Rotas legacy `/blog-post-demo` e `/blog-post-nutricao` sem 301 no `vercel.json`
- SPA sem SSR → crawlers podem ter dificuldade em indexar conteúdo dinâmico (blog posts)
- `FooterNew` com `isStatic` pode render diferente entre páginas sem motivo claro de SEO

---

## 9. ANÁLISE DE SEGURANÇA

| Item | Status | Detalhe |
|------|--------|---------|
| Supabase key exposta | 🔴 CRÍTICO | Hardcoded no supabase.js |
| Admin sem auth | 🔴 CRÍTICO | /adminblogpost público |
| CORS Cloudflare Workers | ⚠️ Verificar | Configuração em functions/api/ |
| `rel="noopener noreferrer"` | ✅ OK | Link WhatsApp configurado corretamente |
| `.env` no .gitignore | Verificar | Confirmar que .env não está commitado |
| HTTPS | ✅ OK | Vercel força HTTPS por padrão |
| RLS Supabase | Verificar | Confirmar Row Level Security nas tabelas |

---

## 10. RESUMO EXECUTIVO

### Contagem de Problemas

| Severidade | Total |
|-----------|-------|
| 🔴 Crítico | 2 |
| 🟠 Alto | 4 |
| 🟡 Médio | 5 |
| 🔵 Baixo/Melhoria | 3 |
| **Total** | **14** |

### Prioridades de Ação

1. **IMEDIATO** — Remover chave Supabase hardcoded do código (E001)
2. **IMEDIATO** — Adicionar autenticação à rota `/adminblogpost` (E002)
3. **URGENTE** — Corrigir Lenis RAF duplo e cleanup de ticker (E003, E004)
4. **MÉDIO PRAZO** — Deletar hook duplicado `useSmoothScroll.js` (E005)
5. **MÉDIO PRAZO** — Setar `setError` no catch do `useArticles` (E007)
6. **MÉDIO PRAZO** — Adicionar `ErrorBoundary` ao redor do `Suspense` (E008)
7. **BAIXO** — Verificar e remover `@react-spring/web` se não usado (E009)
8. **BAIXO** — Adicionar redirecionamentos 301 para rotas legacy (E011)

---

*Log gerado por análise estática do código-fonte em 2026-05-28.*
