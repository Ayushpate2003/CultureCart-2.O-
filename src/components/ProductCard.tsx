import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, MapPin, Award, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Product } from '@/types';
import { artisans } from '@/data/artisans';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'featured' | 'compact';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  className = '',
  variant = 'default'
}) => {
  const { t } = useTranslation();
  const artisan = artisans[product.artisanId];

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement wishlist functionality
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement add to cart functionality
  };

  const cardVariants = {
    default: 'overflow-hidden hover:shadow-warm transition-all duration-300 cursor-pointer group',
    featured: 'overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer group border-2 border-primary/20',
    compact: 'overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group'
  };

  const imageVariants = {
    default: 'aspect-square overflow-hidden',
    featured: 'aspect-[4/3] overflow-hidden',
    compact: 'aspect-square overflow-hidden'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className={cardVariants[variant]} onClick={onClick}>
        <div className={imageVariants[variant]}>
          <div className="relative w-full h-full">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />

            {/* Overlay with quick actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleWishlist}
                  className="bg-white/90 hover:bg-white"
                >
                  <Heart className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  className="bg-primary hover:bg-primary/90"
                >
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {product.featured && (
                <Badge className="bg-gradient-hero text-white shadow-lg">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {t('product.featured', 'Featured')}
                </Badge>
              )}
              {product.trending && (
                <Badge variant="secondary" className="bg-orange-500 text-white shadow-lg">
                  <Star className="w-3 h-3 mr-1" />
                  {t('product.trending', 'Trending')}
                </Badge>
              )}
              {product.newArrival && (
                <Badge variant="outline" className="bg-green-500 text-white border-green-500 shadow-lg">
                  {t('product.newArrival', 'New')}
                </Badge>
              )}
            </div>

            {/* Artisan quick info */}
            {variant === 'featured' && artisan && (
              <div className="absolute bottom-3 left-3 right-3">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2">
                  <img
                    src={artisan.image}
                    alt={artisan.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {artisan.name}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {artisan.craft}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-3 h-3 text-primary" />
                    <span className="text-xs text-primary font-medium">
                      {artisan.yearsOfExperience}y
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <CardContent className={`${variant === 'compact' ? 'p-3' : 'p-4'} space-y-3`}>
          {/* Category & Location */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{product.region}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className={`font-semibold text-gray-900 dark:text-white line-clamp-2 ${
            variant === 'compact' ? 'text-sm' : 'text-base'
          }`}>
            {product.title}
          </h3>

          {/* Artisan */}
          {artisan && variant !== 'featured' && (
            <p className="text-sm text-muted-foreground">
              by <span className="font-medium text-primary">{artisan.name}</span>
            </p>
          )}

          {/* Rating & Reviews (if available) */}
          {product.featured && (
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">(24)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className={`font-bold text-primary ${
              variant === 'compact' ? 'text-base' : 'text-lg'
            }`}>
              {product.priceFormatted}
            </span>

            {variant !== 'compact' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddToCart}
                className="gap-1"
              >
                <ShoppingCart className="w-3 h-3" />
                {t('product.addToCart', 'Add')}
              </Button>
            )}
          </div>

          {/* Certifications */}
          {product.certifications && product.certifications.length > 0 && variant === 'featured' && (
            <div className="flex flex-wrap gap-1 pt-2 border-t">
              {product.certifications.slice(0, 2).map((cert) => (
                <Badge key={cert} variant="secondary" className="text-xs">
                  {cert}
                </Badge>
              ))}
              {product.certifications.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{product.certifications.length - 2}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
