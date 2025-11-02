import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { ArtisanProfile } from '@/components/ArtisanProfile';
import { ProductShowcase } from '@/components/ProductShowcase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal, Grid, List, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { products } from '@/data/products';
import { artisans } from '@/data/artisans';

const categories = ['All', 'Painting', 'Textiles', 'Pottery', 'Metalwork', 'Woodcraft'];
const regions = ['All', 'Bihar', 'Kashmir', 'Rajasthan', 'Gujarat', 'Odisha', 'Tamil Nadu', 'Karnataka', 'Maharashtra', 'West Bengal', 'Andhra Pradesh', 'Uttar Pradesh', 'Chhattisgarh'];

export default function Explore() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductShowcase, setShowProductShowcase] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = searchQuery === '' || 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artisans[product.artisanId]?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesRegion = selectedRegion === 'All' || product.state === selectedRegion;
      
      return matchesSearch && matchesCategory && matchesRegion;
    });
  }, [searchQuery, selectedCategory, selectedRegion]);

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedRegion('All');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="bg-gradient-craft py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Our Collection</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover authentic crafts from master artisans across India
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto relative"
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by craft, artisan, or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 shadow-sm"
            />
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">Filters</span>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2 text-muted-foreground">Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 text-muted-foreground">Region</h3>
              <div className="flex flex-wrap gap-2">
                {regions.map((region) => (
                  <Badge
                    key={region}
                    variant={selectedRegion === region ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedRegion(region)}
                  >
                    {region}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
            </p>
          </div>

          {/* View Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">{t('explore.sort.featured', 'Featured')}</SelectItem>
                  <SelectItem value="price-low">{t('explore.sort.priceLow', 'Price: Low to High')}</SelectItem>
                  <SelectItem value="price-high">{t('explore.sort.priceHigh', 'Price: High to Low')}</SelectItem>
                  <SelectItem value="newest">{t('explore.sort.newest', 'Newest')}</SelectItem>
                  <SelectItem value="rating">{t('explore.sort.rating', 'Highest Rated')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              {t('explore.filters', 'Filters')}
              {(selectedCategory !== 'All' || selectedRegion !== 'All' || searchQuery) && (
                <Badge variant="secondary" className="ml-1 px-1 min-w-5 h-5 text-xs">
                  {(selectedCategory !== 'All' ? 1 : 0) + (selectedRegion !== 'All' ? 1 : 0) + (searchQuery ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{t('explore.filters', 'Filters')}</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                  <X className="w-4 h-4" />
                  {t('explore.clearFilters', 'Clear All')}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('explore.category', 'Category')}</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === 'All' ? t('explore.allCategories', 'All Categories') : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">{t('explore.region', 'Region')}</label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region === 'All' ? t('explore.allRegions', 'All Regions') : region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Products Grid */}
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard
                  product={product}
                  variant={viewMode === 'grid' ? 'default' : 'compact'}
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowProductShowcase(true);
                  }}
                />
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Product Showcase Modal */}
      {selectedProduct && (
        <ProductShowcase
          product={selectedProduct}
          isOpen={showProductShowcase}
          onClose={() => {
            setShowProductShowcase(false);
            setSelectedProduct(null);
          }}
          onAddToCart={() => {
            // TODO: Implement add to cart functionality
            console.log('Add to cart:', selectedProduct.title);
          }}
          onWishlist={() => {
            // TODO: Implement wishlist functionality
            console.log('Add to wishlist:', selectedProduct.title);
          }}
          onShare={() => {
            // TODO: Implement share functionality
            if (navigator.share) {
              navigator.share({
                title: selectedProduct.title,
                text: selectedProduct.description,
                url: window.location.href,
              });
            }
          }}
        />
      )}

      <Footer />
    </div>
  );
}
