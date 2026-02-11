import React, { useLayoutEffect, useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '../services/supabase';
import Unicon from '../components/Unicon';
import Silk from '../components/Silk';

gsap.registerPlugin(ScrollTrigger);

const GluteoLanding = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [formData, setFormData] = useState({
        name: '',
        phone: ''
    });

    const handleWhatsApp = () => {
        const phone = "5561992551867";
        const message = encodeURIComponent(`Olá! Meu nome é ${formData.name}. Vim pela página dos Glúteos dos Sonhos e gostaria de agendar uma consulta.`);
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!formData.name || !formData.phone) {
            setStatus({ type: 'error', message: 'Por favor, preencha nome e WhatsApp.' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const { error } = await supabase
                .from('leads')
                .insert([{
                    name: formData.name,
                    phone: formData.phone,
                    source: 'gluteo_landing_final_cta',
                    email: 'nao@informado.com' // Email is required in LeadCapture, checking if it's required in DB
                }]);

            if (error) throw error;

            setStatus({ type: 'success', message: 'Agendamento solicitado! Redirecionando para o WhatsApp...' });

            // Redirect after a short delay
            setTimeout(() => {
                handleWhatsApp();
                setFormData({ name: '', phone: '' });
                setStatus({ type: '', message: '' });
            }, 1000);

        } catch (error) {
            console.error('Erro ao salvar lead:', error);
            setStatus({ type: 'error', message: 'Erro ao processar. Mas você pode clicar abaixo para o WhatsApp direto.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-natu-brown overflow-x-hidden selection:bg-natu-pink/30">


            {/* Hero Section (Cloned from Home style) */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden bg-white pt-12 md:pt-16">
                {/* Background/Image Card */}
                <div className="absolute inset-0 flex items-center justify-center p-0 md:p-8 z-0 pt-24 md:pt-32">
                    <div className="relative w-full h-full md:w-[95%] md:h-[85%] rounded-b-[2.5rem] md:rounded-[2.5rem] overflow-hidden border border-gray-100/10">
                        <img
                            src="/harmonização de-gluteo/herosection 1-mobile.png"
                            alt="Conquiste o glúteo que sempre sonhou"
                            className="absolute inset-0 w-full h-full object-cover md:hidden pointer-events-none opacity-100 transition-transform duration-[2000ms]"
                        />
                        <img
                            src="/harmonização de-gluteo/herosection.png"
                            alt="Conquiste o glúteo que sempre sonhou"
                            className="absolute inset-0 w-full h-full object-cover hidden md:block scale-x-[-1.05] scale-y-[1.05] pointer-events-none opacity-100 transition-transform duration-[2000ms] hover:scale-x-[-1] hover:scale-y-[1]"
                        />

                        {/* Content positioned like Home hero */}
                        <div className="absolute inset-0 z-20 flex flex-col justify-center md:justify-end items-center md:items-start p-6 pb-12 md:p-20 md:pb-24">
                            <span className="block text-[10px] font-bold uppercase tracking-[0.4em] text-natu-pink mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                PROTOCOLO EXCLUSIVO
                            </span>
                            <h1 className="text-5xl md:text-7xl font-serif text-natu-pink leading-[0.95] tracking-tight animate-in fade-in zoom-in duration-1000 text-center md:text-left max-w-[340px] md:max-w-2xl mx-auto md:mx-0 text-balance">
                                Conquiste o glúteo <span className="italic">que sempre sonhou.</span>
                            </h1>
                            <p className="mt-6 text-base md:text-lg font-medium text-white max-w-[340px] md:max-w-lg leading-relaxed text-center md:text-left animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200 mx-auto md:mx-0">
                                Harmonização com ácido hialurônico: <br className="md:hidden" /> volume, projeção e contorno sem cirurgia.
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 w-full md:w-auto">
                                <NatuButton
                                    onClick={handleWhatsApp}
                                    className="px-10 py-5 bg-[#2D1B14] text-white rounded-full text-xs tracking-[0.2em] font-sans font-bold uppercase transition-all shadow-2xl shadow-black/20 hover:scale-105 active:scale-95"
                                >
                                    Agendar consulta
                                </NatuButton>
                                <button
                                    onClick={() => document.getElementById('transformation').scrollIntoView({ behavior: 'smooth' })}
                                    className="px-10 py-5 bg-transparent border-2 border-white rounded-full text-xs tracking-[0.2em] font-sans font-bold uppercase text-white hover:bg-white hover:text-black transition-all hover:scale-[1.03]"
                                >
                                    Ver Resultados
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator (Same as Home) */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 hidden md:block">
                    <div className="animate-bounce">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/40 cursor-pointer">
                            <Unicon name="arrow-down" className="w-5 h-5 text-natu-brown" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Horizontal Results Section */}
            <section className="py-24 md:py-32 bg-white overflow-hidden">
                <style>
                    {`
                        @keyframes infiniteScroll {
                            from { transform: translateX(0); }
                            to { transform: translateX(-50%); }
                        }
                        .animate-marquee {
                            display: flex;
                            width: max-content;
                            animation: infiniteScroll 60s linear infinite;
                        }
                        .animate-marquee:hover {
                            animation-play-state: paused;
                        }
                    `}
                </style>
                <div className="max-w-[100vw] mx-auto">
                    <div className="px-6 mb-16 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-natu-pink mb-4 block">PORTFÓLIO DE TRANSFORMAÇÕES</span>
                        <h2 className="text-4xl md:text-5xl font-sans font-bold text-natu-brown tracking-tight">Resultados extraordinários.</h2>
                    </div>

                    <div className="relative">
                        <div className="animate-marquee gap-8 px-6 select-none">
                            {[1, 2, 3, 4, 1, 2, 3, 4].map((num, idx) => (
                                <div key={idx} className="h-[300px] md:h-[450px] flex-shrink-0 bg-white rounded-[1.5rem] overflow-hidden shadow-xl shadow-black/5 border border-black/5 group">
                                    <img
                                        src={`/harmonização de-gluteo/result ${num}.png`}
                                        alt={`Resultado ${num}`}
                                        draggable="false"
                                        onContextMenu={(e) => e.preventDefault()}
                                        className="h-full w-auto object-contain transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Professional Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
                        {/* Image Column */}
                        <div className="w-full md:w-1/2 relative lg:pr-12">
                            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/10 transition-transform duration-700 hover:scale-[1.02]">
                                <img
                                    src="/dra-debora.jpg"
                                    alt="Dra. Debora Meneses"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>
                            {/* Decorative element */}
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-natu-pink/10 rounded-full blur-3xl -z-10" />
                        </div>

                        {/* Text Column */}
                        <div className="w-full md:w-1/2 flex flex-col items-start">
                            <div className="w-64 md:w-[20rem] mb-8">
                                <img
                                    src="/avatar instagram dra debora.png"
                                    alt="Dra. Debora Avatar"
                                    className="w-full h-auto object-contain pointer-events-none select-none"
                                    onContextMenu={(e) => e.preventDefault()}
                                    draggable="false"
                                />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-natu-pink mb-6 block">EXPERTISE E CUIDADO</span>
                            <h2 className="text-4xl md:text-5xl font-sans font-bold text-black tracking-tight mb-8 leading-[1.1] uppercase">
                                Dra. Debora Meneses
                            </h2>
                            <h3 className="text-lg md:text-xl font-sans font-semibold text-black mb-2 uppercase tracking-wider">
                                Biomédica esteta especialista em harmonização corporal.
                            </h3>
                            <span className="text-xs font-bold text-black/40 mb-6 block tracking-widest">CRBM - DF 26802</span>
                            <div className="space-y-6">
                                <p className="text-base md:text-lg text-black leading-relaxed font-medium">
                                    Ela entende que cada corpo é único. Por isso, personaliza cada procedimento para entregar o resultado que funciona para você — não um padrão de revista.
                                </p>
                                <div className="pt-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-1 bg-natu-pink/30 rounded-full" />
                                        <span className="text-xs font-bold tracking-[0.2em] text-black/40 uppercase">Abordagem Personalizada</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Image Section - Professional Executing (Adjusted Size) */}
            <section className="w-full bg-white py-12">
                <div className="max-w-4xl mx-auto px-6 overflow-hidden">
                    <img
                        src="/harmonização de-gluteo/fotos-da-profissional-executando.png"
                        alt="Dra. Debora executando o procedimento"
                        className="w-full h-auto object-cover rounded-[2rem] shadow-lg shadow-black/5"
                    />
                </div>
            </section>

            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-natu-pink mb-4 block">A TRANSFORMAÇÃO É INTERNA</span>
                        <h2 className="text-5xl md:text-7xl font-sans font-bold text-natu-brown tracking-tight">
                            Se sinta <span className="text-natu-pink">+</span>
                        </h2>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                        {[
                            { title: 'Confiante, poderosa <br /> e pronta pra usar <br /> qualquer roupa <br /> sem pensar duas vezes.' },
                            { title: 'Livre pra viver <br /> sem esconder o corpo <br /> ou evitar o espelho.' },
                            { title: 'Dona do seu corpo, <br /> da sua autoestima <br /> e de cada foto que tirar.' }
                        ].map((card, i) => (
                            <div key={i} className="flex-1 min-w-[300px] bg-white rounded-2xl p-10 md:p-12 border border-black/5 transition-transform duration-500 hover:-translate-y-2 flex flex-col items-start text-left">
                                <div
                                    className="w-8 h-8 bg-natu-pink/40 mb-6"
                                    style={{
                                        maskImage: 'url(/Vector.svg)',
                                        WebkitMaskImage: 'url(/Vector.svg)',
                                        maskSize: 'contain',
                                        WebkitMaskSize: 'contain',
                                        maskRepeat: 'no-repeat',
                                        WebkitMaskRepeat: 'no-repeat'
                                    }}
                                />
                                <h3
                                    className="text-xl md:text-2xl font-sans font-bold text-natu-brown leading-tight"
                                    dangerouslySetInnerHTML={{ __html: card.title }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Final Call to Action inside the emotional flow */}
                    {/* Final Call to Action inside the emotional flow */}
                    <div className="mt-20 flex justify-center">
                        <NatuButton
                            onClick={handleWhatsApp}
                            className="px-10 py-5 bg-[#2D1B14] text-white rounded-full text-xs tracking-[0.2em] font-sans font-bold uppercase transition-all shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 w-fit"
                        >
                            Quero me sentir assim
                        </NatuButton>
                    </div>
                </div>
            </section>

            {/* Resolution Section - Professional Static Layout */}
            <section className="py-24 bg-natu-brown relative border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="grid lg:grid-cols-12 gap-16 items-stretch">
                        {/* Title Column */}
                        <div className="lg:col-span-5 flex flex-col justify-between h-full">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-natu-pink mb-6 block">POR QUE FAZER?</span>
                                <h2 className="text-4xl md:text-5xl font-sans font-bold text-white leading-[1.15] text-left uppercase text-balance">
                                    preenchimento <br /> de glúteos <br /> <span className="text-natu-pink">resolve:</span>
                                </h2>
                            </div>

                            <p className="text-white text-lg max-w-sm leading-relaxed lg:my-0 my-10">
                                Recupere sua confiança com um procedimento planejado exclusivamente para a sua anatomia.
                            </p>

                            <div className="mt-8 lg:mt-0">
                                <NatuButton
                                    onClick={handleWhatsApp}
                                    className="px-10 py-5 bg-white text-[#2D1B14] rounded-full text-xs tracking-[0.2em] font-sans font-bold uppercase transition-all shadow-2xl shadow-black/5 hover:scale-105 active:scale-95 border-none"
                                >
                                    Agendar avaliação
                                </NatuButton>
                            </div>
                        </div>

                        {/* List Column */}
                        <div className="lg:col-span-7 grid sm:grid-cols-2 gap-8">
                            {[
                                { title: "Falta de volume e projeção", desc: "Aumente o contorno de forma natural e sem cirurgia." },
                                { title: "Assimetrias que incomodam", desc: "Corrija irregularidades e conquiste um formato harmônico." },
                                { title: "Flacidez que envelhece", desc: "Estimule o colágeno e recupere a firmeza da pele." },
                                { title: "Insegurança limitante", desc: "Sinta-se livre para usar biquínis e roupas justas." }
                            ].map((item, i) => (
                                <div key={i} className="p-8 md:p-10 rounded-2xl border border-white/20 transition-all group">
                                    <div className="w-10 h-10 rounded-full bg-natu-pink/10 flex items-center justify-center mb-6 text-natu-pink group-hover:bg-natu-pink group-hover:text-white transition-colors duration-500">
                                        <div
                                            className="w-5 h-5 bg-current"
                                            style={{
                                                maskImage: 'url(/Vector.svg)',
                                                WebkitMaskImage: 'url(/Vector.svg)',
                                                maskSize: 'contain',
                                                WebkitMaskSize: 'contain',
                                                maskRepeat: 'no-repeat',
                                                WebkitMaskRepeat: 'no-repeat'
                                            }}
                                        />
                                    </div>
                                    <h3 className="text-xl font-sans font-bold text-white mb-3 uppercase">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-white/60 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-natu-pink mb-4 block">CONTATO DIRETO</span>
                        <h2 className="text-4xl md:text-6xl font-serif text-natu-brown tracking-tight">
                            Pronta para sua <span className="italic">transformação?</span>
                        </h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-0 items-stretch">
                        {/* Professional Image */}
                        <div className="relative group">
                            <div className="relative aspect-[4/5] rounded-t-[2.5rem] rounded-b-none lg:rounded-l-[2.5rem] lg:rounded-r-none overflow-hidden">
                                <img
                                    src="/harmonização de-gluteo/debora-final-section-cta.jpg"
                                    alt="Dra. Debora Meneses"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-natu-brown/40 to-transparent opacity-60" />
                            </div>
                            {/* Decorative accent */}
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-natu-pink/10 rounded-full blur-3xl -z-10" />
                        </div>

                        {/* CTA Box / Form */}
                        <div className="bg-natu-brown p-8 md:p-12 rounded-b-[2.5rem] rounded-t-none lg:rounded-r-[2.5rem] lg:rounded-l-none shadow-2xl shadow-black/20 text-white relative overflow-hidden flex flex-col justify-center">
                            {/* Decorative background logo */}
                            <div
                                className="absolute -right-20 -top-20 w-64 h-64 opacity-[0.03] pointer-events-none"
                                style={{
                                    maskImage: 'url(/logo-outline-svg.svg)',
                                    WebkitMaskImage: 'url(/logo-outline-svg.svg)',
                                    maskSize: 'contain',
                                    WebkitMaskRepeat: 'no-repeat'
                                }}
                            />

                            <h3 className="text-2xl md:text-3xl font-sans font-bold mb-2">
                                Agende sua avaliação gratuita
                            </h3>
                            <p className="text-white/60 mb-8 text-sm">
                                Preencha os campos abaixo e entraremos em contato o mais breve possível.
                            </p>

                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-4">Nome completo</label>
                                    <input
                                        type="text"
                                        placeholder="Seu nome"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-white/20 focus:outline-none focus:border-natu-pink/50 transition-all font-sans"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-4">WhatsApp</label>
                                    <input
                                        type="tel"
                                        placeholder="(00) 00000-0000"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-white/20 focus:outline-none focus:border-natu-pink/50 transition-all font-sans"
                                        required
                                    />
                                </div>

                                <NatuButton
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-4 py-5 bg-white text-[#2D1B14] rounded-full text-xs tracking-[0.2em] font-sans font-bold uppercase transition-all shadow-xl hover:scale-105 active:scale-95 border-none disabled:opacity-50"
                                >
                                    {loading ? 'Processando...' : 'Quero agendar'}
                                </NatuButton>

                                <p className="text-[10px] text-white/40 font-sans leading-relaxed text-center px-4 mt-4">
                                    Declaro que conheço a <button type="button" onClick={() => window.location.href = '/politica-de-privacidade'} className="underline hover:text-white transition-colors bg-transparent border-0 p-0 text-inherit cursor-pointer">Política de Privacidade</button> e autorizo a utilização das minhas informações pela Natuclinic.
                                </p>

                                {status.message && (
                                    <p className={`text-center text-xs mt-4 ${status.type === 'error' ? 'text-red-400' : 'text-natu-pink'}`}>
                                        {status.message}
                                    </p>
                                )}
                            </form>

                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-[10px] uppercase tracking-widest text-white/40 font-bold">
                                <span className="flex items-center gap-2">
                                    <span className="text-xs">🔒</span> Seus dados estão seguros
                                </span>
                                <span className="hidden sm:block text-white/20">|</span>
                                <span className="flex items-center gap-2">
                                    <span className="text-xs">⚡</span> Resposta em até 2h
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 md:px-12">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-natu-pink mb-4 block">DÚVIDAS FREQUENTES</span>
                        <h2 className="text-4xl md:text-5xl font-sans font-bold text-natu-brown tracking-tighter uppercase">
                            Perguntas Frequentes
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "É seguro? Quais os riscos?",
                                a: "Sim, o procedimento é extremamente seguro quando realizado por profissionais qualificados. Utilizamos ácido hialurônico de alta pureza, um material totalmente biocompatível. Riscos são mínimos, como leve inchaço ou hematomas temporários que desaparecem em poucos dias."
                            },
                            {
                                q: "Quanto tempo dura o resultado?",
                                a: "O ácido hialurônico é reabsorvível, mas de longa duração. Em média, os resultados permanecem visíveis entre 18 a 24 meses, variando conforme o metabolismo de cada paciente e os cuidados pós-procedimento."
                            },
                            {
                                q: "Dói muito? Como é a recuperação?",
                                a: "O procedimento é precedido de anestesia local, o que garante quase nenhum desconforto durante a aplicação. A recuperação é tranquila: você pode retornar às atividades leves no dia seguinte, evitando esforços físicos intensos por cerca de 7 a 15 dias."
                            },
                            {
                                q: "Quanto custa? Tem parcelamento?",
                                a: "O valor é definido em consulta avaliativa, pois o plano de tratamento é 100% personalizado para a sua anatomia e objetivos. Oferecemos condições flexíveis de parcelamento para facilitar sua transformação."
                            },
                            {
                                q: "Qual a diferença para prótese de silicone?",
                                a: "Diferente da cirurgia, o preenchimento não exige cortes, internação ou anestesia geral. É um procedimento ambulatorial (feito no consultório) com resultado imediato, sem 'down-time' cirúrgico e com aspecto muito mais natural ao toque."
                            },
                            {
                                q: "Em quanto tempo vejo resultado?",
                                a: "O resultado é imediato. Você já sai da clínica com o novo contorno e volume. O resultado definitivo se estabiliza após 15-20 dias, quando qualquer edema inicial já foi totalmente absorvido pelo corpo."
                            },
                            {
                                q: "Preciso fazer retoque?",
                                a: "Realizamos uma consulta de revisão após 15 a 30 dias para avaliar a integração do produto e garantir a simetria perfeita. Retoques eventuais podem ser feitos nesta fase se necessário para atingir a perfeição desejada."
                            }
                        ].map((item, index) => (
                            <FAQItem key={index} question={item.q} answer={item.a} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Disclaimer */}
            <footer className="py-12 bg-white text-center px-6 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 font-sans max-w-2xl mx-auto leading-relaxed">
                    * Os resultados podem variar de pessoa para pessoa. A consulta avaliativa é obrigatória para indicação do tratamento.
                    Natuclinic © {new Date().getFullYear()} - Todos os direitos reservados.
                </p>
            </footer>
        </div>
    );
};

const NatuButton = ({ children, onClick, className, ...props }) => (
    <button className={`natu-button flex items-center justify-center gap-4 ${className || ''}`} onClick={onClick} {...props}>
        <span className="natu-button__icon-wrapper">
            <svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="natu-button__icon-svg" width="10">
                <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"></path>
            </svg>
            <svg viewBox="0 0 14 15" fill="none" width="10" xmlns="http://www.w3.org/2000/svg" className="natu-button__icon-svg natu-button__icon-svg--copy">
                <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"></path>
            </svg>
        </span>
        {children}
    </button>
);

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-natu-brown/10 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex justify-between items-center text-left group hover:opacity-70 transition-all"
            >
                <span className="text-lg md:text-xl font-sans font-bold text-natu-brown pr-8 uppercase tracking-tight leading-tight">
                    {question}
                </span>
                <div className={`relative w-6 h-6 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-natu-brown" />
                    <div className={`absolute top-0 left-1/2 w-[2px] h-full bg-natu-brown transition-transform duration-300 ${isOpen ? 'scale-y-0' : 'scale-y-100'}`} />
                </div>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-8' : 'max-h-0'}`}>
                <p className="text-natu-brown/70 text-base md:text-lg leading-relaxed max-w-3xl">
                    {answer}
                </p>
            </div>
        </div>
    );
};

export default GluteoLanding;
