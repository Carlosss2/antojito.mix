export interface MenuItem {
  name: string;
  price: number;
}

export interface Place {
  id?: number;
  name: string;
  category: string;
  vibe: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  tags: string[];
  addressOrNotes?: string;
  zone?: string;
  rating?: number;
  isFavorite: boolean;
  menuItems: MenuItem[];
  createdAt: Date;
}

export interface Craving {
  id?: number;
  name: string;
  iconName: string;
  category: string;
  tags: string[];
  vibes: string[];
}

export interface BlenderState {
  cravingType: string;
  mood: string;
  timeOfDay: string;
  company: string;
  budget: string;
  zone: string;
}

export interface BlenderResult {
  places: Place[];
  craving: Craving;
  timestamp: Date;
}

export interface AppSettings {
  id: number;
  theme: 'light' | 'dark' | 'system';
  animationsEnabled: boolean;
  soundEnabled: boolean;
  language: 'es' | 'en';
}

export interface HistoryEntry {
  id?: number;
  result: BlenderResult;
  createdAt: Date;
}

export type PriceRange = '$' | '$$' | '$$$' | '$$$$';

export const PRICE_RANGES: { value: PriceRange; label: string }[] = [
  { value: '$', label: 'Económico ($)' },
  { value: '$$', label: 'Moderado ($$)' },
  { value: '$$$', label: 'Premium ($$$)' },
  { value: '$$$$', label: 'Lujo ($$$$)' },
];

export const CRAVING_CATEGORIES = [
  'Desayuno',
  'Almuerzo',
  'Cena',
  'Postre',
  'Snack',
  'Bebida',
  'Comida Rápida',
  'Saludable',
] as const;

export const ZONES = [
  { value: 'all', label: 'Todos los municipios', icon: 'globe' },
  { value: 'tuxtla-gutierrez', label: 'Tuxtla Gutiérrez', icon: 'map-pin' },
  { value: 'san-cristobal', label: 'San Cristóbal de las Casas', icon: 'landmark' },
  { value: 'comitan', label: 'Comitán de Domínguez', icon: 'tree-pine' },
  { value: 'tapachula', label: 'Tapachula', icon: 'sun' },
  { value: 'palenque', label: 'Palenque', icon: 'gem' },
  { value: 'pichucalco', label: 'Pichucalco', icon: 'flower' },
  { value: 'ocosingo', label: 'Ocosingo', icon: 'mountain' },
  { value: 'huitiupan', label: 'Huitiupán', icon: 'home' },
  { value: 'simojovel', label: 'Simojovel', icon: 'leaf' },
  { value: 'chilon', label: 'Chilón', icon: 'wheat' },
  { value: 'bachajon', label: 'Bachajón', icon: 'church' },
  { value: 'tenejapa', label: 'Tenejapa', icon: 'users' },
  { value: 'chenalho', label: 'Chenalhó', icon: 'heart' },
  { value: 'larrainzar', label: 'Larráinzar', icon: 'star' },
  { value: 'chamula', label: 'Chamula', icon: 'candle' },
  { value: 'zinacantan', label: 'Zinacantán', icon: 'shirt' },
] as const;

export const MOODS = [
  { value: 'feliz', label: 'Feliz', icon: 'smile' },
  { value: 'triste', label: 'Triste', icon: 'frown' },
  { value: 'estresado', label: 'Estresado', icon: 'zap' },
  { value: 'romantico', label: 'Romántico', icon: 'heart' },
  { value: 'aburrido', label: 'Aburrido', icon: 'circle' },
  { value: 'energetico', label: 'Enérgico', icon: 'zap' },
  { value: 'relajado', label: 'Relajado', icon: 'leaf' },
  { value: 'anhelante', label: 'Con antojo', icon: 'utensils' },
] as const;

export const TIME_OF_DAY = [
  { value: 'manana', label: 'Mañana', icon: 'sunrise' },
  { value: 'mediodia', label: 'Mediodía', icon: 'sun' },
  { value: 'tarde', label: 'Tarde', icon: 'cloud-sun' },
  { value: 'noche', label: 'Noche', icon: 'moon' },
  { value: 'madrugada', label: 'Madrugada', icon: 'moon-star' },
] as const;

export const COMPANY = [
  { value: 'solo', label: 'Solo', icon: 'user' },
  { value: 'pareja', label: 'Pareja', icon: 'users' },
  { value: 'amigos', label: 'Amigos', icon: 'users' },
  { value: 'familia', label: 'Familia', icon: 'home' },
  { value: 'mascota', label: 'Con mascota', icon: 'bone' },
] as const;