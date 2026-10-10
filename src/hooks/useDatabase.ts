import { useState, useEffect, useCallback } from 'react';
import { initializeDatabase, placesApi, cravingsApi, historyApi, settingsApi } from '../db';
import type { Place, Craving, BlenderResult, AppSettings, HistoryEntry } from '../types';
import { sanitizeText, validateAndSanitize, placeSchema, cravingSchema, checkRateLimit } from '../lib/security';

export const useDatabase = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase();
        setIsReady(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al inicializar la base de datos');
      }
    };
    init();
  }, []);

  return { isReady, error };
};

export const usePlaces = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPlaces = useCallback(async () => {
    setLoading(true);
    try {
      const data = await placesApi.getAll();
      setPlaces(data);
    } catch (err) {
      console.error('Error loading places:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  const addPlace = useCallback(async (placeData: Omit<Place, 'id'>): Promise<Place | null> => {
    if (!checkRateLimit('addPlace', 10, 60000)) {
      throw new Error('Demasiadas solicitudes. Intenta de nuevo en un momento.');
    }

    const validation = validateAndSanitize(placeSchema, {
      ...placeData,
      name: sanitizeText(placeData.name),
      category: sanitizeText(placeData.category),
      vibe: sanitizeText(placeData.vibe),
      tags: placeData.tags.map(t => sanitizeText(t)),
      addressOrNotes: placeData.addressOrNotes ? sanitizeText(placeData.addressOrNotes) : undefined,
    });

    if (!validation.success) {
      throw new Error(validation.errors.issues.map((e) => e.message).join(', '));
    }

    try {
      const dataWithDate = { ...validation.data, createdAt: new Date() } as Omit<Place, 'id'>;
      const id = await placesApi.add(dataWithDate);
      const newPlace = { ...dataWithDate, id } as Place;
      setPlaces(prev => [newPlace, ...prev]);
      return newPlace;
    } catch (err) {
      console.error('Error adding place:', err);
      throw new Error('No se pudo agregar el lugar');
    }
  }, []);

  const updatePlace = useCallback(async (id: number, changes: Partial<Place>): Promise<boolean> => {
    if (!checkRateLimit(`updatePlace-${id}`, 20, 60000)) {
      throw new Error('Demasiadas solicitudes. Intenta de nuevo en un momento.');
    }

    try {
      await placesApi.update(id, changes);
      setPlaces(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p));
      return true;
    } catch (err) {
      console.error('Error updating place:', err);
      return false;
    }
  }, []);

  const deletePlace = useCallback(async (id: number): Promise<boolean> => {
    if (!checkRateLimit(`deletePlace-${id}`, 10, 60000)) {
      throw new Error('Demasiadas solicitudes. Intenta de nuevo en un momento.');
    }

    try {
      await placesApi.delete(id);
      setPlaces(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting place:', err);
      return false;
    }
  }, []);

  const toggleFavorite = useCallback(async (id: number): Promise<void> => {
    const place = places.find(p => p.id === id);
    if (place) {
      await updatePlace(id, { isFavorite: !place.isFavorite });
    }
  }, [places, updatePlace]);

  return { places, loading, addPlace, updatePlace, deletePlace, toggleFavorite, refresh: loadPlaces };
};

export const useCravings = () => {
  const [cravings, setCravings] = useState<Craving[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCravings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await cravingsApi.getAll();
      setCravings(data);
    } catch (err) {
      console.error('Error loading cravings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCravings();
  }, [loadCravings]);

  const addCraving = useCallback(async (cravingData: Omit<Craving, 'id'>): Promise<Craving | null> => {
    if (!checkRateLimit('addCraving', 10, 60000)) {
      throw new Error('Demasiadas solicitudes. Intenta de nuevo en un momento.');
    }

    const validation = validateAndSanitize(cravingSchema, {
      ...cravingData,
      name: sanitizeText(cravingData.name),
      iconName: sanitizeText(cravingData.iconName),
      category: sanitizeText(cravingData.category),
      tags: cravingData.tags.map(t => sanitizeText(t)),
      vibes: cravingData.vibes.map(v => sanitizeText(v)),
    });

    if (!validation.success) {
      throw new Error(validation.errors.issues.map((e) => e.message).join(', '));
    }

    try {
      const id = await cravingsApi.add(validation.data);
      const newCraving = { ...validation.data, id } as Craving;
      setCravings(prev => [...prev, newCraving]);
      return newCraving;
    } catch (err) {
      console.error('Error adding craving:', err);
      throw new Error('No se pudo agregar el antojo');
    }
  }, []);

  return { cravings, loading, addCraving, refresh: loadCravings };
};

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await historyApi.getAll();
      setHistory(data);
    } catch (err) {
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const addToHistory = useCallback(async (result: BlenderResult): Promise<void> => {
    try {
      await historyApi.add({ result, createdAt: new Date() });
      loadHistory();
    } catch (err) {
      console.error('Error adding to history:', err);
    }
  }, [loadHistory]);

  const clearHistory = useCallback(async (): Promise<void> => {
    if (!checkRateLimit('clearHistory', 3, 300000)) {
      throw new Error('Demasiadas solicitudes. Intenta de nuevo más tarde.');
    }
    try {
      await historyApi.clear();
      setHistory([]);
    } catch (err) {
      console.error('Error clearing history:', err);
    }
  }, []);

  return { history, loading, addToHistory, clearHistory, refresh: loadHistory };
};

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await settingsApi.get();
      setSettings(data || {
        id: 1,
        theme: 'system',
        animationsEnabled: true,
        soundEnabled: true,
        language: 'es',
      });
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateSettings = useCallback(async (changes: Partial<AppSettings>): Promise<void> => {
    try {
      await settingsApi.update(changes);
      setSettings(prev => prev ? { ...prev, ...changes } : null);
    } catch (err) {
      console.error('Error updating settings:', err);
    }
  }, []);

  return { settings, loading, updateSettings, refresh: loadSettings };
};