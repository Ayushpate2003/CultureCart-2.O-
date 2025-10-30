import React, { Suspense, lazy, useEffect } from 'react';
import { motion } from 'framer-motion';

// Lazy load components for better performance
const Hero = lazy(() => import('./landing/Hero'));
const Stats = lazy(() => import('./landing/Stats'));
const FeaturedCrafts = lazy(() => import('./landing/FeaturedCrafts'));
const CTA = lazy(() => import('./landing/CTA'));

// Loading component with accessibility
const SectionLoader: React.FC = () => (
  <div
    className="flex items-center justify-center py-20"
    role="status"
    aria-label="Loading section"
  >
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
    <span className="sr-only">Loading...</span>
  </div>
);

// Page transition variants
const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 }
};

const pageTransition = {
  duration: 0.5
};

const LandingPage: React.FC = () => {
  useEffect(() => {
    // Performance optimization: Preload critical resources
    const preloadCriticalResources = () => {
      // Preload fonts if needed
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = '/fonts/helvetiker_regular.typeface.json';
      link.as = 'fetch';
      document.head.appendChild(link);
    };

    preloadCriticalResources();

    // Accessibility: Set page title
    document.title = 'CultureCart - India\'s Handmade Craft Marketplace';

    // Performance: Add intersection observer for lazy loading images
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('blur-sm');
            imageObserver.unobserve(img);
          }
        }
      });
    }, { rootMargin: '50px' });

    // Observe all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));

    return () => {
      imageObserver.disconnect();
    };
  }, []);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen"
      role="main"
      aria-label="CultureCart Landing Page"
    >
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-amber-500 text-white px-4 py-2 rounded z-50"
      >
        Skip to main content
      </a>

      <div id="main-content">
        {/* Hero Section */}
        <Suspense fallback={<SectionLoader />}>
          <Hero />
        </Suspense>

        {/* Stats Section */}
        <Suspense fallback={<SectionLoader />}>
          <Stats />
        </Suspense>

        {/* Featured Crafts Section */}
        <Suspense fallback={<SectionLoader />}>
          <FeaturedCrafts />
        </Suspense>

        {/* Call to Action Section */}
        <Suspense fallback={<SectionLoader />}>
          <CTA />
        </Suspense>
      </div>

      {/* Footer with accessibility info */}
      <footer className="sr-only">
        <p>CultureCart - Connecting artisans and craft lovers across India</p>
      </footer>
    </motion.div>
  );
};

export default LandingPage;