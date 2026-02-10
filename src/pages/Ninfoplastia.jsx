import React from 'react';
import ServiceLayout from '../components/ServiceLayout';

const Ninfoplastia = ({ goBack }) => {
    return (
        <ServiceLayout
            title="Ninfoescultura Sem Cortes"
            subtitle="Um protocolo de cuidado íntimo integrativo, pensado para restaurar conforto, estética e, principalmente, autoconfiança."
            goBack={goBack}
            coverImage="/ninfoplastia.jpeg"
            whatsappMessage="Olá! Gostaria de saber mais sobre o procedimento de Ninfoplastia."
        >
            {/* 1. O que é */}
            <section>
                <h3 className="text-2xl font-serif italic mb-6 text-natu-brown">O que é a ninfoescultura sem cortes?</h3>
                <p className="font-sans font-light leading-relaxed text-lg text-gray-600 mb-6 text-pretty">
                    A ninfoescultura sem cortes é um procedimento não cirúrgico, realizado com tecnologias avançadas que promovem retração, remodelação e rejuvenescimento dos pequenos lábios, sem necessidade de bisturi, pontos ou afastamento da rotina.
                </p>
                <p className="font-sans font-light leading-relaxed text-lg text-gray-600 text-pretty">
                    Diferente da cirurgia tradicional, aqui nós respeitamos o corpo:
                </p>
                <ul className="mt-6 grid sm:grid-cols-2 gap-4">
                    {['Sem cortes', 'Sem internação', 'Sem cicatrizes permanentes', 'Sem longos períodos de recuperação'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-natu-brown/80 font-sans">
                            <span className="w-1.5 h-1.5 rounded-full bg-natu-pink block"></span>
                            {item}
                        </li>
                    ))}
                </ul>
            </section>

            <hr className="border-natu-brown/10" />

            {/* 2. Para quem é */}
            <section>
                <h3 className="text-2xl font-serif italic mb-6 text-natu-brown">Para quem é indicado?</h3>
                <p className="font-sans font-light leading-relaxed text-lg text-gray-600 mb-8 text-pretty">
                    A ninfoescultura sem cortes pode ser indicada para mulheres que:
                </p>
                <div className="space-y-4">
                    {[
                        'Sentem desconforto físico ao usar roupas justas, biquínis ou durante atividades físicas',
                        'Têm incômodo estético com o tamanho ou flacidez dos pequenos lábios',
                        'Sentem dor ou desconforto durante a relação sexual',
                        'Passaram por gestação, parto ou alterações hormonais',
                        'Desejam melhorar a autoestima íntima, sem recorrer à cirurgia'
                    ].map((item, i) => (
                        <div key={i} className="flex gap-4 p-4 bg-[#FFF5F5] rounded-2xl items-start">
                            <span className="text-natu-pink font-serif text-xl italic select-none">{i + 1}.</span>
                            <span className="font-sans font-light text-gray-700">{item}</span>
                        </div>
                    ))}
                </div>
            </section>

            <hr className="border-natu-brown/10" />

            {/* 3. Diferencial Natuclinic */}
            <section>
                <h3 className="text-2xl font-serif italic mb-6 text-natu-brown">Por que escolher a Natuclinic?</h3>
                <p className="font-sans font-light leading-relaxed text-lg text-gray-600 mb-6 text-pretty">
                    Porque aqui nós não tratamos apenas uma região do corpo. Nós cuidamos de você como um todo. Na Natuclinic, a ninfoescultura sem cortes está inserida dentro do conceito de estética funcional e saúde integrativa.
                </p>
                <div className="grid sm:grid-cols-2 gap-8 mt-8">
                    <div>
                        <h4 className="font-serif text-lg text-natu-brown mb-4">Nós avaliamos:</h4>
                        <ul className="space-y-2 font-sans font-light text-gray-600">
                            <li>• Qualidade dos tecidos</li>
                            <li>• Saúde hormonal</li>
                            <li>• Estado inflamatório do organismo</li>
                            <li>• Histórico clínico e emocional</li>
                        </ul>
                    </div>
                    <div className="bg-natu-brown/5 p-6 rounded-2xl flex items-center justify-center text-center">
                        <p className="text-natu-brown font-serif italic text-lg">
                            "Nosso diferencial está no acolhimento, na ciência aplicada e na personalização absoluta do cuidado."
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. Benefícios */}
            <section className="bg-natu-brown text-[#F2F0E9] p-8 md:p-12 rounded-2xl -mx-4 md:mx-0">
                <h3 className="text-2xl font-serif italic mb-8 text-center">Benefícios Reais</h3>
                <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                    {[
                        'Melhora estética dos pequenos lábios',
                        'Redução de flacidez',
                        'Mais conforto no dia a dia',
                        'Melhora da autoestima e da confiança íntima',
                        'Procedimento rápido e não invasivo',
                        'Retorno imediato às atividades'
                    ].map((benefit, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-natu-pink shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="font-sans font-light tracking-wide">{benefit}</span>
                        </div>
                    ))}
                </div>
            </section>

            <div className="text-center font-sans font-light text-gray-500 italic">
                "Não é só sobre aparência. É sobre se sentir confortável no próprio corpo novamente."
            </div>
        </ServiceLayout>
    );
};

export default Ninfoplastia;
