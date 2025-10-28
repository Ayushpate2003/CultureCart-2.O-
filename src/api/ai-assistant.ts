import { functions, AI_PRODUCT_PROCESSOR_FUNCTION } from '@/lib/appwrite';

export const aiAPI = {
  chat: async (message: string, context: any = {}) => {
    try {
      const response = await functions.createExecution(
        AI_PRODUCT_PROCESSOR_FUNCTION,
        JSON.stringify({
          action: 'chat',
          message,
          context: {
            userRole: context.userRole || 'buyer',
            userId: context.userId,
            language: context.language || 'en',
            ...context
          }
        })
      );

      const result = JSON.parse(response.responseBody || response.response);
      return { success: true, data: result };
    } catch (error) {
      console.error('AI chat failed:', error);
      return {
        success: false,
        error,
        data: {
          message: "I'm sorry, I'm having trouble connecting right now. Please try again later."
        }
      };
    }
  },

  generateProductDescription: async (productData: any) => {
    try {
      const response = await functions.createExecution(
        AI_PRODUCT_PROCESSOR_FUNCTION,
        JSON.stringify({
          action: 'generate_description',
          productData
        })
      );

      const result = JSON.parse(response.responseBody || response.response);
      return { success: true, data: result };
    } catch (error) {
      console.error('AI description generation failed:', error);
      return { success: false, error };
    }
  },

  enhanceProductImages: async (imageUrls: string[]) => {
    try {
      const response = await functions.createExecution(
        AI_PRODUCT_PROCESSOR_FUNCTION,
        JSON.stringify({
          action: 'enhance_images',
          imageUrls
        })
      );

      const result = JSON.parse(response.responseBody || response.response);
      return { success: true, data: result };
    } catch (error) {
      console.error('AI image enhancement failed:', error);
      return { success: false, error };
    }
  },

  suggestPricing: async (productData: any, marketData?: any) => {
    try {
      const response = await functions.createExecution(
        AI_PRODUCT_PROCESSOR_FUNCTION,
        JSON.stringify({
          action: 'suggest_pricing',
          productData,
          marketData
        })
      );

      const result = JSON.parse(response.responseBody || response.response);
      return { success: true, data: result };
    } catch (error) {
      console.error('AI pricing suggestion failed:', error);
      return { success: false, error };
    }
  },

  generateMarketingContent: async (productData: any, targetAudience?: string) => {
    try {
      const response = await functions.createExecution(
        AI_PRODUCT_PROCESSOR_FUNCTION,
        JSON.stringify({
          action: 'generate_marketing',
          productData,
          targetAudience
        })
      );

      const result = JSON.parse(response.responseBody || response.response);
      return { success: true, data: result };
    } catch (error) {
      console.error('AI marketing content generation failed:', error);
      return { success: false, error };
    }
  }
};
