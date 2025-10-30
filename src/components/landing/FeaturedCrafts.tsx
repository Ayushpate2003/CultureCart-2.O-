import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';



gsap.registerPlugin(ScrollTrigger);

interface CraftCardProps {
  title: string;
  description: string;
  image: string;
  artisan: string;
  location: string;
  delay: number;
}

const CraftCard: React.FC<CraftCardProps> = ({ title, description, image, artisan, location, delay }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
      whileHover={{ rotateY: 5, rotateX: 5 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Featured
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-orange-600">{artisan}</p>
            <p className="text-xs text-gray-500">{location}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-300"
          >
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturedCrafts: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".crafts-title",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".crafts-title",
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const crafts = [
    {
      title: "Madhubani Painting",
      description: "Vibrant Madhubani painting depicting traditional folk motifs and stories from Mithila culture, created with natural colors and intricate detailing.",
      image: "/api/placeholder/400/300",
      artisan: "Sunita Devi",
      location: "Madhubani, Bihar",
      delay: 0.1
    },
    {
      title: "Kashmiri Handicrafts",
      description: "Exquisite Kashmiri craftsmanship featuring intricate woodwork and traditional motifs, passed down through generations of skilled artisans.",
      image: "/api/placeholder/400/300",
      artisan: "Ahmed Khan",
      location: "Srinagar, Kashmir",
      delay: 0.2
    },
    {
      title: "Jaipur Blue Pottery",
      description: "Delicate blue pottery featuring traditional Jaipur craftsmanship with intricate hand-painted designs and unique glazing techniques.",
      image: "/api/placeholder/400/300",
      artisan: "Meera Sharma",
      location: "Jaipur, Rajasthan",
      delay: 0.3
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 to-amber-50 relative overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        ref={parallaxRef}
        style={{ y }}
        className="absolute inset-0 opacity-10"
      >
        <div className="absolute top-20 left-20 w-64 h-64 bg-amber-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-orange-200 rounded-full blur-3xl"></div>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="crafts-title text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Featured Crafts
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover extraordinary handmade treasures from skilled artisans across India
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {crafts.map((craft, index) => (
            <CraftCard
              key={index}
              title={craft.title}
              description={craft.description}
              image={craft.image}
              artisan={craft.artisan}
              location={craft.location}
              delay={craft.delay}
            />
          ))}
        </div>

        {/* Craft Story Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="max-w-md mx-auto mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-6xl">
              🪔
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Every Craft Tells a Story
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Each piece in our collection carries the soul of Indian craftsmanship,
            blending ancient techniques with contemporary aesthetics.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCrafts;