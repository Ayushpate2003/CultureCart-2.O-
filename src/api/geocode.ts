interface GeocodeResult {
  state?: string;
  city?: string;
  country?: string;
  detectedLanguage?: string;
}

interface NominatimResponse {
  address?: {
    state?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    country?: string;
    'ISO3166-2-lvl4'?: string;
  };
}

// Indian states mapping for language detection
const STATE_LANGUAGE_MAP: Record<string, string> = {
  'Gujarat': 'gu',
  'Maharashtra': 'hi', // Marathi, but Hindi is widely spoken
  'Rajasthan': 'hi',
  'Uttar Pradesh': 'hi',
  'Madhya Pradesh': 'hi',
  'Bihar': 'hi',
  'West Bengal': 'bn', // Bengali
  'Odisha': 'or', // Odia
  'Andhra Pradesh': 'te', // Telugu
  'Telangana': 'te',
  'Karnataka': 'kn', // Kannada
  'Tamil Nadu': 'ta',
  'Kerala': 'ml', // Malayalam
  'Punjab': 'pa', // Punjabi
  'Haryana': 'hi',
  'Delhi': 'hi',
  'Jammu and Kashmir': 'ur', // Urdu
  'Himachal Pradesh': 'hi',
  'Uttarakhand': 'hi',
  'Chhattisgarh': 'hi',
  'Jharkhand': 'hi',
  'Assam': 'as', // Assamese
  'Meghalaya': 'en', // English
  'Nagaland': 'en',
  'Manipur': 'en',
  'Mizoram': 'en',
  'Tripura': 'en',
  'Sikkim': 'en',
  'Arunachal Pradesh': 'en',
  'Goa': 'en',
  'Puducherry': 'ta',
  'Chandigarh': 'hi',
  'Dadra and Nagar Haveli and Daman and Diu': 'gu',
  'Lakshadweep': 'en',
  'Ladakh': 'ur',
};

/**
 * Reverse geocode coordinates to get location information
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<GeocodeResult> {
  try {
    // Use a CORS-friendly geocoding service or backend proxy
    // For development, we'll use a different approach or mock data
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      // Fallback to mock data for development
      console.warn('Geocoding service unavailable, using fallback');
      return getMockLocationData(latitude, longitude);
    }

    const data = await response.json();

    if (!data || !data.localityInfo) {
      return getMockLocationData(latitude, longitude);
    }

    const { localityInfo } = data;
    const state = localityInfo.administrative?.find((admin: any) => admin.adminLevel === 4)?.name;
    const city = localityInfo.locality?.name || localityInfo.city?.name;
    const country = localityInfo.country?.name;

    // Detect language based on state
    const detectedLanguage = state ? STATE_LANGUAGE_MAP[state] || 'en' : 'en';

    return {
      state,
      city,
      country,
      detectedLanguage,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    // Return mock data instead of throwing error
    return getMockLocationData(latitude, longitude);
  }
}

/**
 * Get mock location data for development/fallback
 */
function getMockLocationData(latitude: number, longitude: number): GeocodeResult {
  // Mock Indian states based on approximate coordinates
  const mockStates = [
    { state: 'Maharashtra', lang: 'hi', lat: 19.0, lon: 73.0 },
    { state: 'Karnataka', lang: 'kn', lat: 12.9, lon: 77.5 },
    { state: 'Tamil Nadu', lang: 'ta', lat: 13.0, lon: 80.2 },
    { state: 'West Bengal', lang: 'bn', lat: 22.5, lon: 88.3 },
    { state: 'Gujarat', lang: 'gu', lat: 23.0, lon: 72.5 },
    { state: 'Rajasthan', lang: 'hi', lat: 26.9, lon: 75.7 },
    { state: 'Uttar Pradesh', lang: 'hi', lat: 26.8, lon: 80.9 },
    { state: 'Punjab', lang: 'pa', lat: 30.9, lon: 75.8 },
    { state: 'Kerala', lang: 'ml', lat: 8.5, lon: 76.9 },
    { state: 'Odisha', lang: 'or', lat: 20.2, lon: 85.8 },
    { state: 'Andhra Pradesh', lang: 'te', lat: 17.3, lon: 78.4 },
    { state: 'Assam', lang: 'as', lat: 26.1, lon: 91.7 },
  ];

  // Find closest mock state
  let closestState = mockStates[0];
  let minDistance = Number.MAX_VALUE;

  mockStates.forEach(state => {
    const distance = Math.sqrt(
      Math.pow(latitude - state.lat, 2) + Math.pow(longitude - state.lon, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestState = state;
    }
  });

  return {
    state: closestState.state,
    city: `${closestState.state} City`,
    country: 'India',
    detectedLanguage: closestState.lang,
  };
}

/**
 * Get user's current location using browser geolocation API
 */
export function getCurrentLocation(): Promise<{ latitude: number; longitude: number; accuracy?: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let errorMessage = 'Unable to get your location';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }

        reject(new Error(errorMessage));
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
 * Get language name from code
 */
export function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    en: 'English',
    hi: 'हिंदी (Hindi)',
    gu: 'ગુજરાતી (Gujarati)',
    ta: 'தமிழ் (Tamil)',
    bn: 'বাংলা (Bengali)',
    or: 'ଓଡ଼ିଆ (Odia)',
    te: 'తెలుగు (Telugu)',
    kn: 'ಕನ್ನಡ (Kannada)',
    ml: 'മലയാളം (Malayalam)',
    pa: 'ਪੰਜਾਬੀ (Punjabi)',
    ur: 'اردو (Urdu)',
    as: 'অসমীয়া (Assamese)',
  };

  return languages[code] || code;
}

/**
 * Get available languages for a state
 */
export function getStateLanguages(state: string): string[] {
  const stateLanguages: Record<string, string[]> = {
    'Gujarat': ['gu', 'hi', 'en'],
    'Maharashtra': ['hi', 'mr', 'en'], // Marathi
    'Tamil Nadu': ['ta', 'en'],
    'Karnataka': ['kn', 'en'],
    'West Bengal': ['bn', 'en'],
    'Odisha': ['or', 'en'],
    'Andhra Pradesh': ['te', 'en'],
    'Telangana': ['te', 'en'],
    'Kerala': ['ml', 'en'],
    'Punjab': ['pa', 'en'],
    'Delhi': ['hi', 'en'],
    'Rajasthan': ['hi', 'en'],
    'Uttar Pradesh': ['hi', 'en'],
    'Madhya Pradesh': ['hi', 'en'],
    'Bihar': ['hi', 'en'],
    'Assam': ['as', 'en'],
    'Jammu and Kashmir': ['ur', 'hi', 'en'],
    'Ladakh': ['ur', 'hi', 'en'],
    'Haryana': ['hi', 'pa', 'en'],
    'Himachal Pradesh': ['hi', 'en'],
    'Uttarakhand': ['hi', 'en'],
    'Chhattisgarh': ['hi', 'en'],
    'Jharkhand': ['hi', 'en'],
    'Goa': ['en'],
    'Puducherry': ['ta', 'en'],
    'Chandigarh': ['hi', 'pa', 'en'],
    'Dadra and Nagar Haveli and Daman and Diu': ['gu', 'hi', 'en'],
    'Lakshadweep': ['en'],
    'Meghalaya': ['en'],
    'Nagaland': ['en'],
    'Manipur': ['en'],
    'Mizoram': ['en'],
    'Tripura': ['en'],
    'Sikkim': ['en'],
    'Arunachal Pradesh': ['en'],
  };

  return stateLanguages[state] || ['en', 'hi'];
}
