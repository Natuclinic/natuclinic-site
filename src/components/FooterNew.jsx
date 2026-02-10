import React, { useRef, useEffect, useState } from 'react';
import Unicon from './Unicon';

const LocationCard = ({ title, address, mapSrc, mapLink }) => (
    <div className="group relative w-full h-[220px] rounded-[1.5rem] overflow-hidden bg-white/5 border border-[#F2F0E9]/10 transition-all duration-500 hover:border-[#F2F0E9]/30">
        {/* Map Iframe */}
        <div className="absolute inset-0 z-0 opacity-80 group-hover:opacity-100 transition-opacity duration-700">
            <iframe
                width="100%"
                height="100%"
                id="gmap_canvas"
                src={mapSrc}
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                className="grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 invert-[0.1] group-hover:invert-0"
                title={title}
            ></iframe>
        </div>

        {/* Floating Info Card - Compact */}
        <div className="absolute bottom-3 left-3 right-3 bg-[#4C261A]/90 backdrop-blur-md p-4 rounded-2xl border border-[#F2F0E9]/20 transition-transform duration-500 group-hover:-translate-y-1">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-sans font-bold text-lg text-[#F2F0E9] mb-1">{title}</h3>
                    <div className="flex items-center gap-2 text-[#F2F0E9]/70 font-sans text-[10px]">
                        <Unicon name="map-marker" size={12} />
                        <p className="truncate max-w-[150px]">{address}</p>
                    </div>
                </div>
                <a
                    href={mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F2F0E9] text-[#4C261A] hover:scale-110 transition-transform"
                >
                    <Unicon name="arrow-up-right" size={14} />
                </a>
            </div>
        </div>
    </div>
);

import { useNavigate } from 'react-router-dom';

const FooterNew = () => {
    const footerRef = useRef(null);
    const [footerHeight, setFooterHeight] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const updateHeight = () => {
            if (footerRef.current) {
                setFooterHeight(footerRef.current.offsetHeight);
            }
        };
        updateHeight();
        const resizeObserver = new ResizeObserver(() => updateHeight());
        if (footerRef.current) resizeObserver.observe(footerRef.current);
        window.addEventListener('resize', updateHeight);
        return () => {
            window.removeEventListener('resize', updateHeight);
            resizeObserver.disconnect();
        };
    }, []);

    const footerConfig = {
        description: "Referência em Naturopatia e Estética Integral no DF. Integrando ciência, saúde e autoestima.",
        socials: [
            { icon: "instagram", href: "https://www.instagram.com/instituto.natuclinic/" },
            { icon: "facebook", href: "https://web.facebook.com/InstitutoNatuclinic?_rdc=1&_rdr#" },
            { icon: "linkedin", href: "https://www.linkedin.com/feed/update/urn:li:activity:7140785863470333952/" },
            { icon: "youtube", href: "https://www.youtube.com/@Instituto.Natuclinic" },
        ],
        columns: [
            {
                title: "Procedimentos",
                links: [
                    { label: "Ninfoplastia", href: "https://wa.me/5561992551867?text=Olá! Gostaria de saber mais sobre a Ninfoplastia." },
                    { label: "Endolaser", href: "https://wa.me/5561992551867?text=Olá! Gostaria de saber mais sobre o Endolaser." },
                    { label: "Harmonização", href: "https://wa.me/5561992551867?text=Olá! Gostaria de saber mais sobre a Harmonização." },
                    { label: "Emagrecimento", href: "https://wa.me/5561992551867?text=Olá! Gostaria de saber mais sobre o Emagrecimento." },
                    { label: "Ortomolecular", href: "https://wa.me/5561992551867?text=Olá! Gostaria de saber mais sobre a Nutrição Ortomolecular." },
                ],
            },
            {
                title: "Institucional",
                links: [
                    { label: "A Clínica", path: "/" },
                    { label: "Corpo Clínico", path: "/" },
                    { label: "Blog", path: "/blog" },
                    { label: "Política de Privacidade", path: "/politica-de-privacidade" },
                    { label: "Contato", href: "https://wa.me/5561992551867" },
                ],
            },
        ],
    };

    return (
        <>
            <div style={{ height: footerHeight }} className="hidden lg:block w-full relative z-0 pointer-events-none" />

            <footer
                ref={footerRef}
                className="bg-[#4C261A] text-[#F2F0E9] pt-12 pb-6 font-sans relative lg:fixed lg:bottom-0 lg:left-0 w-full z-0 overflow-hidden"
            >
                {/* Decoration */}

                <div className="desktop-container relative z-10 flex flex-col gap-8">

                    {/* MAPS & INFO GRID */}
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">

                        {/* LEFT: Maps Cluster */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2 opacity-80">
                                <Unicon name="map-marker" size={14} className="text-[#F2F0E9]" />
                                <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase">Nossas Unidades</span>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <LocationCard
                                    title="Taguatinga"
                                    address="Setor E Norte, DF"
                                    mapLink="https://www.google.com/maps?client=firefox-b-d&hs=u9bU&sca_esv=4fee371841179941&output=search&q=Taguatinga+Natuclinic"
                                    mapSrc="https://maps.google.com/maps?q=Natuclinic%20Taguatinga%20Norte&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                />
                                <LocationCard
                                    title="Planaltina"
                                    address="Planaltina, DF"
                                    mapLink="https://www.google.com/maps/place/Natuclinic+Est%C3%A9tica+e+Nutri%C3%A7%C3%A3o+Ortomolecular+-+Clinica+de+Est%C3%A9tica+e+Nutri%C3%A7%C3%A3o+em+Planaltina+-+DF/@-15.6186293,-47.676409,1307m/data=!3m2!1e3!4b1!4m16!1m9!4m8!1m0!1m6!1m2!1s0x935a6d03d3f5d4bb:0xe39128bd2284686e!2sNatuclinic+Est%C3%A9tica+e+Nutri%C3%A7%C3%A3o+Ortomolecular+-+Clinica+de+Est%C3%A9tica+e+Nutri%C3%A7%C3%A3o+em+Planaltina+-+DF,+SH+Mte.+D'armas+Est%C3%A2ncia+1+Mod+C,+Condom%C3%ADnio+Est%C3%A2ncia,+M%C3%B3dulo+C+lote+2+loja+3%2F4+-+Planaltina,+Bras%C3%ADlia+-+DF,+73380-100!2m2!1d-47.6738341!2d-15.6186293!3m5!1s0x935a6d03d3f5d4bb:0xe39128bd2284686e!8m2!3d-15.6186293!4d-47.6738341!16s%2Fg%2F11v0t52jk3?entry=ttu&g_ep=EgoyMDI2MDIwMS4wIKXMDSoASAFQAw%3D%3D"
                                    mapSrc="https://maps.google.com/maps?q=Natuclinic%20Est%C3%A9tica%20e%20Nutri%C3%A7%C3%A3o%20Ortomolecular%20Planaltina&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                />
                            </div>
                        </div>

                        {/* RIGHT: Links & Brand Compact */}
                        <div className="flex flex-col md:flex-row justify-between gap-8 h-full">

                            <div className="max-w-[180px]">
                                <div className="mb-6 cursor-pointer" onClick={() => navigate('/')}>
                                    <img
                                        src="/logo-natuclinic.png"
                                        alt="Natuclinic"
                                        className="h-12 md:h-14 w-auto object-contain transition-all hover:scale-105 brightness-0 invert"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                                <p className="text-[#F2F0E9]/60 leading-snug text-xs font-light mb-6">
                                    {footerConfig.description}
                                </p>
                                <div className="flex gap-2">
                                    {footerConfig.socials.map(({ icon, href }, idx) => (
                                        <a
                                            key={idx}
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-8 h-8 rounded-full border border-[#F2F0E9]/20 flex items-center justify-center text-[#F2F0E9] hover:bg-[#F2F0E9] hover:text-[#4C261A] transition-all"
                                        >
                                            <Unicon name={icon} className="w-3.5 h-3.5" />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Links Columns */}
                            <div className="flex gap-8 md:gap-12">
                                {footerConfig.columns.map((col, idx) => (
                                    <div key={idx}>
                                        <h3 className="text-xs font-sans font-bold uppercase tracking-tight mb-4 text-[#F2F0E9]">{col.title}</h3>
                                        <ul className="space-y-2">
                                            {col.links.map((link, i) => (
                                                <li key={i}>
                                                    {link.path ? (
                                                        <button
                                                            onClick={() => navigate(link.path)}
                                                            className="text-xs text-[#F2F0E9]/60 hover:text-[#F2F0E9] transition-colors flex items-center gap-1 group bg-transparent border-0 p-0"
                                                        >
                                                            {link.label}
                                                        </button>
                                                    ) : (
                                                        <a
                                                            href={link.href}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-[#F2F0E9]/60 hover:text-[#F2F0E9] transition-colors flex items-center gap-1 group"
                                                        >
                                                            {link.label}
                                                        </a>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    <div className="pt-6 border-t border-[#F2F0E9]/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] text-[#F2F0E9]/30 uppercase tracking-[0.1em] font-medium">
                        <p>© {new Date().getFullYear()} Natuclinic. Todos os direitos reservados.</p>
                        <div className="flex items-center gap-1">
                            <span>Feito com</span>
                            <span className="text-red-500 animate-pulse text-base">❤️</span>
                            <a
                                href="https://www.instagram.com/obiodomarketing?igsh=MWo2bW04c2k4Nzh1ag%3D%3D&utm_source=qr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold hover:text-[#F2F0E9] transition-colors"
                            >
                                Bio Marketing
                            </a>
                        </div>
                    </div>

                </div>
            </footer >
        </>
    );
};

export default FooterNew;
