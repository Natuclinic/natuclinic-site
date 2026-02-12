import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Unicon from './Unicon';

const NatuButton = ({ children, onClick, className, ...props }) => (
    <button className={`natu-button ${className || ''}`} onClick={onClick} {...props} style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <span className="natu-button__icon-wrapper">
            <svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="natu-button__icon-svg" width="10">
                <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"></path>
            </svg>
            <svg viewBox="0 0 14 15" fill="none" width="10" xmlns="http://www.w3.org/2000/svg" className="natu-button__icon-svg natu-button__icon-svg--copy">
                <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"></path>
            </svg>
        </span>
        {children}
    </button>
);

const MenuLink = ({ link, onClick }) => (
    link.path ? (
        <button
            onClick={() => onClick(link.path)}
            className="text-lg font-[Helvetica,Arial,sans-serif] text-natu-brown/80 hover:text-natu-brown hover:pl-2 transition-all duration-300 bg-transparent border-0 p-0 text-left cursor-pointer"
        >
            {link.label}
        </button>
    ) : (
        <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-[Helvetica,Arial,sans-serif] text-natu-brown/80 hover:text-natu-brown hover:pl-2 transition-all duration-300 no-underline"
        >
            {link.label}
        </a>
    )
);

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleWhatsApp = () => {
        const phone = "5561992551867";
        const message = encodeURIComponent("Olá! Gostaria de agendar uma consulta na Natuclinic.");
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    const menuItems = [
        { label: 'Home', path: '/' },
        {
            label: 'Saúde',
            megaMenu: {
                featured: {
                    image: '/harmonização de-gluteo/expansive-menu-health.png',
                    text: 'Cuidado integral para sua saúde e bem-estar em todos os momentos.'
                },
                categories: [
                    {
                        title: 'Saúde',
                        links: [
                            { label: 'Nutrição Ortomolecular', href: 'https://wa.me/5561992551867?text=Olá! Gostaria de saber mais sobre Nutrição Ortomolecular.' },
                            { label: 'Emagrecimento Saudável', href: 'https://wa.me/5561992551867?text=Olá! Gostaria de saber mais sobre Emagrecimento Saudável.' },
                            { label: 'Soroterapia', href: 'https://wa.me/5561992551867?text=Olá! Gostaria de saber mais sobre Soroterapia.' },
                            { label: 'Ozonioterapia', href: 'https://wa.me/5561992551867?text=Olá! Gostaria de saber mais sobre Ozonioterapia.' },
                            { label: 'Eletroestimulação', href: 'https://wa.me/5561992551867?text=Olá! Gostaria de saber mais sobre Eletroestimulação.' },
                            { label: 'Suplementação', href: 'https://wa.me/5561992551867?text=Olá! Gostaria de saber mais sobre Suplementação.' },
                            { label: 'Ginecologia', href: 'https://wa.me/5561992551867?text=Olá! Gostaria de saber mais sobre Ginecologia.' },
                            { label: 'Nutrição Esportiva', href: 'https://wa.me/5561992551867?text=Olá! Gostaria de saber mais sobre Nutrição Esportiva.' }
                        ]
                    }
                ]
            }
        },
        {
            label: 'Estética',
            megaMenu: {
                featured: {
                    image: '/harmonização de-gluteo/expansive-menu-aesthetic.png',
                    text: 'Tecnologia avançada para realçar sua beleza natural com segurança.'
                },
                categories: [
                    {
                        title: 'Estética',
                        links: [
                            { label: 'Harmonização de Glúteos', path: '/gluteo-dos-sonhos' },
                            { label: 'Harmonização Facial', href: 'https://wa.me/5561992551867?text=Olá! Gostaria de saber mais sobre Harmonização Facial.' },
                            { label: 'Ninfoplastia Sem Cortes', href: 'https://wa.me/5561992551867?text=Olá! Gostaria de saber mais sobre Ninfoplastia Sem Cortes.' },
                            { label: 'Endolaser', href: 'https://wa.me/5561992551867?text=Olá! Gostaria de saber mais sobre Endolaser.' },
                            { label: 'Bioestimuladores de Colágeno', href: 'https://wa.me/5561992551867?text=Olá! Gostaria de saber mais sobre Bioestimuladores.' },
                            { label: 'Lipo sem Cortes', href: 'https://wa.me/5561992551867?text=Olá! Gostaria de saber mais sobre Lipo sem Cortes.' }
                        ]
                    }
                ]
            }
        },
        { label: 'Blog', path: '/blog' },
    ];

    const handleNavigation = (path) => {
        if (path.startsWith('/#')) {
            const id = path.substring(2);
            if (window.location.pathname === '/') {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                navigate('/');
                setTimeout(() => {
                    const element = document.getElementById(id);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            }
        } else {
            navigate(path);
        }
        setMobileMenuOpen(false);
    };

    return (
        <nav className={`fixed w-full z-50 transition-[padding,background-color] duration-500 ${isScrolled || mobileMenuOpen ? 'bg-white py-4 border-b border-gray-100' : 'bg-transparent py-8'}`}>
            <div className="desktop-container flex justify-between items-center">
                <span onClick={() => handleNavigation('/')} className="cursor-pointer z-50 relative">
                    <img
                        src="/logo-natuclinic.png"
                        alt="Natuclinic Logo"
                        className="h-12 md:h-16 w-auto object-contain"
                        width="180"
                        height="64"
                    />
                </span>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden z-50 p-2 text-natu-brown bg-transparent border-none"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle Menu"
                >
                    {mobileMenuOpen ? (
                        <Unicon name="times" size={24} />
                    ) : (
                        <Unicon name="bars" size={24} />
                    )}
                </button>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-10 font-[Helvetica,Arial,sans-serif]">
                    {menuItems.map((item, i) => (
                        <div key={i} className="group/nav py-8 flex items-center">
                            {item.megaMenu ? (
                                <button className="text-[10px] uppercase tracking-widest font-bold text-natu-brown bg-transparent border-0 p-0 cursor-pointer relative">
                                    {item.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-natu-brown transition-all duration-300 group-hover/nav:w-full" />
                                </button>
                            ) : item.path ? (
                                <button onClick={() => handleNavigation(item.path)} className="text-[10px] uppercase tracking-widest font-bold bg-transparent border-0 p-0 text-natu-brown cursor-pointer relative">
                                    {item.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-natu-brown transition-all duration-300 group-hover/nav:w-full" />
                                </button>
                            ) : (
                                <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-widest font-bold text-natu-brown no-underline relative">
                                    {item.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-natu-brown transition-all duration-300 group-hover/nav:w-full" />
                                </a>
                            )}

                            {/* Mega Menu Dropdown */}
                            {item.megaMenu && (
                                <div className="absolute top-full left-0 w-full pt-0 opacity-0 pointer-events-none group-hover/nav:opacity-100 group-hover/nav:pointer-events-auto transition-all duration-300 z-[60]">
                                    <div className="relative group/menu">
                                        {/* Invisible Bridge */}
                                        <div className="absolute -top-12 left-0 w-full h-12 bg-transparent" />

                                        <div className="bg-white shadow-[0_40px_100px_rgba(0,0,0,0.1)] rounded-b-[40px] overflow-hidden">
                                            <div className="max-w-7xl mx-auto px-12 py-16 flex flex-col gap-12">
                                                <div className="grid grid-cols-12 gap-16">
                                                    {/* Left side: Image and Text */}
                                                    {item.megaMenu.featured && (
                                                        <div className="col-span-3 flex flex-col gap-5 group/featured">
                                                            <div className="aspect-[21/9] w-full overflow-hidden rounded-2xl relative">
                                                                <img
                                                                    src={item.megaMenu.featured.image}
                                                                    alt={item.label}
                                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover/featured:scale-105"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col gap-2">
                                                                <h4 className="text-xl font-[Helvetica,Arial,sans-serif] font-bold text-natu-brown">
                                                                    {item.label}
                                                                </h4>
                                                                <p className="text-sm font-[Helvetica,Arial,sans-serif] font-normal text-natu-brown leading-relaxed max-w-[280px] [text-wrap:balance]">
                                                                    {item.megaMenu.featured.text}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Right side: Categories and Links */}
                                                    <div className="col-span-9 grid grid-cols-1 gap-12">
                                                        {item.megaMenu.categories.map((cat, j) => (
                                                            <div key={j} className="grid grid-cols-2 gap-x-12 gap-y-4">
                                                                {cat.links.map((link, k) => (
                                                                    <MenuLink key={k} link={link} onClick={handleNavigation} />
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <NatuButton onClick={handleWhatsApp}>
                        Agendar
                    </NatuButton>
                </div>
            </div> {/* End of desktop-container */}

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-white transition-all duration-500 md:hidden flex flex-col p-8 overflow-y-auto ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="w-full mt-24 flex flex-col gap-12 font-[Helvetica,Arial,sans-serif]">
                    {menuItems.map((item, i) => (
                        <div key={i} className="flex flex-col gap-6">
                            {item.megaMenu ? (
                                <>
                                    <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-natu-pink">
                                        {item.label}
                                    </h3>
                                    <div className="flex flex-col gap-8 pl-4 border-l border-gray-100">
                                        {item.megaMenu.categories.map((cat, j) => (
                                            <div key={j} className="flex flex-col gap-4">
                                                {cat.title !== item.label && (
                                                    <h4 className="text-[9px] uppercase tracking-[0.2em] font-bold text-natu-brown/40">
                                                        {cat.title}
                                                    </h4>
                                                )}
                                                <div className="flex flex-col gap-3">
                                                    {cat.links.map((link, k) => (
                                                        <MenuLink key={k} link={link} onClick={handleNavigation} />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <button
                                    onClick={() => item.path ? handleNavigation(item.path) : window.open(item.href, '_blank')}
                                    className="text-2xl font-bold text-natu-brown text-left bg-transparent border-0 p-0 cursor-pointer"
                                >
                                    {item.label}
                                </button>
                            )}
                        </div>
                    ))}
                    <div className="mt-8">
                        <NatuButton onClick={() => { handleWhatsApp(); setMobileMenuOpen(false); }} className="w-full">
                            Agendar
                        </NatuButton>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
export { NatuButton };
