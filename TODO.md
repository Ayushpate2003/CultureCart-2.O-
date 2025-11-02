# Coolify Setup for CultureCart Project

## Information Gathered
- **Project Structure**: Full-stack app with React frontend (Vite) and Node.js/Express backend (PostgreSQL).
- **Existing Files**:
  - `coolify-deployment.md`: Comprehensive deployment guide with GCP and Coolify setup.
  - `coolify-setup-commands.sh`: GCP infrastructure and Coolify installation commands.
  - `coolify/docker-compose.prod.yml`: Docker Compose for production services (backend and frontend).
  - `culturecart-backend/Dockerfile.prod`: Optimized Dockerfile for backend.
  - `Dockerfile.prod`: Multi-stage Dockerfile for frontend with Nginx.
  - `nginx.conf` and `coolify/nginx.conf`: Nginx configs for proxying API and serving frontend.
  - `.github/workflows/deploy.yml`: GitHub Actions for automated deployment via webhook.
  - `culturecart-backend/healthcheck.js`: Health check script for database connectivity.
  - Backend has health endpoint `/health` in `server.js`.
- **Dependencies**: GCP account, Coolify account, domain (optional), GitHub repo.
- **Current Status**: All Docker and config files are prepared; setup requires GCP infrastructure and Coolify configuration.

## Plan
1. **Install GCP CLI**: Install and configure Google Cloud SDK. ✅
2. **GCP Infrastructure Setup**:
   - Create GCP project. ✅
   - Enable required APIs (Compute, Container, Run, SQL, Cloud Build, Secret Manager). ✅
   - Create VPC network and subnet. ✅
   - Set up Cloud SQL PostgreSQL instance, database, and user. ✅
   - Create VM instance for Coolify. ✅
   - Configure firewall rules for HTTP/HTTPS and SSH. ✅
3. **Coolify Installation**:
   - SSH into VM.
   - Install Coolify using the provided script.
   - Access Coolify dashboard.
4. **Coolify Configuration**:
   - Add server (Local Docker Engine).
   - Create project (CultureCart).
   - Add production environment.
   - Connect GitHub repository as source.
   - Configure environment variables (DATABASE_URL, JWT_SECRET, etc.).
   - Deploy backend and frontend services using docker-compose.prod.yml.
5. **Domain and SSL Setup**:
   - Add domain in Coolify.
   - Update DNS A record.
   - Enable auto SSL with Let's Encrypt.
6. **Monitoring and Security**:
   - Enable GCP monitoring and create uptime checks.
   - Set up database backups.
   - Configure firewall and security headers (already in nginx.conf).
7. **CI/CD Integration**:
   - Ensure GitHub Actions workflow triggers deployments.
   - Test deployment pipeline.
8. **Testing and Verification**:
   - Verify health checks pass.
   - Test frontend and API endpoints.
   - Monitor logs and performance.

## Steps
- [x] Complete GCP CLI installation and initialization.
- [x] Create GCP project 'culturecart-production'.
- [x] Enable required GCP APIs (Compute, Container, Run, SQL, Cloud Build, Secret Manager).
- [x] Create VPC network and subnet.
- [x] Set up Cloud SQL PostgreSQL instance, database, and user.
- [x] Create VM instance for Coolify.
- [x] Configure firewall rules for HTTP/HTTPS and SSH.
- [x] SSH into VM and install Coolify.
- [x] Access Coolify dashboard and configure server (http://136.114.254.145:8000).
- [ ] Create CultureCart project and production environment in Coolify.
- [ ] Connect GitHub repository as source.
- [ ] Configure environment variables in Coolify.
- [ ] Deploy backend and frontend services.
- [ ] Add domain and enable SSL.
- [ ] Set up GCP monitoring and uptime checks.
- [ ] Configure database backups and budget alerts.
- [ ] Test CI/CD pipeline.
- [ ] Verify health checks, frontend, and API functionality.

## Dependent Files
- `coolify-deployment.md`: Reference guide.
- `coolify-setup-commands.sh`: Commands for GCP and Coolify setup.
- `coolify/docker-compose.prod.yml`: Service definitions.
- `culturecart-backend/Dockerfile.prod`: Backend containerization.
- `Dockerfile.prod`: Frontend containerization.
- `nginx.conf`: Nginx configuration.
- `.github/workflows/deploy.yml`: Deployment automation.
- `culturecart-backend/healthcheck.js`: Health check script.
- `culturecart-backend/server.js`: Backend server with health endpoint.

## Followup Steps
- Install dependencies (gcloud CLI).
- Execute GCP setup commands.
- Install and configure Coolify.
- Deploy and test application.
- Set up monitoring and backups.
- Verify SSL and domain configuration.
- Test full application functionality.
