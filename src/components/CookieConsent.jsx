import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const [preferences, setPreferences] = useState({
        essential: true, // Always true
        statistical: true,
        marketing: true
    });

    useEffect(() => {
        const consent = localStorage.getItem('natuclinic-cookie-consent');
        if (!consent) {
            // Wait a bit to show the banner for a better UX
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        } else {
            // Apply existing consent
            applyConsent(JSON.parse(consent));
        }
    }, []);

    const applyConsent = (consents) => {
        // Update Google Consent Mode v2
        if (window.gtag) {
            window.gtag('consent', 'update', {
                'ad_storage': consents.marketing ? 'granted' : 'denied',
                'ad_user_data': consents.marketing ? 'granted' : 'denied',
                'ad_personalization': consents.marketing ? 'granted' : 'denied',
                'analytics_storage': consents.statistical ? 'granted' : 'denied',
                'personalization_storage': consents.marketing ? 'granted' : 'denied',
            });
        }

        // Initialize Meta Pixel if marketing is allowed
        if (consents.marketing && window.fbq) {
            window.fbq('init', '899389778630417');
            window.fbq('track', 'PageView');
        }
    };

    const handleAcceptAll = () => {
        const allAccepted = { essential: true, statistical: true, marketing: true };
        saveAndApply(allAccepted);
    };

    const handleRejectAll = () => {
        const rejected = { essential: true, statistical: false, marketing: false };
        saveAndApply(rejected);
    };

    const handleSavePreferences = () => {
        saveAndApply(preferences);
    };

    const saveAndApply = (consents) => {
        const consentData = {
            ...consents,
            timestamp: new Date().toISOString(),
            id: Math.random().toString(36).substring(2, 15)
        };
        localStorage.setItem('natuclinic-cookie-consent', JSON.stringify(consentData));
        applyConsent(consentData);
        setIsVisible(false);
        setTimeout(() => setShowPreferences(false), 500);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-10 md:max-w-xs z-[100] font-sans"
                >
                    <div className="bg-white rounded-[1.5rem] border border-natu-brown/5 overflow-hidden p-6 flex flex-col gap-5">
                        {!showPreferences ? (
                            <>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-lg font-medium text-natu-brown">Sua privacidade</h3>
                                    <p className="text-[13px] text-gray-500 leading-relaxed font-light">
                                        Usamos cookies para melhorar sua experiência. Ao aceitar, você concorda com nossa <a href="/politica-de-privacidade" className="text-natu-brown underline font-normal">Política de Privacidade</a>.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={handleAcceptAll}
                                        className="w-full bg-natu-brown text-white py-2.5 rounded-full text-sm font-medium hover:bg-black transition-colors"
                                    >
                                        Aceitar todos
                                    </button>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={handleRejectAll}
                                            className="bg-gray-50 text-gray-600 py-2.5 rounded-full text-xs font-medium hover:bg-gray-100 transition-colors"
                                        >
                                            Recusar
                                        </button>
                                        <button
                                            onClick={() => setShowPreferences(true)}
                                            className="bg-transparent border border-gray-100 text-gray-600 py-2.5 rounded-full text-xs font-medium hover:border-natu-brown hover:text-natu-brown transition-all"
                                        >
                                            Preferências
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={() => setShowPreferences(false)}
                                        className="text-xs text-natu-brown/60 uppercase tracking-widest flex items-center gap-1 hover:text-natu-brown transition-colors"
                                    >
                                        ← Voltar
                                    </button>
                                    <h3 className="text-xl font-medium text-natu-brown">Preferências</h3>

                                    <div className="flex flex-col gap-4 mt-2">
                                        {/* Essential */}
                                        <div className="flex items-start justify-between gap-4 p-3 rounded-2xl bg-gray-50/50">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-medium text-natu-brown">Essenciais</span>
                                                <span className="text-[11px] text-gray-500 font-light leading-snug">Necessários para as funcionalidades básicas do site.</span>
                                            </div>
                                            <div className="w-10 h-6 bg-natu-brown rounded-full flex items-center px-1 opacity-50 cursor-not-allowed">
                                                <div className="w-4 h-4 bg-white rounded-full translate-x-4" />
                                            </div>
                                        </div>

                                        {/* Statistical */}
                                        <div className="flex items-start justify-between gap-4 p-3 rounded-2xl border border-gray-100">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-medium text-natu-brown">Estatísticos</span>
                                                <span className="text-[11px] text-gray-500 font-light leading-snug">Google Analytics para entender como você navega.</span>
                                            </div>
                                            <button
                                                onClick={() => setPreferences(prev => ({ ...prev, statistical: !prev.statistical }))}
                                                className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${preferences.statistical ? 'bg-natu-brown' : 'bg-gray-200'}`}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${preferences.statistical ? 'translate-x-4' : 'translate-x-0'}`} />
                                            </button>
                                        </div>

                                        {/* Marketing */}
                                        <div className="flex items-start justify-between gap-4 p-3 rounded-2xl border border-gray-100">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-medium text-natu-brown">Marketing</span>
                                                <span className="text-[11px] text-gray-500 font-light leading-snug">Meta Pixel para oferecer anúncios mais relevantes.</span>
                                            </div>
                                            <button
                                                onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                                                className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${preferences.marketing ? 'bg-natu-brown' : 'bg-gray-200'}`}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${preferences.marketing ? 'translate-x-4' : 'translate-x-0'}`} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSavePreferences}
                                    className="w-full bg-natu-brown text-white py-3.5 rounded-full font-medium hover:bg-black transition-colors mt-2"
                                >
                                    Salvar preferências
                                </button>
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;
