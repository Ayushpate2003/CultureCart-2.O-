import { databases, DATABASE_ID, USERS_COLLECTION_ID, ARTISANS_COLLECTION_ID } from '@/lib/appwrite';
import { ID } from 'appwrite';

export const userAPI = {
  updateProfile: async (userId: string, data: any) => {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId,
        data
      );
      return { success: true, data: response };
    } catch (error) {
      console.error('Profile update failed:', error);
      return { success: false, error };
    }
  },

  updatePreferences: async (userId: string, preferences: any) => {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId,
        { preferences }
      );
      return { success: true, data: response };
    } catch (error) {
      console.error('Preferences update failed:', error);
      return { success: false, error };
    }
  },

  getProfile: async (userId: string) => {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId
      );
      return { success: true, data: response };
    } catch (error) {
      console.error('Profile fetch failed:', error);
      return { success: false, error };
    }
  },

  createUserDocument: async (userData: any) => {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        userData
      );
      return { success: true, data: response };
    } catch (error) {
      console.error('User document creation failed:', error);
      return { success: false, error };
    }
  },

  createArtisanDocument: async (artisanData: any) => {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        ARTISANS_COLLECTION_ID,
        ID.unique(),
        artisanData
      );
      return { success: true, data: response };
    } catch (error) {
      console.error('Artisan document creation failed:', error);
      return { success: false, error };
    }
  }
};
