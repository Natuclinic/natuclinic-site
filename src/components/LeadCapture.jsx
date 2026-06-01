import React, { useState } from 'react';
import Unicon from './Unicon';
import { API_URLS } from '../constants/links';

const LeadCapture = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateEmail = (email) =>
        String(email).toLowerCase().match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );

    const validatePhone = (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length >= 10 && cleaned.length <= 11;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        if (!validateEmail(formData.email)) {
            setStatus({ type: 'error', message: 'Por favor, insira um e-mail válido.' });
            return;
        }
        if (!validatePhone(formData.phone)) {
            setStatus({ type: 'error', message: 'Por favor, insira um número de WhatsApp válido (com DDD).' });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_URLS.BASE}/leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, source: 'newsletter_section' })
            });
            if (res.ok) {
                setStatus({ type: 'success', message: 'Inscrição realizada! Em breve entraremos em contato.' });
                setFormData({ name: '', email: '', phone: '' });
            } else {
                throw new Error();
            }
        } catch {
            setStatus({ type: 'error', message: 'Ocorreu um erro. Tente novamente.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative bg-[#1a0e09] overflow-hidden min-h-[560px] flex items-center">

            {/* Imagem direita */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:flex items-center justify-center">
                <img
                    src="/mensagem-grupovip.webp"
                    alt="Grupo VIP Natuclinic"
                    className="h-full w-full object-contain object-center p-8"
                    loading="lazy"
                    decoding="async"
                />
            </div>

            {/* Conteúdo alinhado ao desktop-container (mesmo da navbar) */}
            <div className="desktop-container relative z-10 py-16 w-full">
                <div className="lg:w-1/2">
                    <div className="max-w-lg">
                        <span className="text-natu-pink font-sans font-bold tracking-[0.3em] uppercase text-[10px] block mb-4">
                            Lista VIP Natuclinic
                        </span>
                        <h2 className="text-4xl md:text-5xl font-sans font-bold text-[#F2F0E9] leading-tight mb-5 text-balance">
                            Comece sua mudança hoje
                        </h2>
                        <p className="text-base font-sans font-light text-[#F2F0E9]/50 leading-relaxed mb-10">
                            Faça parte da nossa comunidade e receba dicas de autocuidado, saúde e beleza feitas com carinho pela nossa equipe para você.
                        </p>

                        {status.type === 'success' ? (
                            <div className="text-center p-10 bg-white/10 rounded-xl border border-white/20 animate-in zoom-in duration-500">
                                <div className="w-16 h-16 bg-natu-pink rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Unicon name="check-circle" className="text-white w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-sans font-bold text-[#F2F0E9] mb-4">Bem-vindo(a)!</h3>
                                <p className="text-[#F2F0E9]/70 font-sans">{status.message}</p>
                                <button
                                    onClick={() => setStatus({ type: '', message: '' })}
                                    className="mt-8 text-[10px] uppercase font-bold tracking-widest text-[#F2F0E9]/40 hover:text-natu-pink transition-colors"
                                >
                                    Cadastrar outro contato
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-2.5">
                                <div className="relative group">
                                    <Unicon name="user" className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#F2F0E9]/30 group-focus-within:text-natu-pink transition-colors" size={14} />
                                    <input required type="text" name="name" value={formData.name} onChange={handleChange}
                                        placeholder="Seu nome completo"
                                        className="w-full pl-11 pr-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-[#F2F0E9] font-sans placeholder:text-[#F2F0E9]/20 focus:outline-none focus:ring-2 focus:ring-natu-pink/20 focus:bg-white/10 transition-all"
                                    />
                                </div>
                                <div className="relative group">
                                    <Unicon name="envelope" className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#F2F0E9]/30 group-focus-within:text-natu-pink transition-colors" size={14} />
                                    <input required type="email" name="email" value={formData.email} onChange={handleChange}
                                        placeholder="E-mail principal"
                                        className="w-full pl-11 pr-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-[#F2F0E9] font-sans placeholder:text-[#F2F0E9]/20 focus:outline-none focus:ring-2 focus:ring-natu-pink/20 focus:bg-white/10 transition-all"
                                    />
                                </div>
                                <div className="relative group">
                                    <Unicon name="phone" className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#F2F0E9]/30 group-focus-within:text-natu-pink transition-colors" size={14} />
                                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                        placeholder="WhatsApp (com DDD)"
                                        className="w-full pl-11 pr-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-[#F2F0E9] font-sans placeholder:text-[#F2F0E9]/20 focus:outline-none focus:ring-2 focus:ring-natu-pink/20 focus:bg-white/10 transition-all"
                                    />
                                </div>
                                <button type="submit" disabled={loading}
                                    className="w-full bg-[#F2F0E9] text-natu-brown py-3.5 rounded-xl font-bold uppercase tracking-[0.25em] text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center gap-3 group"
                                >
                                    {loading ? (
                                        <Unicon name="spinner" className="animate-spin" size={18} />
                                    ) : (
                                        <>
                                            Quero fazer parte
                                            <Unicon name="send" size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                                <p className="text-[10px] text-[#F2F0E9]/40 font-sans leading-relaxed text-center px-4">
                                    Declaro que conheço a{' '}
                                    <button type="button" onClick={() => window.location.href = '/politica-de-privacidade'}
                                        className="underline hover:text-natu-pink transition-colors bg-transparent border-0 p-0 text-inherit cursor-pointer">
                                        Política de Privacidade
                                    </button>{' '}
                                    e autorizo a utilização das minhas informações pela Natuclinic.
                                </p>
                                {status.type === 'error' && (
                                    <p className="text-red-400 text-xs text-center font-sans font-medium">{status.message}</p>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LeadCapture;
