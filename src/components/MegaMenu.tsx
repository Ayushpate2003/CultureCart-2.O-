import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, MapPin, Star, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { stateToLanguage } from '@/i18n';

interface CraftCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  states: string[];
  subcategories: string[];
}

const craftCategories: CraftCategory[] = [
  {
    id: 'odisha',
    name: 'Odisha Crafts',
    icon: '🪔',
    description: 'Pattachitra, Silverware & Tribal Art',
    states: ['Odisha'],
    subcategories: ['Pattachitra', 'Silver Filigree', 'Tassar Silk', 'Stone Carving']
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan Crafts',
    icon: '🏺',
    description: 'Blue Pottery, Jewelry & Textiles',
    states: ['Rajasthan'],
    subcategories: ['Blue Pottery', 'Meenakari', 'Bandhani', 'Leather Work']
  },
  {
    id: 'gujarat',
    name: 'Gujarat Crafts',
    icon: '🧵',
    description: 'Patola Silk, Embroidery & Woodwork',
    states: ['Gujarat'],
    subcategories: ['Patola Silk', 'Kutch Embroidery', 'Wood Carving', 'Brass Work']
  },
  {
    id: 'kerala',
    name: 'Kerala Crafts',
    icon: '🎨',
    description: 'Coconut Shell Work & Handlooms',
    states: ['Kerala'],
    subcategories: ['Coconut Crafts', 'Aranmula Mirror', 'Handlooms', 'Bell Metal']
  },
  {
    id: 'west-bengal',
    name: 'West Bengal Crafts',
    icon: '🖼️',
    description: 'Bengali Terracotta & Dokra Art',
    states: ['West Bengal'],
    subcategories: ['Terracotta', 'Dokra', 'Kantha Stitch', 'Shola Craft']
  },
  {
    id: 'karnataka',
    name: 'Karnataka Crafts',
    icon: '🏛️',
    description: 'Bidriware, Sandalwood & Channapatna Toys',
    states: ['Karnataka'],
    subcategories: ['Bidriware', 'Sandalwood Carving', 'Channapatna Toys', 'Lacquerware']
  }
];

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose, triggerRef }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose, triggerRef]);

  const filteredCategories = craftCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.subcategories.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getLanguageForState = (state: string) => {
    return stateToLanguage[state] || 'en';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-full left-0 mt-2 w-screen max-w-6xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
        >
          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('nav.searchCrafts', 'Search crafts, artisans, or regions...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                >
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-primary transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{category.icon}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                          selectedCategory === category.id ? 'rotate-180' : ''
                        }`}
                      />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {category.name}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {category.description}
                    </p>

                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {category.states.join(', ')}
                      </span>
                    </div>

                    {/* Subcategories */}
                    <AnimatePresence>
                      {selectedCategory === category.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                            <div className="flex flex-wrap gap-2">
                              {category.subcategories.map((subcategory) => (
                                <Link
                                  key={subcategory}
                                  to={`/explore?category=${category.id}&subcategory=${subcategory.toLowerCase().replace(' ', '-')}`}
                                  onClick={onClose}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium hover:bg-primary hover:text-white transition-colors duration-200"
                                >
                                  {subcategory}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Quick Actions */}
                    <div className="flex gap-2 mt-4">
                      <Link
                        to={`/explore?state=${category.states[0]}`}
                        onClick={onClose}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors duration-200"
                      >
                        <Users className="w-4 h-4" />
                        {t('nav.exploreArtisans', 'Explore Artisans')}
                      </Link>
                      <Link
                        to={`/explore?category=${category.id}&featured=true`}
                        onClick={onClose}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-colors duration-200"
                      >
                        <Star className="w-4 h-4" />
                        {t('nav.featured', 'Featured')}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/explore?sort=trending"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all duration-200"
                >
                  <Award className="w-4 h-4" />
                  {t('nav.trending', 'Trending Now')}
                </Link>
                <Link
                  to="/explore?filter=handmade"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all duration-200"
                >
                  <Star className="w-4 h-4" />
                  {t('nav.authentic', 'Authentic Handmade')}
                </Link>
                <Link
                  to="/explore?sort=new"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all duration-200"
                >
                  <Star className="w-4 h-4" />
                  {t('nav.newArrivals', 'New Arrivals')}
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
