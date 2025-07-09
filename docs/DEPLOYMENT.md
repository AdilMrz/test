# Deployment Guide

This guide covers deploying the Lottti POC application to various hosting platforms.

## Pre-deployment Checklist

### Code Quality

- [ ] All TypeScript errors resolved (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] Build succeeds (`npm run build`)

### Environment Setup

- [ ] Production Supabase project configured
- [ ] Environment variables documented
- [ ] Database schema deployed
- [ ] RLS policies configured
- [ ] Storage buckets created (if needed)

### Security Review

- [ ] API keys secured
- [ ] Authentication configured
- [ ] RBAC permissions tested
- [ ] CORS settings verified

## Environment Variables

### Required Variables

```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: Maintenance Mode
VITE_MAINTENANCE_MODE=false

# Optional: Application Configuration
VITE_APP_TITLE=Lottti POC
VITE_APP_VERSION=1.0.0

# Optional: Error Tracking
VITE_SENTRY_DSN=your-sentry-dsn
VITE_SENTRY_ENVIRONMENT=production
```

### Security Notes

- Never commit `.env` files to version control
- Use different Supabase projects for staging/production
- Rotate API keys regularly
- Use environment-specific configurations

## Vercel Deployment (Recommended)

### Prerequisites

- Vercel account
- GitHub repository

### Automatic Deployment

1. **Connect Repository**

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login to Vercel
   vercel login

   # Deploy from project directory
   vercel
   ```

2. **Configure Project**

   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables**

   ```bash
   # Using Vercel CLI
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   ```

   Or via Vercel Dashboard:

   - Go to Project Settings → Environment Variables
   - Add each variable for Production, Preview, and Development

4. **Deploy**
   ```bash
   # Deploy to production
   vercel --prod
   ```

### GitHub Integration

1. **Connect GitHub**

   - Go to Vercel Dashboard
   - Import Git Repository
   - Select your repository

2. **Configure Build Settings**

   - Framework: Vite
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables**

   - Add all required environment variables
   - Set for all environments (Production, Preview, Development)

4. **Automatic Deployments**
   - Production: Deploys on push to `main` branch
   - Preview: Deploys on pull requests

## Netlify Deployment

### Manual Deployment

1. **Build Project**

   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder
   - Configure custom domain (optional)

### Git Integration

1. **Connect Repository**

   - New site from Git
   - Choose your Git provider
   - Select repository

2. **Build Settings**

   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

3. **Environment Variables**

   - Go to Site Settings → Environment Variables
   - Add all required variables

4. **Deploy Settings**

   ```toml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

## Traditional Web Hosting

### Build for Production

```bash
# Create production build
npm run build

# The dist/ folder contains all files needed
```

### Upload Files

1. **FTP/SFTP Upload**

   - Upload all files from `dist/` folder
   - Ensure `index.html` is in the root directory

2. **Server Configuration**

   **Apache (.htaccess)**

   ```apache
   RewriteEngine On
   RewriteBase /
   RewriteRule ^index\.html$ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

   **Nginx**

   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

## Docker Deployment

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Build and Run

```bash
# Build Docker image
docker build -t lottti-poc .

# Run container
docker run -p 80:80 lottti-poc
```

## AWS S3 + CloudFront

### S3 Setup

1. **Create S3 Bucket**

   ```bash
   aws s3 mb s3://your-bucket-name
   ```

2. **Configure Static Website Hosting**

   ```bash
   aws s3 website s3://your-bucket-name \
     --index-document index.html \
     --error-document index.html
   ```

3. **Upload Files**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

### CloudFront Setup

1. **Create Distribution**

   - Origin: Your S3 bucket
   - Default Root Object: `index.html`
   - Error Pages: 404 → `/index.html` (for SPA routing)

2. **Configure Caching**
   - Cache Behavior: Cache based on selected request headers
   - TTL: Set appropriate cache durations

## Environment-Specific Configurations

### Development

```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key
```

### Staging

```env
VITE_SUPABASE_URL=https://staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=staging-anon-key
```

### Production

```env
VITE_SUPABASE_URL=https://production-project.supabase.co
VITE_SUPABASE_ANON_KEY=production-anon-key
```

## Post-Deployment Verification

### Functional Testing

- [ ] Application loads correctly
- [ ] Authentication works
- [ ] All CRUD operations function
- [ ] Dashboard displays data
- [ ] File uploads work (if applicable)

### Performance Testing

- [ ] Page load times acceptable
- [ ] API response times reasonable
- [ ] Images load properly
- [ ] Mobile responsiveness

### Security Testing

- [ ] HTTPS enabled
- [ ] Security headers present
- [ ] Authentication required
- [ ] RBAC permissions enforced

## Monitoring and Maintenance

### Error Monitoring

- Set up error tracking (Sentry, LogRocket)
- Monitor application performance
- Track user analytics

### Backup Strategy

- Database backups (Supabase handles this)
- Code repository backups
- Environment configuration backups

### Update Process

1. Test changes in staging environment
2. Create deployment checklist
3. Deploy during low-traffic periods
4. Monitor for issues post-deployment
5. Have rollback plan ready

## Troubleshooting

### Common Issues

**Build Failures**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Environment Variable Issues**

- Verify all variables are set
- Check variable names (must start with VITE\_)
- Restart build process after changes

**Routing Issues**

- Ensure server redirects all routes to index.html
- Check base URL configuration
- Verify React Router setup

**API Connection Issues**

- Verify Supabase URL and key
- Check CORS settings
- Ensure network connectivity

### Performance Optimization

**Bundle Size**

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

**Caching Strategy**

- Set appropriate cache headers
- Use CDN for static assets
- Implement service worker (optional)

This deployment guide should help you successfully deploy the Lottti POC application to your chosen hosting platform.
