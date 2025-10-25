import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { products } from '@/data/products';
import { artisans } from '@/data/artisans';

const categories = ['All', 'Painting', 'Textiles', 'Pottery', 'Metalwork', 'Woodcraft'];
const regions = ['All', 'Bihar', 'Kashmir', 'Rajasthan', 'Gujarat', 'Odisha', 'Tamil Nadu', 'Karnataka', 'Maharashtra', 'West Bengal', 'Andhra Pradesh', 'Uttar Pradesh', 'Chhattisgarh'];

export default function Explore() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => {
              const artisan = artisans[product.artisanId];
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden hover:shadow-warm transition-all duration-300 cursor-pointer group" onClick={() => navigate(`/product/${product.id}`)}>
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex gap-1 mb-2">
                        {product.featured && <Badge variant="secondary" className="text-xs">Featured</Badge>}
                        {product.trending && <Badge className="text-xs bg-gradient-hero">Trending</Badge>}
                      </div>
                      <h3 className="font-semibold mb-1 line-clamp-1">{product.title}</h3>
                      <p className="text-sm text-muted-foreground mb-1">by {artisan?.name}</p>
                      <p className="text-xs text-muted-foreground mb-3">{product.region}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-primary">{product.priceFormatted}</span>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
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

      <Footer />
    </div>
  );
}
