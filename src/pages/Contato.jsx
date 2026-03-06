import React, { useEffect, useRef } from 'react';
import Unicon from '../components/Unicon';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UNIT_PHONES } from '../constants/links';

gsap.registerPlugin(ScrollTrigger);

const ContactUnit = ({ title, phone, label, address, mapSrc, mapLink, image }) => (
    <div className="flex flex-col w-full gap-6 font-['Helvetica',_sans-serif] text-natu-brown items-start h-full">

        {/* Info Area (Label, Title, Phone) */}
        <div className="flex flex-col items-start mb-2">
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

        {/* Address */}
        <div className="flex items-start gap-2 mb-2">
            <div className="mt-1 flex-shrink-0">
                <Unicon name="map-marker" size={16} className="text-natu-brown/60" />
            </div>
            <p className="text-[13px] md:text-sm leading-relaxed opacity-70">
                {address}
            </p>
        </div>

        {/* Map Area */}
        <div className="w-full h-[200px] overflow-hidden relative group bg-gray-50 mt-auto">
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

    </div>
);

const Contato = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".main-card", {
                filter: "blur(10px)",
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
            mapLink: "https://www.google.com/maps?q=Taguatinga+Natuclinic",
            image: "/images/clinica-de-estetica-natuclinic-brasilia.jpg"
        },
        {
            title: "Unidade Planaltina",
            phone: UNIT_PHONES.PLANALTINA,
            label: "Planaltina-DF",
            address: "SH Mte. D'armas Estância 1 Mod C Condomínio Estância, Módulo C lote 2 loja 3/4 - Planaltina, Brasília - DF, 73380-100, Brasil",
            mapSrc: "https://maps.google.com/maps?q=Natuclinic%20Est%C3%A9tica%20e%20Nutri%C3%A7%C3%A3o%20Ortomolecular%20Planaltina&t=&z=15&ie=UTF8&iwloc=&output=embed",
            mapLink: "https://www.google.com/maps/place/Natuclinic+Est%C3%A9tica+e+Nutri%C3%A7%C3%A3o+Ortomolecular+-+Clinica+de+Est%C3%A9tica+e+Nutri%C3%A7%C3%A3o+em+Planaltina+-+DF",
            image: "/images/melhor-clinica-de-brasilia-df.jpg"
        }
    ];

    return (
        <div ref={containerRef} className="min-h-screen bg-white font-['Helvetica',_sans-serif]">
            {/* Minimal Header - Spacing only */}
            <div className="pt-32 pb-8 md:pt-40 md:pb-12 contact-header">
            </div>

            {/* Main Unified Card - Wider and More Content Spacing */}
            <div className="pb-32">
                <div className="desktop-container px-4">
                    <div className="main-card max-w-6xl mx-auto p-4 md:p-8 bg-white overflow-hidden">

                        {/* Imagens e Texto Complementar (Topo) */}
                        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-24 items-center">
                            {/* Lado Esquerdo: Imagens */}
                            <div className="w-full lg:w-1/2 flex flex-col sm:flex-row gap-4">
                                <div className="w-full sm:w-1/2 h-[300px] md:h-[450px] overflow-hidden bg-gray-50 group">
                                    <img src="/images/clinica-de-estetica-natuclinic-brasilia.jpg" alt="Fachada Natuclinic Taguatinga" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[20%]" />
                                </div>
                                <div className="w-full sm:w-1/2 h-[300px] md:h-[450px] overflow-hidden bg-gray-50 group sm:mt-12">
                                    <img src="/images/melhor-clinica-de-brasilia-df.jpg" alt="Interior Natuclinic Planaltina" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[20%]" />
                                </div>
                            </div>

                            {/* Lado Direito: Título e Texto Complementar */}
                            <div className="w-full lg:w-1/2 flex flex-col font-['Helvetica',_sans-serif] text-natu-brown text-left">
                                <span className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-40 mb-4">Bem-vindo</span>
                                <h2 className="text-3xl md:text-5xl font-bold mb-8 uppercase tracking-tighter leading-tight">
                                    ESPAÇOS PENSADOS PARA SEU BEM-ESTAR
                                </h2>
                                <p className="text-lg opacity-70 leading-relaxed font-light">
                                    Nossas unidades em Taguatinga e Planaltina foram projetadas para entregar uma experiência premium do início ao fim. Ambientes modernos, climatizados e acolhedores, unindo tecnologia de ponta em estética avançada com uma atmosfera de conforto que você não encontra em nenhum outro lugar do Distrito Federal.
                                </p>
                            </div>
                        </div>

                        {/* Divisória Horizontal Suave */}
                        <div className="w-full h-[1px] bg-natu-brown/5 mb-24"></div>

                        {/* Mapas e Contatos (Abaixo) */}
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
