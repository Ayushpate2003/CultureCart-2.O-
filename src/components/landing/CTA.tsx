import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Heart, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CTA: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const floatingElementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main content animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      tl.fromTo(titleRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )
      .fromTo(subtitleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(buttonsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
        "-=0.3"
      );

      // Floating elements animation
      gsap.to(".floating-element", {
        y: "random(-20, 20)",
        x: "random(-10, 10)",
        rotation: "random(-10, 10)",
        duration: "random(3, 6)",
        ease: "none",
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
        scrollTrigger: {
          trigger: floatingElementsRef.current,
          start: "top bottom",
          end: "bottom top",
          toggleActions: "play pause resume pause"
        }
      });

      // Background gradient animation
      gsap.to(".cta-bg", {
        backgroundPosition: "200% 0",
        duration: 8,
        ease: "none",
        repeat: -1,
        yoyo: true
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleGetStarted = () => {
    // Add smooth scroll to top or navigation logic
    gsap.to(window, { duration: 1, scrollTo: 0, ease: "power2.inOut" });
  };

  const handleLearnMore = () => {
    // Add navigation to about section or modal
    console.log("Learn more clicked");
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden cta-bg"
      style={{
        background: 'linear-gradient(135deg, #FF6B35 0%, #A855F7 50%, #10B981 100%)',
        backgroundSize: '400% 400%'
      }}
    >
      {/* Floating Elements */}
      <div ref={floatingElementsRef} className="absolute inset-0 pointer-events-none">
        <div className="floating-element absolute top-20 left-20 text-amber-300 opacity-20">
          <Sparkles size={48} />
        </div>
        <div className="floating-element absolute top-32 right-32 text-orange-300 opacity-20">
          <Heart size={36} />
        </div>
        <div className="floating-element absolute bottom-32 left-32 text-red-300 opacity-20">
          <Star size={40} />
        </div>
        <div className="floating-element absolute bottom-20 right-20 text-yellow-300 opacity-20">
          <Sparkles size={32} />
        </div>
        <div className="floating-element absolute top-1/2 left-16 text-amber-400 opacity-15">
          <Heart size={28} />
        </div>
        <div className="floating-element absolute top-1/2 right-16 text-orange-400 opacity-15">
          <Star size={24} />
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <Sparkles className="w-16 h-16 mx-auto text-white mb-6 drop-shadow-lg" />
          </motion.div>

          <motion.h2
            ref={titleRef}
            className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg"
            style={{ opacity: 0 }}
          >
            Become Part of the Story
          </motion.h2>

          <motion.p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md"
            style={{ opacity: 0 }}
          >
            Join thousands of craft enthusiasts and artisans in celebrating India's rich cultural legacy.
            Start your journey today and bring home pieces that tell stories of tradition and artistry.
          </motion.p>

          <motion.div
            ref={buttonsRef}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            style={{ opacity: 0 }}
          >
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-50 px-10 py-4 text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-0"
            >
              Start Selling Today
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>

            <Button
              onClick={handleLearnMore}
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-10 py-4 text-xl font-bold rounded-full transition-all duration-300 hover:shadow-xl"
            >
              Browse All Crafts
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-white/80"
          >
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current text-yellow-300" />
                ))}
              </div>
              <span className="font-medium">4.9/5 Rating</span>
            </div>

            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 fill-current text-red-300" />
              <span className="font-medium">50K+ Happy Customers</span>
            </div>

            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 fill-current text-blue-300" />
              <span className="font-medium">100% Authentic Crafts</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-20 fill-white"
          preserveAspectRatio="none"
        >
          <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default CTA;