import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn, RotateCcw, Maximize2, Heart, Share2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { Product, Artisan } from '@/types';
import { artisans } from '@/data/artisans';

interface ProductShowcaseProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: () => void;
  onWishlist?: () => void;
  onShare?: () => void;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onWishlist,
  onShare
}) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [rotation, setRotation] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);

  const artisan = artisans[product.artisanId];
  const images = product.images || [product.image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setRotation(0);
    setIsZoomed(false);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setRotation(0);
    setIsZoomed(false);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const rotateImage = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        prevImage();
        break;
      case 'ArrowRight':
        e.preventDefault();
        nextImage();
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
      case 'z':
      case 'Z':
        e.preventDefault();
        toggleZoom();
        break;
      case 'r':
      case 'R':
        e.preventDefault();
        rotateImage();
        break;
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-6xl w-full max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {product.title}
                  </h2>
                  <div className="flex gap-2">
                    {product.featured && (
                      <Badge className="bg-gradient-hero">Featured</Badge>
                    )}
                    {product.trending && (
                      <Badge variant="secondary" className="bg-orange-500 text-white">
                        Trending
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onWishlist}
                    className="gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    {t('product.wishlist', 'Wishlist')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onShare}
                    className="gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    {t('product.share', 'Share')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row">
                {/* Image Viewer */}
                <div className="flex-1 relative bg-gray-50 dark:bg-gray-800">
                  <div className="relative aspect-square lg:aspect-auto lg:h-[600px] overflow-hidden">
                    <motion.img
                      ref={imageRef}
                      src={images[currentImageIndex]}
                      alt={product.title}
                      className="w-full h-full object-contain"
                      style={{
                        transform: `scale(${isZoomed ? 2 : 1}) rotate(${rotation}deg)`,
                        transformOrigin: 'center',
                        transition: 'transform 0.3s ease'
                      }}
                      animate={{ scale: isZoomed ? 2 : 1 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                          onClick={nextImage}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </>
                    )}

                    {/* Image Controls */}
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={toggleZoom}
                        className="bg-white/90 hover:bg-white shadow-lg gap-2"
                      >
                        <ZoomIn className="w-4 h-4" />
                        {isZoomed ? t('product.zoomOut', 'Zoom Out') : t('product.zoomIn', 'Zoom In')}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={rotateImage}
                        className="bg-white/90 hover:bg-white shadow-lg gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        {t('product.rotate', 'Rotate')}
                      </Button>
                    </div>

                    {/* Image Counter */}
                    {images.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Strip */}
                  {images.length > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-2">
                      <div className="flex gap-2 overflow-x-auto">
                        {images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setCurrentImageIndex(index);
                              setRotation(0);
                              setIsZoomed(false);
                            }}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                              index === currentImageIndex
                                ? 'border-primary'
                                : 'border-gray-200 dark:border-gray-600'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`${product.title} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="w-full lg:w-96 p-6 overflow-y-auto max-h-[600px]">
                  <div className="space-y-6">
                    {/* Price and Actions */}
                    <div>
                      <div className="text-3xl font-bold text-primary mb-4">
                        {product.priceFormatted}
                      </div>

                      <div className="flex gap-3 mb-4">
                        <Button
                          className="flex-1 bg-gradient-hero gap-2"
                          onClick={onAddToCart}
                          disabled={!product.inStock}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {product.inStock
                            ? t('product.addToCart', 'Add to Cart')
                            : t('product.outOfStock', 'Out of Stock')
                          }
                        </Button>
                        <Button
                          variant="outline"
                          onClick={onWishlist}
                          className="gap-2"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        {t('product.description', 'Description')}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {product.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">{t('product.category', 'Category')}:</span>
                          <p className="text-muted-foreground">{product.category}</p>
                        </div>
                        <div>
                          <span className="font-medium">{t('product.materials', 'Materials')}:</span>
                          <p className="text-muted-foreground">{product.materials}</p>
                        </div>
                        <div>
                          <span className="font-medium">{t('product.dimensions', 'Dimensions')}:</span>
                          <p className="text-muted-foreground">{product.dimensions}</p>
                        </div>
                        <div>
                          <span className="font-medium">{t('product.technique', 'Technique')}:</span>
                          <p className="text-muted-foreground">{product.technique}</p>
                        </div>
                      </div>
                    </div>

                    {/* Artisan Info */}
                    {artisan && (
                      <div className="border-t pt-6">
                        <h3 className="font-semibold text-lg mb-3">
                          {t('product.meetArtisan', 'Meet the Artisan')}
                        </h3>
                        <div className="flex items-start gap-3">
                          <img
                            src={artisan.image}
                            alt={artisan.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{artisan.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {artisan.craft} • {artisan.region}, {artisan.state}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {artisan.yearsOfExperience} {t('artisan.yearsExperience', 'years of experience')}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {product.certifications && product.certifications.length > 0 && (
                      <div className="border-t pt-6">
                        <h3 className="font-semibold text-lg mb-3">
                          {t('product.certifications', 'Certifications')}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {product.certifications.map((cert) => (
                            <Badge key={cert} variant="secondary">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Craft Story */}
                    <div className="border-t pt-6">
                      <h3 className="font-semibold text-lg mb-3">
                        {t('product.craftStory', 'Craft Story')}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {product.story}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
