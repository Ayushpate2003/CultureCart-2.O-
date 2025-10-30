import React, { useRef, useEffect, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { TypeAnimation } from 'react-type-animation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

const FloatingCraft = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 text-6xl opacity-10 animate-bounce">
        🪔
      </div>
      <div className="absolute top-1/3 right-1/4 text-5xl opacity-10 animate-pulse">
        🎨
      </div>
      <div className="absolute bottom-1/4 left-1/3 text-4xl opacity-10 animate-bounce">
        🧵
      </div>
    </div>
  );
};

const FloatingEmoji = ({ emoji, delay = 0, className = "" }: { emoji: string; delay?: number; className?: string }) => (
  <motion.div
    className={`absolute text-4xl opacity-20 ${className}`}
    animate={{
      y: [0, -20, 0],
      x: [0, 10, -10, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  >
    {emoji}
  </motion.div>
);

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(titleRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    )
    .fromTo(subtitleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      "-=0.5"
    )
    .fromTo(ctaRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      "-=0.3"
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <motion.section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
        y,
        opacity
      }}
    >
      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      {/* Floating Cultural Emojis */}
      <FloatingEmoji emoji="🎨" delay={0} />
      <FloatingEmoji emoji="🧵" delay={1} />
      <FloatingEmoji emoji="🏺" delay={2} />
      <FloatingEmoji emoji="🪔" delay={3} />

      {/* Floating Background Elements */}
      <FloatingCraft />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <Sparkles className="w-16 h-16 mx-auto text-white mb-6 drop-shadow-lg" />
        </motion.div>

        <motion.h1
          ref={titleRef}
          className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight drop-shadow-2xl"
          style={{ opacity: 0 }}
        >
          CultureCart
        </motion.h1>

        <motion.div
          ref={subtitleRef}
          className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
          style={{ opacity: 0 }}
        >
          <TypeAnimation
            sequence={[
              'Discover India\'s rich heritage through authentic handmade crafts.',
              2000,
              'Connect with skilled artisans across the nation.',
              2000,
              'Bring home pieces that tell stories of tradition and artistry.',
              2000,
            ]}
            wrapper="p"
            speed={50}
            repeat={Infinity}
          />
        </motion.div>

        <motion.div
          ref={ctaRef}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          style={{ opacity: 0 }}
        >
          <Button
            size="lg"
            className="bg-white text-orange-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Explore Crafts
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300"
          >
            Become an Artisan
          </Button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center bg-white/20 backdrop-blur-sm">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;