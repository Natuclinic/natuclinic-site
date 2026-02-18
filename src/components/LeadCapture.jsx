import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import Unicon from './Unicon';
import Silk from './Silk';

const LeadCapture = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const validatePhone = (phone) => {
        // Aceita formatos: (61) 99999-9999, 61999999999, +55 61 999999999
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length >= 10 && cleaned.length <= 11;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        // Validações
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
            // Tenta enviar para a API do Cloudflare Workers primeiro
            const cfResponse = await fetch('https://natuclinic-api.fabriccioarts.workers.dev/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    source: 'newsletter_section'
                })
            });

            if (cfResponse.ok) {
                setStatus({
                    type: 'success',
                    message: 'Inscrição realizada com sucesso! Em breve entraremos em contato.'
                });
                setFormData({ name: '', email: '', phone: '' });
                return;
            }

            // Fallback para Supabase se a API do Cloudflare falhar (ex: em ambiente local)
            console.log('API Cloudflare falhou ou não existe. Tentando Supabase...');
            const { error } = await supabase
                .from('leads')
                .insert([{
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    source: 'newsletter_section'
                }]);

            if (error) throw error;

            setStatus({
                type: 'success',
                message: 'Inscrição realizada com sucesso! Em breve entraremos em contato.'
            });
            setFormData({ name: '', email: '', phone: '' });
        } catch (error) {
            console.error('Erro ao salvar lead:', error);
            setStatus({
                type: 'error',
                message: 'Ocorreu um erro ao processar sua solicitação. Tente novamente.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative py-12 md:py-20 bg-natu-brown overflow-hidden">
            {/* Background Silk Effect */}
            <div className="absolute inset-0 z-0 pointer-events-none flicker-fix">
                <Silk
                    speed={3.5}
                    scale={0.6}
                    color="#37261c"
                    noiseIntensity={1.2}
                    rotation={0}
                />
            </div>

            <div className="desktop-container relative z-10">
                <div className="max-w-4xl mx-auto bg-[#2b1d15] border border-white/5 p-8 md:p-16 rounded-[3rem] shadow-2xl flicker-fix">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* Left Side: Copy */}
                        <div className="text-left">
                            <span className="text-natu-pink font-bold tracking-[0.3em] uppercase text-[10px] block mb-4">
                                Lista VIP Natuclinic
                            </span>
                            <h2 className="text-4xl md:text-5xl font-serif text-[#F2F0E9] leading-tight mb-6">
                                Transforme sua saúde conosco
                            </h2>
                            <p className="text-lg font-sans font-light text-[#F2F0E9]/70 leading-relaxed mb-8">
                                Receba conteúdos exclusivos sobre saúde integrativa, estética avançada e garanta condições especiais para suas consultas.
                            </p>

                        </div>

                        {/* Right Side: Form */}
                        <div className="relative">
                            {status.type === 'success' ? (
                                <div className="text-center p-10 bg-white/10 rounded-[2rem] border border-white/20 animate-in zoom-in duration-500">
                                    <div className="w-16 h-16 bg-natu-pink rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Unicon name="check-circle" className="text-white w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-serif text-[#F2F0E9] mb-4">Bem-vindo(a)!</h3>
                                    <p className="text-[#F2F0E9]/70 font-sans">{status.message}</p>
                                    <button
                                        onClick={() => setStatus({ type: '', message: '' })}
                                        className="mt-8 text-[10px] uppercase font-bold tracking-widest text-[#F2F0E9]/40 hover:text-natu-pink transition-colors"
                                    >
                                        Cadastrar outro contato
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5 flex flex-col">
                                    <div className="relative group">
                                        <Unicon name="user" className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F2F0E9]/30 group-focus-within:text-natu-pink transition-colors" size={16} />
                                        <input
                                            required
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Seu nome completo"
                                            className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-[#F2F0E9] font-sans placeholder:text-[#F2F0E9]/20 focus:outline-none focus:ring-2 focus:ring-natu-pink/20 focus:bg-white/10 transition-all"
                                        />
                                    </div>

                                    <div className="relative group">
                                        <Unicon name="envelope" className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F2F0E9]/30 group-focus-within:text-natu-pink transition-colors" size={16} />
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="E-mail principal"
                                            className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-[#F2F0E9] font-sans placeholder:text-[#F2F0E9]/20 focus:outline-none focus:ring-2 focus:ring-natu-pink/20 focus:bg-white/10 transition-all"
                                        />
                                    </div>

                                    <div className="relative group">
                                        <Unicon name="phone" className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F2F0E9]/30 group-focus-within:text-natu-pink transition-colors" size={16} />
                                        <input
                                            required
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="WhatsApp (com DDD)"
                                            className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-[#F2F0E9] font-sans placeholder:text-[#F2F0E9]/20 focus:outline-none focus:ring-2 focus:ring-natu-pink/20 focus:bg-white/10 transition-all"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-[#F2F0E9] text-natu-brown py-5 rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center gap-4 group"
                                    >
                                        {loading ? (
                                            <Unicon name="spinner" className="animate-spin" size={18} />
                                        ) : (
                                            <>
                                                Quero me inscrever
                                                <Unicon name="send" size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </>
                                        )}
                                    </button>

                                    <p className="text-[10px] md:text-xs text-[#F2F0E9]/40 font-sans leading-relaxed text-center px-4">
                                        Declaro que conheço a <button onClick={() => window.location.href = '/politica-de-privacidade'} className="underline hover:text-natu-pink transition-colors bg-transparent border-0 p-0 text-inherit cursor-pointer">Política de Privacidade</button> e autorizo a utilização das minhas informações pela Natuclinic.
                                    </p>

                                    {status.type === 'error' && (
                                        <p className="text-red-400 text-xs text-center mt-2 font-sans font-medium">{status.message}</p>
                                    )}
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LeadCapture;
