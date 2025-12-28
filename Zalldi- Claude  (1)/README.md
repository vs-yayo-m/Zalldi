# 🧡 Zalldi - Premium Quick Commerce Platform

**Fast. Smooth. Orange. Perfect.**

Zalldi is a premium quick commerce platform delivering groceries and daily essentials within 1 hour across all 19 wards of Butwal, Nepal.

---

## 🚀 Features

- ⚡ **1-Hour Delivery** - Fastest delivery in Butwal
- 🛍️ **5000+ Products** - Everything you need in one place
- 🏘️ **All 19 Wards** - Complete coverage of Butwal
- 📱 **Mobile First** - Optimized for smartphones
- 🎨 **Premium Design** - Beautiful orange-themed interface
- 🔐 **Secure** - Bank-grade security measures
- 📊 **Real-time Tracking** - Track your order live
- 💳 **Multiple Payments** - COD, eSewa, Khalti

---

## 🛠️ Tech Stack

### Frontend
- React 18.3+
- Vite 5+
- Tailwind CSS 3.4+
- Framer Motion 11+
- React Router DOM 6+
- Lucide React (Icons)

### Backend
- Firebase Auth
- Firestore Database
- Firebase Storage
- Firebase Cloud Functions

### Deployment
- Netlify (Frontend)
- Firebase (Backend)

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm 9+
- Firebase account
- Netlify account (optional)

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/zalldi.git
cd zalldi
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase credentials:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. **Setup Firebase**
- Create a Firebase project
- Enable Authentication (Email/Password)
- Create Firestore database
- Enable Storage
- Deploy security rules:
```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

5. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 🔧 Build for Production

```bash
npm run build
```

The optimized files will be in the `dist/` folder.

---

## 🚀 Deployment

### Deploy to Netlify

1. **Connect repository to Netlify**
2. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Add environment variables** in Netlify dashboard
4. **Deploy!**

### Deploy Firebase Functions

```bash
cd functions
npm install
firebase deploy --only functions
```

---

## 📁 Project Structure

```
zalldi/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, animations
│   ├── components/     # React components
│   │   ├── layout/    # Header, Footer, etc.
│   │   ├── ui/        # Reusable UI components
│   │   ├── customer/  # Customer-facing components
│   │   ├── supplier/  # Supplier components
│   │   ├── admin/     # Admin components
│   │   ├── shared/    # Shared components
│   │   └── animations/# Animation components
│   ├── pages/         # Page components
│   ├── contexts/      # React contexts
│   ├── hooks/         # Custom hooks
│   ├── services/      # API services
│   ├── utils/         # Utility functions
│   ├── config/        # Configuration files
│   ├── styles/        # Global styles
│   ├── App.jsx        # Main app component
│   └── main.jsx       # Entry point
├── functions/          # Firebase Cloud Functions
└── ...config files
```

---

## 🎨 Design System

### Colors
- **Primary Orange:** #FF6B35
- **Deep Orange:** #F7931E
- **Light Orange:** #FFB88C

### Typography
- **Display:** Poppins (Bold, ExtraBold)
- **Body:** Inter (Regular, Medium, SemiBold)
- **Accent:** Outfit (Medium, SemiBold)

### Minimum Font Size
- Body text: 16px
- Mobile optimization: Fully responsive

---

## 🔐 Security

- HTTPS enforced
- Firebase security rules
- Input validation
- XSS protection
- CSRF protection
- Rate limiting
- Secure authentication

---

## 📊 Performance

- Lighthouse Score: 95+
- Page Load: <2 seconds
- First Contentful Paint: <1.5s
- Mobile optimized
- Code splitting
- Image optimization
- Lazy loading

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is proprietary software. All rights reserved.

---

## 👤 Contact

**Founder:** Vishal Sharma

- **Email:** zalldi.vishalsharma@gmail.com
- **Support:** support.zalldi@gmail.com
- **WhatsApp:** +977 9821072912
- **Instagram:** [@zalldi.com.np](https://instagram.com/zalldi.com.np)
- **Founder Instagram:** [@sharma_vishal_o](https://instagram.com/sharma_vishal_o)

---

## 🙏 Acknowledgments

- React Team
- Tailwind CSS Team
- Firebase Team
- Framer Motion Team
- All open-source contributors

---

**Built with 🧡 in Butwal, Nepal**

*Zalldi - Fast. Premium. Trusted. Orange.* 🧡