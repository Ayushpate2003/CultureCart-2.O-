import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Heart, Share2, MapPin, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProductViewer3D } from '@/components/ProductViewer3D';

const productDetails = {
  '1': {
    id: 1,
    title: 'Madhubani Painting',
    artisan: 'Sita Devi',
    region: 'Bihar',
    price: '₹2,499',
    category: 'Painting',
    description: 'This exquisite Madhubani painting showcases the traditional art form from Bihar, featuring intricate patterns and vibrant colors that tell stories of mythology and nature.',
    materials: 'Natural dyes on handmade paper',
    dimensions: '16" x 20"',
    story: 'Madhubani art, originating from the Mithila region of Bihar, has been practiced for over 2,500 years. Sita Devi learned this art from her grandmother and has been creating masterpieces for over 20 years.',
    image: 'https://images.unsplash.com/photo-1582747652673-603191e6d597?w=800&q=80',
  },
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const product = productDetails[id as keyof typeof productDetails] || productDetails['1'];

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
              <Badge variant="secondary" className="mb-2">{product.category}</Badge>
              <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" />
                <span>{product.region}</span>
              </div>
              <div className="text-3xl font-bold text-primary mb-6">{product.price}</div>
            </div>

            <div className="flex gap-4">
              <Button
                className="flex-1 bg-gradient-hero"
                size="lg"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
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
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 rounded-full">
                    <Award className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Artisan Story</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      By <span className="font-medium text-foreground">{product.artisan}</span>
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {product.story}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
