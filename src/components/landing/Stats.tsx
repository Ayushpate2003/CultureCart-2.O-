import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, ShoppingBag, Award, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface StatItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  delay: number;
}

const StatItem: React.FC<StatItemProps> = ({ icon, value, label, delay }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(itemRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView && valueRef.current) {
      const targetValue = parseInt(value.replace(/[^\d]/g, ''));
      let currentValue = 0;
      const increment = targetValue / 60; // 60 frames for smooth animation

      const animate = () => {
        currentValue += increment;
        if (currentValue >= targetValue) {
          valueRef.current!.textContent = targetValue.toString();
        } else {
          valueRef.current!.textContent = Math.floor(currentValue).toString();
          requestAnimationFrame(animate);
        }
      };

      setTimeout(() => {
        requestAnimationFrame(animate);
      }, delay * 1000);
    }
  }, [isInView, value, delay]);

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="text-center group cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="bg-gradient-to-br from-orange-100 to-red-100 p-6 rounded-2xl mb-4 mx-auto w-24 h-24 flex items-center justify-center group-hover:shadow-lg transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="text-orange-600 group-hover:scale-110 transition-transform duration-300 relative z-10">
          {icon}
        </div>
      </div>
      <div className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
        <span ref={valueRef}>0</span>
        {value.includes('+') && '+'}
        {value.includes('K') && 'K'}
        {value.includes('M') && 'M'}
      </div>
      <p className="text-gray-600 font-medium">{label}</p>
    </motion.div>
  );
};

const Stats: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".stats-container",
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    {
      icon: <Users className="w-10 h-10" />,
      value: "500+",
      label: "Artisans",
      delay: 0.1
    },
    {
      icon: <ShoppingBag className="w-10 h-10" />,
      value: "2,000+",
      label: "Products",
      delay: 0.2
    },
    {
      icon: <Award className="w-10 h-10" />,
      value: "15+",
      label: "States",
      delay: 0.3
    },
    {
      icon: <Globe className="w-10 h-10" />,
      value: "50K+",
      label: "Happy Customers",
      delay: 0.4
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-amber-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-200 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-200 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Our Impact in Numbers
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Celebrating the vibrant community of artisans and craft lovers across India
          </p>
        </motion.div>

        <div className="stats-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              delay={stat.delay}
            />
          ))}
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 flex justify-center">
          <div className="flex space-x-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;