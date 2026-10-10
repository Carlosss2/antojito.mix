import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2, Clock, Heart, Star, DollarSign, RotateCcw } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useHistory } from '../hooks/useDatabase';
import { formatPriceRange, getCategoryIcon, getCravingIcon } from '../utils/formatters';

export const HistoryPage = ({ onBack }: { onBack: () => void }) => {
  const { history, loading, clearHistory } = useHistory();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClear = async () => {
    await clearHistory();
    setShowClearConfirm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background pb-12"
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <motion.button
            onClick={onBack}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-text-secondary hover:text-rose-500 transition-colors"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver</span>
          </motion.button>
          <div className="text-center flex-1">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-4xl md:text-5xl font-bold text-text-primary mb-1"
            >
              Historial
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-text-secondary"
            >
              {history.length} mezclas realizadas
            </motion.p>
          </div>
          {history.length > 0 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-2 text-rose-500 hover:text-rose-600"
              aria-label="Limpiar historial"
            >
              <Trash2 className="w-5 h-5" />
              <span className="font-medium hidden sm:inline">Limpiar</span>
            </motion.button>
          )}
        </div>

        <AnimatePresence>
          {showClearConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
              onClick={() => setShowClearConfirm(false)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="clear-title"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6"
              >
                <h2 id="clear-title" className="font-serif text-2xl font-bold text-text-primary mb-4 text-center">
                  ¿Limpiar historial?
                </h2>
                <p className="text-text-secondary text-center mb-6">
                  Esta acción eliminará todo tu historial de mezclas y no se puede deshacer.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setShowClearConfirm(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button variant="secondary" onClick={handleClear} className="flex-1">
                    Sí, limpiar todo
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="space-y-4" aria-busy="true">
            {[...Array(5)].map((_, i) => (
              <Card key={i} variant="glass" padding="md" className="animate-pulse">
                <div className="h-5 w-1/3 bg-rose-100/50 rounded mb-3" />
                <div className="h-4 w-full bg-rose-100/50 rounded mb-2" />
                <div className="h-4 w-2/3 bg-rose-100/50 rounded" />
              </Card>
            ))}
          </div>
        ) : history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Card variant="glass" padding="lg" className="max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-text-primary mb-2">
                Historial vacío
              </h3>
              <p className="text-text-secondary mb-6">
                Tus mezclas anteriores aparecerán aquí para que puedas recordar tus descubrimientos favoritos.
              </p>
              <Button onClick={onBack} size="lg" variant="primary">
                <RotateCcw className="w-5 h-5 mr-2" />
                Hacer una mezcla
              </Button>
            </Card>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              key="history-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {history.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card variant="glass" padding="md" hover>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                          <CravingIcon iconName={entry.result.craving.iconName} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif text-lg font-semibold text-text-primary">
                              {entry.result.craving.name}
                            </h4>
                            <span className="px-2 py-0.5 text-xs bg-pink-50 text-rose-600 rounded-full">
                              {entry.result.craving.category}
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            {new Date(entry.createdAt).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {entry.result.places.map((place, i) => (
                        <motion.div
                          key={place.id || i}
                          layout
                          className="p-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-rose-100"
                        >
                          <div className="flex items-start gap-2">
                            <CategoryIcon category={place.category} />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-text-primary truncate">{place.name}</h5>
                              <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary">
                                <span className="flex items-center gap-1 px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded-full">
                                  <DollarSign className="w-2.5 h-2.5" />
                                  {formatPriceRange(place.priceRange)}
                                </span>
                                {place.rating && (
                                  <span className="flex items-center gap-1 text-amber-500">
                                    <Star className="w-2.5 h-2.5 fill-current" />
                                    {place.rating}
                                  </span>
                                )}
                                {place.isFavorite && (
                                  <span className="text-rose-500">
                                    <Heart className="w-3 h-3 fill-current" />
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

const CategoryIcon = ({ category }: { category: string }) => {
  const Icon = getCategoryIcon(category);
  return <Icon className="w-6 h-6 text-rose-500" />;
};

const CravingIcon = ({ iconName }: { iconName: string }) => {
  const Icon = getCravingIcon(iconName);
  return <Icon className="w-7 h-7 text-rose-500" />;
};