import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Settings, Sparkles, AlertTriangle } from 'lucide-react';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { BlenderPage } from './components/BlenderPage';
import { PlacesPage } from './components/PlacesPage';
import { HistoryPage } from './components/HistoryPage';
import { SettingsPage } from './components/SettingsPage';
import { SettingsProvider } from './context/SettingsContext';
import { useDatabase } from './hooks/useDatabase';

type Page = 'home' | 'blender' | 'places' | 'history' | 'settings';

const navigation = [
  { id: 'blender', label: 'Mezclar', icon: Sparkles },
  { id: 'places', label: 'Lugares', icon: MapPin },
  { id: 'history', label: 'Historial', icon: Clock },
  { id: 'settings', label: 'Ajustes', icon: Settings },
] as const;

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { isReady, error } = useDatabase();

  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-serif text-xl text-text-primary">Cargando AntojoMix...</p>
          <p className="text-text-secondary mt-2">Preparando tu licuadora de antojos</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card variant="glass" padding="lg" className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-text-primary mb-2">Error al cargar</h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} size="lg">
            Reintentar
          </Button>
        </Card>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'blender':
        return <BlenderPage onBack={() => setCurrentPage('home')} />;
      case 'places':
        return <PlacesPage onBack={() => setCurrentPage('home')} />;
      case 'history':
        return <HistoryPage onBack={() => setCurrentPage('home')} />;
      case 'settings':
        return <SettingsPage onBack={() => setCurrentPage('home')} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, x: currentPage === 'home' ? 0 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-background"
      >
        {renderPage()}
      </motion.div>
    </AnimatePresence>
  );
}

function HomePage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-text-primary mb-4">
            Antojito
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
            Tu guía personal de antojos. Mezcla tu estado de ánimo, momento del día y compañía para descubrir el lugar perfecto.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-16"
        >
          {navigation.map((item, index) => (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -4 }}
              onClick={() => onNavigate(item.id as Page)}
              className="group relative p-6 rounded-3xl bg-white/80 backdrop-blur-sm border border-rose-100 shadow-xl shadow-rose-100/50 transition-all"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mb-4 group-hover:from-pink-200 group-hover:to-purple-200 transition-colors">
                <item.icon className="w-7 h-7 text-rose-500 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-text-primary">{item.label}</h3>
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <Card variant="glass" padding="lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold text-text-primary">¿Cómo funciona?</h3>
                <p className="text-sm text-text-secondary">3 pasos para encontrar tu antojo perfecto</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl font-bold text-rose-500">1</span>
                </div>
                <h4 className="font-medium text-text-primary mb-1">Configura</h4>
                <p className="text-sm text-text-secondary">Elige tu antojo, estado de ánimo, hora y compañía</p>
              </div>
              <div className="p-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl font-bold text-rose-500">2</span>
                </div>
                <h4 className="font-medium text-text-primary mb-1">Mezcla</h4>
                <p className="text-sm text-text-secondary">Presiona el botón y deja que la licuadora haga su magia</p>
              </div>
              <div className="p-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl font-bold text-rose-500">3</span>
                </div>
                <h4 className="font-medium text-text-primary mb-1">Disfruta</h4>
                <p className="text-sm text-text-secondary">Descubre 3 sugerencias personalizadas para ti</p>
              </div>
            </div>
          </Card>

          
        </motion.div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}