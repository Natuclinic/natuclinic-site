import { useEffect, useState } from 'react';

// Avaliações ao vivo do Google (Places API New), compartilhadas pela home (GoogleReviews)
// e pela página /bio. Uma única chamada por carregamento de página, mesmo com vários
// componentes usando o hook.
// Os campos rating, userRatingCount e googleMapsUri não mudam a cobrança: "reviews"
// já é o campo de faixa mais alta da chamada.

const PLACE_ID = import.meta.env.VITE_GOOGLE_PLACE_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
const FIELDS = 'reviews,rating,userRatingCount,googleMapsUri';

let request = null;

function fetchPlace() {
    if (!API_KEY || !PLACE_ID) return Promise.resolve(null);
    if (!request) {
        request = fetch(`https://places.googleapis.com/v1/places/${PLACE_ID}?fields=${FIELDS}&key=${API_KEY}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (!data) return null;
                const reviews = (data.reviews || [])
                    .filter((r) => r.rating >= 4 && (r.text?.text || r.originalText?.text))
                    .map((r) => {
                        const name = r.authorAttribution?.displayName || 'Paciente Natuclinic';
                        return {
                            id: r.name,
                            name,
                            text: r.text?.text || r.originalText?.text,
                            rating: r.rating,
                            when: r.relativePublishTimeDescription || '',
                            avatarLetter: name.charAt(0).toUpperCase(),
                            avatarPhoto: r.authorAttribution?.photoUri || null,
                        };
                    });
                return {
                    reviews,
                    rating: data.rating ?? null,
                    total: data.userRatingCount ?? null,
                    mapsUri: data.googleMapsUri ?? null,
                };
            })
            .catch(() => null);
    }
    return request;
}

// fallbackReviews: mostradas enquanto a busca não responde, ou se ela falhar.
export function useGoogleReviews(fallbackReviews = []) {
    const [place, setPlace] = useState(null);

    useEffect(() => {
        let active = true;
        fetchPlace().then((data) => {
            if (active && data) setPlace(data);
        });
        return () => {
            active = false;
        };
    }, []);

    const live = Boolean(place?.reviews?.length);
    return {
        reviews: live ? place.reviews : fallbackReviews,
        live,
        rating: place?.rating ?? null,
        total: place?.total ?? null,
        mapsUri: place?.mapsUri ?? null,
    };
}
