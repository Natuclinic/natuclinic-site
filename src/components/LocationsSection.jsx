import React from 'react';
import Unicon from './Unicon';

const LocationCard = ({ title, address, mapSrc, mapLink }) => (
    <div className="group relative w-full h-[500px] rounded-[2.5rem] overflow-hidden bg-white border border-natu-brown/5 transition-all duration-500">
        {/* Map Iframe */}
        <div className="absolute inset-0 z-0">
            <iframe
                width="100%"
                height="100%"
                id="gmap_canvas"
                src={mapSrc}
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                className="grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                title={title}
            ></iframe>
            {/* Overlay gradient for text readability if needed, though we have a card below */}
        </div>

        {/* Floating Info Card */}
        <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white/40 transition-transform duration-500 group-hover:-translate-y-2">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-serif text-2xl text-natu-brown mb-2">{title}</h3>
                    <div className="flex items-center gap-2 text-gray-500 font-sans text-sm">
                        <Unicon name="map-marker" size={16} />
                        <p>{address}</p>
                    </div>
                </div>
                <a
                    href={mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-natu-brown text-white hover:bg-black transition-colors"
                >
                    <Unicon name="arrow-up-right" size={20} />
                </a>
            </div>
        </div>
    </div>
);

const LocationsSection = () => {
    return (
        <section className="py-24 bg-white">
            <div className="desktop-container">
                <div className="text-center mb-16">
                    <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.3em] uppercase text-natu-brown/40 block mb-4">
                        Nossas Unidades
                    </span>
                    <h2 className="text-4xl md:text-5xl font-sans font-bold text-natu-brown">
                        Escolha a unidade mais próxima de você
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    <LocationCard
                        title="Unidade Taguatinga"
                        address="Taguatinga Norte (Setor E Norte), DF"
                        mapLink="https://www.google.com/maps?client=firefox-b-d&hs=u9bU&sca_esv=4fee371841179941&output=search&q=Taguatinga+Natuclinic"
                        mapSrc="https://maps.google.com/maps?q=Natuclinic%20Taguatinga%20Norte&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    />

                    <LocationCard
                        title="Unidade Planaltina"
                        address="Planaltina, DF"
                        mapLink="https://www.google.com/maps/place/Natuclinic+Est%C3%A9tica+e+Nutri%C3%A7%C3%A3o+Ortomolecular+-+Clinica+de+Est%C3%A9tica+e+Nutri%C3%A7%C3%A3o+em+Planaltina+-+DF"
                        mapSrc="https://maps.google.com/maps?q=Natuclinic%20Est%C3%A9tica%20e%20Nutri%C3%A7%C3%A3o%20Ortomolecular%20Planaltina&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    />
                </div>
            </div>
        </section>
    );
};

export default LocationsSection;
