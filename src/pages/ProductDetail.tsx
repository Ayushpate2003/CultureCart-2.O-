import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Heart, Share2, MapPin, Award, Package, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProductViewer3D } from '@/components/ProductViewer3D';
import { getProductById } from '@/data/products';
import { artisans } from '@/data/artisans';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const product = getProductById(Number(id));
  
  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => navigate('/explore')}>Browse All Crafts</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const artisan = artisans[product.artisanId];

  const handleAddToCart = () => {
    toast({
      title: 'Added to cart',
      description: `${product.title} has been added to your cart.`,
    });
  };

  const handleWishlist = () => {
    toast({
      title: 'Added to wishlist',
      description: `${product.title} has been saved to your wishlist.`,
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 3D Viewer / Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="overflow-hidden">
              <ProductViewer3D productId={product.id} />
            </Card>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <div className="flex gap-2 mb-3">
                <Badge variant="secondary">{product.category}</Badge>
                {product.featured && <Badge className="bg-gradient-hero">Featured</Badge>}
                {product.trending && <Badge variant="outline">Trending</Badge>}
                {product.newArrival && <Badge variant="outline">New Arrival</Badge>}
              </div>
              <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" />
                <span>{product.region}, {product.state}</span>
              </div>
              <div className="text-3xl font-bold text-primary mb-2">{product.priceFormatted}</div>
              {product.inStock ? (
                <p className="text-sm text-green-600 font-medium mb-6">In Stock</p>
              ) : (
                <p className="text-sm text-red-600 font-medium mb-6">Out of Stock</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                className="flex-1 bg-gradient-hero"
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleWishlist}
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">About this Craft</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <h3 className="font-medium mb-1">Materials</h3>
                    <p className="text-sm text-muted-foreground">{product.materials}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Dimensions</h3>
                    <p className="text-sm text-muted-foreground">{product.dimensions}</p>
                  </div>
                  {product.weight && (
                    <div>
                      <h3 className="font-medium mb-1">Weight</h3>
                      <p className="text-sm text-muted-foreground">{product.weight}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium mb-1">Technique</h3>
                    <p className="text-sm text-muted-foreground">{product.technique}</p>
                  </div>
                </div>
                
                {product.certifications && product.certifications.length > 0 && (
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Certifications
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.certifications.map((cert) => (
                        <Badge key={cert} variant="outline" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {artisan && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img 
                      src={artisan.image} 
                      alt={artisan.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Meet the Artisan</h3>
                      <p className="font-medium text-foreground mb-1">{artisan.name}</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {artisan.craft} • {artisan.region}, {artisan.state}
                      </p>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        {artisan.storySummary}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Award className="h-3 w-3" />
                        <span>{artisan.yearsOfExperience} years of experience</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Craft Story
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.story}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
