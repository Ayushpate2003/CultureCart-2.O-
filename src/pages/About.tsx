import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Users, Globe, Award } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Preserving Heritage',
    description: 'We celebrate and protect India\'s rich craft traditions for future generations.',
  },
  {
    icon: Users,
    title: 'Empowering Artisans',
    description: 'Direct connection between artisans and buyers, ensuring fair compensation.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Bringing authentic Indian crafts to appreciative audiences worldwide.',
  },
  {
    icon: Award,
    title: 'Quality Assured',
    description: 'Every piece is authenticated and represents the finest craftsmanship.',
  },
];

const stats = [
  { value: '500+', label: 'Master Artisans' },
  { value: '15', label: 'Indian States' },
  { value: '2,000+', label: 'Unique Crafts' },
  { value: '10,000+', label: 'Happy Customers' },
];

export default function About() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="about-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#about-pattern)" />
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
              Our Story
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90">
              Bridging centuries of tradition with modern technology to celebrate India's artistic soul
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              CultureCart was born from a simple yet powerful vision: to preserve India's invaluable craft heritage 
              while empowering the artisans who keep these traditions alive. Through innovative 3D storytelling and 
              immersive experiences, we're creating a living digital patachitra—a canvas where every craft has a voice 
              and every artisan's story is celebrated.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-hero rounded-lg">
                        <value.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-craft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-muted-foreground">Making a difference, one craft at a time</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-lg text-muted-foreground leading-relaxed"
          >
            <p>
              India's craft traditions represent thousands of years of cultural evolution, passed down through 
              generations of skilled artisans. Yet in our rapidly modernizing world, these traditions face the 
              risk of fading into obscurity.
            </p>
            <p>
              CultureCart was founded to change that narrative. We believe that technology and tradition aren't 
              opposites—they're partners. By leveraging cutting-edge 3D visualization, AI-powered storytelling, 
              and modern e-commerce, we're creating new opportunities for artisans to thrive while preserving 
              the authenticity and soul of their craft.
            </p>
            <p>
              Every product on CultureCart tells a story—of the artisan who created it, the region it comes from, 
              and the centuries-old techniques it embodies. When you purchase a craft through our platform, you're 
              not just buying a product; you're becoming part of a living tradition and directly supporting the 
              artisans who keep it alive.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
