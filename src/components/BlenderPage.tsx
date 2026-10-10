import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shuffle, Sparkles, Heart, MapPin, Star, DollarSign } from 'lucide-react';
import { BlenderAnimation } from './BlenderAnimation';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Select } from './ui/Select';
import { useBlender } from '../hooks/useBlender';
import type { BlenderState, Place } from '../types';
import { PRICE_RANGES, ZONES } from '../types';
import { getCategoryIcon } from '../utils/formatters';

export const BlenderPage = ({ onBack }: { onBack: () => void }) => {
  const { blend, result, isBlending, error, isReady, categories, moods, timeOfDay, company, zones } = useBlender();
  const [state, setState] = useState<BlenderState>({
    cravingType: categories[0],
    mood: moods[0].value,
    timeOfDay: timeOfDay[0].value,
    company: company[0].value,
    budget: '$$',
    zone: 'all',
  });

  const handleBlend = async () => {
    if (!isReady) return;
    await blend(state);
  };

  const formatPriceRange = (range: string) => {
    const found = PRICE_RANGES.find(p => p.value === range as any);
    return found ? found.label : range;
  };

  const CategoryIcon = ({ category }: { category: string }) => {
    const Icon = getCategoryIcon(category);
    return <Icon className="w-7 h-7 text-rose-500" />;
  };

  const renderPlaceCard = (place: Place) => (
    <Card key={place.id} variant="glass" padding="md" hover className="group">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center flex-shrink-0">
          <CategoryIcon category={place.category} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-serif text-lg font-semibold text-text-primary truncate">{place.name}</h4>
            <span className="text-rose-400 flex-shrink-0">
              <Heart className="w-5 h-5 fill-current" />
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-1">{place.category} • {place.vibe}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary">
            <span className="flex items-center gap-1 px-2 py-1 bg-rose-50 rounded-full">
              <DollarSign className="w-3 h-3" />
              {formatPriceRange(place.priceRange)}
            </span>
            {place.rating && (
              <span className="flex items-center gap-1 text-amber-500">
                <Star className="w-3 h-3 fill-current" />
                {place.rating}
              </span>
            )}
            {place.zone && (
              <span className="flex items-center gap-1 px-2 py-1 bg-purple-50 rounded-full text-purple-600">
                <MapPin className="w-3 h-3" />
                {ZONES.find(z => z.value === place.zone)?.label || place.zone}
              </span>
            )}
          </div>
          {place.addressOrNotes && (
            <p className="mt-2 text-sm text-text-secondary flex items-center gap-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{place.addressOrNotes}</span>
            </p>
          )}
          {place.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {place.tags.slice(0, 4).map(tag => (
                <span key={tag} className="px-2 py-0.5 text-xs bg-pink-50 text-rose-600 rounded-full">
                  {tag}
                </span>
              ))}
              {place.tags.length > 4 && (
                <span className="px-2 py-0.5 text-xs bg-pink-50 text-rose-400 rounded-full">
                  +{place.tags.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background pb-12"
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.button
          onClick={onBack}
          whileTap={{ scale: 0.95 }}
          className="mb-6 flex items-center gap-2 text-text-secondary hover:text-rose-500 transition-colors"
          aria-label="Volver"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Volver</span>
        </motion.button>

        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-5xl font-bold text-text-primary mb-3"
          >
            Licuadora de Antojos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg"
          >
            Mezcla tu estado de ánimo y descubre tu próximo destino perfecto
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            <Card variant="glass" padding="lg" className="sticky top-24">
              <h2 className="font-serif text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-400" />
                Configura tu antojo
              </h2>

              <div className="space-y-5">
                <Select
                  label="Tipo de antojo"
                  value={state.cravingType}
                  onChange={(e) => setState(prev => ({ ...prev, cravingType: e.target.value }))}
                  options={categories.map(c => ({ value: c, label: c }))}
                  placeholder="Selecciona..."
                />

                <Select
                  label="Tu estado de ánimo"
                  value={state.mood}
                  onChange={(e) => setState(prev => ({ ...prev, mood: e.target.value }))}
                  options={moods.map(m => ({ value: m.value, label: m.label }))}
                  placeholder="¿Cómo te sientes?"
                />

                <Select
                  label="Momento del día"
                  value={state.timeOfDay}
                  onChange={(e) => setState(prev => ({ ...prev, timeOfDay: e.target.value }))}
                  options={timeOfDay.map(t => ({ value: t.value, label: t.label }))}
                  placeholder="¿Qué hora es?"
                />

                <Select
                  label="Compañía"
                  value={state.company}
                  onChange={(e) => setState(prev => ({ ...prev, company: e.target.value }))}
                  options={company.map(c => ({ value: c.value, label: c.label }))}
                  placeholder="¿Con quién vas?"
                />

                <Select
                  label="Zona / Ubicación"
                  value={state.zone}
                  onChange={(e) => setState(prev => ({ ...prev, zone: e.target.value }))}
                  options={zones.map(z => ({ value: z.value, label: z.label }))}
                  placeholder="¿En qué zona estás?"
                />

                <Select
                  label="Presupuesto"
                  value={state.budget}
                  onChange={(e) => setState(prev => ({ ...prev, budget: e.target.value as any }))}
                  options={PRICE_RANGES.map(p => ({ value: p.value, label: p.label }))}
                  placeholder="Define tu presupuesto"
                />
              </div>

              <Button
                onClick={handleBlend}
                disabled={isBlending || !isReady}
                isLoading={isBlending}
                size="lg"
                className="w-full mt-6"
              >
                <Shuffle className="w-5 h-5 mr-2" />
                {isBlending ? 'Mezclando...' : '¡Mezclar Antojo!'}
              </Button>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm text-rose-500 mt-4"
                  role="alert"
                >
                  {error}
                </motion.p>
              )}
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <BlenderAnimation
              isBlending={isBlending}
              result={result}
            />
          </motion.div>
        </div>

        {result && !isBlending && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10"
          >
            <h3 className="font-serif text-2xl font-semibold text-text-primary text-center mb-6">
              Sugerencias para ti
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {result.places.map(renderPlaceCard)}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};