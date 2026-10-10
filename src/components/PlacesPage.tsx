import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search, Heart, Star, MapPin, DollarSign, Edit, Trash2, MapPin as MapPinIcon, Utensils, Trash } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { usePlaces } from '../hooks/useDatabase';
import type { Place, MenuItem } from '../types';
import { PRICE_RANGES, CRAVING_CATEGORIES, ZONES } from '../types';
import { sanitizeText } from '../lib/security';
import { getCategoryIcon } from '../utils/formatters';

export const PlacesPage = ({ onBack }: { onBack: () => void }) => {
  const { places, loading, addPlace, updatePlace, deletePlace, toggleFavorite } = usePlaces();
  const [showForm, setShowForm] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterFavorite, setFilterFavorite] = useState<boolean | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    vibe: '',
    priceRange: '$$' as any,
    tags: '',
    addressOrNotes: '',
    zone: '',
    rating: 5,
    isFavorite: false,
    menuItems: [] as MenuItem[],
  });

  const [newMenuItem, setNewMenuItem] = useState({ name: '', price: '' });

  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || place.category === filterCategory;
    const matchesZone = filterZone === 'all' || place.zone === filterZone;
    const matchesFavorite = filterFavorite === null || place.isFavorite === filterFavorite;
    return matchesSearch && matchesCategory && matchesZone && matchesFavorite;
  });

  const categories = [...new Set(places.map(p => p.category))];

  const addMenuItem = () => {
    if (newMenuItem.name.trim() && newMenuItem.price.trim()) {
      setFormData(prev => ({
        ...prev,
        menuItems: [...prev.menuItems, { name: sanitizeText(newMenuItem.name.trim()), price: parseFloat(newMenuItem.price) }],
      }));
      setNewMenuItem({ name: '', price: '' });
    }
  };

  const removeMenuItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      menuItems: prev.menuItems.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: sanitizeText(formData.name),
      category: sanitizeText(formData.category) || 'General',
      vibe: sanitizeText(formData.vibe) || 'Acogedor',
      priceRange: formData.priceRange,
      tags: formData.tags.split(',').map(t => sanitizeText(t.trim())).filter(Boolean),
      addressOrNotes: formData.addressOrNotes ? sanitizeText(formData.addressOrNotes) : undefined,
      zone: formData.zone || undefined,
      rating: formData.rating,
      isFavorite: formData.isFavorite,
      menuItems: formData.menuItems,
      createdAt: new Date(),
    };

    if (editingPlace) {
      await updatePlace(editingPlace.id!, data);
    } else {
      await addPlace(data);
    }
    resetForm();
  };

  const handleEdit = (place: Place) => {
    setEditingPlace(place);
    setFormData({
      name: place.name,
      category: place.category,
      vibe: place.vibe,
      priceRange: place.priceRange,
      tags: place.tags.join(', '),
      addressOrNotes: place.addressOrNotes || '',
      zone: place.zone || '',
      rating: place.rating || 5,
      isFavorite: place.isFavorite,
      menuItems: place.menuItems || [],
    });
    setNewMenuItem({ name: '', price: '' });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este lugar?')) {
      await deletePlace(id);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      vibe: '',
      priceRange: '$$',
      tags: '',
      addressOrNotes: '',
      zone: '',
      rating: 5,
      isFavorite: false,
      menuItems: [],
    });
    setNewMenuItem({ name: '', price: '' });
    setEditingPlace(null);
    setShowForm(false);
  };

  const formatPriceRange = (range: string) => {
    const found = PRICE_RANGES.find(p => p.value === range as any);
    return found ? found.label : range;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(price);
  };

  const CategoryIcon = ({ category }: { category: string }) => {
    const Icon = getCategoryIcon(category);
    return <Icon className="w-6 h-6 text-rose-500" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background pb-12"
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <motion.button
            onClick={onBack}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-text-secondary hover:text-rose-500 transition-colors"
            aria-label="Volver"
          >
            <MapPinIcon className="w-5 h-5" />
            <span className="font-medium">Volver</span>
          </motion.button>
          <div className="text-center flex-1">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-4xl md:text-5xl font-bold text-text-primary mb-1"
            >
              Mis Lugares
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-text-secondary"
            >
              {places.length} lugares guardados
            </motion.p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { setEditingPlace(null); resetForm(); setShowForm(true); }}
            className="flex items-center gap-2"
            aria-label="Agregar lugar"
          >
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Nuevo Lugar
            </Button>
          </motion.button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
              onClick={() => setShowForm(false)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="form-title"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 id="form-title" className="font-serif text-2xl font-bold text-text-primary">
                    {editingPlace ? 'Editar Lugar' : 'Nuevo Lugar'}
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 rounded-xl text-text-secondary hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    aria-label="Cerrar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Nombre del lugar"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: La Panadería Rosa"
                    required
                    maxLength={100}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Categoría"
                      value={formData.category}
                      onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      options={[
                        ...CRAVING_CATEGORIES.map(c => ({ value: c, label: c })),
                        ...categories.filter(c => !CRAVING_CATEGORIES.includes(c as any)).map(c => ({ value: c, label: c })),
                      ]}
                      placeholder="Selecciona..."
                    />
                    <Select
                      label="Ambiente"
                      value={formData.vibe}
                      onChange={e => setFormData(prev => ({ ...prev, vibe: e.target.value }))}
                      options={[
                        { value: 'Acogedor', label: 'Acogedor' },
                        { value: 'Aesthetic', label: 'Aesthetic' },
                        { value: 'Romántico', label: 'Romántico' },
                        { value: 'Divertido', label: 'Divertido' },
                        { value: 'Relajado', label: 'Relajado' },
                        { value: 'Elegante', label: 'Elegante' },
                        { value: 'Casual', label: 'Casual' },
                        { value: 'Rápido', label: 'Rápido' },
                        { value: 'Fresco', label: 'Fresco' },
                        { value: 'Auténtico', label: 'Auténtico' },
                      ]}
                      placeholder="Selecciona..."
                    />
                  </div>

                  <Select
                    label="Rango de precio"
                    value={formData.priceRange}
                    onChange={e => setFormData(prev => ({ ...prev, priceRange: e.target.value as any }))}
                    options={PRICE_RANGES.map(p => ({ value: p.value, label: p.label }))}
                  />

                  <Select
                    label="Ciudad / Municipio"
                    value={formData.zone}
                    onChange={e => setFormData(prev => ({ ...prev, zone: e.target.value }))}
                    options={ZONES.filter(z => z.value !== 'all').map(z => ({ value: z.value, label: z.label }))}
                    placeholder="Selecciona una ciudad..."
                  />

                  <Input
                    label="Etiquetas (separadas por comas)"
                    value={formData.tags}
                    onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="Ej: café, wifi, terraza, vegano"
                    helperText="Máximo 10 etiquetas"
                  />

                  <Input
                    label="Dirección o notas"
                    value={formData.addressOrNotes}
                    onChange={e => setFormData(prev => ({ ...prev, addressOrNotes: e.target.value }))}
                    placeholder="Dirección, teléfono, notas personales..."
                    maxLength={500}
                  />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-text-primary">Menú y Precios</label>
                      <span className="text-xs text-text-secondary">Agrega platillos con sus precios</span>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        label="Platillo"
                        value={newMenuItem.name}
                        onChange={e => setNewMenuItem(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ej: Tacos al pastor"
                        className="flex-1"
                      />
                      <Input
                        label="Precio (MXN)"
                        type="number"
                        value={newMenuItem.price}
                        onChange={e => setNewMenuItem(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="50"
                        className="w-28"
                        step="0.5"
                        min="0"
                      />
                      <Button type="button" onClick={addMenuItem} variant="outline" className="self-end">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {formData.menuItems.length > 0 && (
                      <div className="space-y-2">
                        {formData.menuItems.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl">
                            <Utensils className="w-5 h-5 text-rose-500 flex-shrink-0" />
                            <span className="flex-1 font-medium text-text-primary">{item.name}</span>
                            <span className="font-semibold text-rose-600">{formatPrice(item.price)}</span>
                            <button
                              type="button"
                              onClick={() => removeMenuItem(index)}
                              className="p-1 text-text-secondary hover:text-rose-500 transition-colors"
                              aria-label={`Eliminar ${item.name}`}
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Calificación</label>
                    <div className="flex items-center gap-4">
                      {[1,2,3,4,5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                          className={`p-1 transition-colors ${
                            formData.rating >= star ? 'text-amber-400' : 'text-rose-100'
                          } hover:scale-110`}
                          aria-label={`${star} estrellas`}
                        >
                          <Star className="w-6 h-6 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFavorite}
                      onChange={e => setFormData(prev => ({ ...prev, isFavorite: e.target.checked }))}
                      className="w-5 h-5 text-rose-500 border-rose-300 rounded focus:ring-rose-400 accent-rose-500"
                    />
                    <span className="text-text-primary">Marcar como favorito</span>
                  </label>

                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                      Cancelar
                    </Button>
                    <Button type="submit" size="md" className="flex-1">
                      {editingPlace ? 'Guardar Cambios' : 'Agregar Lugar'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <Card variant="glass" padding="md">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Buscar lugares..."
                    className="w-full pl-10 pr-4 py-3 bg-white/60 backdrop-blur-sm border-2 border-rose-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-text-primary placeholder-text-secondary"
                  />
                </div>
                <Select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  options={[
                    { value: 'all', label: 'Todas las categorías' },
                    ...categories.map(c => ({ value: c, label: c })),
                  ]}
                  className="w-full md:w-48"
                />
                <Select
                  value={filterFavorite === null ? 'all' : filterFavorite.toString()}
                  onChange={e => setFilterFavorite(e.target.value === 'all' ? null : e.target.value === 'true')}
                  options={[
                    { value: 'all', label: 'Todos' },
                    { value: 'true', label: 'Solo favoritos' },
                    { value: 'false', label: 'No favoritos' },
                  ]}
                  className="w-full md:w-40"
                />
                <Select
                  value={filterZone}
                  onChange={e => setFilterZone(e.target.value)}
                  options={ZONES.map(z => ({ value: z.value, label: z.label }))}
                  className="w-full md:w-48"
                />
              </div>
            </Card>
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" aria-busy="true">
              {[...Array(6)].map((_, i) => (
                <Card key={i} variant="glass" padding="md" className="animate-pulse">
                  <div className="h-16 w-16 rounded-2xl bg-rose-100/50 mb-4" />
                  <div className="h-5 w-3/4 bg-rose-100/50 rounded mb-2" />
                  <div className="h-4 w-1/2 bg-rose-100/50 rounded" />
                </Card>
              ))}
            </div>
          ) : filteredPlaces.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Card variant="glass" padding="lg" className="max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
                  <MapPinIcon className="w-8 h-8 text-rose-500" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-text-primary mb-2">
                  {searchQuery || filterCategory !== 'all' || filterFavorite !== null
                    ? 'No se encontraron lugares'
                    : 'Aún no tienes lugares guardados'}
                </h3>
                <p className="text-text-secondary mb-6">
                  {searchQuery || filterCategory !== 'all' || filterFavorite !== null
                    ? 'Intenta cambiar tus filtros de búsqueda'
                    : 'Agrega tu primer lugar favorito para empezar'}
                </p>
                <Button onClick={() => { setEditingPlace(null); resetForm(); setShowForm(true); }} size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Agregar Lugar
                </Button>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredPlaces.map(place => (
                <motion.div key={place.id} layout>
                  <Card variant="glass" padding="md" hover>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                        <CategoryIcon category={place.category} />
                      </div>
                      <button
                        onClick={() => toggleFavorite(place.id!)}
                        className={`p-1 rounded-xl transition-colors ${
                          place.isFavorite
                            ? 'text-rose-500 bg-rose-50'
                            : 'text-text-secondary hover:text-rose-500 hover:bg-rose-50'
                        }`}
                        aria-label={place.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                      >
                        <Heart
                          className="w-5 h-5"
                          fill={place.isFavorite ? 'currentColor' : 'none'}
                          stroke="currentColor"
                        />
                      </button>
                    </div>
                    <h4 className="font-serif text-lg font-semibold text-text-primary mb-1 truncate">
                      {place.name}
                    </h4>
                    <p className="text-sm text-text-secondary mb-2">{place.category} • {place.vibe}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="flex items-center gap-1 px-2 py-1 bg-rose-50 text-rose-600 text-xs rounded-full">
                        <DollarSign className="w-3 h-3" />
                        {formatPriceRange(place.priceRange)}
                      </span>
                      {place.rating && (
                        <span className="flex items-center gap-1 text-amber-500 text-sm">
                          <Star className="w-3 h-3 fill-current" />
                          {place.rating}
                        </span>
                      )}
                    </div>
                    {place.addressOrNotes && (
                      <p className="text-xs text-text-secondary mb-3 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span>{place.addressOrNotes}</span>
                      </p>
                    )}
                    {place.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {place.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-0.5 text-xs bg-pink-50 text-rose-600 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {place.tags.length > 3 && (
                          <span className="px-2 py-0.5 text-xs bg-pink-50 text-rose-400 rounded-full">
                            +{place.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    {place.menuItems && place.menuItems.length > 0 && (
                      <div className="mb-3 pt-3 border-t border-rose-100">
                        <p className="text-xs font-medium text-text-secondary mb-2">Menú:</p>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                          {place.menuItems.slice(0, 5).map((item, index) => (
                            <div key={index} className="flex justify-between text-xs">
                              <span className="text-text-secondary truncate pr-2">{item.name}</span>
                              <span className="font-medium text-rose-600 whitespace-nowrap">{formatPrice(item.price)}</span>
                            </div>
                          ))}
                          {place.menuItems.length > 5 && (
                            <p className="text-xs text-rose-400 text-center">+{place.menuItems.length - 5} platillos más</p>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-2 border-t border-rose-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(place)}
                        className="flex-1 text-xs"
                        aria-label={`Editar ${place.name}`}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(place.id!)}
                        className="flex-1 text-xs text-rose-500 hover:bg-rose-50"
                        aria-label={`Eliminar ${place.name}`}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};