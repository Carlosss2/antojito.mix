import Dexie, { type Table } from 'dexie';
import type { Place, Craving, AppSettings, HistoryEntry } from '../types';

export class AntojitosDB extends Dexie {
  places!: Table<Place, number>;
  cravings!: Table<Craving, number>;
  history!: Table<HistoryEntry, number>;
  settings!: Table<AppSettings, number>;

  constructor() {
    super('AntojitosDB');
    this.version(1).stores({
      places: '++id, name, category, vibe, priceRange, isFavorite, createdAt',
      cravings: '++id, name, category',
      history: '++id, createdAt',
      settings: 'id',
    });
    this.version(2).stores({
      places: '++id, name, category, vibe, priceRange, isFavorite, createdAt',
      cravings: '++id, name, category',
      history: '++id, createdAt',
      settings: 'id',
    }).upgrade(async (trans) => {
      await trans.table('places').clear();
    });
  }
}

export const db = new AntojitosDB();

export const initializeDatabase = async (): Promise<void> => {
  await db.open();
  const cravingCount = await db.cravings.count();
  const settingsCount = await db.settings.count();

  if (cravingCount === 0) {
    await seedCravings();
  }
  if (settingsCount === 0) {
    await db.settings.put({
      id: 1,
      theme: 'system',
      animationsEnabled: true,
      soundEnabled: true,
      language: 'es',
    });
  }
};

const seedCravings = async (): Promise<void> => {
  const initialCravings: Omit<Craving, 'id'>[] = [
    { name: 'Algo Dulce', iconName: 'utensils-crossed', category: 'Postre', tags: ['chocolate', 'frutas', 'cremoso'], vibes: ['feliz', 'romantico', 'anhelante'] },
    { name: 'Comida Reconfortante', iconName: 'utensils-crossed', category: 'Cena', tags: ['caliente', 'casero', 'abundante'], vibes: ['triste', 'estresado', 'relajado'] },
    { name: 'Snack Saludable', iconName: 'salad', category: 'Snack', tags: ['fresco', 'ligero', 'nutritivo'], vibes: ['energetico', 'aburrido', 'anhelante'] },
    { name: 'Brunch Completo', iconName: 'pancakes', category: 'Desayuno', tags: ['huevos', 'pan', 'bebida caliente'], vibes: ['feliz', 'relajado', 'romantico'] },
    { name: 'Cena Romántica', iconName: 'heart', category: 'Cena', tags: ['elegante', 'vino', 'postre compartido'], vibes: ['romantico', 'feliz'] },
    { name: 'Comida Rápida', iconName: 'burger', category: 'Comida Rápida', tags: ['rápido', 'sabroso', 'informal'], vibes: ['estresado', 'aburrido', 'energetico'] },
    { name: 'Bebida Refrescante', iconName: 'coffee', category: 'Bebida', tags: ['frío', 'burbujas', 'sabor'], vibes: ['energetico', 'aburrido', 'anhelante'] },
    { name: 'Algo Picante', iconName: 'utensils-crossed', category: 'Cena', tags: ['picante', 'sabor intenso', 'caliente'], vibes: ['energetico', 'anhelante', 'estresado'] },
    { name: 'Desayuno Ligero', iconName: 'coffee', category: 'Desayuno', tags: ['café', 'toast', 'fruta'], vibes: ['relajado', 'energetico', 'feliz'] },
    { name: 'Cena con Amigos', iconName: 'utensils-crossed', category: 'Cena', tags: ['compartir', 'variedad', 'casual'], vibes: ['feliz', 'energetico', 'aburrido'] },
  ];

  await db.cravings.bulkAdd(initialCravings);
};

export const placesApi = {
  getAll: () => db.places.toArray(),
  getById: (id: number) => db.places.get(id),
  add: (place: Omit<Place, 'id'>) => db.places.add(place),
  update: (id: number, changes: Partial<Place>) => db.places.update(id, changes),
  delete: (id: number) => db.places.delete(id),
  getFavorites: () => db.places.where('isFavorite').equals(1).toArray(),
  search: (query: string) => db.places.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  ).toArray(),
};

export const cravingsApi = {
  getAll: () => db.cravings.toArray(),
  getById: (id: number) => db.cravings.get(id),
  add: (craving: Omit<Craving, 'id'>) => db.cravings.add(craving),
  update: (id: number, changes: Partial<Craving>) => db.cravings.update(id, changes),
  delete: (id: number) => db.cravings.delete(id),
  getByCategory: (category: string) => db.cravings.where('category').equals(category).toArray(),
};

export const historyApi = {
  getAll: () => db.history.orderBy('createdAt').reverse().toArray(),
  add: (entry: Omit<HistoryEntry, 'id'>) => db.history.add(entry),
  clear: () => db.history.clear(),
  getRecent: (limit: number) => db.history.orderBy('createdAt').reverse().limit(limit).toArray(),
};

export const settingsApi = {
  get: () => db.settings.get(1),
  update: (changes: Partial<AppSettings>) => db.settings.update(1, changes),
};