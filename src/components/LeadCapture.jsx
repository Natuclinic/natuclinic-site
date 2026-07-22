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
        <section className="bg-[#1a0e09] py-12 md:py-16 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="bg-[#1a0e09] rounded-2xl overflow-hidden flex flex-col lg:flex-row">

                    {/* Texto — lado esquerdo com borda direita sutil */}
                    <div className="lg:w-[42%] flex-shrink-0 flex flex-col justify-center px-8 md:px-12 py-10">
                        <span className="text-natu-pink font-sans font-bold tracking-[0.3em] uppercase text-[10px] block mb-5">
                            Lista VIP Natuclinic
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-[#F2F0E9] leading-tight tracking-tight mb-4">
                            Comece sua<br />mudança hoje
                        </h2>
                        <p className="text-xs font-sans font-light text-[#F2F0E9]/45 leading-relaxed">
                            Faça parte da nossa comunidade e receba dicas de autocuidado, saúde e beleza feitas com carinho pela nossa equipe para você.
                        </p>
                    </div>

                    {/* Formulário — lado direito */}
                    <div className="lg:w-[58%] flex flex-col justify-center px-8 md:px-12 py-10">
                        {status.type === 'success' ? (
                            <div className="text-center py-6 animate-in zoom-in duration-500">
                                <div className="w-12 h-12 bg-natu-pink rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Unicon name="check-circle" className="text-white" size={20} />
                                </div>
                                <h3 className="text-lg font-sans font-bold text-[#F2F0E9] mb-2">Bem-vindo(a)!</h3>
                                <p className="text-[#F2F0E9]/60 font-sans text-sm">{status.message}</p>
                                <button
                                    onClick={() => setStatus({ type: '', message: '' })}
                                    className="mt-5 text-[10px] uppercase font-bold tracking-widest text-[#F2F0E9]/30 hover:text-natu-pink transition-colors"
                                >
                                    Cadastrar outro contato
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <div className="relative group flex-1">
                                        <Unicon name="user" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F2F0E9]/25 group-focus-within:text-natu-pink transition-colors" size={13} />
                                        <input required type="text" name="name" value={formData.name} onChange={handleChange}
                                            placeholder="Nome completo"
                                            className="w-full pl-10 pr-4 py-3 bg-white/8 border border-white/12 rounded-xl text-sm text-[#F2F0E9] font-sans placeholder:text-[#F2F0E9]/20 focus:outline-none focus:ring-1 focus:ring-natu-pink/30 focus:bg-white/12 transition-all"
                                        />
                                    </div>
                                    <div className="relative group flex-1">
                                        <Unicon name="phone" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F2F0E9]/25 group-focus-within:text-natu-pink transition-colors" size={13} />
                                        <input required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                            placeholder="WhatsApp (com DDD)"
                                            className="w-full pl-10 pr-4 py-3 bg-white/8 border border-white/12 rounded-xl text-sm text-[#F2F0E9] font-sans placeholder:text-[#F2F0E9]/20 focus:outline-none focus:ring-1 focus:ring-natu-pink/30 focus:bg-white/12 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="relative group">
                                    <Unicon name="envelope" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F2F0E9]/25 group-focus-within:text-natu-pink transition-colors" size={13} />
                                    <input required type="email" name="email" value={formData.email} onChange={handleChange}
                                        placeholder="E-mail principal"
                                        className="w-full pl-10 pr-4 py-3 bg-white/8 border border-white/12 rounded-xl text-sm text-[#F2F0E9] font-sans placeholder:text-[#F2F0E9]/20 focus:outline-none focus:ring-1 focus:ring-natu-pink/30 focus:bg-white/12 transition-all"
                                    />
                                </div>
                                <button type="submit" disabled={loading}
                                    className="w-full bg-[#F2F0E9] text-natu-brown py-3 rounded-xl font-bold uppercase tracking-[0.25em] text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center gap-3 group mt-1"
                                >
                                    {loading ? (
                                        <Unicon name="spinner" className="animate-spin" size={16} />
                                    ) : (
                                        <>
                                            Quero fazer parte
                                            <Unicon name="send" size={13} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                                <p className="text-[9px] text-[#F2F0E9]/30 font-sans leading-relaxed text-center mt-1">
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
