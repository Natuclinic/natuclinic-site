import React from 'react';
import ServiceLayout from '../components/ServiceLayout';
import { ImageComparisonSlider } from '../components/ImageComparisonSlider';

const Endolaser = ({ goBack }) => {
    return (
        <ServiceLayout
            title="Endolaser"
            subtitle="Quando o emagrecimento acontece, mas o corpo não acompanha. Um estímulo profundo onde você realmente precisa."
            goBack={goBack}
            coverImage="/harmonizacao-corporal.jpg"
            whatsappMessage="Olá! Gostaria de saber mais sobre o protocolo de Endolaser."
        >
            {/* 1. Contexto - O Dilema da Flacidez */}
            <section>
                <span className="text-xs font-bold tracking-widest text-natu-brown/50 uppercase block mb-4">O Cenário</span>
                <h3 className="text-2xl font-serif italic mb-6 text-natu-brown">Você fez tudo certo. Mas algo ainda incomoda.</h3>
                <p className="font-sans font-light leading-relaxed text-lg text-gray-600 mb-6 text-pretty">
                    Seja com canetas emagrecedoras, cirurgia bariátrica ou após a gestação, o resultado na balança veio. Mas, ao se olhar no espelho, a flacidez e aquele contorno que parece não “assentar” persistem.
                </p>
                <div className="bg-[#FFF5F5] p-6 rounded-2xl border-l-2 border-natu-pink">
                    <p className="font-sans font-medium text-natu-brown text-pretty">
                        Isso não é falha sua. É uma resposta fisiológica. O corpo emagrece, mas a pele e o tecido de sustentação nem sempre acompanham esse ritmo.
                    </p>
                </div>
            </section>

            {/* Before/After Comparison */}
            <section>
                <span className="text-xs font-bold tracking-widest text-natu-brown/50 uppercase block mb-4 text-center">Resultados Reais</span>
                <div className="w-full h-[400px] md:h-[600px] rounded-2xl overflow-hidden">
                    <ImageComparisonSlider
                        leftImage="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2000"
                        rightImage="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2000"
                        altLeft="Antes do tratamento"
                        altRight="Depois do tratamento"
                    />
                </div>
                <p className="text-center text-xs text-gray-400 mt-4 font-sans">Arraste o controle para comparar</p>
            </section>

            {/* 2. O que é Endolaser */}
            <section>
                <span className="text-xs font-bold tracking-widest text-natu-brown/50 uppercase block mb-4">A Solução</span>
                <h3 className="text-2xl font-serif italic mb-6 text-natu-brown">Endolaser: Estímulo profundo</h3>
                <p className="font-sans font-light leading-relaxed text-lg text-gray-600 mb-8 text-pretty">
                    O Endolaser é um procedimento de estética avançada que atua de dentro para fora. Diferente de tratamentos superficiais, ele utiliza energia laser aplicada internamente para promover:
                </p>
                <ul className="grid sm:grid-cols-2 gap-4">
                    {[
                        'Estímulo intenso de colágeno novo',
                        'Contração imediata das fibras existentes',
                        'Melhora da firmeza e textura',
                        'Remodelação do contorno corporal',
                        'Resultados naturais e progressivos'
                    ].map((item, i) => (
                        <li key={i} className="flex gap-3 text-natu-brown/80 font-sans font-light">
                            <span className="text-natu-pink">•</span> {item}
                        </li>
                    ))}
                </ul>
            </section>

            <div className="p-8 md:p-12 bg-natu-brown/5 rounded-2xl">
                <h3 className="text-xl font-serif text-natu-brown mb-4">Definição Corporal: Esculpir com inteligência</h3>
                <p className="font-sans font-light text-gray-600 leading-relaxed max-w-2xl text-pretty">
                    Para quem já emagreceu e tem aqueles pequenos acúmulos que não saem com treino (barriga inferior, flancos, interno de coxa), o Endolaser atua na quebra controlada de gordura enquanto retrai a pele.
                    <br /><br />
                    <span className="font-medium">O objetivo não é "secar". É definir.</span>
                </p>
            </div>

            {/* 3. Indicações */}
            <section>
                <h3 className="text-2xl font-serif italic mb-8 text-natu-brown">Para quem é especialmente indicado?</h3>
                <div className="space-y-6">
                    {[
                        { title: "Pós-Emagrecimento", desc: "Pessoas que usaram canetas emagrecedoras e notaram flacidez." },
                        { title: "Pós-Bariátrica", desc: "Desejo de melhorar a qualidade da pele e definir áreas específicas." },
                        { title: "Pós-Gestação", desc: "Mulheres buscando recuperar a firmeza abdominal." },
                        { title: "Gordura Resistente", desc: "Quem tem baixo percentual de gordura, mas falta definição." }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 border-b border-gray-100 pb-4 last:border-0">
                            <span className="font-serif text-xl text-natu-brown whitespace-nowrap">{item.title}</span>
                            <span className="font-sans font-light text-gray-500 text-sm md:text-base">{item.desc}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. Diferencial */}
            <section className="text-center max-w-2xl mx-auto">
                <h3 className="text-2xl font-serif italic mb-6 text-natu-brown">O Diferencial Natuclinic</h3>
                <p className="font-sans font-light leading-relaxed text-gray-600 mb-8 text-pretty">
                    Nós não tratamos apenas a flacidez. Tratamos o corpo que desenvolveu essas alterações. Avaliamos saúde metabólica, nutricional e hormonal para garantir que o tecido tenha <strong className="text-natu-brown font-medium">capacidade real de regeneração</strong>.
                </p>
                <div className="inline-block px-6 py-2 border border-natu-brown/20 rounded-full text-natu-brown text-sm tracking-widest uppercase font-sans">
                    Estética com base científica
                </div>
            </section>

        </ServiceLayout>
    );
};

export default Endolaser;
