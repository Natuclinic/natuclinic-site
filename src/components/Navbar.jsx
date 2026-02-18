import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Unicon from './Unicon';

const NatuButton = ({ children, onClick, className, ...props }) => (
    <button className={`natu-button ${className || ''}`} onClick={onClick} {...props} style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <span className="natu-button__icon-wrapper flicker-fix">
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
    const [activeMobileSubmenu, setActiveMobileSubmenu] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);
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
        <nav
            className={`fixed w-full z-50 transition-[padding,background-color] duration-300 antialiased italic-font-fix ${isScrolled || mobileMenuOpen || hoveredItem !== null ? 'bg-[#ffffff] py-4' : 'bg-transparent py-8'} ${isScrolled && hoveredItem === null ? 'border-b border-gray-100' : ''}`}
        >
            <div className="desktop-container flex justify-between items-center">
                <span onClick={() => handleNavigation('/')} className="cursor-pointer z-50 relative">
                    <img
                        src="/logo-natuclinic.png"
                        alt="Natuclinic Logo"
                        className="h-12 md:h-16 w-auto object-contain"
                        width="180"
                        height="64"
                        loading="eager"
                        decoding="async"
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
                <div className="hidden md:flex items-center gap-14 font-[Helvetica,Arial,sans-serif]">
                    {menuItems.map((item, i) => (
                        <div
                            key={i}
                            className="group/nav py-8 flex items-center"
                            onMouseEnter={() => setHoveredItem(i)}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            {item.megaMenu ? (
                                <button className="text-[11px] uppercase tracking-widest font-bold text-natu-brown bg-transparent border-0 p-0 cursor-pointer relative flex items-center gap-1 font-sans">
                                    {item.label}
                                    <span className="text-[11px] transition-transform duration-300 group-hover/nav:-rotate-180 font-sans">⌵</span>
                                </button>
                            ) : item.path ? (
                                <button onClick={() => handleNavigation(item.path)} className="text-[11px] uppercase tracking-widest font-bold bg-transparent border-0 p-0 text-natu-brown cursor-pointer relative font-sans">
                                    {item.label}
                                </button>
                            ) : (
                                <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-[11px] uppercase tracking-widest font-bold text-natu-brown no-underline relative font-sans">
                                    {item.label}
                                </a>
                            )}

                            {/* Mega Menu Dropdown */}
                            {item.megaMenu && (
                                <div className="absolute top-full left-0 w-full pt-0 opacity-0 -translate-y-4 pointer-events-none group-hover/nav:opacity-100 group-hover/nav:translate-y-0 group-hover/nav:pointer-events-auto transition-all duration-500 ease-out z-[60]">
                                    <div className="relative group/menu">
                                        {/* Invisible Bridge */}
                                        <div className="absolute -top-12 left-0 w-full h-12 bg-transparent" />

                                        <div className="bg-[#ffffff] rounded-b-[40px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
                                            <div className="max-w-7xl mx-auto px-12 py-16 flex flex-col gap-12">
                                                <div className="grid grid-cols-12 gap-24 items-start">
                                                    {/* Left side: Image and Text */}
                                                    {item.megaMenu.featured && (
                                                        <div className="col-span-4 flex flex-col gap-5 group/featured">
                                                            <div className="aspect-[21/9] w-full overflow-hidden rounded-2xl relative">
                                                                <img
                                                                    src={item.megaMenu.featured.image}
                                                                    alt={item.label}
                                                                    loading="lazy"
                                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover/featured:scale-105"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col gap-2">
                                                                <h4 className="text-xl font-[Helvetica,Arial,sans-serif] font-medium text-natu-brown">
                                                                    {item.label}
                                                                </h4>
                                                                <p className="text-sm font-[Helvetica,Arial,sans-serif] font-normal text-gray-500 leading-relaxed max-w-[280px] [text-wrap:balance]">
                                                                    {item.megaMenu.featured.text}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Right side: Categories and Links (Divided into 2 columns for a 3-column total look) */}
                                                    <div className="col-span-8 flex justify-center">
                                                        <div className="w-full grid grid-cols-2 gap-x-24 gap-y-4">
                                                            {item.megaMenu.categories.map((cat, j) => (
                                                                <React.Fragment key={j}>
                                                                    {cat.links.map((link, k) => (
                                                                        <MenuLink key={k} link={link} onClick={handleNavigation} />
                                                                    ))}
                                                                </React.Fragment>
                                                            ))}
                                                        </div>
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
                        <div key={i} className="flex flex-col border-b border-gray-100 last:border-0 pb-6">
                            {item.megaMenu ? (
                                <>
                                    <button
                                        onClick={() => setActiveMobileSubmenu(activeMobileSubmenu === i ? null : i)}
                                        className="flex items-center justify-between w-full bg-transparent border-0 p-0 cursor-pointer group"
                                    >
                                        <div className="flex flex-col items-start gap-1">
                                            <h3 className="text-2xl font-medium text-natu-brown">
                                                {item.label}
                                            </h3>
                                            <p className="text-sm text-gray-500 font-normal text-left">
                                                {item.megaMenu.featured.text}
                                            </p>
                                        </div>
                                        <span className={`text-xl transition-transform duration-300 ${activeMobileSubmenu === i ? 'rotate-180' : ''}`}>⌵</span>
                                    </button>

                                    <div className={`overflow-hidden transition-all duration-500 ${activeMobileSubmenu === i ? 'max-h-[800px] mt-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="flex flex-col gap-6 pl-4 border-l-2 border-natu-pink/20">
                                            {item.megaMenu.categories.map((cat, j) => (
                                                <div key={j} className="flex flex-col gap-4">
                                                    <div className="flex flex-col gap-4">
                                                        {cat.links.map((link, k) => (
                                                            <button
                                                                key={k}
                                                                onClick={() => {
                                                                    if (link.path) handleNavigation(link.path);
                                                                    else window.open(link.href, '_blank');
                                                                    setMobileMenuOpen(false);
                                                                }}
                                                                className="text-lg text-natu-brown/70 text-left bg-transparent border-0 p-0 hover:text-natu-pink transition-colors"
                                                            >
                                                                {link.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <button
                                    onClick={() => {
                                        if (item.path) handleNavigation(item.path);
                                        else window.open(item.href, '_blank');
                                        setMobileMenuOpen(false);
                                    }}
                                    className="text-2xl font-medium text-natu-brown text-left bg-transparent border-0 p-0 cursor-pointer"
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
