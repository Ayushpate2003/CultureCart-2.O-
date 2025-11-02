# CultureCart Coolify Setup Commands

## 1. GCP Infrastructure Setup
# Create GCP project
gcloud projects create culturecart-production --name='CultureCart Production'
gcloud config set project culturecart-production

# Enable required APIs
gcloud services enable compute.googleapis.com
gcloud services enable container.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable secretmanager.googleapis.com

# Create VPC network
gcloud compute networks create culturecart-network --subnet-mode=custom
gcloud compute networks subnets create culturecart-subnet \
  --network=culturecart-network \
  --range=10.0.0.0/24 \
  --region=us-central1

# Create Cloud SQL PostgreSQL instance
gcloud sql instances create culturecart-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --network=culturecart-network \
  --no-assign-ip

# Create database and user
gcloud sql databases create culturecart_db --instance=culturecart-db
gcloud sql users create culturecart_user \
  --instance=culturecart-db \
  --password=culturecart_password

# Create VM instance for Coolify
gcloud compute instances create culturecart-server \
  --zone=us-central1-a \
  --machine-type=e2-medium \
  --network=culturecart-network \
  --subnet=culturecart-subnet \
  --tags=coolify \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=50GB \
  --boot-disk-type=pd-standard

# Allow HTTP/HTTPS traffic
gcloud compute firewall-rules create culturecart-allow-http \
  --network=culturecart-network \
  --allow=tcp:80,tcp:443 \
  --source-ranges=0.0.0.0/0 \
  --target-tags=coolify

# Allow SSH (restrict to your IP)
gcloud compute firewall-rules create culturecart-allow-ssh \
  --network=culturecart-network \
  --allow=tcp:22 \
  --source-ranges=YOUR_IP_RANGE \
  --target-tags=coolify

## 2. Coolify Installation
# SSH into your VM
gcloud compute ssh culturecart-server --zone=us-central1-a

# Install Coolify
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# Access Coolify at: http://YOUR_VM_EXTERNAL_IP:8000
# Default credentials: root / password

## 3. Coolify Configuration
# In Coolify dashboard:
# 1. Add Server (Local Docker Engine)
# 2. Add Project (CultureCart)
# 3. Add Environment (production)
# 4. Add Git Source (your GitHub repo)
# 5. Configure Environment Variables
# 6. Deploy Services

## 4. Domain Setup
# Add domain in Coolify
# Update DNS A record to point to VM external IP
# Enable SSL (Let's Encrypt)

## 5. Monitoring Setup
# Enable GCP monitoring
gcloud services enable monitoring.googleapis.com

# Create uptime check
gcloud monitoring uptime-check-configs create culturecart-uptime \
  --display-name='CultureCart Uptime Check' \
  --http-check-path='/' \
  --http-check-port=80 \
  --monitored-resource-type=uptime_url \
  --resource-labels=host=yourdomain.com

## 6. Backup Configuration
gcloud sql backups create culturecart-db-backup \
  --instance=culturecart-db \
  --description='Daily backup'

## 7. Cost Optimization
# Set up budget alerts
gcloud billing budgets create culturecart-budget \
  --billing-account=YOUR_BILLING_ACCOUNT \
  --display-name='CultureCart Monthly Budget' \
  --budget-amount=100.0 \
  --budget-filter-projects=projects/culturecart-production
