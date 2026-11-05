import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion as Motion, useReducedMotion } from 'motion/react';
import Unicon from '../components/Unicon';
import { UNIT_PHONES, WHATSAPP_BASE } from '../constants/links';
import { useGoogleReviews } from '../hooks/useGoogleReviews';

// Página "link na bio" do Instagram (@instituto.natuclinic).
// Endereço para colocar no Instagram:
//   https://www.natuclinic.com.br/bio?utm_source=instagram&utm_medium=social&utm_content=link_in_bio
// O WhatsApp é o número oficial do site (constants/links), o mesmo conectado ao CRM.
// A mensagem começa com a frase-gatilho da campanha "link da bio" do CRM
// ("Olá! Vim de: link da bio"): o lead entra com essa origem sozinho. Se a frase
// mudar lá no CRM, mude aqui também.

const AGENDAR = `${WHATSAPP_BASE}?text=${encodeURIComponent('Olá! Vim de: link da bio. Quero agendar uma consulta na Natuclinic.')}`;

// Diferenciais e credenciais: mesmos textos já publicados no FAQ e na página Sobre.
const PADRAO = [
    { titulo: 'Atendimento exclusivamente particular', texto: 'Sem convênio, para dedicar o tempo e a atenção que cada caso exige.' },
    { titulo: 'Avaliação completa antes de tudo', texto: 'Histórico, objetivos e exames. Não existe receita pronta: cada plano é construído para você.' },
    { titulo: 'Saúde e estética no mesmo plano', texto: 'A nutrição ortomolecular equilibra o organismo por dentro e potencializa os resultados dos procedimentos.' },
];

const EQUIPE = [
    { nome: 'Dr. Julimar Meneses', credenciais: 'Nutricionista ortomolecular e farmacêutico · CRN-DF 21414', foto: '/images/bio/dr-julimar.webp' },
    { nome: 'Dra. Débora Meneses', credenciais: 'Biomédica esteta, especialista em harmonização facial', foto: '/images/bio/dra-debora.webp' },
];

// Mesmos pares de /images/resultados usados na home, em versão leve (public/images/bio).
const RESULTADOS = ['01', '06', '09', '04', '05', '07', '02', '08', '10'];

// Mesmos vídeos de depoimento da home (VideoFeedbacks).
const DEPOIMENTOS = [
    { id: 'edilza', nome: 'Edilza', video: 'https://pub-cf3f0550e96b441691fba3f1c70e6a39.r2.dev/edilza.mp4#t=0.001', resultado: 'Emagreceu 10 kg e melhorou a saúde por completo.' },
    { id: 'elizangela', nome: 'Elizangela', video: 'https://pub-cf3f0550e96b441691fba3f1c70e6a39.r2.dev/elisangela.mp4#t=0.001', resultado: 'Perdeu mais de 5 kg e ganhou qualidade de vida.' },
    { id: 'margarete', nome: 'Margarete', video: 'https://pub-cf3f0550e96b441691fba3f1c70e6a39.r2.dev/margarete.mp4#t=0.001', resultado: 'Decidiu cuidar de si e hoje colhe os frutos.' },
    { id: 'josi', nome: 'Josi', video: 'https://pub-cf3f0550e96b441691fba3f1c70e6a39.r2.dev/josi.mp4#t=0.001', resultado: 'Emagreceu e transformou a autoestima.' },
];

// Reserva caso a busca ao vivo do Google falhe: trechos de avaliações reais
// (as mesmas do fallback do GoogleReviews da home).
const AVALIACOES_RESERVA = [
    { id: 'claudia', name: 'Claudia Costa', rating: 5, avatarLetter: 'C', text: 'Amei o atendimento humanizado com profissionais altamente qualificados! Alcancei meus objetivos com muita satisfação!' },
    { id: 'catia', name: 'Catia Keila', rating: 5, avatarLetter: 'C', text: 'Estive na clínica com minha filha para uma consulta com o Dr Julimar e foi de excelência todo o atendimento, desde a recepção até a finalização.' },
];

const UNIDADES = [
    {
        nome: 'Taguatinga Norte',
        endereco: 'QNE 01, Lote 17/20, Loja 02, Av. Comercial',
        telefone: UNIT_PHONES.TAGUATINGA,
        mapa: 'https://www.google.com/maps?q=Taguatinga+Natuclinic',
        embed: 'https://maps.google.com/maps?q=Natuclinic%20Taguatinga%20Norte&t=&z=15&ie=UTF8&iwloc=&output=embed',
    },
    {
        nome: 'Planaltina',
        endereco: 'SH Mestre D\'Armas, Módulo C, Lote 2, Lojas 3/4',
        telefone: UNIT_PHONES.PLANALTINA,
        mapa: 'https://www.google.com/maps/place/Natuclinic+Est%C3%A9tica+e+Nutri%C3%A7%C3%A3o+Ortomolecular+-+Clinica+de+Est%C3%A9tica+e+Nutri%C3%A7%C3%A3o+em+Planaltina+-+DF',
        embed: 'https://maps.google.com/maps?q=Natuclinic%20Est%C3%A9tica%20e%20Nutri%C3%A7%C3%A3o%20Ortomolecular%20Planaltina&t=&z=15&ie=UTF8&iwloc=&output=embed',
    },
];

// Conta cliques no GA4 (o consentimento de cookies continua valendo via gtag consent).
const track = (id) => {
    try { window.gtag?.('event', 'bio_click', { link_id: id }); } catch { /* sem analytics */ }
};

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];
const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-natu-brown';
const textLink = `inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-semibold underline decoration-natu-brown/30 underline-offset-[5px] hover:decoration-natu-brown ${focusRing}`;

// Faixa com rolagem lateral; encosta nas bordas da tela no celular.
const Rail = ({ label, children }) => (
    <div
        role="region"
        aria-label={label}
        tabIndex={0}
        className={`-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-6 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:px-0 [&::-webkit-scrollbar]:hidden ${focusRing}`}
    >
        {children}
    </div>
);

// Ícones no traço do Instagram (contorno 1.75), desenhados aqui para não depender de glifos.
const IconHeart = ({ filled }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round">
        <path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 6.9 4.5c2.1 0 3.6 1.2 5.1 3 1.5-1.8 3-3 5.1-3 3.5 0 5.5 3.5 4.2 6.8-1.8 4.6-9.3 9.2-9.3 9.2z" />
    </svg>
);
const IconSend = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round">
        <path d="M21.5 3 10 13.5M21.5 3 15 21l-5-7.5L2.5 9 21.5 3z" />
    </svg>
);
const IconChevron = ({ dir }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d={dir === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
);

const BIO_URL = 'https://www.natuclinic.com.br/bio';

// Um resultado no formato de post do Instagram: carrossel de 2 fotos (antes → depois).
const ResultPost = ({ n }) => {
    const trackRef = React.useRef(null);
    const [slide, setSlide] = React.useState(0);
    const [liked, setLiked] = React.useState(false);
    const fases = ['antes', 'depois'];

    const goTo = (i) => {
        const el = trackRef.current;
        if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
    };
    const onScroll = () => {
        const el = trackRef.current;
        if (el) setSlide(Math.round(el.scrollLeft / el.clientWidth));
    };
    const share = async () => {
        track(`compartilhar-resultado-${n}`);
        try {
            if (navigator.share) await navigator.share({ title: 'Natuclinic', url: BIO_URL });
            else await navigator.clipboard?.writeText(BIO_URL);
        } catch { /* compartilhamento cancelado */ }
    };

    return (
        <article className="border-b border-natu-brown/10 pb-5">
            <header className="flex items-center gap-3 py-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-natu-brown/15">
                    <img src="/logo-svg.svg" alt="" className="h-5 w-auto" />
                </span>
                <span className="flex flex-col leading-tight">
                    <span className="text-[14px] font-bold">instituto.natuclinic</span>
                    <span className="text-[12px] text-natu-brown/60">Taguatinga e Planaltina, DF</span>
                </span>
            </header>

            <div className="group relative -mx-4 overflow-hidden bg-natu-brown/5 sm:mx-0 sm:rounded-[6px]">
                <div
                    ref={trackRef}
                    onScroll={onScroll}
                    role="region"
                    aria-roledescription="carrossel"
                    aria-label={`Resultado ${Number(n)}: antes e depois`}
                    tabIndex={0}
                    className={`flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${focusRing}`}
                >
                    {fases.map((fase) => (
                        <div key={fase} className="relative aspect-[4/5] w-full shrink-0 snap-start">
                            <img
                                src={`/images/bio/resultado-${n}-${fase}.webp`}
                                alt={`Resultado ${Number(n)}, ${fase}`}
                                width="720"
                                height="900"
                                loading="lazy"
                                draggable="false"
                                className="h-full w-full select-none object-cover"
                            />
                            <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-[12px] font-semibold text-white">
                                {fase === 'antes' ? 'Antes' : 'Depois'}
                            </span>
                        </div>
                    ))}
                </div>

                <span aria-hidden="true" className="absolute right-3 top-3 rounded-full bg-black/55 px-2 py-0.5 text-[12px] font-semibold tabular-nums text-white">
                    {slide + 1}/2
                </span>
                {slide === 1 && (
                    <button type="button" onClick={() => goTo(0)} aria-label="Ver o antes" className="absolute left-3 top-1/2 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-natu-brown sm:flex">
                        <IconChevron dir="prev" />
                    </button>
                )}
                {slide === 0 && (
                    <button type="button" onClick={() => goTo(1)} aria-label="Ver o depois" className="absolute right-3 top-1/2 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-natu-brown sm:flex">
                        <IconChevron dir="next" />
                    </button>
                )}
            </div>

            <div className="relative flex items-center pt-2.5">
                <button
                    type="button"
                    onClick={() => { setLiked((v) => !v); if (!liked) track(`curtir-resultado-${n}`); }}
                    aria-pressed={liked}
                    aria-label="Curtir"
                    className={`-ml-2 flex h-10 w-10 items-center justify-center transition-transform duration-200 active:scale-90 ${liked ? 'text-[#E0245E]' : 'text-natu-brown'} ${focusRing}`}
                >
                    <IconHeart filled={liked} />
                </button>
                <button type="button" onClick={share} aria-label="Compartilhar" className={`flex h-10 w-10 items-center justify-center text-natu-brown ${focusRing}`}>
                    <IconSend />
                </button>
                <span aria-hidden="true" className="absolute left-1/2 flex -translate-x-1/2 gap-1">
                    {fases.map((fase, i) => (
                        <span key={fase} className={`h-1.5 w-1.5 rounded-full transition-colors ${slide === i ? 'bg-natu-brown' : 'bg-natu-brown/25'}`} />
                    ))}
                </span>
            </div>

            <p className="mt-1 text-[14px] leading-snug">
                <span className="font-bold">instituto.natuclinic</span>{' '}
                {slide === 0 ? 'Arraste para ver o depois.' : 'Antes e depois.'}{' '}
                <span className="text-natu-brown/60">Resultado individual; varia de pessoa para pessoa.</span>
            </p>
        </article>
    );
};

const ResultFeed = () => {
    const [showAll, setShowAll] = React.useState(false);
    const visible = showAll ? RESULTADOS : RESULTADOS.slice(0, 3);
    return (
        <div>
            {visible.map((n) => <ResultPost key={n} n={n} />)}
            {!showAll && (
                <button
                    type="button"
                    onClick={() => { setShowAll(true); track('ver-mais-resultados'); }}
                    className={`mt-5 flex min-h-[52px] w-full items-center justify-center rounded-full border border-natu-brown/20 text-[15px] font-bold transition-colors hover:border-natu-brown/50 hover:bg-natu-brown/[0.03] ${focusRing}`}
                >
                    Ver mais resultados ({RESULTADOS.length - 3})
                </button>
            )}
        </div>
    );
};

const Stars = ({ value = 5, size = 13 }) => (
    <span className="flex gap-0.5" role="img" aria-label={`${value} de 5 estrelas`}>
        {[1, 2, 3, 4, 5].map((i) => (
            <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill={i <= Math.round(value) ? '#FBBC05' : 'rgba(76,38,26,0.18)'}>
                <path d="M12 2.5l2.94 6.1 6.56.8-4.84 4.55 1.24 6.55L12 17.27 6.1 20.5l1.24-6.55L2.5 9.4l6.56-.8L12 2.5z" />
            </svg>
        ))}
    </span>
);

const ReviewItem = ({ review }) => {
    const [open, setOpen] = React.useState(false);
    const [photoOk, setPhotoOk] = React.useState(Boolean(review.avatarPhoto));
    const long = review.text.length > 220;
    return (
        <blockquote className="border-b border-natu-brown/15 py-5">
            <header className="flex items-center gap-3">
                {photoOk ? (
                    <img
                        src={review.avatarPhoto}
                        alt=""
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={() => setPhotoOk(false)}
                        className="h-9 w-9 shrink-0 rounded-full object-cover"
                    />
                ) : (
                    <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-natu-pink text-[14px] font-bold">
                        {review.avatarLetter}
                    </span>
                )}
                <span className="flex min-w-0 flex-col leading-tight">
                    <span className="truncate text-[14px] font-bold">{review.name}</span>
                    <span className="mt-1 flex items-center gap-2 text-[12px] text-natu-brown/60">
                        <Stars value={review.rating} size={12} />
                        {review.when}
                    </span>
                </span>
            </header>
            <p className={`mt-3 font-serif text-[17px] leading-[1.4] ${long && !open ? 'line-clamp-5' : ''}`}>“{review.text}”</p>
            {long && (
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className={`mt-1 min-h-[36px] text-[13px] font-semibold underline decoration-natu-brown/30 underline-offset-4 ${focusRing}`}
                >
                    {open ? 'Ler menos' : 'Ler mais'}
                </button>
            )}
        </blockquote>
    );
};

// Avaliações ao vivo do Google, pela mesma API da home (hook useGoogleReviews).
const GoogleReviewsList = () => {
    const { reviews, live, rating, total, mapsUri } = useGoogleReviews(AVALIACOES_RESERVA);
    return (
        <div>
            <div className="mb-4 mt-9 flex items-center justify-between gap-4">
                <h3 className="text-[16px] font-bold">No Google</h3>
                {live && rating && (
                    <span className="flex items-center gap-2 text-[13px]">
                        <img src="/google-icon.png" alt="" className="h-4 w-4" />
                        <span className="font-bold tabular-nums">{rating.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                        <Stars value={rating} size={12} />
                        {total && <span className="tabular-nums text-natu-brown/60">({total.toLocaleString('pt-BR')})</span>}
                    </span>
                )}
            </div>
            <div className="border-t border-natu-brown/15">
                {reviews.slice(0, 3).map((r) => <ReviewItem key={r.id} review={r} />)}
            </div>
            <a
                href={mapsUri || UNIDADES[0].mapa}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('avaliacoes-google')}
                className={`mt-2 ${textLink}`}
            >
                Ver todas as avaliações
                <Unicon name="arrow-up-right" size={14} />
            </a>
        </div>
    );
};

const SubTitle = ({ children, note }) => (
    <div className="mb-4 mt-9 flex items-baseline justify-between gap-4">
        <h3 className="text-[16px] font-bold">{children}</h3>
        {note && <span className="text-[12px] text-natu-brown/55">{note}</span>}
    </div>
);

const Bio = () => {
    const reduceMotion = useReducedMotion();

    return (
        <div className="min-h-[100svh] bg-white font-sans text-natu-brown selection:bg-natu-pink selection:text-natu-brown">
            <Helmet>
                <title>Natuclinic | Saúde e estética de dentro para fora</title>
                <meta name="description" content="Clínica particular de nutrição ortomolecular e estética avançada, com o Dr. Julimar e a Dra. Débora. Agende sua consulta em Taguatinga ou Planaltina-DF." />
                <meta name="robots" content="noindex, follow" />
                <link rel="canonical" href="https://www.natuclinic.com.br/bio" />
            </Helmet>

            <div className="mx-auto max-w-[460px] sm:px-4 sm:pt-6">
                <header className="relative isolate overflow-hidden bg-natu-brown text-white sm:rounded-[30px]">
                    <div className="relative aspect-[5/4] w-full overflow-hidden">
                        <Motion.img
                            src="/images/dr-julimar-e-dra-debora-bio.webp"
                            alt="Dra. Débora e Dr. Julimar, da Natuclinic"
                            width="900"
                            height="600"
                            fetchPriority="high"
                            initial={reduceMotion ? false : { scale: 1.08 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 1.6, ease: EASE_OUT_EXPO }}
                            className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
                        />
                        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-natu-brown via-natu-brown/20 via-40% to-natu-brown/25" />
                        <img src="/logo-natuclinic-completa.svg" alt="Natuclinic" className="absolute left-1/2 top-6 h-6 w-auto -translate-x-1/2" />
                    </div>

                    <div className="relative -mt-14 px-6 pb-7">
                        <h1 className="font-serif text-[38px] leading-[1.02] tracking-[-0.015em] [text-wrap:balance]">
                            Saúde e estética de dentro para fora
                        </h1>
                        <p className="mt-3 max-w-[34ch] text-[15px] leading-snug text-white/80">
                            Clínica particular de nutrição ortomolecular e estética avançada, com o Dr. Julimar e a Dra. Débora. Taguatinga e Planaltina, DF.
                        </p>

                        <div className="mt-7 flex flex-col gap-3">
                            <a
                                href={AGENDAR}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => track('agendar')}
                                className="group flex items-center justify-between rounded-full bg-white py-2 pl-6 pr-2 text-natu-brown transition-transform duration-300 ease-out active:scale-[0.985] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                            >
                                <span className="text-[16px] font-bold">Agendar minha consulta</span>
                                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-whatsapp text-white transition-transform duration-300 group-hover:scale-105">
                                    <Unicon name="whatsapp" size={24} />
                                </span>
                            </a>
                            <a
                                href="#padrao"
                                onClick={(e) => {
                                    e.preventDefault();
                                    track('conhecer-clinica');
                                    document.getElementById('padrao')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
                                }}
                                className="group flex min-h-[64px] items-center justify-between rounded-full border border-white/35 pl-6 pr-2 text-white transition-colors duration-300 hover:border-white/70 hover:bg-white/[0.06] active:scale-[0.985] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                            >
                                <span className="text-[16px] font-bold">Conhecer a clínica</span>
                                <span className="flex h-12 w-12 items-center justify-center transition-transform duration-300 group-hover:translate-y-0.5">
                                    <Unicon name="arrow-down" size={20} />
                                </span>
                            </a>
                        </div>
                    </div>
                </header>

                <div className="px-4 pb-12 sm:px-0">
                    {/* O padrão da clínica: só fatos já publicados no site (FAQ e página Sobre) */}
                    <section id="padrao" aria-labelledby="bio-padrao" className="scroll-mt-4">
                        <h2 id="bio-padrao" className="mt-14 font-serif text-[28px] leading-[1.1] tracking-[-0.01em]">
                            O padrão Natuclinic
                        </h2>
                        <p className="mt-3 max-w-[38ch] text-[15px] leading-relaxed text-natu-brown/75">
                            Uma clínica particular, com tempo para cada paciente e um plano construído só para você.
                        </p>

                        <div className="mt-6 grid grid-cols-2 gap-[3px] overflow-hidden rounded-[20px] bg-natu-brown/5">
                            <img src="/images/bio/espaco-recepcao.webp" alt="Recepção da Natuclinic" width="560" height="746" loading="lazy" className="aspect-[3/4] h-full w-full object-cover" />
                            <img src="/images/bio/espaco-espera.webp" alt="Sala de espera da Natuclinic" width="560" height="746" loading="lazy" className="aspect-[3/4] h-full w-full object-cover" />
                        </div>

                        <dl className="mt-6 border-t border-natu-brown/15">
                            {PADRAO.map((p) => (
                                <div key={p.titulo} className="border-b border-natu-brown/15 py-5">
                                    <dt className="font-serif text-[20px] leading-tight">{p.titulo}</dt>
                                    <dd className="mt-1.5 text-[14px] leading-snug text-natu-brown/70">{p.texto}</dd>
                                </div>
                            ))}
                        </dl>

                        <h3 className="mt-9 text-[16px] font-bold">Quem cuida de você</h3>
                        <ul className="mt-4 flex flex-col gap-5">
                            {EQUIPE.map((m) => (
                                <li key={m.nome} className="flex items-center gap-4">
                                    <img src={m.foto} alt="" width="160" height="160" loading="lazy" className="h-16 w-16 shrink-0 rounded-full object-cover" />
                                    <div>
                                        <p className="font-serif text-[19px] leading-tight">{m.nome}</p>
                                        <p className="mt-1 text-[13px] leading-snug text-natu-brown/70">{m.credenciais}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <Link to="/sobre" onClick={() => track('historia-clinica')} className={`mt-4 ${textLink}`}>
                            Conheça a história da clínica
                            <Unicon name="arrow-right" size={14} />
                        </Link>
                    </section>

                    {/* Feedbacks e resultados */}
                    <section aria-labelledby="bio-resultados">
                        <h2 id="bio-resultados" className="mt-14 font-serif text-[28px] leading-[1.1] tracking-[-0.01em]">
                            Feedbacks e resultados
                        </h2>

                        <SubTitle>Antes e depois</SubTitle>
                        <ResultFeed />

                        <SubTitle>Quem fez, conta</SubTitle>
                        <Rail label="Depoimentos em vídeo">
                            {DEPOIMENTOS.map((d) => (
                                <figure key={d.id} className="w-[62%] shrink-0 snap-start">
                                    <video
                                        src={d.video}
                                        controls
                                        playsInline
                                        preload="metadata"
                                        onPlay={() => track(`video-${d.id}`)}
                                        className="aspect-[9/16] w-full rounded-[20px] bg-natu-brown object-cover"
                                    />
                                    <figcaption className="mt-3 px-1">
                                        <span className="block text-[15px] font-bold">{d.nome}</span>
                                        <span className="mt-0.5 block text-[13px] leading-snug text-natu-brown/70">{d.resultado}</span>
                                    </figcaption>
                                </figure>
                            ))}
                        </Rail>

                        <GoogleReviewsList />
                    </section>

                    {/* Unidades */}
                    <section aria-labelledby="bio-unidades">
                        <h2 id="bio-unidades" className="mb-5 mt-14 font-serif text-[28px] leading-[1.1] tracking-[-0.01em]">
                            Nossas unidades
                        </h2>
                        <div className="flex flex-col gap-9">
                            {UNIDADES.map((u) => (
                                <div key={u.nome}>
                                    <div className="h-[180px] overflow-hidden rounded-[20px] bg-natu-brown/5">
                                        <iframe
                                            src={u.embed}
                                            title={`Mapa da unidade ${u.nome}`}
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            className="h-full w-full border-0 grayscale-[35%]"
                                        />
                                    </div>
                                    <h3 className="mt-4 font-serif text-[21px] leading-tight">{u.nome}</h3>
                                    <p className="mt-1.5 text-[14px] leading-snug text-natu-brown/70">{u.endereco}</p>
                                    <div className="mt-1 flex flex-wrap items-center gap-x-5">
                                        <a href={u.mapa} target="_blank" rel="noopener noreferrer" onClick={() => track(`mapa-${u.nome}`)} className={textLink}>
                                            Como chegar
                                            <Unicon name="arrow-up-right" size={14} />
                                        </a>
                                        <a
                                            href={`tel:+5561${u.telefone.replace(/\D/g, '').slice(-8)}`}
                                            onClick={() => track(`tel-${u.nome}`)}
                                            className={`${textLink} tabular-nums`}
                                        >
                                            {u.telefone}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <footer className="mt-14 flex flex-col items-center gap-1 border-t border-natu-brown/15 pt-6 text-[12px] text-natu-brown/60">
                        <a
                            href="https://www.instagram.com/instituto.natuclinic/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex min-h-[40px] items-center gap-1.5 hover:text-natu-brown ${focusRing}`}
                        >
                            <Unicon name="instagram" size={14} />
                            @instituto.natuclinic
                        </a>
                        <Link to="/politica-de-privacidade" className={`underline underline-offset-4 hover:text-natu-brown ${focusRing}`}>
                            Política de privacidade
                        </Link>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Bio;
