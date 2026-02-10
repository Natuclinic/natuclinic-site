import React from 'react';
import ServiceLayout from '../components/ServiceLayout';
import { ImageComparisonSlider } from '../components/ImageComparisonSlider';

const HarmonizacaoFacial = ({ goBack }) => {
    return (
        <ServiceLayout
            title="Harmonização Facial"
            subtitle="Realçar sua beleza natural com equilíbrio, proporção e técnica científica."
            goBack={goBack}
            coverImage="/harmonizacao-facial.jpg"
            whatsappMessage="Olá! Gostaria de saber mais sobre a Harmonização Facial."
        >
            {/* 1. Introdução */}
            <section>
                <p className="font-sans font-light leading-relaxed text-lg text-gray-600 mb-8 text-pretty first-letter:text-5xl first-letter:font-serif first-letter:text-natu-brown first-letter:mr-2 first-letter:float-left">
                    A harmonização facial não é sobre mudar quem você é. É sobre realçar o que já existe de mais belo em você, respeitando suas características únicas e trazendo equilíbrio às proporções do rosto.
                </p>
                <p className="font-sans font-light leading-relaxed text-lg text-gray-600 mb-8 text-pretty">
                    Com o passar dos anos, perdemos volume em áreas estratégicas, desenvolvemos linhas de expressão e notamos mudanças na textura da pele. Isso é natural. Mas também é possível reverter esses sinais de forma sutil, elegante e completamente natural.
                </p>

                <div className="my-12 pl-6 border-l-2 border-natu-brown/30">
                    <h3 className="text-2xl font-serif italic text-natu-brown mb-2">Beleza não é padronização.</h3>
                    <p className="font-sans text-natu-brown/70 italic">É expressão da sua melhor versão.</p>
                </div>
            </section>

            {/* Before/After Comparison */}
            <section>
                <span className="text-xs font-bold tracking-widest text-natu-brown/50 uppercase block mb-4 text-center">Transformação Sutil</span>
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

            {/* 2. Áreas de Atuação */}
            <section>
                <span className="text-xs font-bold tracking-widest text-natu-brown/50 uppercase block mb-4">Áreas de Tratamento</span>
                <h3 className="text-2xl font-serif italic mb-8 text-natu-brown">Onde atuamos com precisão</h3>

                <div className="grid md:grid-cols-2 gap-8">
                    {[
                        { title: "Preenchimento Labial", desc: "Volume natural, contorno definido e hidratação profunda." },
                        { title: "Bigode Chinês", desc: "Suavização dos sulcos nasolabiais para um rosto mais jovem." },
                        { title: "Projeção de Mento", desc: "Equilíbrio do perfil facial com definição do queixo." },
                        { title: "Maçãs do Rosto", desc: "Restauração do volume perdido e sustentação da face." },
                        { title: "Olheiras", desc: "Preenchimento para reduzir sombras e aparência de cansaço." },
                        { title: "Mandíbula", desc: "Definição do contorno e harmonização do terço inferior." }
                    ].map((item, i) => (
                        <div key={i} className="bg-[#F9F7F5] p-6 rounded-2xl">
                            <h4 className="font-serif text-xl text-natu-brown mb-2">{item.title}</h4>
                            <p className="font-sans font-light text-gray-600 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Técnicas Utilizadas */}
            <section className="py-12 border-t border-gray-100">
                <h3 className="text-lg font-bold tracking-widest uppercase text-natu-brown mb-8 text-center">Nossos Recursos</h3>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div>
                        <h4 className="font-serif text-xl text-natu-brown mb-3">Ácido Hialurônico</h4>
                        <p className="font-sans font-light text-sm text-gray-500">Substância biocompatível para preenchimento e hidratação profunda.</p>
                    </div>
                    <div>
                        <h4 className="font-serif text-xl text-natu-brown mb-3">Toxina Botulínica</h4>
                        <p className="font-sans font-light text-sm text-gray-500">Suavização de linhas dinâmicas com resultados naturais.</p>
                    </div>
                    <div>
                        <h4 className="font-serif text-xl text-natu-brown mb-3">Bioestimuladores</h4>
                        <p className="font-sans font-light text-sm text-gray-500">Estímulo da produção natural de colágeno para rejuvenescimento progressivo.</p>
                    </div>
                </div>
            </section>

            {/* 4. Diferencial */}
            <section className="text-center max-w-2xl mx-auto">
                <h3 className="text-2xl font-serif italic mb-6 text-natu-brown">O Diferencial Natuclinic</h3>
                <p className="font-sans font-light leading-relaxed text-gray-600 mb-8 text-pretty">
                    Não fazemos procedimentos isolados. Avaliamos sua saúde como um todo — nutrição, hormônios, qualidade da pele — para garantir que os resultados sejam <strong className="text-natu-brown font-medium">duradouros e harmoniosos</strong>.
                </p>
                <div className="inline-block px-6 py-2 border border-natu-brown/20 rounded-full text-natu-brown text-sm tracking-widest uppercase font-sans">
                    Beleza com Ciência
                </div>
            </section>

        </ServiceLayout>
    );
};

export default HarmonizacaoFacial;
