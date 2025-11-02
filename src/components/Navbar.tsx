import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, User, LogOut, Menu, X, MessageCircle, Search, ChevronDown } from 'lucide-react';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';
import { KalaMitra } from './ai/KalaMitra';
import { MegaMenu } from './MegaMenu';
import { SmartSearch } from './SmartSearch';

export const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [smartSearchOpen, setSmartSearchOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { t } = useTranslation();

  const exploreButtonRef = useRef<HTMLButtonElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    return `/dashboard/${user.role}`;
  };

  const navLinks = [
    { to: '/', label: t('nav.home', 'Home') },
    { to: '/explore', label: t('nav.explore', 'Explore') },
    { to: '/about', label: t('nav.about', 'About') },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gradient-hero">CultureCart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-foreground hover:text-primary transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {link.label}
              </Link>
            ))}

            {/* Explore Mega Menu */}
            <div className="relative">
              <button
                ref={exploreButtonRef}
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className={`flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  megaMenuOpen ? 'text-primary bg-primary/5' : ''
                }`}
              >
                {t('nav.explore', 'Explore')}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <MegaMenu
                isOpen={megaMenuOpen}
                onClose={() => setMegaMenuOpen(false)}
                triggerRef={exploreButtonRef}
              />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Smart Search */}
            <div className="relative">
              <button
                ref={searchButtonRef}
                onClick={() => setSmartSearchOpen(!smartSearchOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                  smartSearchOpen ? 'ring-2 ring-primary border-primary' : ''
                }`}
              >
                <Search className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300 hidden lg:inline">
                  {t('nav.search', 'Search')}
                </span>
              </button>

              <SmartSearch
                isOpen={smartSearchOpen}
                onClose={() => setSmartSearchOpen(false)}
                placeholder={t('nav.searchPlaceholder', 'Search crafts, artisans, regions...')}
                className="w-96"
              />
            </div>

            <LanguageSelector variant="select" showLocationDetection={false} />

            {/* AI Assistant Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAiChatOpen(!aiChatOpen)}
              className={`gap-2 ${aiChatOpen ? 'bg-primary/10 border-primary' : ''}`}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden lg:inline">{t('ai.assistant', 'AI Assistant')}</span>
            </Button>

            {isAuthenticated && user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(getDashboardLink())}
                  className="gap-2"
                >
                  <User className="h-4 w-4" />
                  {user.name}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  {t('auth.logout', 'Logout')}
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate('/login')} className="bg-gradient-hero">
                {t('auth.login', 'Sign In')}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background"
          >
            {/* Mobile Search */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setSmartSearchOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <Search className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">
                  {t('nav.search', 'Search crafts, artisans...')}
                </span>
              </button>
            </div>

            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Explore Button */}
              <button
                onClick={() => {
                  setMegaMenuOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between w-full py-2 text-foreground hover:text-primary transition-colors"
              >
                <span>{t('nav.explore', 'Explore')}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {isAuthenticated && user ? (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      navigate(getDashboardLink());
                      setMobileMenuOpen(false);
                    }}
                  >
                    <User className="h-4 w-4" />
                    {user.name}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    {t('auth.logout', 'Logout')}
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full bg-gradient-hero"
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                >
                  {t('auth.login', 'Sign In')}
                </Button>
              )}
            </div>

            {/* Mobile Language Selector */}
            <div className="border-t pt-3">
              <LanguageSelector variant="button" showLocationDetection={false} className="w-full" />
            </div>

            {/* Mobile AI Assistant Button */}
            <div className="border-t pt-3">
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => {
                  setAiChatOpen(!aiChatOpen);
                  setMobileMenuOpen(false);
                }}
              >
                <MessageCircle className="h-4 w-4" />
                {t('ai.assistant', 'AI Assistant')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Assistant Chat */}
      <KalaMitra
        isOpen={aiChatOpen}
        onToggle={() => setAiChatOpen(!aiChatOpen)}
        userRole={user?.role}
      />

      {/* Mobile Mega Menu Overlay */}
      <AnimatePresence>
        {megaMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setMegaMenuOpen(false)}
          >
            <div className="absolute inset-0 bg-black/50" />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl max-h-[80vh] overflow-hidden"
            >
              <MegaMenu
                isOpen={true}
                onClose={() => setMegaMenuOpen(false)}
                triggerRef={{ current: null }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Smart Search Overlay */}
      <AnimatePresence>
        {smartSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setSmartSearchOpen(false)}
          >
            <div className="absolute inset-0 bg-black/50" />
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute top-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-b-3xl max-h-[80vh] overflow-hidden"
            >
              <SmartSearch
                isOpen={true}
                onClose={() => setSmartSearchOpen(false)}
                placeholder={t('nav.searchPlaceholder', 'Search crafts, artisans, regions...')}
                className="rounded-none border-0"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
