const Joi = require('joi');

// User validation schemas
const userSchemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    roles: Joi.array().items(Joi.string().valid('buyer', 'artisan', 'admin')).default(['buyer']),
    metadata: Joi.object().default({}),
    preferences: Joi.object().default({})
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  updateProfile: Joi.object({
    fullName: Joi.string().min(2).max(100),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/),
    location: Joi.object({
      state: Joi.string().required(),
      district: Joi.string(),
      coordinates: Joi.object({
        lat: Joi.number().min(-90).max(90),
        lng: Joi.number().min(-180).max(180)
      })
    }),
    preferences: Joi.object({
      language: Joi.string().min(2).max(5),
      notifications: Joi.object({
        email: Joi.boolean(),
        push: Joi.boolean(),
        sms: Joi.boolean()
      })
    }),
    metadata: Joi.object({
      onboardingCompleted: Joi.boolean()
    })
  })
};

// Artisan validation schemas
const artisanSchemas = {
  create: Joi.object({
    fullName: Joi.string().min(2).max(100).required(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).required(),
    location: Joi.object({
      state: Joi.string().required(),
      district: Joi.string().required(),
      pincode: Joi.string().pattern(/^\d{6}$/).required(),
      coordinates: Joi.object({
        lat: Joi.number().min(-90).max(90),
        lng: Joi.number().min(-180).max(180)
      })
    }).required(),
    craftType: Joi.string().min(2).max(100).required(),
    specializations: Joi.array().items(Joi.string()).default([]),
    experience: Joi.number().integer().min(0).default(0),
    bio: Joi.string().max(1000),
    portfolio: Joi.array().items(Joi.string().uri()).default([]),
    languages: Joi.array().items(Joi.string().min(2).max(5)).default(['en'])
  }),

  update: Joi.object({
    fullName: Joi.string().min(2).max(100),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/),
    location: Joi.object({
      state: Joi.string(),
      district: Joi.string(),
      pincode: Joi.string().pattern(/^\d{6}$/),
      coordinates: Joi.object({
        lat: Joi.number().min(-90).max(90),
        lng: Joi.number().min(-180).max(180)
      })
    }),
    craftType: Joi.string().min(2).max(100),
    specializations: Joi.array().items(Joi.string()),
    experience: Joi.number().integer().min(0),
    bio: Joi.string().max(1000),
    portfolio: Joi.array().items(Joi.string().uri()),
    languages: Joi.array().items(Joi.string().min(2).max(5))
  })
};

// Product validation schemas
const productSchemas = {
  create: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().max(2000).required(),
    category: Joi.string().min(2).max(100).required(),
    craftTradition: Joi.string().min(2).max(100),
    price: Joi.number().positive().required(),
    currency: Joi.string().length(3).default('INR'),
    images: Joi.array().items(Joi.string().uri()).min(1).required(),
    stockQuantity: Joi.number().integer().min(0).default(0),
    minOrderQuantity: Joi.number().integer().min(1).default(1),
    dimensions: Joi.object({
      length: Joi.number().positive(),
      width: Joi.number().positive(),
      height: Joi.number().positive(),
      unit: Joi.string().valid('cm', 'inch', 'mm')
    }),
    weight: Joi.object({
      value: Joi.number().positive(),
      unit: Joi.string().valid('kg', 'g', 'lb', 'oz')
    }),
    materials: Joi.array().items(Joi.string()).default([]),
    colors: Joi.array().items(Joi.string()).default([]),
    tags: Joi.array().items(Joi.string()).default([]),
    featured: Joi.boolean().default(false),
    ecoFriendly: Joi.boolean().default(false),
    handmade: Joi.boolean().default(true),
    customizable: Joi.boolean().default(false)
  }),

  update: Joi.object({
    title: Joi.string().min(3).max(200),
    description: Joi.string().max(2000),
    category: Joi.string().min(2).max(100),
    craftTradition: Joi.string().min(2).max(100),
    price: Joi.number().positive(),
    currency: Joi.string().length(3),
    images: Joi.array().items(Joi.string().uri()).min(1),
    stockQuantity: Joi.number().integer().min(0),
    minOrderQuantity: Joi.number().integer().min(1),
    dimensions: Joi.object({
      length: Joi.number().positive(),
      width: Joi.number().positive(),
      height: Joi.number().positive(),
      unit: Joi.string().valid('cm', 'inch', 'mm')
    }),
    weight: Joi.object({
      value: Joi.number().positive(),
      unit: Joi.string().valid('kg', 'g', 'lb', 'oz')
    }),
    materials: Joi.array().items(Joi.string()),
    colors: Joi.array().items(Joi.string()),
    tags: Joi.array().items(Joi.string()),
    featured: Joi.boolean(),
    ecoFriendly: Joi.boolean(),
    handmade: Joi.boolean(),
    customizable: Joi.boolean(),
    status: Joi.string().valid('draft', 'published', 'archived', 'out_of_stock')
  })
};

// Order validation schemas
const orderSchemas = {
  create: Joi.object({
    items: Joi.array().items(Joi.object({
      productId: Joi.string().required(),
      title: Joi.string().required(),
      price: Joi.number().positive().required(),
      quantity: Joi.number().integer().min(1).required(),
      image: Joi.string().uri().required(),
      artisanId: Joi.string().required(),
      customization: Joi.object({
        color: Joi.string(),
        size: Joi.string(),
        notes: Joi.string()
      })
    })).min(1).required(),
    shippingAddress: Joi.object({
      fullName: Joi.string().required(),
      phone: Joi.string().required(),
      email: Joi.string().email().required(),
      addressLine1: Joi.string().required(),
      addressLine2: Joi.string(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      pincode: Joi.string().pattern(/^\d{6}$/).required(),
      country: Joi.string().default('India')
    }).required(),
    billingAddress: Joi.object({
      fullName: Joi.string().required(),
      phone: Joi.string().required(),
      email: Joi.string().email().required(),
      addressLine1: Joi.string().required(),
      addressLine2: Joi.string(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      pincode: Joi.string().pattern(/^\d{6}$/).required(),
      country: Joi.string().default('India')
    }),
    notes: Joi.string().max(500)
  }),

  updateStatus: Joi.object({
    orderStatus: Joi.string().valid('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded').required(),
    trackingNumber: Joi.string(),
    notes: Joi.string()
  })
};

// Review validation schemas
const reviewSchemas = {
  create: Joi.object({
    productId: Joi.string().required(),
    orderId: Joi.string(),
    rating: Joi.number().integer().min(1).max(5).required(),
    title: Joi.string().min(3).max(100).required(),
    comment: Joi.string().min(10).max(1000).required(),
    images: Joi.array().items(Joi.string().uri()).default([])
  }),

  update: Joi.object({
    rating: Joi.number().integer().min(1).max(5),
    title: Joi.string().min(3).max(100),
    comment: Joi.string().min(10).max(1000),
    images: Joi.array().items(Joi.string().uri())
  })
};

// AI validation schemas
const aiSchemas = {
  generateDescription: Joi.object({
    productTitle: Joi.string().min(1).max(200).required(),
    category: Joi.string().min(2).max(100).required(),
    craftTradition: Joi.string().min(2).max(100),
    materials: Joi.array().items(Joi.string()).default([]),
    targetAudience: Joi.string().min(2).max(100)
  }),

  generatePricing: Joi.object({
    category: Joi.string().min(2).max(100).required(),
    materials: Joi.array().items(Joi.string()).default([]),
    craftsmanshipHours: Joi.number().positive().required(),
    marketLocation: Joi.string().min(2).max(100).required()
  }),

  generateBio: Joi.object({
    craftType: Joi.string().min(2).max(100).required(),
    experience: Joi.number().integer().min(0).required(),
    specializations: Joi.array().items(Joi.string()).default([]),
    location: Joi.string().min(2).max(100).required(),
    achievements: Joi.string().max(500)
  }),

  categorizeProduct: Joi.object({
    productTitle: Joi.string().min(1).max(200).required(),
    description: Joi.string().min(10).max(2000).required(),
    materials: Joi.array().items(Joi.string()).default([])
  })
};

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    req.body = value;
    next();
  };
};



module.exports = {
  userSchemas,
  artisanSchemas,
  productSchemas,
  orderSchemas,
  reviewSchemas,
  aiSchemas,
  validate
};


