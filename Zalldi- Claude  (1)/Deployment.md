# 🚀 Zalldi Deployment Guide

Complete guide for deploying Zalldi to production.

---

## 📋 Pre-Deployment Checklist

### Code Quality
- [ ] All files compile without errors
- [ ] No console.log() statements
- [ ] No unused imports
- [ ] ESLint passes with 0 warnings
- [ ] All components properly exported/imported
- [ ] All routes configured correctly

### Environment Setup
- [ ] Firebase project created
- [ ] All environment variables configured
- [ ] API keys secured
- [ ] Domain purchased (zalldi.com.np)
- [ ] SSL certificate ready

### Testing
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on iOS and Android
- [ ] Test all user flows
- [ ] Test cart functionality
- [ ] Test checkout process
- [ ] Test order tracking
- [ ] Lighthouse score >90

### Security
- [ ] Firebase rules deployed
- [ ] Storage rules deployed
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] CORS configured
- [ ] Rate limiting enabled

---

## 🔥 Firebase Setup

### 1. Create Firebase Project

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
firebase init
```

Select:
- Firestore
- Storage
- Functions
- Hosting (optional)

### 2. Deploy Security Rules

**Firestore Rules:**
```bash
firebase deploy --only firestore:rules
```

**Storage Rules:**
```bash
firebase deploy --only storage:rules
```

### 3. Deploy Cloud Functions

```bash
cd functions
npm install
firebase deploy --only functions
```

### 4. Create Collections

Create these collections in Firestore:
- `users`
- `products`
- `orders`
- `reviews`
- `notifications`

---

## 🌐 Netlify Deployment

### Option 1: Deploy via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build project
npm run build

# Deploy
netlify deploy --prod
```

### Option 2: Deploy via Git

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/zalldi.git
git push -u origin main
```

2. **Connect to Netlify:**
- Go to [netlify.com](https://netlify.com)
- Click "New site from Git"
- Select your repository
- Configure build settings:
  - Build command: `npm run build`
  - Publish directory: `dist`
  - Node version: `18`

3. **Add Environment Variables:**

Go to Site Settings → Build & Deploy → Environment → Add variables:
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
VITE_APP_URL
VITE_SUPPORT_EMAIL
VITE_BUSINESS_EMAIL
VITE_WHATSAPP_NUMBER
```

4. **Configure Custom Domain:**
- Go to Domain Settings
- Add custom domain: `zalldi.com.np`
- Configure DNS records
- Enable HTTPS

---

## 🔧 Build Optimization

### Vite Build Config

Already configured in `vite.config.js`:
- Code splitting
- Tree shaking
- Minification
- Source maps disabled
- Chunk optimization

### Performance Checklist

- [ ] Images compressed and in WebP format
- [ ] Fonts preloaded
- [ ] Code split by route
- [ ] Lazy loading implemented
- [ ] Service Worker (optional)
- [ ] Gzip compression enabled

---

## 🌍 Domain Configuration

### DNS Settings

Add these records to your DNS:

**A Record:**
```
Type: A
Name: @
Value: 75.2.60.5 (Netlify's load balancer)
TTL: 3600
```

**CNAME Record:**
```
Type: CNAME
Name: www
Value: zalldi.netlify.app
TTL: 3600
```

### SSL Certificate

- Netlify auto-provisions SSL via Let's Encrypt
- No additional configuration needed
- HTTPS will be enforced automatically

---

## 📧 Email Configuration

### Setup Email Service

For transactional emails (order confirmations, etc.):

1. **Use Firebase Cloud Functions:**
```javascript
// functions/sendEmail.js
exports.sendEmail = functions.https.onCall(async (data) => {
  // Email sending logic
})
```

2. **Use SendGrid/Mailgun:**
- Create account
- Get API key
- Configure in Cloud Functions

---

## 🔐 Security Configuration

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['supplier', 'admin'];
    }
    
    match /orders/{orderId} {
      allow read: if request.auth != null && 
                   (resource.data.customerId == request.auth.uid || 
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['supplier', 'admin']);
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['supplier', 'admin'];
    }
  }
}
```

### Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                    request.resource.size < 5 * 1024 * 1024;
    }
    
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

---

## 📊 Monitoring & Analytics

### Setup Google Analytics

Add to `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Firebase Performance Monitoring

```javascript
import { getPerformance } from 'firebase/performance'
const perf = getPerformance(app)
```

### Error Tracking

Consider using:
- Sentry
- LogRocket
- Firebase Crashlytics

---

## 🔄 Continuous Deployment

### Automatic Deployment

Netlify automatically deploys when you push to main branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

### Deploy Previews

- Pull requests get deploy previews
- Test before merging
- Share preview links with team

---

## 🧪 Post-Deployment Testing

### Manual Testing Checklist

- [ ] Homepage loads correctly
- [ ] Products display properly
- [ ] Search works
- [ ] Cart functions
- [ ] Checkout completes
- [ ] Orders track correctly
- [ ] User registration works
- [ ] Login/logout works
- [ ] Mobile responsive
- [ ] All links work

### Automated Testing

```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun --upload.target=temporary-public-storage
```

---

## 📈 Performance Optimization

### After Deployment

1. **Check Lighthouse scores**
2. **Optimize images** if needed
3. **Review bundle sizes**
4. **Check Core Web Vitals**
5. **Test on real devices**

### Monitoring

- Use Netlify Analytics
- Firebase Performance
- Google Analytics
- Uptime monitoring (UptimeRobot)

---

## 🆘 Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Routing Issues

- Ensure `_redirects` file in `public/`
- Content: `/* /index.html 200`

### Environment Variables Not Working

- Prefix with `VITE_`
- Restart dev server after changes
- Check Netlify environment variables

### Firebase Connection Issues

- Verify API keys
- Check Firebase project settings
- Ensure billing enabled for Cloud Functions

---

## 📞 Support

If you encounter issues:

**Email:** zalldi.vishalsharma@gmail.com
**WhatsApp:** +977 9821072912

---

## ✅ Launch Checklist

Final checks before announcing launch:

- [ ] All features working
- [ ] No critical bugs
- [ ] Performance optimized
- [ ] Security verified
- [ ] Monitoring active
- [ ] Backup strategy in place
- [ ] Support system ready
- [ ] Marketing materials ready
- [ ] Social media accounts active
- [ ] Contact information correct

---

**Ready to Launch! 🚀**

*Zalldi - Fast. Premium. Trusted. Orange.* 🧡