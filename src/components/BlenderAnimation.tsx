import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Heart } from 'lucide-react';

interface BlenderAnimationProps {
  isBlending: boolean;
  result?: { places: { name: string; iconName?: string }[] } | null;
}

export const BlenderAnimation = ({ isBlending, result }: BlenderAnimationProps) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[400px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={isBlending ? 'blending' : 'idle'}
          animate={isBlending ? { rotate: [0, -5, 5, -3, 3, -1, 1, 0], scale: [1, 1.05, 0.98, 1.02, 1] } : { rotate: 0, scale: 1 }}
          transition={isBlending ? { duration: 2.5, ease: 'easeInOut', repeat: Infinity } : { duration: 0.6, ease: 'easeOut' }}
          className="relative z-10"
        >
          <div className="relative w-48 h-64">
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-4 rounded-b-2xl bg-gradient-to-r from-pink-300 to-purple-300"
            />
            <motion.div
              animate={isBlending ? { height: ['0%', '30%', '60%', '85%', '100%'], opacity: [0, 0.4, 0.7, 0.9, 1] } : { height: 0, opacity: 0 }}
              transition={isBlending ? { duration: 2, ease: 'easeOut' } : undefined}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-full rounded-b-2xl bg-gradient-to-t from-pink-400/60 via-purple-400/40 to-transparent"
            />
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-2 bg-gradient-to-r from-pink-200 to-purple-200 rounded-t-full"
            />
            <motion.div
              className="absolute top-4 left-1/2 -translate-x-1/2 w-36 h-8 rounded-t-2xl border-4 border-rose-200 bg-white/50 backdrop-blur-sm"
            />
            <motion.div
              className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-3 rounded-full bg-gradient-to-r from-pink-300 to-purple-300"
            />
          </div>
        </motion.div>

        <AnimatePresence>
          {isBlending && (
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.5 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 w-28 h-32 pointer-events-none overflow-hidden rounded-2xl"
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 100, scale: 0 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.5 }}
                  transition={{ delay: i * 0.15, duration: 0.5, ease: 'easeOut' }}
                  className="absolute rounded-full bg-white/30"
                  style={{
                    left: `${Math.random() * 80}%`,
                    bottom: `${Math.random() * 20}%`,
                    width: `${8 + Math.random() * 16}px`,
                    height: `${8 + Math.random() * 16}px`,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isBlending && (
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 2.2, duration: 0.5, ease: 'easeOut' }}
              className="absolute inset-0 pointer-events-none"
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 2.2 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
                  className="absolute text-yellow-300"
                  style={{
                    left: `${15 + Math.random() * 70}%`,
                    top: `${20 + Math.random() * 60}%`,
                    fontSize: `${16 + Math.random() * 12}px`,
                  }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!isBlending && result && result.places.length > 0 && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 2.5 }}
              className="relative z-20 w-full max-w-md mt-8"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-6 border border-pink-100 shadow-glass"
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-rose-500"
                  >
                    <Heart className="w-8 h-8 fill-current" />
                  </motion.div>
                  <h3 className="font-serif text-2xl font-semibold text-text-primary">
                    ¡Tu antojo está listo!
                  </h3>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                    className="text-rose-500"
                  >
                    <Heart className="w-8 h-8 fill-current" />
                  </motion.div>
                </div>
                <div className="space-y-3">
                  {result.places.map((place, i) => (
                    <motion.div
                      key={place.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2.8 + i * 0.2, duration: 0.4 }}
                      className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-pink-100"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-rose-500" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-text-primary">{place.name}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isBlending && !result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-text-secondary mt-8"
          >
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-pink-300 animate-spin" />
            <p className="font-serif text-lg">Configura tu antojo y presiona mezclar</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};