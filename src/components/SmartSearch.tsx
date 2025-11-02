import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, MapPin, User, Star, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchResult {
  id: string;
  type: 'product' | 'artisan' | 'category' | 'location';
  title: string;
  subtitle?: string;
  image?: string;
  rating?: number;
  location?: string;
  price?: string;
  tags?: string[];
}

interface SmartSearchProps {
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
  className?: string;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({
  isOpen,
  onClose,
  placeholder,
  className = ''
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  // Mock search function - replace with actual API call
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockResults: SearchResult[] = [
      {
        id: '1',
        type: 'product',
        title: 'Hand-painted Pattachitra',
        subtitle: 'Traditional Odia art piece',
        image: '/api/placeholder/64/64',
        rating: 4.8,
        location: 'Bhubaneswar, Odisha',
        price: '₹2,500',
        tags: ['Pattachitra', 'Odisha', 'Traditional']
      },
      {
        id: '2',
        type: 'artisan',
        title: 'Ramesh Kumar',
        subtitle: 'Master Pattachitra Artist',
        image: '/api/placeholder/64/64',
        rating: 4.9,
        location: 'Puri, Odisha',
        tags: ['Pattachitra', 'Master Artisan', '25+ years']
      },
      {
        id: '3',
        type: 'category',
        title: 'Blue Pottery',
        subtitle: 'Rajasthani ceramic art',
        image: '/api/placeholder/64/64',
        location: 'Jaipur, Rajasthan',
        tags: ['Ceramics', 'Rajasthan', 'Blue Pottery']
      },
      {
        id: '4',
        type: 'location',
        title: 'Kutch, Gujarat',
        subtitle: 'Famous for embroidery and crafts',
        tags: ['Gujarat', 'Embroidery', 'Textiles']
      }
    ];

    const filteredResults = mockResults.filter(result =>
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setResults(filteredResults);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery, performSearch]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          } else if (query.trim()) {
            handleSearchSubmit();
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, query, onClose]);

  const handleResultClick = (result: SearchResult) => {
    // Add to recent searches
    const updatedRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem('culturecart_recent_searches', JSON.stringify(updatedRecent));

    // Navigate based on result type
    let url = '/explore';
    switch (result.type) {
      case 'product':
        url = `/product/${result.id}`;
        break;
      case 'artisan':
        url = `/artisan/${result.id}`;
        break;
      case 'category':
        url = `/explore?category=${result.id}`;
        break;
      case 'location':
        url = `/explore?location=${result.location}`;
        break;
    }

    window.location.href = url;
    onClose();
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      const updatedRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(updatedRecent);
      localStorage.setItem('culturecart_recent_searches', JSON.stringify(updatedRecent));

      window.location.href = `/explore?q=${encodeURIComponent(query)}`;
      onClose();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSelectedIndex(-1);
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'product':
        return <Star className="w-4 h-4" />;
      case 'artisan':
        return <User className="w-4 h-4" />;
      case 'category':
        return <Filter className="w-4 h-4" />;
      case 'location':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getResultColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'product':
        return 'text-blue-600 bg-blue-50';
      case 'artisan':
        return 'text-green-600 bg-green-50';
      case 'category':
        return 'text-purple-600 bg-purple-50';
      case 'location':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem('culturecart_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={searchRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 ${className}`}
        >
          {/* Search Input */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder || t('nav.searchPlaceholder', 'Search for crafts, artisans, or regions...')}
                className="w-full pl-12 pr-12 py-3 bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              {query && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading && (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                {t('nav.searching', 'Searching...')}
              </div>
            )}

            {!isLoading && query && results.length === 0 && (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                {t('nav.noResults', 'No results found for')} "{query}"
              </div>
            )}

            {!isLoading && !query && recentSearches.length > 0 && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('nav.recentSearches', 'Recent Searches')}
                  </span>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(search)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors duration-150"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <div className="p-2">
                {results.map((result, index) => (
                  <motion.button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className={`w-full text-left p-3 rounded-lg transition-colors duration-150 ${
                      index === selectedIndex
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-start gap-3">
                      {result.image && (
                        <img
                          src={result.image}
                          alt={result.title}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getResultColor(result.type)}`}>
                            {getResultIcon(result.type)}
                            {t(`nav.type.${result.type}`, result.type)}
                          </span>
                          {result.rating && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                              <Star className="w-3 h-3 fill-current text-yellow-400" />
                              {result.rating}
                            </span>
                          )}
                        </div>
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                          {result.title}
                        </h4>
                        {result.subtitle && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {result.subtitle}
                          </p>
                        )}
                        {result.location && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {result.location}
                          </p>
                        )}
                        {result.price && (
                          <p className="text-sm font-semibold text-primary mt-1">
                            {result.price}
                          </p>
                        )}
                        {result.tags && result.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {result.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {query && results.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <button
                onClick={handleSearchSubmit}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
              >
                <TrendingUp className="w-4 h-4" />
                {t('nav.viewAllResults', 'View all results for')} "{query}"
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
