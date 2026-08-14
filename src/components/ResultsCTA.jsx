import React, { useRef, useState, useEffect } from 'react';
import Unicon from './Unicon';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { API_URLS } from '../constants/links';

gsap.registerPlugin(ScrollTrigger);

const ResultsCTA = () => {
    const containerRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [formData, setFormData] = useState({ name: '', phone: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validatePhone = (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length >= 10 && cleaned.length <= 11;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        if (!formData.name.trim()) {
            setStatus({ type: 'error', message: 'Por favor, informe seu nome completo.' });
            return;
        }
        if (!validatePhone(formData.phone)) {
            setStatus({ type: 'error', message: 'Por favor, insira um WhatsApp válido.' });
            return;
        }

        setLoading(true);
        try {
            fetch(`${API_URLS.BASE}/leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, source: 'lead_capture_hero' })
            }).catch(() => {});

            const message = encodeURIComponent(`Olá! Meu nome é ${formData.name}. Gostaria de agendar minha avaliação personalizada.`);
            const whatsappUrl = `https://wa.me/5561992551867?text=${message}`;

            setStatus({ type: 'success', message: 'Redirecionando...' });
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                setLoading(false);
            }, 600);
        } catch {
            setStatus({ type: 'error', message: 'Erro. Tente novamente.' });
            setLoading(false);
        }
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(containerRef.current,
                {
                    rotateX: 50,
                    y: 80,
                    opacity: 0,
                    transformPerspective: 1000,
                    transformOrigin: "center top"
                },
                {
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 95%",
                        end: "center center",
                        scrub: 1,
                    },
                    rotateX: 0,
                    y: 0,
                    opacity: 1,
                    ease: "power2.out"
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section className="relative z-20 mt-20 mb-12 pointer-events-none px-4 sm:px-6 lg:px-8">
            <div
                ref={containerRef}
                className="w-full max-w-md mx-auto pointer-events-auto"
            >
                <div className="bg-natu-brown rounded-2xl p-6 md:p-8 relative overflow-hidden group transition-transform duration-500 [backface-visibility:hidden] [transform:translate3d(0,0,0)]">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3 group-hover:bg-white/10 transition-colors duration-500"></div>

                    {/* Logo Grafismo */}
                    <img
                        src="/logo-outline-svg.svg"
                        alt=""
                        className="absolute top-1/2 right-[10%] -translate-y-1/2 h-[180%] w-auto opacity-10 pointer-events-none select-none invert rotate-12"
                    />

                    <div className="relative z-10 flex flex-col items-center justify-center gap-6 text-center">

                        <div className="space-y-3 max-w-sm">
                            <h3 className="font-sans font-bold tracking-tight text-3xl text-[#F2F0E9] leading-[0.95]">
                                Sua transformação <br />
                                <span className="opacity-90">começa hoje</span>
                            </h3>
                            <p className="font-sans font-light text-[#F2F0E9]/70 text-sm">
                                Descubra qual é o protocolo ideal para o seu corpo. Agende sua avaliação personalizada.
                            </p>
                        </div>

                        <div className="shrink-0 w-full">
                            <div className="bg-white rounded-2xl p-6 shadow-2xl text-gray-800 relative z-20">
                                <div className="text-center mb-5">
                                    <h3 className="text-lg font-sans font-bold text-natu-brown mb-1">
                                        Garanta sua vaga
                                    </h3>
                                    <p className="text-[10px] text-gray-500">
                                        Preencha seus dados para receber atendimento
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                    <input
                                        required
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Nome completo *"
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-natu-brown/20 focus:border-natu-brown transition-all font-sans"
                                    />
                                    <input
                                        required
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="WhatsApp *"
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-natu-brown/20 focus:border-natu-brown transition-all font-sans"
                                    />
                                    {status.message && (
                                        <div className={`text-[10px] p-2 rounded text-center font-bold ${status.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                                            {status.message}
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-[#1CD760] text-white py-3 rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#19b350] transition-colors shadow-lg shadow-[#1CD760]/30 disabled:opacity-70 font-sans mt-2"
                                    >
                                        {loading ? 'Aguarde...' : 'CONTINUAR NO WHATSAPP'}
                                        {!loading && <Unicon name="arrow-right" size={16} />}
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResultsCTA;
