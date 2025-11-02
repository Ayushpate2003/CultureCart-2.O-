import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Award, Star, Users, Calendar, Heart, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslation } from 'react-i18next';
import { Artisan } from '@/types';

interface ArtisanProfileProps {
  artisan: Artisan;
  products?: any[]; // TODO: Add proper Product type
  onContact?: () => void;
  onFollow?: () => void;
  isFollowing?: boolean;
  className?: string;
  variant?: 'full' | 'compact' | 'card';
}

export const ArtisanProfile: React.FC<ArtisanProfileProps> = ({
  artisan,
  products = [],
  onContact,
  onFollow,
  isFollowing = false,
  className = '',
  variant = 'full'
}) => {
  const { t } = useTranslation();

  const profileVariants = {
    full: 'max-w-4xl mx-auto',
    compact: 'max-w-md',
    card: 'w-full'
  };

  const renderStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">{artisan.yearsOfExperience}</div>
        <div className="text-sm text-muted-foreground">{t('artisan.yearsExperience', 'Years Experience')}</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">{products.length}</div>
        <div className="text-sm text-muted-foreground">{t('artisan.products', 'Products')}</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">4.9</div>
        <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          {t('artisan.rating', 'Rating')}
        </div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">1.2k</div>
        <div className="text-sm text-muted-foreground">{t('artisan.followers', 'Followers')}</div>
      </div>
    </div>
  );

  const renderSpecializations = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">{t('artisan.specializations', 'Specializations')}</h3>
      <div className="flex flex-wrap gap-2">
        {artisan.specialization.map((spec, index) => (
          <Badge key={index} variant="secondary" className="px-3 py-1">
            {spec}
          </Badge>
        ))}
      </div>
    </div>
  );

  const renderStory = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          {t('artisan.story', 'Artisan Story')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed mb-4">
          {artisan.bio}
        </p>
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-700 p-4 rounded-lg">
          <p className="text-sm italic text-gray-700 dark:text-gray-300">
            "{artisan.storySummary}"
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderActions = () => (
    <div className="flex gap-3 mb-6">
      <Button
        onClick={onContact}
        className="flex-1 bg-gradient-hero gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        {t('artisan.contact', 'Contact Artisan')}
      </Button>
      <Button
        variant={isFollowing ? "secondary" : "outline"}
        onClick={onFollow}
        className="gap-2"
      >
        <Heart className={`w-4 h-4 ${isFollowing ? 'fill-current' : ''}`} />
        {isFollowing ? t('artisan.following', 'Following') : t('artisan.follow', 'Follow')}
      </Button>
    </div>
  );

  if (variant === 'card') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={className}
      >
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={artisan.image} alt={artisan.name} />
                <AvatarFallback>{artisan.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                  {artisan.name}
                </h3>

                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <MapPin className="w-3 h-3" />
                  <span>{artisan.region}, {artisan.state}</span>
                </div>

                <p className="text-sm text-primary font-medium mb-2">
                  {artisan.craft}
                </p>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {artisan.storySummary}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {artisan.yearsOfExperience}y
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current text-yellow-400" />
                      4.9
                    </span>
                  </div>

                  <Button size="sm" variant="outline">
                    {t('artisan.viewProfile', 'View Profile')}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${profileVariants[variant]} ${className}`}
    >
      {/* Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 mx-auto md:mx-0">
              <AvatarImage src={artisan.image} alt={artisan.name} />
              <AvatarFallback className="text-2xl">{artisan.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {artisan.name}
              </h1>

              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <Badge variant="secondary" className="px-3 py-1">
                  {artisan.craft}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{artisan.region}, {artisan.state}</span>
                </div>
              </div>

              <p className="text-muted-foreground mb-4 max-w-2xl">
                {artisan.bio}
              </p>

              {variant === 'full' && renderActions()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      {variant === 'full' && renderStats()}

      {/* Specializations */}
      {variant === 'full' && renderSpecializations()}

      {/* Story */}
      {variant === 'full' && renderStory()}

      {/* Products Preview */}
      {products.length > 0 && variant === 'full' && (
        <Card>
          <CardHeader>
            <CardTitle>{t('artisan.featuredProducts', 'Featured Products')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.slice(0, 6).map((product, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full aspect-square object-cover rounded-lg mb-3"
                  />
                  <h4 className="font-medium text-sm mb-1 line-clamp-2">{product.title}</h4>
                  <p className="text-primary font-semibold text-sm">{product.priceFormatted}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};
