# 🚀 CultureCart Deployment with Coolify on GCP

This guide provides step-by-step instructions for deploying CultureCart to Google Cloud Platform using Coolify.

## 📋 Prerequisites

- Google Cloud Platform account with billing enabled
- Coolify account (free tier available)
- Domain name (optional but recommended)
- GitHub repository with your CultureCart code

## 🏗️ Step 1: Set Up GCP Infrastructure

### 1.1 Create GCP Project
```bash
# Set up gcloud CLI (if not already installed)
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Create new project
gcloud projects create culturecart-production --name="CultureCart Production"
gcloud config set project culturecart-production
```

### 1.2 Enable Required APIs
```bash
# Enable necessary APIs
gcloud services enable compute.googleapis.com
gcloud services enable container.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable secretmanager.googleapis.com
```

### 1.3 Create VPC Network
```bash
# Create custom VPC network
gcloud compute networks create culturecart-network --subnet-mode=custom

# Create subnet
gcloud compute networks subnets create culturecart-subnet \
  --network=culturecart-network \
  --range=10.0.0.0/24 \
  --region=us-central1
```

### 1.4 Set Up Cloud SQL (PostgreSQL)
```bash
# Create PostgreSQL instance
gcloud sql instances create culturecart-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --network=culturecart-network \
  --no-assign-ip

# Create database
gcloud sql databases create culturecart_db --instance=culturecart-db

# Create database user
gcloud sql users create culturecart_user \
  --instance=culturecart-db \
  --password=culturecart_password
```

## 🐳 Step 2: Prepare Application for Coolify

### 2.1 Update Docker Configuration

Create optimized Dockerfiles for production:

**culturecart-backend/Dockerfile.prod**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S culturecart -u 1001

# Change ownership
RUN chown -R culturecart:nodejs /app
USER culturecart

EXPOSE 3001

CMD ["npm", "start"]
```

**Dockerfile.prod** (for frontend)
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    sendfile on;
    keepalive_timeout 65;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://culturecart-backend:3001;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    }
}
```

### 2.2 Create Coolify Configuration

**coolify/docker-compose.prod.yml**
```yaml
version: '3.8'

services:
  culturecart-backend:
    build:
      context: ./culturecart-backend
      dockerfile: Dockerfile.prod
    environment:
      - NODE_ENV=production
      - PORT=3001
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - UPLOAD_PATH=/app/uploads
      - EMAIL_USER=${EMAIL_USER}
      - EMAIL_PASS=${EMAIL_PASS}
    volumes:
      - uploads:/app/uploads
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  culturecart-frontend:
    build:
      context: .
      dockerfile: Dockerfile.prod
    depends_on:
      - culturecart-backend
    restart: unless-stopped

volumes:
  uploads:
```

### 2.3 Environment Variables Setup

Create `.env.production` file:
```env
# Database
DATABASE_URL=postgresql://culturecart_user:culturecart_password@culturecart-db/culturecart_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## ⚙️ Step 3: Coolify Setup

### 3.1 Install Coolify on GCP

```bash
# SSH into your GCP VM
gcloud compute ssh culturecart-server --zone=us-central1-a

# Install Coolify
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# Follow the installation prompts
# Default credentials: root / password
```

### 3.2 Configure Coolify

1. **Access Coolify Dashboard**
   - Open `http://your-server-ip:8000`
   - Login with default credentials

2. **Add Server**
   - Go to "Servers" → "Add Server"
   - Select "Local Docker Engine"
   - Name: "CultureCart Production"

3. **Add Project**
   - Go to "Projects" → "Add Project"
   - Name: "CultureCart"
   - Select your server

4. **Add Environment**
   - In project settings, add "production" environment

## 🚀 Step 4: Deploy Application

### 4.1 Connect Git Repository

1. **Add Git Source**
   - Go to project → "Sources" → "Add"
   - Select "Git"
   - Repository URL: `https://github.com/your-username/culturecart`
   - Branch: `main`

2. **Configure Environment Variables**
   - Go to environment → "Environment Variables"
   - Add all variables from `.env.production`

### 4.2 Create Services

1. **Backend Service**
   - Go to project → "Services" → "Add"
   - Type: "Docker Compose"
   - Name: "culturecart-backend"
   - Docker Compose file: `coolify/docker-compose.prod.yml`
   - Environment: production

2. **Frontend Service**
   - Add another service
   - Type: "Docker Compose"
   - Name: "culturecart-frontend"
   - Same compose file

### 4.3 Database Configuration

1. **Add Database Service**
   - Services → Add → Database
   - Type: PostgreSQL
   - Name: culturecart-db
   - Use external database (Cloud SQL)

2. **Configure External Database**
   - Host: Your Cloud SQL private IP
   - Port: 5432
   - Database: culturecart_db
   - Username: culturecart_user
   - Password: culturecart_password

## 🌐 Step 5: Domain & SSL Setup

### 5.1 Configure Domain

1. **Add Domain to Coolify**
   - Project → Settings → Domains
   - Add your domain: `yourdomain.com`

2. **Update DNS**
   ```bash
   # Add A record pointing to your server IP
   # A record: yourdomain.com -> YOUR_SERVER_IP
   # CNAME: api.yourdomain.com -> yourdomain.com
   ```

### 5.2 SSL Certificate

Coolify automatically handles SSL certificates via Let's Encrypt:
- Go to domain settings
- Enable "Auto SSL"
- Coolify will generate and renew certificates automatically

## 🔧 Step 6: Monitoring & Scaling

### 6.1 Health Checks

```bash
# Backend health check endpoint
GET /health

# Frontend health check
GET /
```

### 6.2 Monitoring Setup

1. **Enable Coolify Monitoring**
   - Project → Settings → Monitoring
   - Enable health checks and logging

2. **GCP Monitoring**
   ```bash
   # Enable Cloud Monitoring
   gcloud services enable monitoring.googleapis.com

   # Create uptime check
   gcloud monitoring uptime-check-configs create culturecart-uptime \
     --display-name="CultureCart Uptime Check" \
     --http-check-path="/" \
     --http-check-port=80 \
     --monitored-resource-type=uptime_url \
     --resource-labels=host=yourdomain.com
   ```

### 6.3 Backup Configuration

```bash
# Database backup
gcloud sql backups create culturecart-db-backup \
  --instance=culturecart-db \
  --description="Daily backup"
```

## 🚀 Step 7: Deployment

### 7.1 Initial Deployment

```bash
# Trigger deployment from Coolify dashboard
# Or use Coolify CLI
coolify deploy production
```

### 7.2 Zero-Downtime Deployment

Coolify supports zero-downtime deployments automatically:
- New containers are started
- Traffic is switched once health checks pass
- Old containers are stopped

## 🔒 Step 8: Security Hardening

### 8.1 Firewall Rules

```bash
# Allow only necessary ports
gcloud compute firewall-rules create culturecart-allow-ssh \
  --network=culturecart-network \
  --allow=tcp:22 \
  --source-ranges=YOUR_IP_RANGE

gcloud compute firewall-rules create culturecart-allow-http \
  --network=culturecart-network \
  --allow=tcp:80,tcp:443 \
  --source-ranges=0.0.0.0/0

gcloud compute firewall-rules create culturecart-allow-health \
  --network=culturecart-network \
  --allow=tcp:8000 \
  --source-ranges=YOUR_IP_RANGE
```

### 8.2 Secrets Management

```bash
# Store secrets in GCP Secret Manager
echo -n "your-jwt-secret" | gcloud secrets create jwt-secret --data-file=-
echo -n "your-db-password" | gcloud secrets create db-password --data-file=-

# Access in Coolify environment variables
JWT_SECRET=$(gcloud secrets versions access latest --secret=jwt-secret)
```

## 📊 Step 9: Performance Optimization

### 9.1 CDN Setup

```bash
# Enable Cloud CDN
gcloud compute backend-services add-backend culturecart-backend \
  --instance-group=culturecart-group \
  --instance-group-region=us-central1

gcloud compute backend-services update culturecart-backend \
  --enable-cdn \
  --cache-mode=CACHE_ALL_STATIC
```

### 9.2 Auto Scaling

```bash
# Create instance group
gcloud compute instance-groups managed create culturecart-group \
  --base-instance-name=culturecart-instance \
  --size=1 \
  --template=culturecart-template \
  --region=us-central1

# Set auto scaling
gcloud compute instance-groups managed set-autoscaling culturecart-group \
  --max-num-replicas=5 \
  --min-num-replicas=1 \
  --target-cpu-utilization=0.6 \
  --cool-down-period=60
```

## 🔄 Step 10: CI/CD Pipeline

### 10.1 GitHub Actions Integration

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Deploy to Coolify
      run: |
        curl -X POST "${{ secrets.COOLIFY_WEBHOOK_URL }}" \
          -H "Content-Type: application/json" \
          -d '{"ref": "refs/heads/main"}'
```

### 10.2 Webhook Configuration

1. **Create Coolify Webhook**
   - Project → Settings → Webhooks
   - Add GitHub webhook URL

2. **Add Secret to GitHub**
   - Repository → Settings → Secrets
   - Add `COOLIFY_WEBHOOK_URL`

## 📈 Step 11: Cost Optimization

### 11.1 Resource Sizing

```bash
# Monitor usage and adjust instance types
gcloud compute instances set-machine-type culturecart-instance \
  --machine-type=e2-medium \
  --zone=us-central1-a
```

### 11.2 Budget Alerts

```bash
# Set up budget alerts
gcloud billing budgets create culturecart-budget \
  --billing-account=YOUR_BILLING_ACCOUNT \
  --display-name="CultureCart Monthly Budget" \
  --budget-amount=100.0 \
  --budget-filter-projects=projects/culturecart-production
```

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check Cloud SQL connectivity
   gcloud sql instances describe culturecart-db --format="value(ipAddresses)"
   ```

2. **Container Health Checks Failing**
   ```bash
   # Check container logs
   docker logs culturecart-backend
   docker logs culturecart-frontend
   ```

3. **SSL Certificate Issues**
   - Ensure domain DNS is properly configured
   - Check Coolify domain settings

### Logs & Monitoring

```bash
# View Coolify logs
coolify logs production

# GCP logs
gcloud logging read "resource.type=gce_instance AND resource.labels.instance_name=culturecart-instance"
```

## 📚 Additional Resources

- [Coolify Documentation](https://coolify.io/docs)
- [GCP Documentation](https://cloud.google.com/docs)
- [PostgreSQL on GCP](https://cloud.google.com/sql/docs/postgres)
- [Cloud Load Balancing](https://cloud.google.com/load-balancing/docs)

---

## 🎯 Quick Start Checklist

- [ ] GCP project created
- [ ] APIs enabled
- [ ] VPC network configured
- [ ] Cloud SQL instance running
- [ ] Coolify installed on VM
- [ ] Git repository connected
- [ ] Services deployed
- [ ] Domain configured
- [ ] SSL enabled
- [ ] Monitoring set up
- [ ] Backups configured

**Your CultureCart application should now be live at `https://yourdomain.com`! 🎉**
