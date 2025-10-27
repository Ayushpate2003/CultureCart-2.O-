# CultureCart - Frontend Functionality Testing Checklist

## 📋 Overview

Comprehensive testing documentation for CultureCart - a multi-role eCommerce platform for Indian artisans.

**Tech Stack**: React 18 + TypeScript + TailwindCSS + Zustand + React Query + Appwrite

**Test Frameworks**: Jest + React Testing Library + Cypress + axe-core + Lighthouse

---

## 🚀 Test Environment Setup

### Prerequisites

```bash
# Install dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev cypress @cypress/react18
npm install --save-dev axe-core @axe-core/react
npm install --save-dev lighthouse lighthouse-ci
npm install --save-dev @testing-library/cypress
```

### Configuration Files

**jest.config.js**
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts'
  ],
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

**cypress.config.ts**
```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});
```

**lighthouserc.js**
```javascript
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:5173/'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
  },
};
```

---

## 🔐 1. Authentication & Authorization Tests

### 1.1 Login Flow - All Roles

**Test File**: `cypress/e2e/auth/login.cy.ts`

```javascript
describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form with all required fields', () => {
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible').and('contain', 'Login');
  });

  it('should show validation errors for empty fields', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });

  it('should show error for invalid email format', () => {
    cy.get('input[type="email"]').type('invalid-email');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid email address').should('be.visible');
  });

  it('should login admin and redirect to admin dashboard', () => {
    cy.get('input[type="email"]').type('admin@culturecart.com');
    cy.get('input[type="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard/admin');
    cy.contains('Admin Dashboard').should('be.visible');
  });

  it('should login artisan and redirect to artisan dashboard', () => {
    cy.get('input[type="email"]').type('artisan@culturecart.com');
    cy.get('input[type="password"]').type('artisan123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard/artisan');
    cy.contains('Artisan Dashboard').should('be.visible');
  });

  it('should login buyer and redirect to buyer dashboard', () => {
    cy.get('input[type="email"]').type('buyer@culturecart.com');
    cy.get('input[type="password"]').type('buyer123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard/buyer');
    cy.contains('Buyer Dashboard').should('be.visible');
  });

  it('should show error for incorrect credentials', () => {
    cy.get('input[type="email"]').type('wrong@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid credentials').should('be.visible');
  });

  it('should persist auth state after page reload', () => {
    // Login first
    cy.get('input[type="email"]').type('buyer@culturecart.com');
    cy.get('input[type="password"]').type('buyer123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard/buyer');
    
    // Reload page
    cy.reload();
    
    // Should still be authenticated
    cy.url().should('include', '/dashboard/buyer');
  });
});
```

### 1.2 Protected Routes

**Test File**: `cypress/e2e/auth/protected-routes.cy.ts`

```javascript
describe('Protected Routes', () => {
  const protectedRoutes = [
    { path: '/dashboard/admin', role: 'admin' },
    { path: '/dashboard/artisan', role: 'artisan' },
    { path: '/dashboard/buyer', role: 'buyer' },
    { path: '/artisan/upload', role: 'artisan' },
    { path: '/admin/users', role: 'admin' },
  ];

  it('should redirect unauthenticated users to login', () => {
    protectedRoutes.forEach(route => {
      cy.visit(route.path);
      cy.url().should('include', '/login');
    });
  });

  it('should prevent role-based unauthorized access', () => {
    // Login as buyer
    cy.login('buyer@culturecart.com', 'buyer123');
    
    // Try to access admin route
    cy.visit('/dashboard/admin');
    cy.url().should('include', '/dashboard/buyer'); // Redirected to their dashboard
  });

  it('should allow access to role-specific routes', () => {
    // Login as artisan
    cy.login('artisan@culturecart.com', 'artisan123');
    
    // Should access artisan routes
    cy.visit('/artisan/upload');
    cy.url().should('include', '/artisan/upload');
    cy.get('h2').should('contain', 'Upload Your Craft');
  });
});
```

### 1.3 Logout Functionality

```javascript
describe('Logout', () => {
  beforeEach(() => {
    cy.login('buyer@culturecart.com', 'buyer123');
  });

  it('should logout user and redirect to home', () => {
    cy.get('[data-testid="user-menu"]').click();
    cy.get('[data-testid="logout-button"]').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should clear auth state after logout', () => {
    cy.get('[data-testid="user-menu"]').click();
    cy.get('[data-testid="logout-button"]').click();
    
    // Try to access protected route
    cy.visit('/dashboard/buyer');
    cy.url().should('include', '/login');
  });
});
```

---

## 👨‍💼 2. Admin Dashboard Tests

### 2.1 All Users Management

**Test File**: `cypress/e2e/admin/users.cy.ts`

```javascript
describe('Admin - All Users', () => {
  beforeEach(() => {
    cy.login('admin@culturecart.com', 'admin123');
    cy.visit('/admin/users');
  });

  it('should display users table with pagination', () => {
    cy.get('table').should('be.visible');
    cy.get('tbody tr').should('have.length.at.least', 1);
    cy.get('[data-testid="pagination"]').should('be.visible');
  });

  it('should filter users by role', () => {
    cy.get('select[name="roleFilter"]').select('artisan');
    cy.wait(500);
    cy.get('tbody tr').each(($row) => {
      cy.wrap($row).find('td').eq(3).should('contain', 'artisan');
    });
  });

  it('should search users by name or email', () => {
    cy.get('input[placeholder*="Search"]').type('Priya');
    cy.wait(500);
    cy.get('tbody tr').should('have.length.at.least', 1);
    cy.get('tbody tr').first().should('contain', 'Priya');
  });

  it('should suspend a user', () => {
    cy.get('tbody tr').first().find('[data-testid="actions-menu"]').click();
    cy.get('[data-testid="suspend-user"]').click();
    cy.get('[data-testid="confirm-suspend"]').click();
    cy.contains('User suspended successfully').should('be.visible');
  });

  it('should activate a suspended user', () => {
    // Filter suspended users
    cy.get('select[name="statusFilter"]').select('suspended');
    cy.get('tbody tr').first().find('[data-testid="actions-menu"]').click();
    cy.get('[data-testid="activate-user"]').click();
    cy.contains('User activated successfully').should('be.visible');
  });

  it('should delete a user with confirmation', () => {
    const userCount = Cypress.$('tbody tr').length;
    cy.get('tbody tr').last().find('[data-testid="actions-menu"]').click();
    cy.get('[data-testid="delete-user"]').click();
    cy.get('[data-testid="confirm-delete"]').click();
    cy.contains('User deleted successfully').should('be.visible');
    cy.get('tbody tr').should('have.length', userCount - 1);
  });

  it('should paginate through users', () => {
    cy.get('[data-testid="next-page"]').click();
    cy.url().should('include', 'page=2');
    cy.get('[data-testid="prev-page"]').click();
    cy.url().should('include', 'page=1');
  });
});
```

### 2.2 All Products Management

```javascript
describe('Admin - All Products', () => {
  beforeEach(() => {
    cy.login('admin@culturecart.com', 'admin123');
    cy.visit('/admin/products');
  });

  it('should display products with stats cards', () => {
    cy.get('[data-testid="total-products"]').should('be.visible');
    cy.get('[data-testid="pending-approval"]').should('be.visible');
    cy.get('[data-testid="approved-products"]').should('be.visible');
  });

  it('should filter products by status', () => {
    cy.get('select[name="statusFilter"]').select('pending');
    cy.wait(500);
    cy.get('tbody tr').each(($row) => {
      cy.wrap($row).find('[data-testid="status-badge"]').should('contain', 'Pending');
    });
  });

  it('should filter products by category', () => {
    cy.get('select[name="categoryFilter"]').select('Textiles');
    cy.wait(500);
    cy.get('tbody tr').should('have.length.at.least', 1);
  });

  it('should approve a pending product', () => {
    cy.get('select[name="statusFilter"]').select('pending');
    cy.get('tbody tr').first().find('[data-testid="approve-btn"]').click();
    cy.get('[data-testid="confirm-approve"]').click();
    cy.contains('Product approved').should('be.visible');
  });

  it('should reject a product with reason', () => {
    cy.get('tbody tr').first().find('[data-testid="reject-btn"]').click();
    cy.get('textarea[name="rejectionReason"]').type('Image quality is too low');
    cy.get('[data-testid="confirm-reject"]').click();
    cy.contains('Product rejected').should('be.visible');
  });

  it('should view product details', () => {
    cy.get('tbody tr').first().find('[data-testid="view-details"]').click();
    cy.get('[data-testid="product-modal"]').should('be.visible');
    cy.get('[data-testid="product-title"]').should('be.visible');
    cy.get('[data-testid="product-price"]').should('be.visible');
  });
});
```

### 2.3 All Artisans Management

```javascript
describe('Admin - All Artisans', () => {
  beforeEach(() => {
    cy.login('admin@culturecart.com', 'admin123');
    cy.visit('/admin/artisans');
  });

  it('should display artisan verification stats', () => {
    cy.get('[data-testid="total-artisans"]').should('be.visible');
    cy.get('[data-testid="verified-artisans"]').should('be.visible');
    cy.get('[data-testid="pending-verification"]').should('be.visible');
  });

  it('should verify an artisan', () => {
    cy.get('select[name="statusFilter"]').select('pending');
    cy.get('tbody tr').first().find('[data-testid="verify-btn"]').click();
    cy.get('[data-testid="confirm-verify"]').click();
    cy.contains('Artisan verified successfully').should('be.visible');
  });

  it('should view artisan profile and products', () => {
    cy.get('tbody tr').first().find('[data-testid="view-profile"]').click();
    cy.get('[data-testid="artisan-modal"]').should('be.visible');
    cy.get('[data-testid="artisan-bio"]').should('be.visible');
    cy.get('[data-testid="artisan-products"]').should('be.visible');
  });
});
```

### 2.4 All Orders Management

```javascript
describe('Admin - All Orders', () => {
  beforeEach(() => {
    cy.login('admin@culturecart.com', 'admin123');
    cy.visit('/admin/orders');
  });

  it('should display order statistics', () => {
    cy.get('[data-testid="total-orders"]').should('be.visible');
    cy.get('[data-testid="pending-orders"]').should('be.visible');
    cy.get('[data-testid="completed-orders"]').should('be.visible');
    cy.get('[data-testid="total-revenue"]').should('be.visible');
  });

  it('should filter orders by status', () => {
    cy.get('select[name="statusFilter"]').select('shipped');
    cy.wait(500);
    cy.get('tbody tr').each(($row) => {
      cy.wrap($row).find('[data-testid="status-badge"]').should('contain', 'Shipped');
    });
  });

  it('should view order details', () => {
    cy.get('tbody tr').first().find('[data-testid="view-order"]').click();
    cy.get('[data-testid="order-modal"]').should('be.visible');
    cy.get('[data-testid="order-items"]').should('be.visible');
    cy.get('[data-testid="customer-info"]').should('be.visible');
  });

  it('should search orders by ID or customer', () => {
    cy.get('input[placeholder*="Search"]').type('ORD-001');
    cy.wait(500);
    cy.get('tbody tr').should('have.length', 1);
    cy.get('tbody tr').first().should('contain', 'ORD-001');
  });
});
```

### 2.5 Admin Analytics

```javascript
describe('Admin - Analytics', () => {
  beforeEach(() => {
    cy.login('admin@culturecart.com', 'admin123');
    cy.visit('/admin/analytics');
  });

  it('should display platform overview metrics', () => {
    cy.get('[data-testid="total-revenue"]').should('be.visible');
    cy.get('[data-testid="total-orders"]').should('be.visible');
    cy.get('[data-testid="active-users"]').should('be.visible');
    cy.get('[data-testid="platform-growth"]').should('be.visible');
  });

  it('should render revenue chart', () => {
    cy.get('[data-testid="revenue-chart"]').should('be.visible');
    cy.get('.recharts-line').should('exist');
  });

  it('should render category distribution chart', () => {
    cy.get('[data-testid="category-chart"]').should('be.visible');
    cy.get('.recharts-pie').should('exist');
  });

  it('should change time range filter', () => {
    cy.get('select[name="timeRange"]').select('30d');
    cy.wait(1000);
    cy.get('[data-testid="revenue-chart"]').should('be.visible');
  });

  it('should export analytics data', () => {
    cy.get('[data-testid="export-btn"]').click();
    cy.get('[data-testid="export-csv"]').click();
    // Verify download initiated
    cy.readFile('cypress/downloads/analytics-data.csv').should('exist');
  });
});
```

---

## 🎨 3. Artisan Dashboard Tests

### 3.1 Upload Craft Wizard - Step 1: Image Upload

**Test File**: `cypress/e2e/artisan/upload-wizard.cy.ts`

```javascript
describe('Artisan - Upload Wizard', () => {
  beforeEach(() => {
    cy.login('artisan@culturecart.com', 'artisan123');
    cy.visit('/artisan/upload');
  });

  describe('Step 1 - Image Upload', () => {
    it('should display image upload zone', () => {
      cy.get('[data-testid="image-upload-zone"]').should('be.visible');
      cy.contains('Upload 1-5 high-quality images').should('be.visible');
    });

    it('should allow drag and drop image upload', () => {
      const fileName = 'test-craft.jpg';
      cy.get('[data-testid="image-upload-zone"]').attachFile(fileName, {
        subjectType: 'drag-n-drop'
      });
      cy.get('[data-testid="image-preview"]').should('have.length', 1);
    });

    it('should allow multiple image selection', () => {
      const files = ['craft1.jpg', 'craft2.jpg', 'craft3.jpg'];
      cy.get('input[type="file"]').attachFile(files, { allowEmpty: true });
      cy.get('[data-testid="image-preview"]').should('have.length', 3);
    });

    it('should show error for exceeding max files (5)', () => {
      const files = Array(6).fill('craft.jpg');
      cy.get('input[type="file"]').attachFile(files, { allowEmpty: true });
      cy.contains('Maximum 5 images allowed').should('be.visible');
    });

    it('should allow removing uploaded images', () => {
      cy.get('input[type="file"]').attachFile('craft1.jpg');
      cy.get('[data-testid="image-preview"]').should('have.length', 1);
      cy.get('[data-testid="remove-image"]').first().click();
      cy.get('[data-testid="image-preview"]').should('have.length', 0);
    });

    it('should reorder images via drag and drop', () => {
      cy.get('input[type="file"]').attachFile(['craft1.jpg', 'craft2.jpg']);
      cy.get('[data-testid="image-preview"]').first().trigger('dragstart');
      cy.get('[data-testid="image-preview"]').last().trigger('drop');
      // Verify order changed
    });

    it('should disable continue button without images', () => {
      cy.get('button').contains('Continue').should('be.disabled');
    });

    it('should proceed to step 2 with valid images', () => {
      cy.get('input[type="file"]').attachFile('craft1.jpg');
      cy.get('button').contains('Continue').should('not.be.disabled').click();
      cy.url().should('include', 'step=2');
      cy.contains('Voice Description').should('be.visible');
    });
  });

  describe('Step 2 - Voice Description', () => {
    beforeEach(() => {
      cy.get('input[type="file"]').attachFile('craft1.jpg');
      cy.get('button').contains('Continue').click();
    });

    it('should display voice recorder', () => {
      cy.get('[data-testid="voice-recorder"]').should('be.visible');
      cy.get('[data-testid="record-btn"]').should('be.visible');
    });

    it('should record voice description', () => {
      cy.get('[data-testid="record-btn"]').click();
      cy.wait(2000);
      cy.get('[data-testid="stop-btn"]').click();
      cy.get('[data-testid="audio-preview"]').should('be.visible');
    });

    it('should allow text input alternative', () => {
      cy.get('[data-testid="text-input-toggle"]').click();
      cy.get('textarea').type('This is a handwoven Pashmina shawl made using traditional methods');
      cy.get('textarea').should('have.value', 'This is a handwoven Pashmina shawl made using traditional methods');
    });

    it('should validate minimum description length', () => {
      cy.get('[data-testid="text-input-toggle"]').click();
      cy.get('textarea').type('Short');
      cy.get('button').contains('Continue').click();
      cy.contains('Description must be at least 20 characters').should('be.visible');
    });

    it('should select language for description', () => {
      cy.get('select[name="language"]').select('Hindi');
      cy.get('select[name="language"]').should('have.value', 'hi');
    });

    it('should proceed to step 3', () => {
      cy.get('[data-testid="text-input-toggle"]').click();
      cy.get('textarea').type('This is a handwoven Pashmina shawl made using traditional methods from Kashmir');
      cy.get('button').contains('Continue').click();
      cy.url().should('include', 'step=3');
    });
  });

  describe('Step 3 - Basic Details', () => {
    beforeEach(() => {
      // Complete steps 1 and 2
      cy.get('input[type="file"]').attachFile('craft1.jpg');
      cy.get('button').contains('Continue').click();
      cy.get('[data-testid="text-input-toggle"]').click();
      cy.get('textarea').type('Traditional handwoven craft');
      cy.get('button').contains('Continue').click();
    });

    it('should display all required fields', () => {
      cy.get('input[name="price"]').should('be.visible');
      cy.get('input[name="quantity"]').should('be.visible');
      cy.get('input[name="length"]').should('be.visible');
      cy.get('input[name="width"]').should('be.visible');
      cy.get('input[name="height"]').should('be.visible');
      cy.get('input[name="weight"]').should('be.visible');
    });

    it('should validate price format', () => {
      cy.get('input[name="price"]').type('invalid');
      cy.get('button').contains('Continue').click();
      cy.contains('Invalid price format').should('be.visible');
    });

    it('should validate quantity is whole number', () => {
      cy.get('input[name="quantity"]').type('2.5');
      cy.get('button').contains('Continue').click();
      cy.contains('Quantity must be a whole number').should('be.visible');
    });

    it('should fill all fields correctly', () => {
      cy.get('input[name="price"]').type('2500');
      cy.get('input[name="quantity"]').type('5');
      cy.get('input[name="length"]').type('200');
      cy.get('input[name="width"]').type('100');
      cy.get('input[name="height"]').type('2');
      cy.get('input[name="weight"]').type('0.5');
      cy.get('input[type="checkbox"][name="customizable"]').check();
      cy.get('button').contains('Continue').click();
      cy.url().should('include', 'step=4');
    });
  });

  describe('Step 4 - AI Preview', () => {
    beforeEach(() => {
      // Complete steps 1-3
      cy.completeUploadSteps(1, 3);
    });

    it('should display AI generated content', () => {
      cy.get('[data-testid="ai-title"]').should('be.visible');
      cy.get('[data-testid="ai-story"]').should('be.visible');
      cy.get('[data-testid="ai-tags"]').should('be.visible');
    });

    it('should allow editing AI generated title', () => {
      cy.get('[data-testid="edit-title"]').click();
      cy.get('input[name="title"]').clear().type('Custom Handwoven Pashmina');
      cy.get('[data-testid="save-title"]').click();
      cy.get('[data-testid="ai-title"]').should('contain', 'Custom Handwoven Pashmina');
    });

    it('should allow editing AI generated story', () => {
      cy.get('[data-testid="edit-story"]').click();
      cy.get('textarea[name="story"]').clear().type('Updated story about the craft');
      cy.get('[data-testid="save-story"]').click();
    });

    it('should add/remove tags', () => {
      cy.get('[data-testid="add-tag"]').click();
      cy.get('input[name="newTag"]').type('handmade{enter}');
      cy.get('[data-testid="ai-tags"]').should('contain', 'handmade');
      
      cy.get('[data-testid="remove-tag"]').first().click();
      // Verify tag removed
    });

    it('should regenerate AI content', () => {
      const originalTitle = cy.get('[data-testid="ai-title"]').invoke('text');
      cy.get('[data-testid="regenerate-btn"]').click();
      cy.wait(2000);
      cy.get('[data-testid="ai-title"]').invoke('text').should('not.equal', originalTitle);
    });

    it('should proceed to final review', () => {
      cy.get('button').contains('Continue').click();
      cy.url().should('include', 'step=5');
    });
  });

  describe('Step 5 - Final Review', () => {
    beforeEach(() => {
      cy.completeUploadSteps(1, 4);
    });

    it('should display all submitted information', () => {
      cy.get('[data-testid="review-images"]').should('be.visible');
      cy.get('[data-testid="review-title"]').should('be.visible');
      cy.get('[data-testid="review-price"]').should('be.visible');
      cy.get('[data-testid="review-dimensions"]').should('be.visible');
    });

    it('should allow going back to edit', () => {
      cy.get('[data-testid="edit-step-3"]').click();
      cy.url().should('include', 'step=3');
    });

    it('should submit craft successfully', () => {
      cy.get('[data-testid="submit-craft"]').click();
      cy.contains('Craft uploaded successfully').should('be.visible');
      cy.url().should('include', '/artisan/products');
    });

    it('should show success modal after submission', () => {
      cy.get('[data-testid="submit-craft"]').click();
      cy.get('[data-testid="success-modal"]').should('be.visible');
      cy.get('[data-testid="view-products"]').click();
      cy.url().should('include', '/artisan/products');
    });
  });
});
```

### 3.2 My Products

```javascript
describe('Artisan - My Products', () => {
  beforeEach(() => {
    cy.login('artisan@culturecart.com', 'artisan123');
    cy.visit('/artisan/products');
  });

  it('should display all artisan products', () => {
    cy.get('[data-testid="product-card"]').should('have.length.at.least', 1);
  });

  it('should filter products by status', () => {
    cy.get('select[name="statusFilter"]').select('approved');
    cy.wait(500);
    cy.get('[data-testid="status-badge"]').each(($badge) => {
      cy.wrap($badge).should('contain', 'Approved');
    });
  });

  it('should search products by name', () => {
    cy.get('input[placeholder*="Search"]').type('Pashmina');
    cy.wait(500);
    cy.get('[data-testid="product-card"]').first().should('contain', 'Pashmina');
  });

  it('should edit a product', () => {
    cy.get('[data-testid="product-card"]').first().find('[data-testid="edit-btn"]').click();
    cy.get('input[name="price"]').clear().type('3000');
    cy.get('[data-testid="save-changes"]').click();
    cy.contains('Product updated').should('be.visible');
  });

  it('should toggle product availability', () => {
    cy.get('[data-testid="product-card"]').first().find('[data-testid="toggle-availability"]').click();
    cy.contains('Product status updated').should('be.visible');
  });

  it('should delete a product', () => {
    cy.get('[data-testid="product-card"]').first().find('[data-testid="delete-btn"]').click();
    cy.get('[data-testid="confirm-delete"]').click();
    cy.contains('Product deleted').should('be.visible');
  });
});
```

### 3.3 Orders Management

```javascript
describe('Artisan - Orders', () => {
  beforeEach(() => {
    cy.login('artisan@culturecart.com', 'artisan123');
    cy.visit('/artisan/orders');
  });

  it('should display order statistics', () => {
    cy.get('[data-testid="pending-orders"]').should('be.visible');
    cy.get('[data-testid="completed-orders"]').should('be.visible');
    cy.get('[data-testid="total-revenue"]').should('be.visible');
  });

  it('should filter orders by status', () => {
    cy.get('select[name="statusFilter"]').select('pending');
    cy.wait(500);
    cy.get('[data-testid="status-badge"]').each(($badge) => {
      cy.wrap($badge).should('contain', 'Pending');
    });
  });

  it('should update order status', () => {
    cy.get('[data-testid="order-card"]').first().find('[data-testid="update-status"]').click();
    cy.get('select[name="newStatus"]').select('shipped');
    cy.get('[data-testid="confirm-status"]').click();
    cy.contains('Order status updated').should('be.visible');
  });

  it('should view order details', () => {
    cy.get('[data-testid="order-card"]').first().find('[data-testid="view-details"]').click();
    cy.get('[data-testid="order-modal"]').should('be.visible');
    cy.get('[data-testid="buyer-info"]').should('be.visible');
  });
});
```

### 3.4 Analytics

```javascript
describe('Artisan - Analytics', () => {
  beforeEach(() => {
    cy.login('artisan@culturecart.com', 'artisan123');
    cy.visit('/artisan/analytics');
  });

  it('should display performance metrics', () => {
    cy.get('[data-testid="total-views"]').should('be.visible');
    cy.get('[data-testid="total-sales"]').should('be.visible');
    cy.get('[data-testid="conversion-rate"]').should('be.visible');
  });

  it('should render sales trend chart', () => {
    cy.get('[data-testid="sales-chart"]').should('be.visible');
    cy.get('.recharts-line').should('exist');
  });

  it('should display AI insights', () => {
    cy.get('[data-testid="ai-insights"]').should('be.visible');
    cy.get('[data-testid="ai-tip"]').should('have.length.at.least', 1);
  });

  it('should change time range', () => {
    cy.get('select[name="timeRange"]').select('30d');
    cy.wait(1000);
    cy.get('[data-testid="sales-chart"]').should('be.visible');
  });

  it('should export analytics data', () => {
    cy.get('[data-testid="export-btn"]').click();
    cy.get('[data-testid="export-pdf"]').click();
  });
});
```

### 3.5 Earnings & Transactions

```javascript
describe('Artisan - Earnings', () => {
  beforeEach(() => {
    cy.login('artisan@culturecart.com', 'artisan123');
    cy.visit('/artisan/earnings');
  });

  it('should display earnings summary', () => {
    cy.get('[data-testid="total-earnings"]').should('be.visible');
    cy.get('[data-testid="pending-payouts"]').should('be.visible');
    cy.get('[data-testid="available-balance"]').should('be.visible');
  });

  it('should display transaction history', () => {
    cy.get('[data-testid="transaction-row"]').should('have.length.at.least', 1);
  });

  it('should request payout', () => {
    cy.get('[data-testid="request-payout-btn"]').click();
    cy.get('[data-testid="payout-modal"]').should('be.visible');
    cy.get('input[name="amount"]').type('5000');
    cy.get('select[name="method"]').select('bank_transfer');
    cy.get('[data-testid="submit-payout"]').click();
    cy.contains('Payout request submitted').should('be.visible');
  });
});
```

### 3.6 Messages

```javascript
describe('Artisan - Messages', () => {
  beforeEach(() => {
    cy.login('artisan@culturecart.com', 'artisan123');
    cy.visit('/artisan/messages');
  });

  it('should display message threads', () => {
    cy.get('[data-testid="message-thread"]').should('have.length.at.least', 1);
  });

  it('should open a conversation', () => {
    cy.get('[data-testid="message-thread"]').first().click();
    cy.get('[data-testid="chat-window"]').should('be.visible');
    cy.get('[data-testid="message"]').should('have.length.at.least', 1);
  });

  it('should send a message', () => {
    cy.get('[data-testid="message-thread"]').first().click();
    cy.get('textarea[name="message"]').type('Thank you for your inquiry!');
    cy.get('[data-testid="send-btn"]').click();
    cy.get('[data-testid="message"]').last().should('contain', 'Thank you for your inquiry!');
  });

  it('should use quick reply', () => {
    cy.get('[data-testid="message-thread"]').first().click();
    cy.get('[data-testid="quick-reply"]').first().click();
    cy.get('[data-testid="message"]').last().should('be.visible');
  });

  it('should search messages', () => {
    cy.get('input[placeholder*="Search"]').type('order');
    cy.wait(500);
    cy.get('[data-testid="message-thread"]').should('have.length.at.least', 1);
  });
});
```

---

## 🛍️ 4. Buyer Dashboard Tests

### 4.1 Analytics

```javascript
describe('Buyer - Analytics', () => {
  beforeEach(() => {
    cy.login('buyer@culturecart.com', 'buyer123');
    cy.visit('/buyer/analytics');
  });

  it('should display purchase statistics', () => {
    cy.get('[data-testid="total-spend"]').should('be.visible');
    cy.get('[data-testid="avg-order-value"]').should('be.visible');
    cy.get('[data-testid="total-orders"]').should('be.visible');
  });

  it('should render spending trend chart', () => {
    cy.get('[data-testid="spend-chart"]').should('be.visible');
    cy.get('.recharts-line').should('exist');
  });

  it('should display category distribution', () => {
    cy.get('[data-testid="category-chart"]').should('be.visible');
    cy.get('.recharts-pie').should('exist');
  });

  it('should show AI insights', () => {
    cy.get('[data-testid="ai-insights"]').should('be.visible');
  });
});
```

### 4.2 Earnings (Rewards/Cashback)

```javascript
describe('Buyer - Earnings', () => {
  beforeEach(() => {
    cy.login('buyer@culturecart.com', 'buyer123');
    cy.visit('/buyer/earnings');
  });

  it('should display wallet balance', () => {
    cy.get('[data-testid="wallet-balance"]').should('be.visible');
  });

  it('should display transaction history', () => {
    cy.get('[data-testid="transaction-row"]').should('have.length.at.least', 1);
  });

  it('should request withdrawal', () => {
    cy.get('[data-testid="withdraw-btn"]').click();
    cy.get('[data-testid="withdraw-modal"]').should('be.visible');
    cy.get('input[name="amount"]').type('1000');
    cy.get('[data-testid="submit-withdrawal"]').click();
    cy.contains('Withdrawal request submitted').should('be.visible');
  });
});
```

### 4.3 AI Studio

```javascript
describe('Buyer - AI Studio', () => {
  beforeEach(() => {
    cy.login('buyer@culturecart.com', 'buyer123');
    cy.visit('/buyer/ai-studio');
  });

  it('should display AI chat interface', () => {
    cy.get('[data-testid="ai-chat"]').should('be.visible');
    cy.get('[data-testid="chat-input"]').should('be.visible');
  });

  it('should send a query and receive response', () => {
    cy.get('[data-testid="chat-input"]').type('Find handwoven textiles under ₹2000');
    cy.get('[data-testid="send-btn"]').click();
    cy.wait(2000);
    cy.get('[data-testid="ai-response"]').should('be.visible');
  });

  it('should display product recommendations', () => {
    cy.get('[data-testid="chat-input"]').type('Show me pottery from Rajasthan');
    cy.get('[data-testid="send-btn"]').click();
    cy.wait(2000);
    cy.get('[data-testid="product-recommendation"]').should('have.length.at.least', 1);
  });

  it('should track order via AI', () => {
    cy.get('[data-testid="chat-input"]').type('Track my latest order');
    cy.get('[data-testid="send-btn"]').click();
    cy.wait(2000);
    cy.get('[data-testid="order-status"]').should('be.visible');
  });

  it('should use suggested prompts', () => {
    cy.get('[data-testid="suggested-prompt"]').first().click();
    cy.get('[data-testid="ai-response"]').should('be.visible');
  });
});
```

### 4.4 Messages

```javascript
describe('Buyer - Messages', () => {
  beforeEach(() => {
    cy.login('buyer@culturecart.com', 'buyer123');
    cy.visit('/buyer/messages');
  });

  it('should display conversations with artisans', () => {
    cy.get('[data-testid="conversation"]').should('have.length.at.least', 1);
  });

  it('should create new inquiry', () => {
    cy.get('[data-testid="new-inquiry-btn"]').click();
    cy.get('[data-testid="inquiry-modal"]').should('be.visible');
    cy.get('select[name="artisan"]').select('Artisan Name');
    cy.get('textarea[name="message"]').type('Is this product customizable?');
    cy.get('[data-testid="send-inquiry"]').click();
    cy.contains('Inquiry sent').should('be.visible');
  });

  it('should send message to artisan', () => {
    cy.get('[data-testid="conversation"]').first().click();
    cy.get('textarea[name="message"]').type('Can you ship to Delhi?');
    cy.get('[data-testid="send-btn"]').click();
    cy.get('[data-testid="message"]').last().should('contain', 'Can you ship to Delhi?');
  });
});
```

### 4.5 Help Center

```javascript
describe('Buyer - Help Center', () => {
  beforeEach(() => {
    cy.login('buyer@culturecart.com', 'buyer123');
    cy.visit('/buyer/help');
  });

  it('should display help sections', () => {
    cy.get('[data-testid="getting-started"]').should('be.visible');
    cy.get('[data-testid="faqs"]').should('be.visible');
    cy.get('[data-testid="contact-support"]').should('be.visible');
  });

  it('should search help articles', () => {
    cy.get('input[placeholder*="Search"]').type('track order');
    cy.wait(500);
    cy.get('[data-testid="search-result"]').should('have.length.at.least', 1);
  });

  it('should expand FAQ accordion', () => {
    cy.get('[data-testid="faq-item"]').first().click();
    cy.get('[data-testid="faq-answer"]').should('be.visible');
  });

  it('should submit support ticket', () => {
    cy.get('[data-testid="support-form"]').within(() => {
      cy.get('input[name="name"]').type('Test User');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('select[name="issueType"]').select('Order Issue');
      cy.get('textarea[name="message"]').type('Need help with my order');
      cy.get('[data-testid="submit-ticket"]').click();
    });
    cy.contains('Support ticket submitted').should('be.visible');
  });
});
```

---

## 🏪 5. Marketplace & Explore Tests

### 5.1 Product Browsing

**Test File**: `cypress/e2e/marketplace/explore.cy.ts`

```javascript
describe('Marketplace - Explore Products', () => {
  beforeEach(() => {
    cy.visit('/explore');
  });

  it('should display product grid', () => {
    cy.get('[data-testid="product-card"]').should('have.length.at.least', 1);
  });

  it('should filter by category', () => {
    cy.get('[data-testid="category-filter"]').click();
    cy.get('[data-testid="category-textiles"]').click();
    cy.wait(500);
    cy.get('[data-testid="product-card"]').should('have.length.at.least', 1);
  });

  it('should filter by price range', () => {
    cy.get('[data-testid="price-min"]').type('1000');
    cy.get('[data-testid="price-max"]').type('5000');
    cy.get('[data-testid="apply-filters"]').click();
    cy.wait(500);
    cy.get('[data-testid="product-card"]').should('exist');
  });

  it('should filter by region', () => {
    cy.get('select[name="region"]').select('Kashmir');
    cy.wait(500);
    cy.get('[data-testid="product-card"]').should('have.length.at.least', 1);
  });

  it('should sort products', () => {
    cy.get('select[name="sort"]').select('price-low-high');
    cy.wait(500);
    // Verify first product has lower price than last
  });

  it('should search products', () => {
    cy.get('input[placeholder*="Search"]').type('Pashmina');
    cy.wait(500);
    cy.get('[data-testid="product-card"]').first().should('contain', 'Pashmina');
  });

  it('should paginate through products', () => {
    cy.get('[data-testid="next-page"]').click();
    cy.url().should('include', 'page=2');
  });

  it('should show empty state with no results', () => {
    cy.get('input[placeholder*="Search"]').type('xyznonexistent');
    cy.wait(500);
    cy.contains('No products found').should('be.visible');
  });
});
```

### 5.2 Product Detail Page

```javascript
describe('Marketplace - Product Detail', () => {
  beforeEach(() => {
    cy.visit('/explore');
    cy.get('[data-testid="product-card"]').first().click();
  });

  it('should display product information', () => {
    cy.get('[data-testid="product-title"]').should('be.visible');
    cy.get('[data-testid="product-price"]').should('be.visible');
    cy.get('[data-testid="product-description"]').should('be.visible');
  });

  it('should display product images with gallery', () => {
    cy.get('[data-testid="product-image"]').should('be.visible');
    cy.get('[data-testid="thumbnail"]').should('have.length.at.least', 1);
  });

  it('should switch between image thumbnails', () => {
    cy.get('[data-testid="thumbnail"]').eq(1).click();
    // Verify main image changed
  });

  it('should display artisan information', () => {
    cy.get('[data-testid="artisan-name"]').should('be.visible');
    cy.get('[data-testid="artisan-region"]').should('be.visible');
  });

  it('should add product to wishlist', () => {
    cy.login('buyer@culturecart.com', 'buyer123');
    cy.get('[data-testid="wishlist-btn"]').click();
    cy.contains('Added to wishlist').should('be.visible');
  });

  it('should add product to cart', () => {
    cy.get('[data-testid="add-to-cart"]').click();
    cy.contains('Added to cart').should('be.visible');
    cy.get('[data-testid="cart-count"]').should('contain', '1');
  });

  it('should display related products', () => {
    cy.scrollTo('bottom');
    cy.get('[data-testid="related-products"]').should('be.visible');
    cy.get('[data-testid="related-product-card"]').should('have.length.at.least', 1);
  });

  it('should view 3D model if available', () => {
    cy.get('[data-testid="3d-view-btn"]').click();
    cy.get('[data-testid="3d-viewer"]').should('be.visible');
  });
});
```

---

## 🤖 6. AI Assistant Tests

### 6.1 Global AI Assistant

**Test File**: `cypress/e2e/ai/assistant.cy.ts`

```javascript
describe('AI Assistant', () => {
  beforeEach(() => {
    cy.login('artisan@culturecart.com', 'artisan123');
    cy.visit('/dashboard/artisan');
  });

  it('should display floating AI assistant button', () => {
    cy.get('[data-testid="ai-assistant-btn"]').should('be.visible');
  });

  it('should open AI chat panel', () => {
    cy.get('[data-testid="ai-assistant-btn"]').click();
    cy.get('[data-testid="ai-chat-panel"]').should('be.visible');
  });

  it('should send query and receive response', () => {
    cy.get('[data-testid="ai-assistant-btn"]').click();
    cy.get('[data-testid="ai-input"]').type('Generate title for my craft');
    cy.get('[data-testid="ai-send"]').click();
    cy.wait(2000);
    cy.get('[data-testid="ai-message"]').last().should('be.visible');
  });

  it('should provide context-aware suggestions', () => {
    cy.visit('/artisan/products');
    cy.get('[data-testid="ai-assistant-btn"]').click();
    cy.get('[data-testid="ai-suggestion"]').should('contain', 'product');
  });

  it('should close AI panel', () => {
    cy.get('[data-testid="ai-assistant-btn"]').click();
    cy.get('[data-testid="close-ai-panel"]').click();
    cy.get('[data-testid="ai-chat-panel"]').should('not.be.visible');
  });

  it('should persist conversation during session', () => {
    cy.get('[data-testid="ai-assistant-btn"]').click();
    cy.get('[data-testid="ai-input"]').type('Hello');
    cy.get('[data-testid="ai-send"]').click();
    cy.wait(1000);
    
    // Navigate to different page
    cy.visit('/artisan/orders');
    
    // Reopen AI panel
    cy.get('[data-testid="ai-assistant-btn"]').click();
    cy.get('[data-testid="ai-message"]').should('contain', 'Hello');
  });
});
```

---

## ♿ 7. Accessibility Tests

### 7.1 WCAG Compliance

**Test File**: `cypress/e2e/accessibility/wcag.cy.ts`

```javascript
import 'cypress-axe';

describe('Accessibility - WCAG 2.1 AA Compliance', () => {
  const pages = [
    '/',
    '/login',
    '/explore',
    '/about',
    '/dashboard/admin',
    '/dashboard/artisan',
    '/dashboard/buyer',
  ];

  pages.forEach(page => {
    it(`should have no accessibility violations on ${page}`, () => {
      if (page.includes('dashboard')) {
        // Login with appropriate role
        const role = page.split('/').pop();
        cy.login(`${role}@culturecart.com`, `${role}123`);
      }
      
      cy.visit(page);
      cy.injectAxe();
      cy.checkA11y(null, {
        rules: {
          'color-contrast': { enabled: true },
          'valid-aria-attr': { enabled: true },
          'aria-roles': { enabled: true },
          'button-name': { enabled: true },
          'link-name': { enabled: true },
        }
      });
    });
  });

  it('should navigate using keyboard only', () => {
    cy.visit('/');
    
    // Tab through interactive elements
    cy.get('body').tab();
    cy.focused().should('have.attr', 'href');
    
    // Navigate through navbar
    cy.focused().tab();
    cy.focused().tab();
    
    // Press Enter on focused element
    cy.focused().type('{enter}');
  });

  it('should announce page changes to screen readers', () => {
    cy.visit('/');
    cy.get('[role="main"]').should('exist');
    cy.get('h1').should('be.visible');
  });

  it('should have proper heading hierarchy', () => {
    cy.visit('/explore');
    
    // Check h1 exists and is unique
    cy.get('h1').should('have.length', 1);
    
    // Check heading order
    cy.get('h1, h2, h3, h4, h5, h6').then($headings => {
      const levels = $headings.map((i, el) => parseInt(el.tagName[1])).get();
      // Verify no skipped levels
    });
  });

  it('should have alt text for all images', () => {
    cy.visit('/explore');
    cy.get('img').each($img => {
      cy.wrap($img).should('have.attr', 'alt');
    });
  });

  it('should have proper form labels', () => {
    cy.visit('/login');
    cy.get('input').each($input => {
      const id = $input.attr('id');
      cy.get(`label[for="${id}"]`).should('exist');
    });
  });

  it('should have focus indicators', () => {
    cy.visit('/');
    cy.get('a').first().focus();
    cy.focused().should('have.css', 'outline').and('not.equal', 'none');
  });
});
```

### 7.2 Screen Reader Testing

```javascript
describe('Screen Reader Support', () => {
  it('should have ARIA landmarks', () => {
    cy.visit('/');
    cy.get('[role="banner"]').should('exist'); // Header
    cy.get('[role="navigation"]').should('exist'); // Nav
    cy.get('[role="main"]').should('exist'); // Main content
    cy.get('[role="contentinfo"]').should('exist'); // Footer
  });

  it('should announce dynamic content changes', () => {
    cy.login('artisan@culturecart.com', 'artisan123');
    cy.visit('/artisan/products');
    
    cy.get('[data-testid="delete-btn"]').first().click();
    cy.get('[role="alert"]').should('exist').and('be.visible');
  });

  it('should have descriptive link text', () => {
    cy.visit('/');
    cy.get('a').each($link => {
      const text = $link.text().trim();
      expect(text).not.to.match(/^(click here|read more|learn more)$/i);
    });
  });
});
```

---

## ⚡ 8. Performance Tests

### 8.1 Lighthouse Performance

**Test File**: `cypress/e2e/performance/lighthouse.cy.ts`

```javascript
describe('Performance - Lighthouse Metrics', () => {
  it('should meet performance benchmarks on homepage', () => {
    cy.visit('/');
    cy.lighthouse({
      performance: 90,
      accessibility: 95,
      'best-practices': 90,
      seo: 90,
    });
  });

  it('should have fast First Contentful Paint', () => {
    cy.visit('/');
    cy.window().then(win => {
      const fcp = win.performance.getEntriesByName('first-contentful-paint')[0];
      expect(fcp.startTime).to.be.lessThan(2000);
    });
  });

  it('should have fast Time to Interactive', () => {
    cy.visit('/explore');
    cy.window().then(win => {
      const tti = win.performance.timing.domInteractive - win.performance.timing.navigationStart;
      expect(tti).to.be.lessThan(3000);
    });
  });
});
```

### 8.2 Bundle Size & Optimization

```javascript
describe('Performance - Bundle Optimization', () => {
  it('should lazy load routes', () => {
    cy.visit('/');
    
    // Check that dashboard routes are not loaded initially
    cy.window().then(win => {
      const scripts = Array.from(win.document.scripts).map(s => s.src);
      expect(scripts.some(s => s.includes('dashboard'))).to.be.false;
    });
    
    // Navigate to dashboard
    cy.login('buyer@culturecart.com', 'buyer123');
    
    // Verify dashboard chunk loaded
    cy.window().then(win => {
      const scripts = Array.from(win.document.scripts).map(s => s.src);
      expect(scripts.some(s => s.includes('dashboard'))).to.be.true;
    });
  });

  it('should optimize images', () => {
    cy.visit('/explore');
    cy.get('img').each($img => {
      cy.wrap($img).should('have.attr', 'loading', 'lazy');
    });
  });

  it('should use efficient caching', () => {
    cy.visit('/');
    cy.getCookie('cultureCart_cache').should('exist');
  });
});
```

### 8.3 Load Time Tests

```javascript
describe('Performance - Load Times', () => {
  const loadTimeThreshold = 3000; // 3 seconds

  it('should load homepage quickly', () => {
    const start = Date.now();
    cy.visit('/');
    cy.get('[data-testid="hero-section"]').should('be.visible');
    const loadTime = Date.now() - start;
    expect(loadTime).to.be.lessThan(loadTimeThreshold);
  });

  it('should load product list quickly', () => {
    const start = Date.now();
    cy.visit('/explore');
    cy.get('[data-testid="product-card"]').should('have.length.at.least', 1);
    const loadTime = Date.now() - start;
    expect(loadTime).to.be.lessThan(loadTimeThreshold);
  });

  it('should handle large product catalogs efficiently', () => {
    cy.visit('/explore');
    cy.scrollTo('bottom', { duration: 2000 });
    // Verify infinite scroll or pagination works smoothly
    cy.get('[data-testid="product-card"]').should('have.length.at.least', 20);
  });
});
```

---

## 🔒 9. Security Tests

### 9.1 Input Validation

**Test File**: `cypress/e2e/security/input-validation.cy.ts`

```javascript
describe('Security - Input Validation', () => {
  it('should prevent XSS in product title', () => {
    cy.login('artisan@culturecart.com', 'artisan123');
    cy.visit('/artisan/upload');
    
    // Complete upload steps with XSS attempt
    cy.completeUploadSteps(1, 3);
    
    // Try to inject script in title
    cy.get('[data-testid="edit-title"]').click();
    cy.get('input[name="title"]').clear().type('<script>alert("XSS")</script>');
    cy.get('[data-testid="save-title"]').click();
    
    // Verify script is escaped
    cy.get('[data-testid="ai-title"]').should('not.contain', '<script>');
    cy.get('[data-testid="ai-title"]').should('contain', '&lt;script&gt;');
  });

  it('should prevent SQL injection in search', () => {
    cy.visit('/explore');
    cy.get('input[placeholder*="Search"]').type("'; DROP TABLE products; --");
    cy.wait(500);
    
    // Verify app still works
    cy.get('[data-testid="product-card"]').should('exist');
  });

  it('should sanitize user input in forms', () => {
    cy.login('buyer@culturecart.com', 'buyer123');
    cy.visit('/buyer/help');
    
    cy.get('textarea[name="message"]').type('<img src=x onerror=alert(1)>');
    cy.get('[data-testid="submit-ticket"]').click();
    
    // Verify malicious code is sanitized
    cy.contains('Support ticket submitted').should('be.visible');
  });

  it('should validate email format strictly', () => {
    cy.visit('/login');
    const invalidEmails = [
      'plaintext',
      '@missing-local.com',
      'missing-at-sign.com',
      'invalid@',
    ];

    invalidEmails.forEach(email => {
      cy.get('input[type="email"]').clear().type(email);
      cy.get('button[type="submit"]').click();
      cy.contains('Invalid email').should('be.visible');
    });
  });

  it('should enforce password strength', () => {
    cy.visit('/register'); // If registration page exists
    
    const weakPasswords = ['123', 'password', 'abc'];
    weakPasswords.forEach(pwd => {
      cy.get('input[type="password"]').clear().type(pwd);
      cy.contains('Password is too weak').should('be.visible');
    });
  });
});
```

### 9.2 Authentication & Authorization

```javascript
describe('Security - Auth & Authorization', () => {
  it('should not expose sensitive data in localStorage', () => {
    cy.login('admin@culturecart.com', 'admin123');
    
    cy.window().then(win => {
      const storage = win.localStorage;
      const keys = Object.keys(storage);
      
      keys.forEach(key => {
        const value = storage.getItem(key);
        expect(value).not.to.match(/password|token|secret/i);
      });
    });
  });

  it('should prevent CSRF attacks', () => {
    cy.login('artisan@culturecart.com', 'artisan123');
    
    // Verify CSRF token exists
    cy.getCookie('csrf_token').should('exist');
  });

  it('should timeout inactive sessions', () => {
    cy.login('buyer@culturecart.com', 'buyer123');
    
    // Wait for session timeout (simulate with clock)
    cy.clock();
    cy.tick(3600000); // 1 hour
    
    // Try to access protected route
    cy.visit('/dashboard/buyer');
    cy.url().should('include', '/login');
  });

  it('should prevent role escalation', () => {
    cy.login('buyer@culturecart.com', 'buyer123');
    
    // Try to manipulate role in localStorage
    cy.window().then(win => {
      const user = JSON.parse(win.localStorage.getItem('culturecart_user'));
      user.role = 'admin';
      win.localStorage.setItem('culturecart_user', JSON.stringify(user));
    });
    
    // Try to access admin route
    cy.visit('/admin/users');
    
    // Should be redirected (server validates role)
    cy.url().should('not.include', '/admin/users');
  });
});
```

### 9.3 Data Privacy

```javascript
describe('Security - Data Privacy', () => {
  it('should not log sensitive data to console', () => {
    cy.visit('/login', {
      onBeforeLoad(win) {
        cy.spy(win.console, 'log').as('consoleLog');
      }
    });
    
    cy.get('input[type="email"]').type('user@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    cy.get('@consoleLog').should(log => {
      const calls = log.getCalls().map(call => call.args.join(' '));
      expect(calls.join(' ')).not.to.match(/password123/);
    });
  });

  it('should mask sensitive form fields', () => {
    cy.visit('/login');
    cy.get('input[type="password"]').should('have.attr', 'type', 'password');
  });

  it('should use HTTPS for sensitive operations', () => {
    // Verify all API calls use HTTPS
    cy.intercept('*').as('apiCalls');
    cy.login('buyer@culturecart.com', 'buyer123');
    
    cy.wait('@apiCalls').then(interception => {
      expect(interception.request.url).to.match(/^https:/);
    });
  });
});
```

---

## 📱 10. Responsive Design Tests

### 10.1 Mobile Responsiveness

**Test File**: `cypress/e2e/responsive/mobile.cy.ts`

```javascript
describe('Responsive - Mobile Devices', () => {
  const viewports = [
    { device: 'iphone-6', width: 375, height: 667 },
    { device: 'iphone-x', width: 375, height: 812 },
    { device: 'samsung-s10', width: 360, height: 760 },
  ];

  viewports.forEach(viewport => {
    describe(`${viewport.device}`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height);
      });

      it('should display mobile menu', () => {
        cy.visit('/');
        cy.get('[data-testid="mobile-menu-btn"]').should('be.visible');
        cy.get('[data-testid="mobile-menu-btn"]').click();
        cy.get('[data-testid="mobile-menu"]').should('be.visible');
      });

      it('should stack product cards vertically', () => {
        cy.visit('/explore');
        cy.get('[data-testid="product-card"]').first().should('have.css', 'width').and('match', /100%|360px|375px/);
      });

      it('should make forms mobile-friendly', () => {
        cy.visit('/login');
        cy.get('input[type="email"]').should('have.css', 'font-size').and('match', /16px|1rem/);
      });

      it('should optimize touch targets', () => {
        cy.visit('/');
        cy.get('button').first().should('have.css', 'min-height', '44px');
      });
    });
  });
});
```

### 10.2 Tablet Responsiveness

```javascript
describe('Responsive - Tablet Devices', () => {
  beforeEach(() => {
    cy.viewport('ipad-2'); // 768x1024
  });

  it('should display tablet layout', () => {
    cy.visit('/explore');
    cy.get('[data-testid="product-grid"]').should('have.css', 'grid-template-columns');
  });

  it('should show condensed navigation', () => {
    cy.visit('/');
    cy.get('[data-testid="desktop-nav"]').should('not.be.visible');
    cy.get('[data-testid="tablet-nav"]').should('be.visible');
  });
});
```

---

## 🧪 11. Integration Tests

### 11.1 Complete User Journeys

**Test File**: `cypress/e2e/integration/user-journeys.cy.ts`

```javascript
describe('Integration - Complete User Journeys', () => {
  it('Buyer Journey: Browse → View → Add to Cart → Checkout', () => {
    cy.login('buyer@culturecart.com', 'buyer123');
    
    // Browse products
    cy.visit('/explore');
    cy.get('[data-testid="product-card"]').should('have.length.at.least', 1);
    
    // View product detail
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="product-title"]').should('be.visible');
    
    // Add to cart
    cy.get('[data-testid="add-to-cart"]').click();
    cy.contains('Added to cart').should('be.visible');
    
    // Verify cart count
    cy.get('[data-testid="cart-count"]').should('contain', '1');
  });

  it('Artisan Journey: Upload → Review → Submit Product', () => {
    cy.login('artisan@culturecart.com', 'artisan123');
    
    // Start upload
    cy.visit('/artisan/upload');
    
    // Step 1: Upload images
    cy.get('input[type="file"]').attachFile('craft1.jpg');
    cy.get('button').contains('Continue').click();
    
    // Step 2: Voice description
    cy.get('[data-testid="text-input-toggle"]').click();
    cy.get('textarea').type('Traditional handwoven craft from Kashmir');
    cy.get('button').contains('Continue').click();
    
    // Step 3: Basic details
    cy.get('input[name="price"]').type('2500');
    cy.get('input[name="quantity"]').type('3');
    cy.get('input[name="length"]').type('200');
    cy.get('input[name="width"]').type('100');
    cy.get('input[name="height"]').type('5');
    cy.get('input[name="weight"]').type('0.5');
    cy.get('button').contains('Continue').click();
    
    // Step 4: AI Preview
    cy.get('[data-testid="ai-title"]').should('be.visible');
    cy.get('button').contains('Continue').click();
    
    // Step 5: Submit
    cy.get('[data-testid="submit-craft"]').click();
    cy.contains('Craft uploaded successfully').should('be.visible');
    
    // Verify in products list
    cy.visit('/artisan/products');
    cy.get('[data-testid="product-card"]').should('contain', 'Kashmir');
  });

  it('Admin Journey: Review → Approve → Verify Artisan', () => {
    cy.login('admin@culturecart.com', 'admin123');
    
    // Review pending products
    cy.visit('/admin/products');
    cy.get('select[name="statusFilter"]').select('pending');
    cy.get('[data-testid="approve-btn"]').first().click();
    cy.get('[data-testid="confirm-approve"]').click();
    cy.contains('Product approved').should('be.visible');
    
    // Verify artisan
    cy.visit('/admin/artisans');
    cy.get('[data-testid="verify-btn"]').first().click();
    cy.get('[data-testid="confirm-verify"]').click();
    cy.contains('Artisan verified').should('be.visible');
  });
});
```

---

## 📊 12. E2E Test Commands

### Custom Cypress Commands

**File**: `cypress/support/commands.ts`

```typescript
// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});

// Complete upload steps
Cypress.Commands.add('completeUploadSteps', (fromStep: number, toStep: number) => {
  if (fromStep <= 1 && toStep >= 1) {
    cy.get('input[type="file"]').attachFile('craft1.jpg');
    cy.get('button').contains('Continue').click();
  }
  
  if (fromStep <= 2 && toStep >= 2) {
    cy.get('[data-testid="text-input-toggle"]').click();
    cy.get('textarea').type('Traditional handwoven craft');
    cy.get('button').contains('Continue').click();
  }
  
  if (fromStep <= 3 && toStep >= 3) {
    cy.get('input[name="price"]').type('2500');
    cy.get('input[name="quantity"]').type('3');
    cy.get('input[name="length"]').type('200');
    cy.get('input[name="width"]').type('100');
    cy.get('input[name="height"]').type('5');
    cy.get('input[name="weight"]').type('0.5');
    cy.get('button').contains('Continue').click();
  }
  
  if (fromStep <= 4 && toStep >= 4) {
    cy.get('button').contains('Continue').click();
  }
});

// Wait for API response
Cypress.Commands.add('waitForApi', (alias: string) => {
  cy.wait(`@${alias}`).then((interception) => {
    expect(interception.response.statusCode).to.be.oneOf([200, 201]);
  });
});

// Tab navigation
Cypress.Commands.add('tab', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).trigger('keydown', { key: 'Tab' });
});
```

---

## ✅ 13. Manual QA Checklist

### Authentication Flow
- [ ] Login with valid credentials (admin, artisan, buyer)
- [ ] Login with invalid credentials shows error
- [ ] Logout clears session and redirects to home
- [ ] Protected routes redirect unauthenticated users
- [ ] Role-based access control works correctly
- [ ] Password visibility toggle works
- [ ] Remember me functionality works
- [ ] Session persists after page reload

### Admin Dashboard
- [ ] All stats cards display correct data
- [ ] User management: filter, search, suspend, activate, delete
- [ ] Product management: approve, reject, view details
- [ ] Artisan management: verify, view profile
- [ ] Order management: filter by status, view details
- [ ] Analytics: charts render, filters work, export works
- [ ] Pagination works across all tables
- [ ] Actions require confirmation before execution

### Artisan Dashboard
- [ ] Upload wizard: all 5 steps complete successfully
- [ ] Image upload: drag-drop, multiple files, remove, reorder
- [ ] Voice recorder: record, play, delete audio
- [ ] Text alternative for voice description works
- [ ] Form validation shows appropriate errors
- [ ] AI preview generates content correctly
- [ ] Can edit AI-generated content
- [ ] Final review shows all entered data
- [ ] Products list: view, edit, delete, toggle availability
- [ ] Orders: filter, update status, view details
- [ ] Analytics: charts display, AI insights shown
- [ ] Earnings: summary, transactions, request payout
- [ ] Messages: view threads, send messages, quick replies

### Buyer Dashboard
- [ ] Analytics: spending trends, category distribution
- [ ] Earnings: wallet balance, transaction history, withdraw
- [ ] AI Studio: send queries, receive responses, product recommendations
- [ ] Messages: conversations with artisans, send inquiries
- [ ] Help Center: search articles, FAQs, submit support ticket

### Marketplace
- [ ] Product grid displays correctly
- [ ] Filters: category, price, region work correctly
- [ ] Search returns relevant results
- [ ] Sort options work (price, newest, popular)
- [ ] Pagination loads more products
- [ ] Product detail: images, description, artisan info display
- [ ] Add to cart works
- [ ] Add to wishlist works
- [ ] Related products shown

### AI Assistant
- [ ] Floating button visible on all pages
- [ ] Chat panel opens and closes smoothly
- [ ] Sends queries and receives responses
- [ ] Context-aware suggestions based on current page
- [ ] Conversation persists during session

### Accessibility
- [ ] Can navigate entire site with keyboard only
- [ ] All images have alt text
- [ ] All form fields have labels
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators visible
- [ ] ARIA landmarks present
- [ ] Screen reader announcements work

### Responsive Design
- [ ] Mobile menu works on small screens
- [ ] All pages responsive on mobile (375px - 428px)
- [ ] All pages responsive on tablet (768px - 1024px)
- [ ] Touch targets minimum 44px
- [ ] Forms usable on mobile
- [ ] Images scale properly

### Performance
- [ ] Initial page load < 3 seconds
- [ ] Images lazy load
- [ ] Smooth scrolling and animations
- [ ] No layout shifts during load
- [ ] Lighthouse score > 90 for all metrics

### Security
- [ ] XSS attempts are sanitized
- [ ] SQL injection attempts blocked
- [ ] Sensitive data not in localStorage
- [ ] Password fields masked
- [ ] CSRF protection enabled
- [ ] Session timeout works

---

## 🚀 14. Running Tests

### Run All Tests
```bash
# Unit tests with Jest
npm run test

# E2E tests with Cypress (headless)
npm run cypress:run

# E2E tests with Cypress (interactive)
npm run cypress:open

# Accessibility tests
npm run test:a11y

# Performance tests with Lighthouse
npm run lighthouse
```

### Run Specific Test Suites
```bash
# Run only auth tests
npm run cypress:run -- --spec "cypress/e2e/auth/**"

# Run only admin tests
npm run cypress:run -- --spec "cypress/e2e/admin/**"

# Run only artisan tests
npm run cypress:run -- --spec "cypress/e2e/artisan/**"

# Run only buyer tests
npm run cypress:run -- --spec "cypress/e2e/buyer/**"
```

### Generate Coverage Report
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

### CI/CD Integration
```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm test
      
      - name: Run E2E tests
        run: npm run cypress:run
      
      - name: Run accessibility tests
        run: npm run test:a11y
      
      - name: Run Lighthouse
        run: npm run lighthouse
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## 📈 15. Test Metrics & Reporting

### Coverage Goals
- **Unit Test Coverage**: > 80%
- **E2E Test Coverage**: All critical user flows
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Lighthouse score > 90

### Test Reports
```bash
# Generate HTML test report
npm run test:report

# Generate accessibility report
npm run a11y:report

# Generate performance report
npm run perf:report
```

---

## 🎯 16. Priority Test Matrix

| Feature | Critical | High | Medium | Low |
|---------|----------|------|--------|-----|
| Authentication | ✅ | | | |
| Admin - User Management | ✅ | | | |
| Artisan - Upload Wizard | ✅ | | | |
| Marketplace - Browse/Search | ✅ | | | |
| Product Detail | ✅ | | | |
| Artisan - My Products | | ✅ | | |
| Analytics (All roles) | | ✅ | | |
| Messages | | ✅ | | |
| AI Assistant | | | ✅ | |
| Help Center | | | ✅ | |
| Earnings | | | | ✅ |

---

## 📝 Notes

1. **Test Data**: Use seed data for consistent testing across environments
2. **API Mocking**: Mock Appwrite calls in Cypress for faster, more reliable tests
3. **Visual Regression**: Consider adding Percy or Chromatic for visual testing
4. **Mobile Testing**: Test on real devices when possible
5. **Load Testing**: Use tools like k6 or Artillery for stress testing
6. **Security**: Schedule regular security audits and penetration testing

---

**Last Updated**: 2025-10-27  
**Version**: 1.0.0  
**Maintained by**: CultureCart QA Team
