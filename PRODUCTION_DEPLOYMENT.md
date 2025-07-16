# 🚀 Vita Health App - Production Deployment Guide

## 📋 **Production Environment Setup**

### **Firebase Production Configuration**

#### **1. Create Production Firebase Project**
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project (if not done)
firebase init

# Select:
# - Hosting
# - Firestore
# - Authentication
# - Functions (optional)
```

#### **2. Production Firebase Config**
Create production environment variables:

```javascript
// src/config/firebase.prod.js
const firebaseConfig = {
  apiKey: "YOUR_PROD_API_KEY",
  authDomain: "vita-health-prod.firebaseapp.com",
  projectId: "vita-health-prod",
  storageBucket: "vita-health-prod.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_PROD_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

#### **3. Environment Configuration**
```bash
# .env.production
VITE_FIREBASE_API_KEY=your_prod_api_key
VITE_FIREBASE_AUTH_DOMAIN=vita-health-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vita-health-prod
VITE_FIREBASE_STORAGE_BUCKET=vita-health-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## **🔧 Build & Deployment Process**

### **1. Production Build**
```bash
# Clean previous builds
rm -rf dist/

# Install dependencies
npm ci

# Run linting
npm run lint

# Create production build
npm run build

# Test production build locally
npm run preview
```

### **2. Firebase Deployment**
```bash
# Deploy to Firebase Hosting
firebase deploy --only hosting

# Deploy Firestore rules and indexes
firebase deploy --only firestore

# Deploy everything
firebase deploy
```

### **3. Custom Domain Setup**
```bash
# Add custom domain in Firebase Console
# - Go to Hosting section
# - Click "Add custom domain"
# - Follow DNS configuration steps

# Example DNS records:
# A record: @ -> 151.101.1.195
# A record: @ -> 151.101.65.195
# CNAME: www -> vita-health-prod.web.app
```

---

## **🔒 Security Configuration**

### **1. Firestore Security Rules**
```javascript
// firestore.rules (production)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Strict user data isolation
    match /profiles/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId
        && request.auth.token.email_verified == true;
    }
    
    match /health_entries/{entryId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.user_id
        && request.auth.token.email_verified == true;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.user_id
        && request.auth.token.email_verified == true;
    }
    
    // Add rate limiting and validation
    match /{document=**} {
      allow read, write: if false; // Deny all by default
    }
  }
}
```

### **2. Authentication Configuration**
```javascript
// Enable email verification requirement
// Configure password policies
// Set up reCAPTCHA for sign-up
// Configure authorized domains
```

### **3. Content Security Policy**
```html
<!-- Add to index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://apis.google.com;
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               connect-src 'self' https://*.googleapis.com https://*.firebaseapp.com;">
```

---

## **📊 Monitoring & Analytics**

### **1. Firebase Analytics Setup**
```javascript
// Enable enhanced measurement
// Set up custom events
// Configure conversion tracking
// Set up audience segments
```

### **2. Performance Monitoring**
```javascript
// Firebase Performance
import { getPerformance } from 'firebase/performance';
const perf = getPerformance(app);

// Custom traces for key user flows
const trace = perf.trace('health_data_entry');
trace.start();
// ... user action
trace.stop();
```

### **3. Error Tracking**
```javascript
// Firebase Crashlytics (if using React Native)
// Or integrate with Sentry for web
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production"
});
```

---

## **🔄 CI/CD Pipeline**

### **1. GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: vita-health-prod
```

### **2. Environment Management**
```bash
# Development
firebase use development

# Staging
firebase use staging

# Production
firebase use production
```

---

## **🧪 Testing Strategy**

### **1. Automated Testing**
```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Performance tests
npm run test:performance
```

### **2. Manual Testing Checklist**
- [ ] All authentication flows
- [ ] Data entry and persistence
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness
- [ ] Performance benchmarks
- [ ] Security validation

### **3. Load Testing**
```bash
# Use tools like:
# - Artillery.io
# - k6
# - Firebase Performance Monitoring
```

---

## **📱 Progressive Web App (PWA)**

### **1. Service Worker Configuration**
```javascript
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'Vita Health App',
        short_name: 'Vita',
        description: 'Your personal health companion',
        theme_color: '#10B981',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
}
```

### **2. Offline Functionality**
```javascript
// Implement offline data caching
// Sync when connection restored
// Show offline indicators
```

---

## **🔍 Health Checks & Monitoring**

### **1. Uptime Monitoring**
```javascript
// Set up monitoring with:
// - Firebase Hosting health checks
// - Third-party services (Pingdom, UptimeRobot)
// - Custom health check endpoints
```

### **2. Performance Monitoring**
```javascript
// Core Web Vitals tracking
// Real User Monitoring (RUM)
// Synthetic monitoring
// Database performance metrics
```

---

## **📋 Production Checklist**

### **Pre-Deployment**
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Performance benchmarks met
- [ ] Cross-browser testing done
- [ ] Mobile testing completed
- [ ] Accessibility audit passed

### **Deployment**
- [ ] Production build successful
- [ ] Firebase deployment completed
- [ ] DNS configuration verified
- [ ] SSL certificate active
- [ ] CDN configuration optimized

### **Post-Deployment**
- [ ] Health checks passing
- [ ] Analytics tracking working
- [ ] Error monitoring active
- [ ] Performance monitoring setup
- [ ] Backup strategy implemented

---

## **🚀 Go-Live Process**

### **1. Soft Launch**
- Deploy to staging environment
- Limited user testing
- Monitor for 24-48 hours
- Fix any critical issues

### **2. Production Launch**
- Deploy to production
- Monitor real-time metrics
- Have rollback plan ready
- Communicate with users

### **3. Post-Launch**
- Monitor for 72 hours
- Collect user feedback
- Address any issues quickly
- Plan next iteration

---

**🎯 Production Status: READY FOR DEPLOYMENT**

**Current Environment:**
- Development: `http://localhost:4175/`
- Production Build: `http://localhost:4176/`
- Firebase Project: `vital-b788d`
