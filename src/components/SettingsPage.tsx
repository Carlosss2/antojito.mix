import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Moon, Sun, Monitor, Zap, Volume2, Globe, Palette, Save } from 'lucide-react';
import { Card } from './ui/Card';
import { useSettingsContext } from '../context/SettingsContext';
import type { AppSettings } from '../types';

export const SettingsPage = ({ onBack }: { onBack: () => void }) => {
  const { settings, updateSettings, theme } = useSettingsContext();
  const [saved, setSaved] = useState(false);

  const handleSave = async (changes: Partial<AppSettings>) => {
    await updateSettings(changes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background pb-12"
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
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
            Configuración
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary"
          >
            Personaliza tu experiencia en Antojito
          </motion.p>
        </div>

        <div className="space-y-6">
          <Card variant="glass" padding="lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <Palette className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-semibold text-text-primary">Apariencia</h2>
                <p className="text-sm text-text-secondary">Elige cómo se ve la app</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'light', label: 'Claro', icon: Sun, desc: 'Siempre claro' },
                { value: 'dark', label: 'Oscuro', icon: Moon, desc: 'Siempre oscuro' },
                { value: 'system', label: 'Sistema', icon: Monitor, desc: 'Sigue tu dispositivo' },
              ].map(({ value, label, icon: Icon, desc }) => (
                <button
                  key={value}
                  onClick={() => handleSave({ theme: value as any })}
                  className={`relative p-4 rounded-2xl border-2 transition-all ${
                    theme === value
                      ? 'border-rose-400 bg-rose-50 shadow-glass'
                      : 'border-rose-100 hover:border-rose-300 hover:bg-white/50'
                  }`}
                  aria-pressed={theme === value}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon className={`w-6 h-6 ${theme === value ? 'text-rose-500' : 'text-text-secondary'}`} />
                  </div>
                  <p className={`font-medium text-center ${theme === value ? 'text-rose-600' : 'text-text-primary'}`}>
                    {label}
                  </p>
                  <p className="text-xs text-center text-text-secondary mt-1">{desc}</p>
                  {theme === value && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </Card>

          <Card variant="glass" padding="lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-semibold text-text-primary">Animaciones</h2>
                <p className="text-sm text-text-secondary">Controla los efectos visuales</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-2xl border border-rose-100 hover:bg-white/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">Animaciones fluidas</p>
                    <p className="text-sm text-text-secondary">Transiciones y efectos visuales</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings?.animationsEnabled ?? true}
                  onChange={e => handleSave({ animationsEnabled: e.target.checked })}
                  className="w-6 h-6 text-rose-500 border-rose-300 rounded focus:ring-rose-400 accent-rose-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl border border-rose-100 hover:bg-white/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Volume2 className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">Sonidos</p>
                    <p className="text-sm text-text-secondary">Efectos de sonido en interacciones</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings?.soundEnabled ?? true}
                  onChange={e => handleSave({ soundEnabled: e.target.checked })}
                  className="w-6 h-6 text-rose-500 border-rose-300 rounded focus:ring-rose-400 accent-rose-500"
                />
              </label>
            </div>
          </Card>

          <Card variant="glass" padding="lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-semibold text-text-primary">Idioma</h2>
                <p className="text-sm text-text-secondary">Configura tu idioma preferido</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'es', label: 'Español', code: 'ES' },
                { value: 'en', label: 'English', code: 'EN' },
              ].map(({ value, label, code }) => (
                <button
                  key={value}
                  onClick={() => handleSave({ language: value as any })}
                  className={`p-4 rounded-2xl border-2 transition-all text-left ${
                    settings?.language === value
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-rose-100 hover:border-rose-300 hover:bg-white/50'
                  }`}
                  aria-pressed={settings?.language === value}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-sm font-bold text-blue-600">
                      {code}
                    </span>
                    <div>
                      <p className={`font-medium ${settings?.language === value ? 'text-blue-600' : 'text-text-primary'}`}>
                        {label}
                      </p>
                    </div>
                  </div>
                  {settings?.language === value && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </Card>

          <Card variant="glass" padding="lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                <Save className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-semibold text-text-primary">Acerca de</h2>
                <p className="text-sm text-text-secondary">Información de la aplicación</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-text-secondary">
              <div className="flex justify-between py-2 border-b border-rose-100">
                <span>Versión</span>
                <span className="font-medium text-text-primary">1.0.0</span>
              </div>
              <div className="flex justify-between py-2 border-b border-rose-100">
                <span>Stack</span>
                <span className="font-medium text-text-primary">React + Vite + TypeScript</span>
              </div>
              <div className="flex justify-between py-2 border-b border-rose-100">
                <span>Base de datos</span>
                <span className="font-medium text-text-primary">IndexedDB (Dexie.js)</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Licencia</span>
                <span className="font-medium text-text-primary">MIT</span>
              </div>
            </div>
          </Card>

          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-2xl shadow-lg"
            >
              <Save className="w-5 h-5" />
              <span>Cambios guardados</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};