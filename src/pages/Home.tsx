import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ArrowRight, Sparkles, Users, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getFeaturedProducts } from '@/data/products';
import { artisans } from '@/data/artisans';

const featuredCrafts = getFeaturedProducts().slice(0, 3);

const stats = [
  { icon: Users, value: '500+', label: 'Artisans' },
  { icon: Package, value: '2,000+', label: 'Products' },
  { icon: Sparkles, value: '15+', label: 'States' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="40" cy="40" r="1.5" fill="white" />
                <path d="M 40 25 L 40 55 M 25 40 L 55 40" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-pattern)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6">
              Living Digital
              <br />
              <span className="italic">Patachitra</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Experience India's rich craft heritage through immersive 3D storytelling. Connect with master artisans and their timeless traditions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/explore')}
                className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow"
              >
                Explore Crafts
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/about')}
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className="text-center"
              >
                <stat.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Crafts */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Crafts</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover handpicked masterpieces from artisans across India
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCrafts.map((craft, index) => (
              <motion.div
                key={craft.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-warm transition-all duration-300 cursor-pointer group" onClick={() => navigate(`/product/${craft.id}`)}>
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={craft.image}
                      alt={craft.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{craft.title}</h3>
                    <p className="text-sm text-muted-foreground mb-1">by {artisans[craft.artisanId]?.name}</p>
                    <p className="text-xs text-muted-foreground mb-4">{craft.region}, {craft.state}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary">{craft.priceFormatted}</span>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button onClick={() => navigate('/explore')} size="lg" className="bg-gradient-hero">
              View All Crafts
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-craft">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Become Part of the Story
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of buyers celebrating India's craft heritage
            </p>
            <Button size="lg" onClick={() => navigate('/login')} className="bg-gradient-hero">
              Sign Up Today
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
