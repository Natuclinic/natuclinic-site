import React, { useState } from 'react';
import Unicon from './Unicon';
import { API_URLS } from '../constants/links';

const LeadCapture = () => {
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
            setStatus({ type: 'error', message: 'Por favor, insira um número de WhatsApp válido (com DDD).' });
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
            const whatsappUrl = `https://wa.me/5561982582150?text=${message}`;

            setStatus({ type: 'success', message: 'Redirecionando para o WhatsApp...' });
            setTimeout(() => {
                window.location.href = whatsappUrl;
                setLoading(false);
            }, 600);
        } catch {
            setStatus({ type: 'error', message: 'Ocorreu um erro. Tente novamente.' });
            setLoading(false);
        }
    };

    return (
        <section className="w-full py-0 md:py-16 flex justify-center bg-white md:bg-transparent px-4 sm:px-6 lg:px-8">
            <div className="relative w-full max-w-6xl text-white overflow-hidden md:rounded-2xl bg-natu-brown flex flex-col md:block mx-auto">
                
                {/* Image: In flow on mobile, absolute background on desktop */}
                <div className="relative w-full h-[350px] md:h-auto md:absolute md:inset-0 z-0">
                    <img 
                        src="/images/Mulher_com_roupa_202604201420.jpeg_2K_202607281626.jpeg"
                        alt="Natuclinic"
                        className="w-full h-full object-cover object-center"
                    />
                    {/* Dark Overlay for Readability (Desktop only) */}
                    <div className="hidden md:block absolute inset-0 bg-black/40 pointer-events-none" />
                    {/* Brown Gradient for blending (Mobile only) */}
                    <div className="md:hidden absolute inset-0 bg-gradient-to-t from-natu-brown via-natu-brown/50 to-transparent pointer-events-none" />
                </div>

                {/* Background Glow Overlay (Desktop only) */}
                <div className="hidden md:block absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-natu-pink/10 rounded-full blur-3xl pointer-events-none z-0" />

                <div className="desktop-container-fluid relative z-10 py-8 md:py-12 lg:py-16">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">

                        {/* Lado Esquerdo — Headline e Benefícios */}
                        <div className="w-full lg:w-[55%] flex flex-col items-start text-left mt-2 md:mt-0">
                        <div className="inline-flex items-center gap-1.5 text-white/90 text-sm font-sans font-medium mb-4">
                            <Unicon name="map-marker" size={14} className="text-[#FFC2C2]" />
                            Natuclinic em Brasília-DF
                        </div>

                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-white leading-[0.95] mb-4">
                            Cansada de tentar de tudo e não ver resultados?
                        </h2>

                        <p className="font-sans font-light text-white/80 text-xs md:text-sm leading-relaxed mb-6 max-w-xl">
                            Gordura localizada, flacidez e celulite não se resolvem com rotinas genéricas. Na Natuclinic, unimos estética de alta tecnologia e nutrição ortomolecular em um protocolo criado sob medida para o seu corpo.
                        </p>

                        <div className="flex items-center gap-6 text-xs text-white/90 font-medium font-sans">
                            <span className="flex items-center gap-2">
                                <Unicon name="check-circle" size={16} className="text-emerald-400" />
                                Dados seguros
                            </span>
                            <span className="flex items-center gap-2">
                                <Unicon name="check-circle" size={16} className="text-emerald-400" />
                                100% Gratuito
                            </span>
                        </div>
                    </div>

                    {/* Lado Direito — Card Formulário Flutuante */}
                    <div className="w-full lg:w-[42%] max-w-md mx-auto lg:mx-0">
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl text-gray-800 border border-white/20 relative">
                            <div className="text-center mb-5">
                                <h3 className="text-xl font-sans font-bold text-natu-brown mb-1">
                                    Garanta sua vaga
                                </h3>
                                <p className="text-[10px] font-sans text-gray-500">
                                    Preencha seus dados e receba atendimento exclusivo
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div>
                                    <input
                                        required
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Nome completo *"
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-natu-brown/20 focus:border-natu-brown transition-all font-sans"
                                    />
                                </div>

                                <div>
                                    <input
                                        required
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="WhatsApp *"
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-natu-brown/20 focus:border-natu-brown transition-all font-sans"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-1 bg-[#25D366] hover:bg-[#1EBE5D] active:scale-[0.99] text-white py-3 rounded-lg font-bold font-sans text-[10px] uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
                                >
                                    {loading ? (
                                        <Unicon name="spinner" className="animate-spin" size={16} />
                                    ) : (
                                        <>
                                            Continuar no WhatsApp
                                            <Unicon name="arrow-right" size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                {status.message && (
                                    <p className={`text-xs text-center font-sans font-medium mt-1 ${status.type === 'error' ? 'text-red-500' : 'text-emerald-600'}`}>
                                        {status.message}
                                    </p>
                                )}

                                <p className="text-[10px] text-gray-400 font-sans text-center flex items-center justify-center gap-1.5 mt-2">
                                    <Unicon name="lock" size={11} className="text-gray-400" />
                                    Seus dados estão protegidos e seguros
                                </p>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
            </div>
        </section>
    );
};

export default LeadCapture;
