import { useCallback, useState } from 'react';
import { usePlaces, useCravings, useHistory } from './useDatabase';
import type { Place, BlenderState, BlenderResult, Craving } from '../types';
import { CRAVING_CATEGORIES, MOODS, TIME_OF_DAY, COMPANY, ZONES } from '../types';

const PRICE_ORDER = ['$', '$$', '$$$', '$$$$'];

const MOOD_VIBE_MAP: Record<string, string[]> = {
  feliz: ['Divertido', 'Aesthetic', 'Fresco', 'Acogedor'],
  triste: ['Acogedor', 'Relajado', 'Auténtico', 'Casual'],
  estresado: ['Relajado', 'Rápido', 'Casual', 'Acogedor'],
  romantico: ['Romántico', 'Elegante', 'Acogedor', 'Aesthetic'],
  aburrido: ['Divertido', 'Aesthetic', 'Fresco', 'Casual'],
  energetico: ['Divertido', 'Fresco', 'Rápido', 'Casual'],
  relajado: ['Relajado', 'Acogedor', 'Auténtico', 'Fresco'],
  anhelante: ['Auténtico', 'Divertido', 'Aesthetic', 'Acogedor'],
};

const TIME_CATEGORY_MAP: Record<string, string[]> = {
  manana: ['Desayuno', 'Cafetería', 'Panadería', 'Postres', 'Bebida'],
  mediodia: ['Almuerzo', 'Comida Corrida', 'Tacos', 'Comida Rápida', 'Saludable', 'Japonesa'],
  tarde: ['Postres', 'Bebida', 'Snack', 'Cafetería', 'Panadería', 'Heladería'],
  noche: ['Cena', 'Tacos', 'Japonesa', 'Hamburguesas', 'Pizza', 'Mariscos', 'Bar/Cantina'],
  madrugada: ['Tacos', 'Comida Rápida', 'Hamburguesas'],
};

const COMPANY_VIBE_TAG_MAP: Record<string, { vibes: string[]; tags: string[] }> = {
  solo: { vibes: ['Acogedor', 'Relajado', 'Casual', 'Rápido'], tags: ['tranquilo', 'wifi', 'para llevar'] },
  pareja: { vibes: ['Romántico', 'Elegante', 'Acogedor', 'Aesthetic'], tags: ['romántico', 'vino', 'velas', 'intimo'] },
  amigos: { vibes: ['Divertido', 'Casual', 'Aesthetic', 'Fresco'], tags: ['grupo', 'compartir', 'cerveza', 'animado'] },
  familia: { vibes: ['Familiar', 'Acogedor', 'Casual', 'Auténtico'], tags: ['familiar', 'niños', 'espacioso', 'menu infantil'] },
  mascota: { vibes: ['Casual', 'Fresco', 'Relajado', 'Al Aire Libre'], tags: ['pet friendly', 'terraza', 'jardín', 'al aire libre'] },
};

const CATEGORY_VIBE_MAP: Record<string, string[]> = {
  Desayuno: ['Acogedor', 'Relajado', 'Fresco', 'Aesthetic'],
  Almuerzo: ['Casual', 'Auténtico', 'Rápido', 'Acogedor'],
  Cena: ['Romántico', 'Elegante', 'Acogedor', 'Auténtico'],
  Postre: ['Divertido', 'Aesthetic', 'Fresco', 'Acogedor'],
  Snack: ['Rápido', 'Casual', 'Fresco', 'Divertido'],
  Bebida: ['Relajado', 'Acogedor', 'Aesthetic', 'Fresco'],
  'Comida Rápida': ['Rápido', 'Casual', 'Divertido'],
  Saludable: ['Fresco', 'Relajado', 'Aesthetic', 'Acogedor'],
};

function calculatePlaceScore(place: Place, state: BlenderState, craving: Craving | undefined): number {
  let score = 0;

  const priceIndex = PRICE_ORDER.indexOf(place.priceRange);
  const budgetIndex = PRICE_ORDER.indexOf(state.budget);
  const priceDiff = Math.abs(priceIndex - budgetIndex);
  score += Math.max(0, 30 - priceDiff * 10);

  if (craving) {
    if (place.category === craving.category) score += 40;
    const tagMatches = place.tags.filter(tag => craving.tags.includes(tag)).length;
    score += tagMatches * 10;
    if (craving.vibes.includes(place.vibe)) score += 20;
  }

  const timeCategories = TIME_CATEGORY_MAP[state.timeOfDay] || [];
  if (timeCategories.includes(place.category)) score += 25;

  const moodVibes = MOOD_VIBE_MAP[state.mood] || [];
  if (moodVibes.includes(place.vibe)) score += 20;

  const companyPrefs = COMPANY_VIBE_TAG_MAP[state.company] || { vibes: [], tags: [] };
  if (companyPrefs.vibes.includes(place.vibe)) score += 15;
  const companyTagMatches = place.tags.filter(tag => companyPrefs.tags.includes(tag)).length;
  score += companyTagMatches * 8;

  if (state.zone !== 'all' && place.zone === state.zone) score += 15;

  if (place.isFavorite) score += 10;
  if (place.rating && place.rating >= 4.5) score += 10;
  else if (place.rating && place.rating >= 4) score += 5;

  const categoryVibes = CATEGORY_VIBE_MAP[state.cravingType] || [];
  if (categoryVibes.includes(place.vibe)) score += 10;

  return score;
}

export const useBlender = () => {
  const { places, loading: placesLoading } = usePlaces();
  const { cravings, loading: cravingsLoading } = useCravings();
  const { addToHistory } = useHistory();
  const [isBlending, setIsBlending] = useState(false);
  const [result, setResult] = useState<BlenderResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getScoredPlaces = useCallback((
    placesList: Place[],
    state: BlenderState
  ): Place[] => {
    const craving = cravings.find(c => c.category === state.cravingType);

    return placesList
      .map(place => ({ place, score: calculatePlaceScore(place, state, craving) }))
      .sort((a, b) => b.score - a.score)
      .map(({ place }) => place);
  }, [cravings]);

  const blend = useCallback(async (state: BlenderState): Promise<BlenderResult | null> => {
    setIsBlending(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2500));

      const craving = cravings.find(c => c.category === state.cravingType) || cravings[0];
      let scoredPlaces = getScoredPlaces(places, state);

      let filtered = scoredPlaces.filter(place => {
        const priceIndex = PRICE_ORDER.indexOf(place.priceRange);
        const budgetIndex = PRICE_ORDER.indexOf(state.budget);
        return priceIndex <= budgetIndex + 1;
      });

      if (state.zone !== 'all') {
        const zoneFiltered = filtered.filter(p => p.zone === state.zone);
        if (zoneFiltered.length > 0) filtered = zoneFiltered;
      }

      if (filtered.length === 0) {
        filtered = scoredPlaces.filter(place => {
          const priceIndex = PRICE_ORDER.indexOf(place.priceRange);
          const budgetIndex = PRICE_ORDER.indexOf(state.budget);
          return priceIndex <= budgetIndex + 2;
        });
      }

      if (filtered.length === 0) {
        filtered = scoredPlaces;
      }

      if (filtered.length === 0) {
        filtered = places;
      }

      const topPlaces = filtered.slice(0, 10);
      const shuffled = [...topPlaces].sort(() => Math.random() - 0.5);
      const selectedPlaces = shuffled.slice(0, 3);

      const blendResult: BlenderResult = {
        places: selectedPlaces,
        craving,
        timestamp: new Date(),
      };

      setResult(blendResult);
      await addToHistory(blendResult);
      return blendResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al mezclar';
      setError(message);
      return null;
    } finally {
      setIsBlending(false);
    }
  }, [places, cravings, getScoredPlaces, addToHistory]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    blend,
    reset,
    result,
    isBlending,
    error,
    isReady: !placesLoading && !cravingsLoading,
    categories: CRAVING_CATEGORIES,
    moods: MOODS,
    timeOfDay: TIME_OF_DAY,
    company: COMPANY,
    zones: ZONES,
  };
};