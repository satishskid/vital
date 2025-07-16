# 🌐 Vita Health App - Custom Domain Setup

## 🎯 **Target Domains**

### **Production Domain**: `vital.skids.health`
- **Purpose**: Main production application
- **Environment**: Production Firebase hosting
- **SSL**: Automatic Firebase SSL certificate

### **Staging Domain**: `vital.greybrain.ai`
- **Purpose**: Staging and testing environment
- **Environment**: Staging Firebase hosting
- **SSL**: Automatic Firebase SSL certificate

---

## 🔧 **Firebase Hosting Setup**

### **Step 1: Configure Firebase Hosting Targets**

```bash
# Set up hosting targets
firebase target:apply hosting staging vital-staging
firebase target:apply hosting production vital-production

# Verify targets
firebase target
```

### **Step 2: Deploy to Staging**

```bash
# Build for staging
npm run build

# Deploy to staging
firebase deploy --only hosting:staging

# Add custom domain in Firebase Console
# Go to Hosting > Add custom domain > vital.greybrain.ai
```

### **Step 3: Deploy to Production**

```bash
# Build for production
npm run build:production

# Deploy to production
firebase deploy --only hosting:production

# Add custom domain in Firebase Console
# Go to Hosting > Add custom domain > vital.skids.health
```

---

## 📋 **DNS Configuration Required**

### **For vital.skids.health (Production)**

Add these DNS records in your domain provider:

```
Type: A
Name: vital
Value: 151.101.1.195

Type: A
Name: vital
Value: 151.101.65.195

Type: AAAA
Name: vital
Value: 2a04:4e42::645

Type: AAAA
Name: vital
Value: 2a04:4e42:200::645
```

### **For vital.greybrain.ai (Staging)**

Add these DNS records in your domain provider:

```
Type: A
Name: vital
Value: 151.101.1.195

Type: A
Name: vital
Value: 151.101.65.195

Type: AAAA
Name: vital
Value: 2a04:4e42::645

Type: AAAA
Name: vital
Value: 2a04:4e42:200::645
```

---

## 🚀 **Deployment Commands**

### **Updated Package.json Scripts**

```json
{
  "scripts": {
    "build:staging": "REACT_APP_ENV=staging npm run build",
    "build:production": "REACT_APP_ENV=production npm run build",
    "deploy:staging": "npm run build:staging && firebase deploy --only hosting:staging",
    "deploy:production": "npm run build:production && firebase deploy --only hosting:production",
    "deploy:all": "npm run deploy:staging && npm run deploy:production"
  }
}
```

### **Environment Variables**

Create `.env.staging` and `.env.production`:

```bash
# .env.staging
REACT_APP_ENV=staging
REACT_APP_API_URL=https://vital.greybrain.ai
REACT_APP_DOMAIN=vital.greybrain.ai

# .env.production
REACT_APP_ENV=production
REACT_APP_API_URL=https://vital.skids.health
REACT_APP_DOMAIN=vital.skids.health
```

---

## ✅ **Verification Steps**

### **After DNS Configuration**

1. **Wait for DNS propagation** (up to 24 hours)
2. **Verify DNS records**:
   ```bash
   dig vital.skids.health
   dig vital.greybrain.ai
   ```
3. **Check SSL certificate** in Firebase Console
4. **Test both domains** in browser
5. **Verify redirects** work properly

### **Testing Checklist**

- [ ] `https://vital.skids.health` loads production app
- [ ] `https://vital.greybrain.ai` loads staging app
- [ ] SSL certificates are valid
- [ ] All routes work correctly
- [ ] Firebase authentication works
- [ ] Health data sync functions properly
- [ ] Performance is optimal

---

## 🔒 **Security Configuration**

### **Firebase Security Rules**

Update Firestore rules for domain restrictions:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow access only from authorized domains
    match /{document=**} {
      allow read, write: if request.auth != null 
        && (request.headers.origin == 'https://vital.skids.health' 
        || request.headers.origin == 'https://vital.greybrain.ai'
        || request.headers.origin == 'http://localhost:3000');
    }
  }
}
```

### **CORS Configuration**

Update Firebase hosting headers:

```json
{
  "headers": [
    {
      "source": "**",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://vital.skids.health, https://vital.greybrain.ai"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

---

## 📊 **Monitoring & Analytics**

### **Domain-Specific Analytics**

Update Google Analytics configuration:

```javascript
// In src/lib/analytics.js
const GA_TRACKING_IDS = {
  'vital.skids.health': 'GA_PRODUCTION_ID',
  'vital.greybrain.ai': 'GA_STAGING_ID'
};

const trackingId = GA_TRACKING_IDS[window.location.hostname];
```

### **Performance Monitoring**

Set up domain-specific monitoring:

```javascript
// Firebase Performance
const perf = getPerformance(app);
perf.dataCollectionEnabled = window.location.hostname === 'vital.skids.health';
```

---

## 🎯 **Next Steps**

### **Immediate Actions**

1. **Configure DNS records** for both domains
2. **Deploy to staging** environment first
3. **Test staging thoroughly** before production
4. **Deploy to production** after validation
5. **Monitor both environments** for issues

### **Post-Deployment**

1. **Set up monitoring** and alerts
2. **Configure backup strategies**
3. **Plan rollback procedures**
4. **Document operational procedures**
5. **Train team on domain management**

---

## 🆘 **Troubleshooting**

### **Common Issues**

**DNS not propagating**:
- Wait up to 24 hours
- Use different DNS servers for testing
- Check with online DNS propagation tools

**SSL certificate issues**:
- Verify domain ownership in Firebase Console
- Check DNS records are correct
- Wait for automatic certificate generation

**App not loading**:
- Check Firebase hosting deployment status
- Verify build was successful
- Check browser console for errors

### **Support Resources**

- **Firebase Documentation**: https://firebase.google.com/docs/hosting
- **DNS Propagation Checker**: https://dnschecker.org
- **SSL Certificate Checker**: https://www.sslshopper.com/ssl-checker.html

---

**Once configured, Vita Health App will be accessible at:**
- **Production**: https://vital.skids.health
- **Staging**: https://vital.greybrain.ai

**Both domains will provide the full Vita experience with proper SSL certificates and optimal performance! 🌟**
