import React from 'react';
import ServiceLayout from '../components/ServiceLayout';
import { ImageComparisonSlider } from '../components/ImageComparisonSlider';

const HarmonizacaoGluteos = ({ goBack }) => {
    return (
        <ServiceLayout
            title="Harmonização de Glúteos"
            subtitle="Volume, contorno e projeção com naturalidade, segurança e ciência."
            goBack={goBack}
            coverImage="/harmonizacao-de-gluteo.jpg"
            whatsappMessage="Olá! Gostaria de saber mais sobre a Harmonização de Glúteos."
        >
            <section className="md:grid md:grid-cols-12 gap-12 items-center">
                {/* Lado Esquerdo - Conceito */}
                <div className="md:col-span-12 lg:col-span-8">
                    <p className="font-sans font-light leading-relaxed text-lg text-gray-600 mb-8 text-pretty first-letter:text-5xl first-letter:font-serif first-letter:text-natu-brown first-letter:mr-2 firs-letter:float-left">
                        Você já reparou como o contorno dos glúteos influencia diretamente a autoestima, a postura e até a forma como as roupas vestem no corpo?
                    </p>
                    <p className="font-sans font-light leading-relaxed text-lg text-gray-600 mb-8 text-pretty">
                        Com o passar dos anos — ou mesmo por características genéticas — é comum perceber perda de volume, flacidez ou assimetrias na região glútea. E isso não tem a ver apenas com estética. Tem a ver com como você se sente no próprio corpo.
                    </p>

                    <div className="my-12 pl-6 border-l-2 border-natu-brown/30">
                        <h3 className="text-2xl font-serif italic text-natu-brown mb-2">Estética não é vaidade.</h3>
                        <p className="font-sans text-natu-brown/70 italic">É cuidado. É saúde. É autoestima.</p>
                    </div>

                    <p className="font-sans font-light leading-relaxed text-lg text-gray-600 text-pretty">
                        Desenvolvemos um protocolo exclusivo de <strong className="text-natu-brown font-medium">Harmonização de Glúteos com Ácido Hialurônico</strong>, pensado para quem busca resultados naturais, seguros e sustentáveis, sem cirurgias e sem exageros.
                    </p>
                </div>

                {/* Lado Direito - Destaques Visuais (Ficando mais vazio pois o texto era curto, usando para respiro ou stats visuais) */}
                <div className="hidden lg:block lg:col-span-4 space-y-6">
                    <div className="bg-[#F9F7F5] aspect-square rounded-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-1000">
                        <span className="font-serif text-5xl text-natu-brown mb-2">100%</span>
                        <span className="text-xs uppercase tracking-widest text-gray-500">Sem Cirurgia</span>
                    </div>
                    <div className="bg-[#FFF5F5] aspect-square rounded-full flex flex-col items-center justify-center p-8 text-center translate-x-8 animate-in fade-in duration-1000 delay-300">
                        <span className="font-serif text-5xl text-natu-pink mb-2">Natural</span>
                        <span className="text-xs uppercase tracking-widest text-gray-500">Resultado</span>
                    </div>
                </div>
            </section>

            {/* Before/After Comparison */}
            <section>
                <span className="text-xs font-bold tracking-widest text-natu-brown/50 uppercase block mb-4 text-center">Transformação Real</span>
                <div className="w-full h-[400px] md:h-[600px] rounded-2xl overflow-hidden">
                    <ImageComparisonSlider
                        leftImage="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2000"
                        rightImage="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2000"
                        altLeft="Antes"
                        altRight="Depois"
                    />
                </div>
                <p className="text-center text-xs text-gray-400 mt-4 font-sans">Arraste para comparar</p>
            </section>

            {/* Grid de Benefícios do Ácido Hialurônico */}
            <section className="py-12 border-t border-gray-100">
                <h3 className="text-lg font-bold tracking-widest uppercase text-natu-brown mb-8 text-center">Por que Ácido Hialurônico?</h3>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div>
                        <h4 className="font-serif text-xl text-natu-brown mb-3">Segurança Biológica</h4>
                        <p className="font-sans font-light text-sm text-gray-500">Substância biocompatível, absorvível e com baixíssimo risco de rejeição.</p>
                    </div>
                    <div>
                        <h4 className="font-serif text-xl text-natu-brown mb-3">Modelagem Precisa</h4>
                        <p className="font-sans font-light text-sm text-gray-500">Permite esculpir detalhes, corrigir depressões laterais ("hip dips") e projetar.</p>
                    </div>
                    <div>
                        <h4 className="font-serif text-xl text-natu-brown mb-3">Sem Downtime</h4>
                        <p className="font-sans font-light text-sm text-gray-500">Retorno rápido à rotina, sem a recuperação dolorosa de próteses ou lipoenxertia.</p>
                    </div>
                </div>
            </section>

        </ServiceLayout>
    );
};

export default HarmonizacaoGluteos;
