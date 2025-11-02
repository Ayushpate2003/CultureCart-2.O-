import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { MapPin, Globe, Check, Loader2 } from 'lucide-react';
import { languageService, LanguageSuggestion } from '../services/languageService';
import { languageMetadata } from '../i18n';

interface LanguageSelectorProps {
  variant?: 'button' | 'select' | 'dialog';
  showLocationDetection?: boolean;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'select',
  showLocationDetection = true,
  className = '',
}) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<LanguageSuggestion[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [locationData, setLocationData] = useState<any>(null);

  const currentLanguage = i18n.language;
  const currentMetadata = languageMetadata[currentLanguage as keyof typeof languageMetadata];

  useEffect(() => {
    if (showLocationDetection) {
      loadLanguageSuggestions();
    }
  }, [showLocationDetection]);

  const loadLanguageSuggestions = async () => {
    setIsDetecting(true);
    try {
      const location = await languageService.detectLocation();
      setLocationData(location);
      const smartSuggestions = languageService.getSmartSuggestions({
        previousLanguage: currentLanguage,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      setSuggestions(smartSuggestions);
    } catch (error) {
      console.error('Error loading language suggestions:', error);
      setSuggestions(languageService.getSmartSuggestions());
    } finally {
      setIsDetecting(false);
    }
  };

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      localStorage.setItem('culturecart_language', languageCode);
      setIsOpen(false);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const renderLanguageOption = (langCode: string, showNative = true) => {
    const metadata = languageMetadata[langCode as keyof typeof languageMetadata];
    if (!metadata) return null;

    const isSelected = currentLanguage === langCode;
    const displayName = showNative
      ? `${metadata.name} (${metadata.nativeName})`
      : metadata.name;

    return (
      <div key={langCode} className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{displayName}</span>
          {metadata.rtl && <Badge variant="secondary" className="text-xs">RTL</Badge>}
          {isSelected && <Check className="h-4 w-4 text-green-600" />}
        </div>
      </div>
    );
  };

  if (variant === 'button') {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className={className}>
            <Globe className="h-4 w-4 mr-2" />
            {currentMetadata?.nativeName || currentLanguage.toUpperCase()}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t('onboarding.chooseLanguage')}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {showLocationDetection && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {t('onboarding.detectingLanguage')}
                  </span>
                  {isDetecting && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>

                {locationData && (
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {t('onboarding.languageDetected', {
                      state: locationData.state,
                      language: languageMetadata[suggestions[0]?.language as keyof typeof languageMetadata]?.nativeName
                    })}
                  </p>
                )}

                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={() => suggestions[0] && handleLanguageChange(suggestions[0].language)}
                    disabled={!suggestions.length || isDetecting}
                  >
                    {t('onboarding.confirmLanguage', {
                      language: languageMetadata[suggestions[0]?.language as keyof typeof languageMetadata]?.nativeName
                    })}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsOpen(true)}
                  >
                    {t('onboarding.chooseDifferent')}
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-sm font-medium">All Languages</h4>
              <div className="grid gap-1">
                {Object.keys(languageMetadata).map(langCode =>
                  renderLanguageOption(langCode)
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (variant === 'select') {
    return (
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className={`w-[180px] ${className}`}>
          <SelectValue>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {currentMetadata?.nativeName || currentLanguage.toUpperCase()}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(languageMetadata).map(([code, metadata]) => (
            <SelectItem key={code} value={code}>
              <div className="flex items-center justify-between w-full">
                <span>{metadata.nativeName}</span>
                {metadata.rtl && <Badge variant="secondary" className="text-xs ml-2">RTL</Badge>}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return null;
};

export default LanguageSelector;
