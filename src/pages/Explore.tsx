import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const products = [
  { id: 1, title: 'Madhubani Painting', artisan: 'Sita Devi', region: 'Bihar', price: '₹2,499', category: 'Painting', image: 'https://images.unsplash.com/photo-1582747652673-603191e6d597?w=500&q=80' },
  { id: 2, title: 'Warli Art', artisan: 'Jivya Soma', region: 'Maharashtra', price: '₹1,899', category: 'Painting', image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=500&q=80' },
  { id: 3, title: 'Pashmina Shawl', artisan: 'Rashid Khan', region: 'Kashmir', price: '₹8,999', category: 'Textile', image: 'https://images.unsplash.com/photo-1601924638867-f4974de87957?w=500&q=80' },
  { id: 4, title: 'Brass Lamp', artisan: 'Kumar Das', region: 'West Bengal', price: '₹3,499', category: 'Metal', image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&q=80' },
  { id: 5, title: 'Kalamkari Saree', artisan: 'Lakshmi Rao', region: 'Andhra Pradesh', price: '₹5,999', category: 'Textile', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80' },
  { id: 6, title: 'Terracotta Horse', artisan: 'Gopal Prajapati', region: 'Tamil Nadu', price: '₹1,299', category: 'Pottery', image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500&q=80' },
  { id: 7, title: 'Pattachitra', artisan: 'Raghunath Mahapatra', region: 'Odisha', price: '₹4,299', category: 'Painting', image: 'https://images.unsplash.com/photo-1579541814924-49fef17c5be5?w=500&q=80' },
  { id: 8, title: 'Bamboo Basket', artisan: 'Menaka Gogoi', region: 'Assam', price: '₹899', category: 'Bamboo', image: 'https://images.unsplash.com/photo-1611439374584-cd9a02c7c95e?w=500&q=80' },
  { id: 9, title: 'Block Print Fabric', artisan: 'Vinay Joshi', region: 'Rajasthan', price: '₹2,199', category: 'Textile', image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=500&q=80' },
];

const categories = ['All', 'Painting', 'Textile', 'Metal', 'Pottery', 'Bamboo'];
const regions = ['All', 'Bihar', 'Maharashtra', 'Kashmir', 'West Bengal', 'Andhra Pradesh', 'Tamil Nadu', 'Odisha', 'Assam', 'Rajasthan'];

export default function Explore() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.artisan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesRegion = selectedRegion === 'All' || product.region === selectedRegion;
    return matchesSearch && matchesCategory && matchesRegion;
  });

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
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

          {/* Search Bar */}
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

      {/* Filters and Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
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

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
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
                    <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                    <h3 className="font-semibold mb-1 line-clamp-1">{product.title}</h3>
                    <p className="text-sm text-muted-foreground mb-1">by {product.artisan}</p>
                    <p className="text-xs text-muted-foreground mb-3">{product.region}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary">{product.price}</span>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedRegion('All');
                }}
              >
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
