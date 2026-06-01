import React from 'react';
import { useNavigate } from 'react-router-dom';
import Unicon from './Unicon';
import { WHATSAPP_LINKS } from '../constants/links';

const columns = [
    {
        title: 'Procedimentos',
        links: [
            { label: 'Ninfoplastia Sem Cortes', path: '/procedimentos/ninfoplastia' },
            { label: 'Endolaser', path: '/procedimentos/endolaser' },
            { label: 'Harmonização Facial', path: '/procedimentos/harmonizacao-facial' },
            { label: 'Harmonização Corporal', path: '/procedimentos/harmonizacao-corporal' },
            { label: 'Harmonização de Glúteos', path: '/gluteo-dos-sonhos' },
            { label: 'Nutrição Ortomolecular', path: '/procedimentos/nutricao-ortomolecular' },
        ],
    },
    {
        title: 'Especialidades',
        links: [
            { label: 'Soroterapia', href: WHATSAPP_LINKS.MSG_SOROTERAPIA },
            { label: 'Ozonioterapia', href: WHATSAPP_LINKS.MSG_OZONIO },
            { label: 'Emagrecimento Saudável', href: WHATSAPP_LINKS.MSG_EMAGRECIMENTO },
            { label: 'Suplementação', href: WHATSAPP_LINKS.MSG_SUPLEMENTACAO },
            { label: 'Bioestimuladores', href: WHATSAPP_LINKS.PROCEDURES },
        ],
    },
    {
        title: 'Clínica',
        links: [
            { label: 'Sobre a Natuclinic', path: '/' },
            { label: 'Blog de Saúde', path: '/blog' },
            { label: 'Contato via WhatsApp', href: WHATSAPP_LINKS.GENERAL },
            { label: 'Unidade Taguatinga', href: 'https://www.google.com/maps?q=Natuclinic+Taguatinga+Norte' },
            { label: 'Unidade Planaltina', href: 'https://www.google.com/maps/place/Natuclinic+Planaltina' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { label: 'Política de Privacidade', path: '/politica-de-privacidade' },
            { label: 'Termos de Uso', path: '/politica-de-privacidade' },
            { label: 'LGPD', path: '/politica-de-privacidade' },
        ],
    },
];

const socials = [
    { icon: 'instagram', href: 'https://www.instagram.com/instituto.natuclinic/', label: 'Instagram' },
    { icon: 'facebook', href: 'https://web.facebook.com/InstitutoNatuclinic', label: 'Facebook' },
    { icon: 'youtube', href: 'https://www.youtube.com/@Instituto.Natuclinic', label: 'YouTube' },
    { icon: 'linkedin', href: 'https://www.linkedin.com/feed/update/urn:li:activity:7140785863470333952/', label: 'LinkedIn' },
];

const FooterNew = () => {
    const navigate = useNavigate();

    return (
        <footer className="bg-[#1a0e09] text-[#F2F0E9] font-sans">

            {/* Main grid */}
            <div className="desktop-container py-16">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">

                    {/* Brand column */}
                    <div className="col-span-2 md:col-span-3 lg:col-span-1">
                        <button onClick={() => navigate('/')} className="block mb-5 bg-transparent border-0 p-0">
                            <img
                                src="/logo-natuclinic.png"
                                alt="Natuclinic"
                                className="h-10 w-auto object-contain brightness-0 invert opacity-90"
                            />
                        </button>
                        <p className="text-[#F2F0E9]/50 text-xs leading-relaxed font-light mb-6 max-w-[220px]">
                            Referência em estética integral e nutrição ortomolecular em Brasília e Taguatinga.
                        </p>
                        <div className="flex gap-2.5">
                            {socials.map(({ icon, href, label }) => (
                                <a
                                    key={icon}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="w-8 h-8 rounded-full border border-[#F2F0E9]/15 flex items-center justify-center text-[#F2F0E9]/60 hover:text-[#F2F0E9] hover:border-[#F2F0E9]/40 transition-all duration-200"
                                >
                                    <Unicon name={icon} size={14} animate={false} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {columns.map((col) => (
                        <div key={col.title}>
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#F2F0E9]/40 mb-4">
                                {col.title}
                            </h3>
                            <ul className="space-y-2.5">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        {link.path ? (
                                            <button
                                                onClick={() => navigate(link.path)}
                                                className="text-xs text-[#F2F0E9]/60 hover:text-[#F2F0E9] transition-colors bg-transparent border-0 p-0 text-left"
                                            >
                                                {link.label}
                                            </button>
                                        ) : (
                                            <a
                                                href={link.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-[#F2F0E9]/60 hover:text-[#F2F0E9] transition-colors"
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

            {/* Bottom bar */}
            <div className="border-t border-[#F2F0E9]/8">
                <div className="desktop-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[10px] text-[#F2F0E9]/30 tracking-wide">
                        © {new Date().getFullYear()} Natuclinic. Todos os direitos reservados.
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#F2F0E9]/30">
                        <span>Desenvolvido por</span>
                        <a
                            href="https://www.instagram.com/gone.assessoria"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-60 transition-opacity"
                        >
                            <img src="/gone-logo.svg" alt="Gone Assessoria" className="h-3.5 w-auto opacity-30" />
                        </a>
                    </div>
                </div>
            </div>

        </footer>
    );
};

export default FooterNew;
