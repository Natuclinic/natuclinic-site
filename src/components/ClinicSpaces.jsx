import React from 'react';

const ClinicSpaces = () => (
    <section className="py-16 md:py-24 bg-natu-ivory">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
                <div className="w-full lg:w-1/2 flex flex-row gap-3 md:gap-4">
                    <div className="w-1/2 h-[240px] sm:h-[320px] md:h-[450px] overflow-hidden rounded-2xl md:rounded-3xl bg-gray-50 group">
                        <img
                            src="/sala-dra-debora.jpg"
                            alt="Sala Dra Débora - Natuclinic"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[20%]"
                        />
                    </div>
                    <div className="w-1/2 h-[240px] sm:h-[320px] md:h-[450px] overflow-hidden rounded-2xl md:rounded-3xl bg-gray-50 group mt-6 sm:mt-12">
                        <img
                            src="/images/melhor-clinica-de-brasilia-df.jpg"
                            alt="Recepção Natuclinic"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[20%]"
                        />
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex flex-col font-sans text-natu-brown text-left">
                    <span className="text-[10px] font-sans font-bold tracking-[0.3em] uppercase text-natu-brown/40 block mb-4">Bem-vindo</span>
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-natu-brown leading-[0.95] mb-8">
                        Espaços pensados para seu bem-estar
                    </h2>
                    <p className="text-sm md:text-base opacity-60 leading-relaxed font-light">
                        Nossas unidades em Taguatinga e Planaltina foram projetadas para entregar uma experiência premium do início ao fim. Ambientes modernos, climatizados e acolhedores, unindo tecnologia de ponta em estética avançada com uma atmosfera de conforto que você não encontra em nenhum outro lugar do Distrito Federal.
                    </p>
                </div>
            </div>
        </div>
    </section>
);

export default ClinicSpaces;
