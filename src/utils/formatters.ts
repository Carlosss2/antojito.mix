import {
  UtensilsCrossed,
  Coffee,
  Fish,
  Salad,
  Cookie,
  Sandwich,
} from 'lucide-react';

export const formatPriceRange = (range: string): string => {
  const ranges: Record<string, string> = {
    '$': 'Económico ($)',
    '$$': 'Moderado ($$)',
    '$$$': 'Premium ($$$)',
    '$$$$': 'Lujo ($$$$)',
  };
  return ranges[range] || range;
};

export const getCategoryIcon = (category: string) => {
  const icons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    'Postres': UtensilsCrossed,
    'Tacos': UtensilsCrossed,
    'Cafetería': Coffee,
    'Japonesa': Fish,
    'Saludable': Salad,
    'Desayuno': Cookie,
    'Comida Rápida': Sandwich,
  };
  return icons[category] || UtensilsCrossed;
};

export const getCravingIcon = (iconName: string) => {
  const icons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    'utensils-crossed': UtensilsCrossed,
    'salad': Salad,
    'cookie': Cookie,
    'heart': UtensilsCrossed,
    'sandwich': Sandwich,
    'coffee': Coffee,
  };
  return icons[iconName] || UtensilsCrossed;
};