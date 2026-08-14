import React from 'react';
import { WHATSAPP_LINKS } from '../constants/links';
import Unicon from './Unicon';
import { Link } from 'react-router-dom';

const HiproSection = () => {
    return (
        <section className="bg-natu-ivory pt-8 md:pt-10 pb-6 md:pb-8 overflow-hidden" id="hipro-section">
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                    to="/procedimentos/hipro"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                    className="group relative flex flex-col justify-end rounded-lg bg-[#3D1E15] overflow-hidden no-underline transition-all duration-500 hover:scale-[1.01] aspect-[4/5] md:aspect-[24/9] w-full border border-natu-brown/20"
                >
                    {/* Background Image */}
                    <img
                        src="/images/hipro-bg.png"
                        alt="Tratamento HIPRO - Derretimento Facial"
                        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 pointer-events-none"
                    />
                    
                    {/* Gradient Overlay - adaptado para desktop (esquerda) e mobile (baixo) */}
                    <div className="absolute inset-x-0 bottom-0 h-[80%] md:h-full md:inset-y-0 md:w-[70%] bg-gradient-to-t md:bg-gradient-to-r from-[#2C140C] via-[#2C140C]/95 via-40% md:via-50% to-transparent pointer-events-none" />

                    {/* Text Content */}
                    <div className="relative z-10 flex flex-col justify-end p-4 md:p-6 lg:p-8 text-white h-full md:w-[60%] lg:w-[50%]">
                        <span className="block text-[9px] sm:text-[10px] font-normal text-white/70 font-sans mb-1 uppercase tracking-widest">
                            Tratamento de Sustentação
                        </span>
                        
                        <h3 className="font-sans font-bold text-white text-[1.15rem] leading-[1.15] md:text-xl lg:text-2xl mb-1.5">
                            HIPRO: Tratamento para<br />Derretimento Facial
                        </h3>
                        
                        <p className="font-sans font-light text-white/90 text-[11px] md:text-xs leading-relaxed mb-3 max-w-lg">
                            Ultrassom focado de última geração que trata flacidez, pálpebra caída e bochecha de buldogue sem cortes.
                        </p>
                        
                        <div className="flex items-center justify-between bg-[#2C140C]/40 backdrop-blur-md border border-white/30 rounded-md px-3 py-1.5 transition-all duration-300 group-hover:bg-[#2C140C]/60 group-hover:border-white/50 flicker-fix w-full md:w-auto md:min-w-[180px] max-w-[220px] gap-3">
                            <span className="text-[10px] md:text-[11px] font-bold font-sans">Ver Explicação Completa</span>
                            <Unicon name="arrow-right" className="h-3 w-3 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                    </div>
                </Link>
            </div>
        </section>
    );
};

export default HiproSection;
