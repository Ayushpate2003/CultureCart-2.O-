import { languageMetadata, stateToLanguage } from '../i18n';

export interface LocationData {
  state: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface LanguageSuggestion {
  language: string;
  confidence: number;
  reason: string;
  metadata: {
    name: string;
    nativeName: string;
    regions: string[];
    rtl: boolean;
  };
}

/**
 * AI-based language detection service using location and user context
 */
export class LanguageDetectionService {
  private static instance: LanguageDetectionService;

  public static getInstance(): LanguageDetectionService {
    if (!LanguageDetectionService.instance) {
      LanguageDetectionService.instance = new LanguageDetectionService();
    }
    return LanguageDetectionService.instance;
  }

  /**
   * Detect user's location using browser geolocation API
   */
  async detectLocation(): Promise<LocationData | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;

            // Use reverse geocoding to get state information
            const locationData = await this.reverseGeocode(latitude, longitude);
            resolve(locationData);
          } catch (error) {
            console.error('Error getting location data:', error);
            resolve(null);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  /**
   * Reverse geocode coordinates to get location information
   */
  private async reverseGeocode(lat: number, lon: number): Promise<LocationData | null> {
    try {
      // Using a free geocoding service (you might want to use Google Maps API or similar)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );

      if (!response.ok) {
        throw new Error('Geocoding failed');
      }

      const data = await response.json();

      return {
        state: data.principalSubdivision || data.city || '',
        city: data.city || '',
        country: data.countryName || 'India',
        latitude: lat,
        longitude: lon,
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }

  /**
   * Suggest language based on location and user context
   */
  suggestLanguage(locationData?: LocationData | null): LanguageSuggestion[] {
    const suggestions: LanguageSuggestion[] = [];

    // If we have location data, prioritize location-based suggestions
    if (locationData?.state) {
      const stateLanguage = stateToLanguage[locationData.state as keyof typeof stateToLanguage];

      if (stateLanguage && stateLanguage !== 'en') {
        const metadata = languageMetadata[stateLanguage as keyof typeof languageMetadata];
        suggestions.push({
          language: stateLanguage,
          confidence: 0.9,
          reason: `Based on your location in ${locationData.state}`,
          metadata,
        });
      }
    }

    // Add English as fallback with high confidence
    suggestions.push({
      language: 'en',
      confidence: 0.8,
      reason: 'Global language and fallback option',
      metadata: languageMetadata.en,
    });

    // Add Hindi as secondary option for Indian users
    if (locationData?.country === 'India') {
      suggestions.push({
        language: 'hi',
        confidence: 0.7,
        reason: 'Widely spoken in India',
        metadata: languageMetadata.hi,
      });
    }

    // Sort by confidence
    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Get language suggestions with AI-enhanced reasoning
   */
  getSmartSuggestions(userContext?: {
    previousLanguage?: string;
    userAgent?: string;
    timezone?: string;
  }): LanguageSuggestion[] {
    const suggestions = this.suggestLanguage();

    // Enhance suggestions based on user context
    if (userContext?.previousLanguage) {
      // Boost confidence for previously used language
      const prevLangSuggestion = suggestions.find(s => s.language === userContext.previousLanguage);
      if (prevLangSuggestion) {
        prevLangSuggestion.confidence += 0.1;
        prevLangSuggestion.reason = 'Your previously selected language';
      }
    }

    // Consider timezone for regional preferences
    if (userContext?.timezone?.includes('Asia/Kolkata')) {
      // Boost Indian languages for IST timezone
      suggestions.forEach(suggestion => {
        if (suggestion.metadata.regions.includes('India') || suggestion.language !== 'en') {
          suggestion.confidence += 0.05;
        }
      });
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Check if a language supports RTL
   */
  isRTLLanguage(language: string): boolean {
    return languageMetadata[language as keyof typeof languageMetadata]?.rtl || false;
  }

  /**
   * Get all available languages with metadata
   */
  getAvailableLanguages() {
    return Object.entries(languageMetadata).map(([code, metadata]) => ({
      code,
      ...metadata,
    }));
  }
}

// Export singleton instance
export const languageService = LanguageDetectionService.getInstance();
