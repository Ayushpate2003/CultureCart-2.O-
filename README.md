# CultureCart 🛍️

A comprehensive multi-role eCommerce platform connecting Indian artisans with global buyers through AI-powered features and traditional craft preservation.

![CultureCart Banner](https://via.placeholder.com/800x200/4F46E5/FFFFFF?text=CultureCart+-+Empowering+Indian+Artisans)

## 🌟 Overview

CultureCart is a modern eCommerce platform specifically designed for Indian artisans to showcase and sell their traditional crafts. The platform features role-based dashboards for buyers, artisans, and administrators, with AI-powered content generation, voice descriptions, and intelligent product recommendations.

### 🎯 Mission
To preserve and promote India's rich artisanal heritage while providing artisans with modern digital tools to reach global markets.

## ✨ Features

### 👨‍💼 For Artisans
- **AI-Powered Upload Wizard**: 5-step guided process with voice descriptions and AI-generated content
- **Product Management**: Comprehensive dashboard for managing crafts, orders, and analytics
- **Earnings Tracking**: Real-time earnings, transaction history, and payout requests
- **Messaging System**: Direct communication with buyers
- **Analytics Dashboard**: Performance insights with AI recommendations

### 🛒 For Buyers
- **AI Shopping Assistant**: Intelligent product recommendations and search
- **Marketplace Exploration**: Browse crafts by category, region, and artisan
- **Wishlist & Cart**: Save favorites and seamless checkout
- **Order Tracking**: Real-time updates on purchases
- **Rewards System**: Cashback and loyalty programs

### 👨‍💼 For Administrators
- **User Management**: Comprehensive admin panel for all users
- **Product Moderation**: Approve/reject artisan submissions
- **Analytics & Insights**: Platform-wide performance metrics
- **Order Management**: Oversee all transactions
- **Artisan Verification**: Verify and manage artisan profiles

### 🤖 AI Features
- **Content Generation**: AI-powered product titles, descriptions, and tags
- **Voice Descriptions**: Record and transcribe craft stories
- **Smart Recommendations**: Personalized product suggestions
- **Image Analysis**: AI-powered image processing and optimization
- **Chat Assistant**: Context-aware help throughout the platform

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Zustand** - Lightweight state management
- **React Query** - Powerful data fetching and caching
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations
- **React Three Fiber** - 3D model rendering

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Primary database
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Nodemailer** - Email services

### DevOps & Tools
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Firebase** - Authentication and hosting
- **Lighthouse** - Performance monitoring
- **Jest** - Unit testing
- **Cypress** - E2E testing
- **ESLint** - Code linting

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **bun** (latest version)
- **Docker** and **Docker Compose**
- **PostgreSQL** (if running without Docker)
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/culturecart.git
cd culturecart
```

### 2. Environment Setup

#### Frontend Environment Variables
Create `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### Backend Environment Variables
Create `.env` file in `culturecart-backend/` directory:

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://culturecart_user:culturecart_password@localhost:5433/culturecart_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
UPLOAD_PATH=/app/uploads
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Docker Setup (Recommended)

```bash
# Start all services (PostgreSQL, PgAdmin, Backend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 4. Manual Setup (Alternative)

#### Database Setup
```bash
# Install PostgreSQL and create database
createdb culturecart_db

# Run database migrations
psql -d culturecart_db -f database/init.sql
```

#### Backend Setup
```bash
cd culturecart-backend
npm install
npm run dev
```

#### Frontend Setup
```bash
# Using npm
npm install
npm run dev

# Or using bun (faster)
bun install
bun run dev
```

### 5. Build for Production

```bash
# Frontend
npm run build

# Backend
cd culturecart-backend
npm run build
```

## 📖 Usage

### Development

```bash
# Start frontend development server
npm run dev

# Start backend development server
cd culturecart-backend && npm run dev

# Start with Docker
docker-compose up
```

### Production

```bash
# Build and serve frontend
npm run build
npm run preview

# Start backend
cd culturecart-backend && npm start
```

### Key URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **PgAdmin**: http://localhost:5051 (admin@admin.com / admin)
- **PostgreSQL**: localhost:5433

## 🔌 API Documentation

### Authentication Endpoints

```javascript
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET /api/auth/me
```

### Product Endpoints

```javascript
GET /api/products - Get all products
POST /api/products - Create product (artisan only)
GET /api/products/:id - Get product details
PUT /api/products/:id - Update product
DELETE /api/products/:id - Delete product
```

### Order Endpoints

```javascript
GET /api/orders - Get user orders
POST /api/orders - Create order
GET /api/orders/:id - Get order details
PUT /api/orders/:id/status - Update order status
```

### User Management (Admin only)

```javascript
GET /api/admin/users - Get all users
PUT /api/admin/users/:id/status - Update user status
GET /api/admin/analytics - Get platform analytics
```

## 🧪 Testing

CultureCart includes comprehensive testing setup:

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
# Run in headless mode
npm run cypress:run

# Run in interactive mode
npm run cypress:open
```

### Performance Testing
```bash
npm run lighthouse
```

### Accessibility Testing
```bash
npm run test:a11y
```

### Test Coverage
```bash
npm run test:coverage
```

See [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) for detailed testing procedures.

## 📁 Project Structure

```
culturecart/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── stores/        # Zustand state stores
│   ├── services/      # API services
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   ├── types/         # TypeScript type definitions
│   └── config/        # Configuration files
├── culturecart-backend/
│   ├── routes/        # API route handlers
│   ├── middleware/    # Express middleware
│   ├── config/        # Backend configuration
│   └── uploads/       # File upload directory
├── database/
│   └── init.sql       # Database schema
├── public/            # Static assets
└── docker-compose.yml # Docker orchestration
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass
- Follow semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Indian Artisans**: For preserving centuries-old traditions
- **Open Source Community**: For the amazing tools and libraries
- **Contributors**: For their valuable contributions

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/culturecart/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/culturecart/discussions)
- **Email**: support@culturecart.com

## 🎉 Roadmap

- [ ] Mobile app development
- [ ] Multi-language support (Hindi, regional languages)
- [ ] Advanced AI features (image generation, trend analysis)
- [ ] Blockchain-based authenticity verification
- [ ] Integration with government artisan schemes
- [ ] Global shipping partnerships

---

**Made with ❤️ for India's artisans**

[![GitHub stars](https://img.shields.io/github/stars/your-username/culturecart.svg)](https://github.com/your-username/culturecart/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/your-username/culturecart.svg)](https://github.com/your-username/culturecart/network)
[![GitHub issues](https://img.shields.io/github/issues/your-username/culturecart.svg)](https://github.com/your-username/culturecart/issues)
