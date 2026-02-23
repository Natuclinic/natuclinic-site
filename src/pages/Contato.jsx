import React, { useEffect, useRef } from 'react';
import Unicon from '../components/Unicon';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UNIT_PHONES } from '../constants/links';

gsap.registerPlugin(ScrollTrigger);

const ContactUnit = ({ title, phone, label, address, mapSrc, mapLink }) => (
    <div className="flex flex-col w-full font-['Helvetica',_sans-serif] text-natu-brown">
        {/* Info Area */}
        <div className="flex flex-col items-start mb-6">
            <span className="text-[9px] md:text-[10px] font-bold tracking-[0.3em] uppercase opacity-40 mb-2">
                {label}
            </span>
            <h2 className="text-xl md:text-2xl font-bold mb-3 uppercase tracking-tight">{title}</h2>
            <a
                href={`tel:${phone.replace(/\D/g, '')}`}
                className="text-lg md:text-xl font-bold hover:opacity-70 transition-opacity flex items-center gap-2"
            >
                <Unicon name="phone" size={18} />
                {phone}
            </a>
        </div>

        {/* Small Map - Slightly Wider/Taller to fill space */}
        <div className="w-full md:max-w-[420px] h-[220px] md:h-[280px] rounded-2xl overflow-hidden border border-natu-brown/5 relative group bg-gray-50">
            <iframe
                width="100%"
                height="100%"
                src={mapSrc}
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                className="grayscale-[40%] group-hover:grayscale-0 transition-all duration-700"
                title={title}
                loading="lazy"
            ></iframe>
            <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 bg-natu-brown text-white w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
            >
                <Unicon name="arrow-up-right" size={16} />
            </a>
        </div>

        {/* Address - Below Map */}
        <div className="flex items-start gap-2 mt-6">
            <div className="mt-1 flex-shrink-0">
                <Unicon name="map-marker" size={16} className="text-natu-brown/60" />
            </div>
            <p className="text-[13px] md:text-sm leading-relaxed opacity-70">
                {address}
            </p>
        </div>
    </div>
);

const Contato = ({ goBack }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".main-card", {
                y: 40,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out"
            });

            gsap.from(".contact-header > *", {
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power2.out"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const units = [
        {
            title: "Unidade Taguatinga",
            phone: UNIT_PHONES.TAGUATINGA,
            label: "Taguatinga-DF",
            address: "Qne 01 Lote 17/20 Loja 02 Taguatinga Norte, Av. Comercial, Brasília - DF, 72125-010, Brasil",
            mapSrc: "https://maps.google.com/maps?q=Natuclinic%20Taguatinga%20Norte&t=&z=15&ie=UTF8&iwloc=&output=embed",
            mapLink: "https://www.google.com/maps?q=Taguatinga+Natuclinic"
        },
        {
            title: "Unidade Planaltina",
            phone: UNIT_PHONES.PLANALTINA,
            label: "Planaltina-DF",
            address: "SH Mte. D'armas Estância 1 Mod C Condomínio Estância, Módulo C lote 2 loja 3/4 - Planaltina, Brasília - DF, 73380-100, Brasil",
            mapSrc: "https://maps.google.com/maps?q=Natuclinic%20Est%C3%A9tica%20e%20Nutri%C3%A7%C3%A3o%20Ortomolecular%20Planaltina&t=&z=15&ie=UTF8&iwloc=&output=embed",
            mapLink: "https://www.google.com/maps/place/Natuclinic+Est%C3%A9tica+e+Nutri%C3%A7%C3%A3o+Ortomolecular+-+Clinica+de+Est%C3%A9tica+e+Nutri%C3%A7%C3%A3o+em+Planaltina+-+DF"
        }
    ];

    return (
        <div ref={containerRef} className="min-h-screen bg-white font-['Helvetica',_sans-serif]">
            {/* Minimal Header - Centered */}
            <div className="pt-32 pb-12 md:pt-48 md:pb-16 contact-header">
                <div className="desktop-container flex flex-col items-center text-center leading-none px-4">
                    <button
                        onClick={goBack}
                        className="flex items-center gap-2 text-natu-brown/40 hover:text-natu-brown transition-colors mb-8 text-[10px] uppercase tracking-[0.3em] font-bold group"
                    >
                        <Unicon name="arrow-left" size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Voltar
                    </button>
                    <h1 className="text-4xl md:text-7xl font-bold text-natu-brown uppercase tracking-tighter mb-4">
                        Contato
                    </h1>
                    <div className="w-16 h-[2px] bg-natu-brown mb-8" />
                </div>
            </div>

            {/* Main Unified Card - Wider and More Content Spacing */}
            <div className="pb-32">
                <div className="desktop-container px-4">
                    <div className="main-card max-w-5xl mx-auto border border-natu-brown/10 rounded-[2.5rem] p-8 md:p-16 bg-white overflow-hidden">
                        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32 items-start">
                            {/* Vertical Divider */}
                            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-natu-brown/10 -translate-x-1/2" />

                            {units.map((unit, index) => (
                                <ContactUnit key={index} {...unit} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contato;
