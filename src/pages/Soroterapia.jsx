import React, { useState, useRef, useEffect } from 'react';
import ServiceLayout from '../components/ServiceLayout';
import { motion } from "motion/react";
import { NatuButton } from '../components/Navbar';
import { WHATSAPP_LINKS, UNIT_PHONES } from '../constants/links';
import Unicon from '../components/Unicon';

const BlurFade = ({ children, delay = 0, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        whileInView={{ opacity: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
        className={`flicker-fix ${className}`}
    >
        {children}
    </motion.div>
);

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-natu-brown/20 py-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-start justify-between w-full text-left focus:outline-none group gap-4"
            >
                <h3 className="font-sans text-lg md:text-xl text-natu-brown group-hover:text-natu-pink transition-colors leading-[1.2] flex-1">
                    {question}
                </h3>
                <span className={`text-natu-brown text-2xl transition-transform duration-300 font-sans leading-none shrink-0 ${isOpen ? 'rotate-45' : ''}`}>
                    +
                </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 font-sans font-light text-gray-600 text-left ${isOpen ? 'max-h-[500px] mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                {answer}
            </div>
        </div>
    );
};

const protocols = [
    { name: "Glutationa",        abbr: "Gsh",   tag: "Antioxidante Master",       description: "O antioxidante mais potente do organismo. Clareia a pele, protege o fígado, elimina toxinas e combate o envelhecimento celular. Muito indicado após cirurgia bariátrica e para pele mais uniforme.",                                                                                    benefits: ["Clareamento cutâneo", "Detox hepático", "Antiaging"] },
    { name: "Vitamina C",        abbr: "Vit C", tag: "Imunidade e Colágeno",       description: "Em altas doses intravenosas, a vitamina C estimula a produção de colágeno, fortalece o sistema imunológico, reduz inflamação e tem efeito antiviral comprovado.",                                                                                                                        benefits: ["Imunidade reforçada", "Síntese de colágeno", "Antiinflamatório"] },
    { name: "Coenzima Q10",      abbr: "Q10",   tag: "Energia Celular",            description: "Essencial para a produção de energia nas mitocôndrias. Melhora disposição, protege o coração, reduz a fadiga crônica e tem forte ação antioxidante. Indicada também no protocolo antiaging.",                                                                                             benefits: ["Energia e disposição", "Saúde cardiovascular", "Antiaging"] },
    { name: "PQQ",               abbr: "PQQ",   tag: "Neuroproteção",              description: "Pirroloquinolina quinona: estimula a formação de novas mitocôndrias, protege o sistema nervoso, melhora memória, foco e cognição. Muito utilizado em protocolos de longevidade e performance mental.",                                                                                     benefits: ["Função cognitiva", "Novas mitocôndrias", "Longevidade"] },
    { name: "Ácido Alfa Lipóico",abbr: "α-LA",  tag: "Antioxidante Universal",     description: "Age tanto no meio aquoso quanto no lipídico, protegendo células em todos os tecidos. Melhora sensibilidade à insulina, reduz neuropatia, combate inflamação e potencializa outros antioxidantes.",                                                                                        benefits: ["Controle glicêmico", "Neuroprotação", "Regenera antioxidantes"] },
    { name: "BCAA",              abbr: "BCAA",  tag: "Massa e Recuperação",        description: "Aminoácidos de cadeia ramificada (leucina, isoleucina e valina) essenciais para síntese proteica, recuperação muscular pós-treino e prevenção de perda de massa magra.",                                                                                                                  benefits: ["Síntese proteica", "Recuperação muscular", "Preserva massa magra"] },
    { name: "Vitamina B12",      abbr: "B12",   tag: "Sistema Nervoso",            description: "Fundamental para produção de glóbulos vermelhos, função neurológica e metabolismo energético. Essencial no pós-bariátrico, onde a deficiência é quase universal e causa fadiga, formigamento e anemia.",                                                                                   benefits: ["Energia e vitalidade", "Saúde neurológica", "Pós-bariátrico"] },
    { name: "Complexo B",        abbr: "Cpx B", tag: "Metabolismo e Energia",      description: "Conjunto das vitaminas B1, B2, B3, B5, B6, B7 e B9 com ação sinérgica sobre o metabolismo energético, sistema nervoso, saúde da pele e produção de neurotransmissores.",                                                                                                                  benefits: ["Metabolismo ativo", "Sistema nervoso", "Reduz fadiga"] },
    { name: "NADH",              abbr: "NADH",  tag: "Energia e Cognição",         description: "Forma ativa da vitamina B3, essencial para a produção de ATP nas células. Aumenta energia, melhora foco, memória e raciocínio. Indicado em fadiga crônica, longevidade e performance mental.",                                                                                             benefits: ["Produção de ATP", "Clareza mental", "Combate fadiga crônica"] },
    { name: "Arginina",          abbr: "Arg",   tag: "Circulação e Imunidade",     description: "Aminoácido precursor do óxido nítrico, que dilata os vasos sanguíneos e melhora a circulação. Estimula o sistema imunológico, a produção de hormônio de crescimento e acelera a cicatrização.",                                                                                           benefits: ["Melhora circulação", "Imunidade", "Hormônio de crescimento"] },
    { name: "Taurina",           abbr: "Tau",   tag: "Sistema Nervoso",            description: "Aminoácido com ação neuroprotetora, antioxidante e reguladora do sistema cardiovascular. Melhora o sono, reduz ansiedade, protege o coração e é essencial para a função da retina.",                                                                                                      benefits: ["Neuroproteção", "Saúde cardiovascular", "Qualidade do sono"] },
    { name: "Carnitina",         abbr: "Car",   tag: "Emagrecimento",              description: "Transporta ácidos graxos para dentro das mitocôndrias, onde são convertidos em energia. Essencial para o emagrecimento, performance esportiva e recuperação muscular.",                                                                                                                    benefits: ["Queima de gordura", "Energia muscular", "Performance"] },
    { name: "NAC",               abbr: "NAC",   tag: "Detox e Pulmões",            description: "N-Acetil Cisteína: precursor da glutationa, com potente ação mucolítica, detoxificante hepática e antioxidante. Indicado para saúde respiratória, desintoxicação e pós-COVID.",                                                                                                            benefits: ["Precursor glutationa", "Saúde pulmonar", "Detox hepático"] },
    { name: "Selênio",           abbr: "Se",    tag: "Tireoide e Antioxidante",    description: "Mineral essencial para a função da tireoide, produção de glutationa e defesa antioxidante. Protege contra danos celulares, apoia a imunidade e tem ação anticancerígena comprovada.",                                                                                                      benefits: ["Saúde da tireoide", "Antioxidante", "Imunidade"] },
    { name: "Magnésio",          abbr: "Mg",    tag: "Relaxamento e Sono",         description: "Participa de mais de 300 reações enzimáticas no organismo. Reduz cãibras, melhora o sono, combate ansiedade, controla a pressão arterial e é fundamental para a saúde muscular e óssea.",                                                                                                  benefits: ["Reduz cãibras", "Melhora o sono", "Controla ansiedade"] },
    { name: "Zinco",             abbr: "Zn",    tag: "Imunidade e Pele",           description: "Mineral essencial para a imunidade, cicatrização, produção de testosterona e saúde da pele. Muito deficiente em pós-bariátricos e fundamental para o controle inflamatório.",                                                                                                              benefits: ["Imunidade", "Cicatrização", "Saúde hormonal"] },
    { name: "Vitamina D",        abbr: "D3",    tag: "Ossos e Imunidade",           description: "A vitamina mais deficiente no Brasil. Via intramuscular garante absorção imediata. Fundamental para imunidade, saúde óssea, humor, função muscular e prevenção de doenças crônicas. Indispensável no pós-bariátrico.",                                                                             benefits: ["Saúde óssea", "Imunidade", "Pós-bariátrico"] },
    { name: "Ácido Fólico",      abbr: "B9",    tag: "DNA e Gestação",              description: "Vitamina B9 essencial para a síntese e reparo do DNA, produção de glóbulos vermelhos e redução da homocisteína. Indispensável na gestação para prevenção de defeitos do tubo neural e no pós-bariátrico.",                                                                                        benefits: ["Síntese de DNA", "Homocisteína", "Gestação"] },
    { name: "Biotina",           abbr: "B7",    tag: "Cabelo, Unhas e Pele",        description: "Vitamina B7 com papel central no metabolismo de gorduras, carboidratos e proteínas. Reconhecida pela ação na redução da queda de cabelo, fortalecimento das unhas e melhora da pele. Muito indicada no pós-bariátrico.",                                                                           benefits: ["Queda de cabelo", "Unhas fortes", "Metabolismo"] },
    { name: "Ferro",             abbr: "Fe",    tag: "Anemia e Energia",            description: "Mineral essencial para produção de hemoglobina e transporte de oxigênio. A deficiência causa anemia, fadiga extrema, queda de cabelo e palidez. Via intravenosa é a forma mais eficaz, especialmente no pós-bariátrico onde a absorção oral é limitada.",                                         benefits: ["Anemia", "Energia", "Queda de cabelo"] },
    { name: "Cromo",             abbr: "Cr",    tag: "Glicemia e Emagrecimento",    description: "Mineral que potencializa a ação da insulina, melhorando o controle glicêmico e reduzindo a compulsão por carboidratos e doces. Indicado em protocolos de emagrecimento, diabetes tipo 2 e síndrome metabólica.",                                                                                   benefits: ["Controle glicêmico", "Reduz compulsão", "Emagrecimento"] },
    { name: "Vitamina ADEK",     abbr: "ADEK",  tag: "Vitaminas Lipossolúveis",     description: "Complexo das quatro vitaminas lipossolúveis: A (visão e imunidade), D (ossos e hormônios), E (antioxidante e pele) e K (coagulação e saúde óssea). A absorção oral é comprometida em pacientes com má absorção de gordura, tornando a via injetável essencial no pós-bariátrico.", benefits: ["Visão e imunidade", "Saúde óssea", "Pós-bariátrico"] },
];

const faqs = [
    {
        question: "Soroterapia dói?",
        answer: "A aplicação usa agulha fina e técnica cuidadosa. A maioria dos pacientes sente apenas um leve desconforto no momento da punção. A infusão dura entre 40 e 60 minutos e você fica confortavelmente instalado durante todo o processo."
    },
    {
        question: "Quantas sessões são necessárias?",
        answer: "Depende do objetivo. Para resultados pontuais como imunidade e energia, 1 a 3 sessões já fazem diferença. Para protocolos de beleza ou reposição pós-bariátrica, recomendamos ciclos de 4 a 8 sessões mensais com manutenção conforme avaliação."
    },
    {
        question: "A soroterapia substitui suplementos orais?",
        answer: "Em alguns casos sim. No pós-bariátrico, por exemplo, a absorção intestinal é comprometida e a via intravenosa garante 100% de biodisponibilidade dos nutrientes. Suplementos orais perdem potência no processo digestivo."
    },
    {
        question: "Tem contraindicação?",
        answer: "O protocolo é prescrito individualmente após avaliação médica. Gestantes e pacientes com insuficiência renal ou cardíaca grave precisam de análise mais criteriosa. Sempre realizamos uma anamnese completa antes da primeira sessão."
    },
    {
        question: "Posso fazer soroterapia sem ter feito bariátrica?",
        answer: "Sim. A soroterapia em Brasília é indicada para qualquer pessoa que queira repor nutrientes com eficiência: por fadiga, estresse, baixa imunidade, emagrecimento ou para potencializar saúde e beleza no geral."
    },
    {
        question: "Onde são realizadas as sessões?",
        answer: "As sessões de soroterapia acontecem em ambiente clínico seguro e confortável nas unidades da Natuclinic em Taguatinga-DF e Planaltina-DF, com acompanhamento durante toda a infusão."
    },
];

const useDragScroll = () => {
    const ref = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const onMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.pageX - ref.current.offsetLeft;
        scrollLeft.current = ref.current.scrollLeft;
        ref.current.style.cursor = 'grabbing';
        ref.current.style.userSelect = 'none';
    };
    const onMouseLeave = () => { isDragging.current = false; if (ref.current) ref.current.style.cursor = 'grab'; };
    const onMouseUp = () => { isDragging.current = false; if (ref.current) ref.current.style.cursor = 'grab'; };
    const onMouseMove = (e) => {
        if (!isDragging.current) return;
        e.preventDefault();
        const x = e.pageX - ref.current.offsetLeft;
        const walk = (x - startX.current) * 1.2;
        ref.current.scrollLeft = scrollLeft.current - walk;
    };

    return { ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove };
};

const Soroterapia = ({ goBack }) => {
    const containerRef = useRef(null);
    const bgRef = useRef(null);
    const [activeProtocol, setActiveProtocol] = useState(protocols[0]);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const dragScroll = useDragScroll();
    const cardRef = useRef(null);

    const updateScrollState = () => {
        const el = dragScroll.ref.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    };

    useEffect(() => {
        updateScrollState();
    }, []);

    const handleWhatsApp = () => {
        window.open(WHATSAPP_LINKS.MSG_SOROTERAPIA, '_blank');
    };

    return (
        <ServiceLayout
            title="Soroterapia"
            goBack={goBack}
            hideHeader={true}
            whatsappMessage="Olá! Tenho interesse na Soroterapia (Soro da Beleza/Imunidade)."
            seo={{
                title: "Soroterapia em Brasília: Soro da Beleza e Imunidade | Natuclinic",
                description: "Reposição de vitaminas e minerais na veia com a Soroterapia (Soro da Beleza e Soro da Imunidade) em Brasília e Taguatinga. Mais saúde e vitalidade.",
                url: "https://www.natuclinic.com.br/procedimentos/soroterapia",
                canonical: "https://www.natuclinic.com.br/procedimentos/soroterapia",
                keywords: "soroterapia brasília, soro da beleza df, reposição de vitaminas na veia, soro da imunidade taguatinga, terapia endovenosa df",
                image: "/soroterapia-terapia-injetavel-vitaminas-e-aminoacidos.png",
                jsonLdList: [
                    {
                        "@context": "https://schema.org",
                        "@type": "MedicalProcedure",
                        "name": "Soroterapia",
                        "description": "Soroterapia intravenosa com protocolos personalizados de vitaminas e minerais para beleza, imunidade, emagrecimento, tratamento de queda de cabelo, fraqueza, anemia e reposição pós-bariátrica em Brasília e Taguatinga.",
                        "indication": ["Queda de cabelo por deficiência de vitaminas", "Fraqueza e cansaço crônico", "Anemia ferropriva", "Deficiência de vitamina B12", "Baixa imunidade", "Reposição pós-bariátrica", "Detox e emagrecimento"],
                        "url": "https://www.natuclinic.com.br/procedimentos/soroterapia",
                        "procedureType": "Noninvasive",
                        "performer": {
                            "@type": "Person",
                            "name": "Dr. Julimar Meneses",
                            "jobTitle": "Nutricionista Ortomolecular",
                            "hasCredential": { "@type": "EducationalOccupationalCredential", "credentialCategory": "CRN-DF 21414" },
                            "worksFor": { "@type": "MedicalOrganization", "name": "Natuclinic" }
                        }
                    },
                    {
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": faqs.map(f => ({
                            "@type": "Question",
                            "name": f.question,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": typeof f.answer === 'string' ? f.answer : f.question
                            }
                        }))
                    },
                    {
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://www.natuclinic.com.br" },
                            { "@type": "ListItem", "position": 2, "name": "Procedimentos", "item": "https://www.natuclinic.com.br/procedimentos" },
                            { "@type": "ListItem", "position": 3, "name": "Soroterapia", "item": "https://www.natuclinic.com.br/procedimentos/soroterapia" }
                        ]
                    },
                    {
                        "@context": "https://schema.org",
                        "@type": "LocalBusiness",
                        "name": "Natuclinic — Soroterapia em Brasília",
                        "url": "https://www.natuclinic.com.br/procedimentos/soroterapia",
                        "image": "https://www.natuclinic.com.br/soroterapia-terapia-injetavel-vitaminas-e-aminoacidos.png",
                        "description": "Soroterapia intravenosa com protocolo personalizado em Taguatinga e Planaltina, Brasília-DF.",
                        "priceRange": "$$",
                        "telephone": "+55-61-99375-5298",
                        "address": [
                            {
                                "@type": "PostalAddress",
                                "streetAddress": "Qne 01 Lote 17/20 Loja 02",
                                "addressLocality": "Taguatinga Norte",
                                "addressRegion": "DF",
                                "addressCountry": "BR"
                            },
                            {
                                "@type": "PostalAddress",
                                "streetAddress": "SH Mte. D'armas Estância 1 Mod C",
                                "addressLocality": "Planaltina",
                                "addressRegion": "DF",
                                "addressCountry": "BR"
                            }
                        ],
                        "hasMap": "https://www.google.com/maps?q=Natuclinic+Taguatinga+Norte",
                        "openingHours": "Mo-Fr 08:00-18:00",
                        "sameAs": ["https://www.instagram.com/natuclinic"]
                    }
                ],
            }}
        >
            {/* 1. Hero */}
            <section ref={containerRef} className="relative h-[90vh] md:h-screen flex items-center justify-center overflow-hidden bg-white pt-12 md:pt-16">
                <div className="absolute inset-0 flex items-center justify-center p-0 md:p-8 z-0 pt-24 md:pt-32">
                    <div className="relative w-full h-full md:w-[95%] md:h-[85%] rounded-b-[2.5rem] md:rounded-[2.5rem] overflow-hidden">
                        <img
                            ref={bgRef}
                            src="/images/woman-running-soroterapia-brasilia.png"
                            alt="Soroterapia intravenosa na Natuclinic em Brasília"
                            className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#4C261A]/90 via-[#4C261A]/30 to-transparent z-[5]" />

                        <div className="absolute inset-0 z-10 flex flex-col justify-end items-center md:items-start p-6 pb-10 md:p-20 md:pb-24">
                            <BlurFade delay={0.2}>
                                <span className="block text-[10px] font-bold tracking-[0.1em] text-white/60 font-sans text-center md:text-left mb-4">
                                    Taguatinga-DF · Planaltina-DF
                                </span>
                            </BlurFade>
                            <BlurFade delay={0.4}>
                                <h1 className="text-4xl md:text-7xl font-serif text-white leading-[0.9] tracking-tighter text-center md:text-left max-w-3xl mx-auto md:mx-0">
                                    Nutrientes direto<br />
                                    <span className="italic">na sua corrente sanguínea</span>
                                </h1>
                            </BlurFade>
                            <BlurFade delay={0.6}>
                                <p className="mt-4 text-sm md:text-base font-normal text-white/85 max-w-lg leading-relaxed text-center md:text-left mx-auto md:mx-0 font-sans">
                                    Vitaminas, minerais e antioxidantes com absorção de 100%, sem passar pelo sistema digestivo. Sinta a diferença já na primeira sessão.
                                </p>
                            </BlurFade>
                            <BlurFade delay={0.8}>
                                <div className="mt-6 flex justify-center md:justify-start w-full md:w-auto">
                                    <NatuButton
                                        onClick={handleWhatsApp}
                                        className="relative overflow-hidden group/shimmer transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] !bg-black !text-white border-none"
                                    >
                                        <motion.div
                                            className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-[25deg] pointer-events-none"
                                            initial={{ left: '-100%', opacity: 0 }}
                                            animate={{ left: '150%', opacity: 1 }}
                                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                                        />
                                        <span className="relative z-10 font-sans">Quero meu protocolo</span>
                                    </NatuButton>
                                </div>
                            </BlurFade>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. O que é Soroterapia */}
            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                        <BlurFade>
                            <span className="text-[10px] font-bold tracking-[0.12em] text-natu-brown/50 font-sans block mb-4">TERAPIA INTRAVENOSA</span>
                            <h2 className="text-3xl md:text-5xl font-sans font-black text-natu-brown leading-tight tracking-tight mb-6">
                                Soroterapia intravenosa em Brasília com absorção de 100%
                            </h2>
                            <p className="font-sans font-light text-gray-500 text-base leading-relaxed mb-4">
                                A soroterapia é a administração intravenosa de vitaminas, minerais, aminoácidos e antioxidantes diretamente na corrente sanguínea. A absorção chega a 100%, o que é impossível com suplementos orais, que perdem potência no processo digestivo.
                            </p>
                            <p className="font-sans font-light text-gray-500 text-base leading-relaxed">
                                Na Natuclinic, cada protocolo de soroterapia em Brasília é formulado individualmente pelo Dr. Julimar após avaliação clínica e laboratorial, garantindo que você receba exatamente o que seu corpo precisa.
                            </p>
                        </BlurFade>
                        <BlurFade delay={0.2}>
                            <div className="flex items-center justify-center">
                                <img
                                    src="/images/bag-soro-soroterapia-brasilia.png"
                                    alt="Bag de soro soroterapia intravenosa Brasília"
                                    className="w-full max-w-lg object-contain"
                                />
                            </div>
                        </BlurFade>
                    </div>
                </div>
            </section>

            {/* 3. Onde Estamos */}
            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12">

                    {/* Fotos + Texto */}
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-20 items-center">
                        <div className="w-full lg:w-1/2 flex flex-row gap-3 md:gap-4">
                            <div className="w-1/2 h-[240px] sm:h-[320px] md:h-[450px] overflow-hidden bg-gray-50 group">
                                <img src="/images/clinica-de-estetica-natuclinic-brasilia.jpg" alt="Fachada Natuclinic Taguatinga" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[20%]" />
                            </div>
                            <div className="w-1/2 h-[240px] sm:h-[320px] md:h-[450px] overflow-hidden bg-gray-50 group mt-6 sm:mt-12">
                                <img src="/images/melhor-clinica-de-brasilia-df.jpg" alt="Interior Natuclinic Planaltina" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[20%]" />
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 flex flex-col font-sans text-natu-brown text-left">
                            <span className="text-[10px] font-sans font-bold tracking-[0.3em] uppercase text-natu-brown/40 block mb-4">Bem-vindo</span>
                            <h2 className="font-sans font-bold text-3xl md:text-4xl text-natu-brown leading-tight tracking-tight mb-8">
                                Espaços pensados para seu bem-estar
                            </h2>
                            <p className="text-sm md:text-base opacity-60 leading-relaxed font-light">
                                Nossas unidades em Taguatinga e Planaltina foram projetadas para entregar uma experiência premium do início ao fim. Ambientes modernos, climatizados e acolhedores, unindo tecnologia de ponta em estética avançada com uma atmosfera de conforto que você não encontra em nenhum outro lugar do Distrito Federal.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* 4. Vitaminas — carrossel estilo Instagram */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <BlurFade>
                        <span className="text-[10px] font-bold tracking-[0.12em] text-natu-brown/40 font-sans block mb-3 text-center">SUPLEMENTOS INJETÁVEIS</span>
                        <h2 className="text-3xl md:text-4xl font-sans font-black text-natu-brown leading-tight tracking-tight mb-8 text-center">
                            O que aplicamos e para que serve
                        </h2>
                    </BlurFade>

                    {/* Card com os círculos */}
                    <div ref={cardRef} className="relative rounded-2xl border border-natu-brown/10">
                        {/* Setas de navegação */}
                        <button
                            onClick={() => dragScroll.ref.current?.scrollBy({ left: -200, behavior: 'smooth' })}
                            className={`absolute left-2 top-[52px] -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-natu-brown/15 shadow-sm flex items-center justify-center text-natu-brown/50 hover:text-natu-brown hover:border-natu-brown/30 transition-all duration-300 ${canScrollLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                        </button>
                        <button
                            onClick={() => dragScroll.ref.current?.scrollBy({ left: 200, behavior: 'smooth' })}
                            className={`absolute right-2 top-[52px] -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-natu-brown/15 shadow-sm flex items-center justify-center text-natu-brown/50 hover:text-natu-brown hover:border-natu-brown/30 transition-all duration-300 ${canScrollRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                        </button>
                        {/* Fila de círculos */}
                        <div
                            ref={dragScroll.ref}
                            onMouseDown={dragScroll.onMouseDown}
                            onMouseLeave={dragScroll.onMouseLeave}
                            onMouseUp={dragScroll.onMouseUp}
                            onMouseMove={dragScroll.onMouseMove}
                            onScroll={updateScrollState}
                            style={{ cursor: 'grab' }}
                            className="flex gap-4 md:gap-5 overflow-x-auto px-5 md:px-8 pt-6 pb-6 scrollbar-hide bg-white select-none rounded-2xl"
                        >
                            {protocols.map((p, i) => {
                                const isActive = activeProtocol?.name === p.name;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setActiveProtocol(p)}
                                        onMouseEnter={() => setActiveProtocol(p)}
                                        className="shrink-0 flex flex-col items-center gap-2 cursor-pointer focus:outline-none"
                                    >
                                        <div className={`p-[2px] rounded-full transition-all duration-300 ${isActive ? 'bg-gradient-to-br from-natu-pink via-natu-brown to-natu-pink shadow-[0_0_0_3px_rgba(255,194,194,0.4)]' : 'bg-natu-brown/15 hover:bg-gradient-to-br hover:from-natu-pink hover:via-natu-brown hover:to-natu-pink'}`}>
                                            <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center">
                                                <img src="/images/soroterapia-icon.png" alt="" className={`w-8 h-8 md:w-11 md:h-11 object-contain select-none transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-30'}`} />
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-sans font-medium text-center w-16 md:w-20 leading-tight transition-colors duration-200 ${isActive ? 'text-natu-brown' : 'text-natu-brown/40'}`}>
                                            {p.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Painel de detalhes — fora do card */}
                    <div className="mt-4">
                        {activeProtocol && (
                            <div className="flex flex-row gap-4 md:gap-6 items-start py-4">
                                <div className="flex-shrink-0 p-[2px] rounded-full bg-gradient-to-br from-natu-pink via-natu-brown to-natu-pink">
                                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center">
                                        <img src="/images/soroterapia-icon.png" alt="" className="w-6 h-6 md:w-9 md:h-9 object-contain" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-sans font-bold text-lg text-natu-brown mb-2">{activeProtocol.name}</h4>
                                    <p className="font-sans font-light text-gray-500 text-sm leading-relaxed mb-3">{activeProtocol.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {activeProtocol.benefits.map((b, j) => (
                                            <span key={j} className="text-[10px] font-bold font-sans text-natu-brown/60 bg-natu-ivory border border-natu-brown/10 rounded-full px-3 py-1">
                                                {b}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 5. Queda de Cabelo e Fraqueza */}
            <section className="py-16 md:py-24 bg-natu-ivory">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <BlurFade>
                        <span className="text-[10px] font-bold tracking-[0.12em] text-natu-brown/40 font-sans block mb-3 text-center">INDICAÇÕES</span>
                        <h2 className="text-3xl md:text-4xl font-sans font-black text-natu-brown leading-tight tracking-tight mb-4 text-center">
                            Para quem a soroterapia é indicada?
                        </h2>
                        <p className="text-base font-sans font-light text-gray-500 leading-relaxed text-center max-w-2xl mx-auto mb-14">
                            A maioria dos sintomas que persistem mesmo com hábitos saudáveis tem origem em deficiências nutricionais. A soroterapia repõe o que falta com absorção de 100%, direto na corrente sanguínea.
                        </p>
                    </BlurFade>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <BlurFade delay={0.1}>
                            <div className="bg-white rounded-2xl p-8 border border-natu-brown/8 h-full">
                                <h3 className="font-sans font-black text-natu-brown text-xl mb-3">Queda de cabelo</h3>
                                <p className="font-sans font-light text-gray-500 text-sm leading-relaxed">
                                    A queda de cabelo é frequentemente causada por deficiência de Ferro, Biotina (B7), Zinco e Vitamina D — nutrientes de baixa absorção oral. Via intravenosa, eles chegam diretamente às células do folículo capilar, revertendo o processo de queda com muito mais eficácia.
                                </p>
                            </div>
                        </BlurFade>

                        <BlurFade delay={0.15}>
                            <div className="bg-white rounded-2xl p-8 border border-natu-brown/8 h-full">
                                <h3 className="font-sans font-black text-natu-brown text-xl mb-3">Fraqueza e cansaço crônico</h3>
                                <p className="font-sans font-light text-gray-500 text-sm leading-relaxed">
                                    Cansaço que não passa com descanso, falta de energia e baixo rendimento podem ser sintomas de anemia, deficiência de B12, Magnésio ou Coenzima Q10. A soroterapia restaura os níveis celulares rapidamente, com resultados sentidos já na primeira sessão.
                                </p>
                            </div>
                        </BlurFade>

                        <BlurFade delay={0.2}>
                            <div className="bg-white rounded-2xl p-8 border border-natu-brown/8 h-full">
                                <h3 className="font-sans font-black text-natu-brown text-xl mb-3">Ansiedade e insônia</h3>
                                <p className="font-sans font-light text-gray-500 text-sm leading-relaxed">
                                    O sistema nervoso depende de Magnésio, Taurina e vitaminas do Complexo B para regular o sono e o humor. A deficiência desses nutrientes alimenta ciclos de ansiedade, agitação e insônia — que a soroterapia interrompe de forma rápida e sem efeitos colaterais.
                                </p>
                            </div>
                        </BlurFade>

                        <BlurFade delay={0.25}>
                            <div className="bg-white rounded-2xl p-8 border border-natu-brown/8 h-full">
                                <h3 className="font-sans font-black text-natu-brown text-xl mb-3">Imunidade baixa</h3>
                                <p className="font-sans font-light text-gray-500 text-sm leading-relaxed">
                                    Gripes frequentes, infecções recorrentes e recuperação lenta são sinais de imunidade comprometida. Vitamina C em altas doses IV, Zinco, Selênio e NAC atuam em conjunto para fortalecer as defesas do organismo de forma imediata e duradoura.
                                </p>
                            </div>
                        </BlurFade>

                        <BlurFade delay={0.3}>
                            <div className="bg-white rounded-2xl p-8 border border-natu-brown/8 h-full">
                                <h3 className="font-sans font-black text-natu-brown text-xl mb-3">Atletas e performance</h3>
                                <p className="font-sans font-light text-gray-500 text-sm leading-relaxed">
                                    Treinos intensos aumentam a demanda por nutrientes que a dieta não supre. BCAA, Carnitina, Arginina e Coenzima Q10 via intravenosa aceleram a recuperação muscular, aumentam a resistência e reduzem a fadiga pós-treino já a partir da primeira aplicação.
                                </p>
                            </div>
                        </BlurFade>

                        <BlurFade delay={0.35}>
                            <div className="bg-white rounded-2xl p-8 border border-natu-brown/8 h-full">
                                <h3 className="font-sans font-black text-natu-brown text-xl mb-3">Emagrecimento sem resultado</h3>
                                <p className="font-sans font-light text-gray-500 text-sm leading-relaxed">
                                    Quando a dieta e os exercícios não avançam, o problema pode ser metabólico. Carnitina, Cromo e Ácido Alfa Lipóico via intravenosa otimizam o metabolismo de gordura, melhoram a sensibilidade à insulina e reduzem a compulsão por carboidratos, desbloqueando o emagrecimento.
                                </p>
                            </div>
                        </BlurFade>
                    </div>

                    <BlurFade delay={0.3}>
                        <div className="mt-10 text-center">
                            <button
                                onClick={handleWhatsApp}
                                className="inline-flex items-center gap-2 bg-natu-brown text-white font-sans font-bold text-sm px-7 py-3.5 rounded-lg hover:brightness-110 transition-all duration-300"
                            >
                                Falar com especialista
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </button>
                        </div>
                    </BlurFade>
                </div>
            </section>

            {/* 6. Callout Pós-Bariátrico */}
            <section className="bg-white py-4 md:py-8">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <BlurFade>
                        <button
                            onClick={handleWhatsApp}
                            className="group relative flex flex-row items-stretch rounded-2xl bg-natu-brown overflow-visible w-full max-w-3xl mx-auto min-h-[580px] md:min-h-[240px] text-left transition-all duration-300 hover:brightness-110"
                        >
                            {/* Text side */}
                            <div className="relative z-10 flex flex-col justify-start md:justify-center px-8 md:px-12 pt-10 pb-4 md:py-10 w-full md:w-[55%]">
                                <span className="block text-[10px] font-bold tracking-[0.12em] text-white/40 font-sans mb-4">
                                    SOROTERAPIA EM TAGUATINGA-DF / PLANALTINA-DF
                                </span>
                                <h3 className="font-sans font-black text-white text-2xl md:text-3xl leading-tight tracking-tight mb-3">
                                    REPOSIÇÃO DE VITAMINAS<br />PÓS-BARIÁTRICA
                                    <span className="text-natu-pink"> ·</span>
                                </h3>
                                <p className="font-sans font-light text-white/70 text-sm leading-relaxed mb-6 max-w-sm">
                                    Pós-bariátrico em Brasília? Evite deficiências e recupere energia com protocolo de soroterapia personalizado.
                                </p>
                                <div className="inline-flex items-center gap-2 bg-white rounded-lg px-5 py-2.5 text-natu-brown text-[11px] font-bold font-sans w-fit transition-all duration-300 group-hover:bg-white/90">
                                    Falar com especialista
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 transform transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7"/>
                                    </svg>
                                </div>
                            </div>

                            {/* Image side */}
                            <div className="absolute bottom-0 right-0 h-[80%] md:h-[130%] overflow-hidden pointer-events-none select-none flex items-end justify-end" style={{ clipPath: 'inset(0 60px 0 60px)', right: '-60px' }}>
                                <img
                                    src="/images/bariatrica-vitaminas-banner.webp"
                                    alt="Reposição de vitaminas pós-bariátrica soroterapia"
                                    className="h-full w-auto object-contain object-right-bottom"
                                />
                            </div>
                        </button>
                    </BlurFade>
                </div>
            </section>

            {/* 7. Unidades */}
            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-natu-brown/10 -translate-x-1/2" />
                        {[
                            {
                                label: "Taguatinga-DF",
                                title: "Unidade Taguatinga",
                                phone: UNIT_PHONES.TAGUATINGA,
                                address: "Qne 01 Lote 17/20 Loja 02 Taguatinga Norte, Av. Comercial, Brasília - DF",
                                mapSrc: "https://maps.google.com/maps?q=Natuclinic%20Taguatinga%20Norte&t=&z=15&ie=UTF8&iwloc=&output=embed",
                                mapLink: "https://www.google.com/maps?q=Taguatinga+Natuclinic",
                            },
                            {
                                label: "Planaltina-DF",
                                title: "Unidade Planaltina",
                                phone: UNIT_PHONES.PLANALTINA,
                                address: "SH Mte. D'armas Estância 1 Mod C Condomínio Estância, Módulo C lote 2 loja 3/4 - Planaltina, Brasília - DF",
                                mapSrc: "https://maps.google.com/maps?q=Natuclinic%20Est%C3%A9tica%20e%20Nutri%C3%A7%C3%A3o%20Ortomolecular%20Planaltina&t=&z=15&ie=UTF8&iwloc=&output=embed",
                                mapLink: "https://www.google.com/maps/place/Natuclinic+Est%C3%A9tica+e+Nutri%C3%A7%C3%A3o+Ortomolecular+-+Clinica+de+Est%C3%A9tica+e+Nutri%C3%A7%C3%A3o+em+Planaltina+-+DF",
                            },
                        ].map((unit, i) => (
                            <BlurFade key={i} delay={0.1 * i}>
                                <div className="flex flex-col gap-5 font-sans text-natu-brown">
                                    <div>
                                        <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-natu-brown/40 block mb-1">{unit.label}</span>
                                        <h3 className="text-lg font-bold uppercase tracking-tight mb-2">{unit.title}</h3>
                                        <a href={`tel:${unit.phone.replace(/\D/g, '')}`} className="text-base font-bold hover:opacity-70 transition-opacity flex items-center gap-2">
                                            <Unicon name="phone" size={16} />
                                            {unit.phone}
                                        </a>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Unicon name="map-marker" size={15} className="text-natu-brown/50 mt-0.5 shrink-0" />
                                        <p className="text-sm leading-relaxed text-natu-brown/60">{unit.address}</p>
                                    </div>
                                    <div className="w-full h-[200px] overflow-hidden relative group bg-gray-50 rounded-xl">
                                        <iframe
                                            width="100%" height="100%"
                                            src={unit.mapSrc}
                                            frameBorder="0" scrolling="no"
                                            className="grayscale-[40%] group-hover:grayscale-0 transition-all duration-700"
                                            title={unit.title}
                                            loading="lazy"
                                        />
                                        <a href={unit.mapLink} target="_blank" rel="noopener noreferrer"
                                            className="absolute bottom-3 right-3 bg-natu-brown text-white w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                                            <Unicon name="arrow-up-right" size={14} />
                                        </a>
                                    </div>
                                </div>
                            </BlurFade>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8. FAQ */}
            <section className="py-16 md:py-24 bg-[white]">
                <div className="max-w-3xl mx-auto px-6 md:px-12">
                    <BlurFade>
                        <span className="text-[10px] font-bold tracking-[0.12em] text-natu-brown/50 font-sans block mb-4">DÚVIDAS FREQUENTES</span>
                        <h2 className="text-3xl md:text-4xl font-sans font-black text-natu-brown leading-tight tracking-tight mb-10">
                            Perguntas frequentes sobre soroterapia em Brasília
                        </h2>
                    </BlurFade>
                    <div>
                        {faqs.map((faq, i) => (
                            <FAQItem key={i} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
            </section>

        </ServiceLayout>
    );
};

export default Soroterapia;
