import React, { useState, useEffect } from 'react';

const CarouselAd = ({ ads = [], rotationInterval = 5000, className = '', layout = 'vertical' }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const activeAds = ads.filter(ad => ad.content === 'active');

    useEffect(() => {
        if (activeAds.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % activeAds.length);
        }, rotationInterval);

        return () => clearInterval(interval);
    }, [activeAds.length, rotationInterval]);

    if (!activeAds || activeAds.length === 0) return null;

    // Se tiver só um, ou para renderizar o primeiro e dar a altura ao container
    return (
        <div className={`relative overflow-hidden group ${className}`}>
            {/* Elemento base para manter a altura do container dinamicamente (baseado na imagem ativa) */}
            <div className="w-full relative invisible">
                <img src={activeAds[currentIndex].image} className="w-full h-auto object-cover max-h-[300px]" alt="spacer" />
            </div>

            {/* Imagens Posicionadas Absolutamente */}
            {activeAds.map((ad, idx) => (
                <div
                    key={ad.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentIndex ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'}`}
                >
                    <a href={ad.excerpt} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative group/ad">
                        <img 
                            src={ad.image} 
                            alt={ad.title || "Anúncio Parceiro"} 
                            className="w-full h-full object-cover"
                        />
                        {(ad.meta_description || ad.meta_keywords) && (
                            <div className={`absolute inset-0 transition-all duration-500 ${
                                layout === 'horizontal' 
                                ? (ad.author_name === 'brown' ? 'bg-gradient-to-r from-natu-brown via-natu-brown/80 to-transparent flex flex-col justify-center items-start p-8 md:p-12 w-full md:w-3/4' : 'bg-gradient-to-r from-black/95 via-black/70 to-transparent flex flex-col justify-center items-start p-8 md:p-12 w-full md:w-3/4')
                                : (ad.author_name === 'brown' ? 'bg-gradient-to-t from-natu-brown via-natu-brown/40 to-transparent flex flex-col justify-end p-5 md:p-6' : 'bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5 md:p-6')
                            }`}>
                                {ad.meta_description && (
                                    layout === 'horizontal' ? (
                                        <h3 className="text-white font-sans leading-[1.15] text-[28px] md:text-[40px] mb-6 md:mb-8 max-w-lg md:max-w-xl tracking-tight">
                                            <span className="italic font-medium">{ad.meta_description.split(' ')[0]}</span>{' '}
                                            <span className="font-bold">{ad.meta_description.split(' ').slice(1).join(' ')}</span>
                                        </h3>
                                    ) : (
                                        <h3 className="text-white font-sans font-bold leading-tight text-lg md:text-xl mb-3">
                                            {ad.meta_description}
                                        </h3>
                                    )
                                )}
                                {ad.meta_keywords && (
                                    <span className={`${
                                        layout === 'horizontal'
                                        ? 'bg-natu-ivory text-natu-brown px-6 py-3 rounded-full text-[15px] font-bold flex items-center gap-2 hover:bg-white transition-colors group-hover/ad:scale-105'
                                        : 'text-natu-pink font-bold text-[11px] uppercase tracking-widest flex items-center gap-1.5 group-hover/ad:translate-x-1 transition-transform'
                                    }`}>
                                        {ad.meta_keywords} <span className={layout === 'horizontal' ? 'text-xl leading-none mt-[-2px] font-light' : 'text-lg leading-none'}>&rarr;</span>
                                    </span>
                                )}
                            </div>
                        )}
                    </a>
                </div>
            ))}
            
            {/* Tag de Publicidade */}
            <div className="absolute top-2 right-2 bg-black/40 text-white/80 text-[9px] uppercase px-2 py-0.5 rounded backdrop-blur-sm tracking-widest font-sans z-20">
                Publicidade
            </div>
            
            {/* Indicadores de bolinha */}
            {activeAds.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                    {activeAds.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'}`} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CarouselAd;
