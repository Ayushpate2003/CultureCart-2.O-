import React, { useRef, useEffect, Suspense, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { TypeAnimation } from 'react-type-animation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);

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

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      style={{
        y,
        opacity
      }}
    >
      {/* Cinematic Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/api/placeholder/1920/1080"
      >
        <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
        {/* Fallback for browsers that don't support video */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500"></div>
      </video>

      {/* Video Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Video Controls */}
      <motion.div
        className="absolute top-4 right-4 z-20 flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleVideo}
          className="bg-black/50 hover:bg-black/70 text-white border-0"
        >
          {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleMute}
          className="bg-black/50 hover:bg-black/70 text-white border-0"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
      </motion.div>

      {/* Interactive Craft Previews */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        {/* Hover-activated craft previews */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer"
          whileHover={{ scale: 1.2, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          onHoverStart={() => setShowControls(true)}
          onHoverEnd={() => setShowControls(false)}
        >
          <span className="text-4xl">🪔</span>
        </motion.div>

        <motion.div
          className="absolute top-1/3 right-1/4 w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer"
          whileHover={{ scale: 1.2, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          onHoverStart={() => setShowControls(true)}
          onHoverEnd={() => setShowControls(false)}
        >
          <span className="text-4xl">🎨</span>
        </motion.div>

        <motion.div
          className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer"
          whileHover={{ scale: 1.2, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          onHoverStart={() => setShowControls(true)}
          onHoverEnd={() => setShowControls(false)}
        >
          <span className="text-4xl">🧵</span>
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer"
          whileHover={{ scale: 1.2, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          onHoverStart={() => setShowControls(true)}
          onHoverEnd={() => setShowControls(false)}
        >
          <span className="text-4xl">🏺</span>
        </motion.div>
      </motion.div>

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
          {t('hero.title', 'Living Digital Patachitra')}
        </motion.h1>

        <motion.div
          ref={subtitleRef}
          className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
          style={{ opacity: 0 }}
        >
          <TypeAnimation
            sequence={[
              t('hero.subtitle1', 'Discover India\'s rich heritage through authentic handmade crafts.'),
              2000,
              t('hero.subtitle2', 'Connect with skilled artisans across the nation.'),
              2000,
              t('hero.subtitle3', 'Bring home pieces that tell stories of tradition and artistry.'),
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
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {t('hero.exploreCrafts', 'Explore Crafts')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300"
            >
              {t('hero.becomeArtisan', 'Become an Artisan')}
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {t('hero.learnMore', 'Learn More')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
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