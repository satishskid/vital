# 🌟 Vita Health App

> **Privacy-first health tracking with manual data entry, educational content, and gentle motivation**

[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/satishskid/vital)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)](https://supabase.com/)

## 📱 About

Vita Health App is a privacy-first health tracking application that puts you in complete control of your health data. Version 1 focuses on manual data entry with comprehensive guidance for importing data from existing health apps.

### 🎯 Core Philosophy
- **Privacy First**: Your data stays with you - no third-party tracking
- **User Control**: You decide what to track and when
- **Educational**: Learn about health metrics while tracking
- **Motivational**: Gentle nudges and achievements to build habits

## ✨ Features

### 📝 Manual Health Data Entry
- **Heart Health**: Heart Rate & HRV tracking with validation
- **Activity**: Daily steps and activity level monitoring
- **Sleep**: Duration and quality rating (1-10 scale)
- **Notes**: Optional personal notes for each entry
- **Smart Validation**: Helpful error messages and input guidance

### 📊 Data Import Guidance
- **Apple Health**: Step-by-step export instructions
- **Google Fit**: Data export and manual entry guidance
- **Samsung Health**: Export process walkthrough
- **Fitbit**: Account export instructions
- **Privacy-Focused**: No automatic data access - you control everything

### 🎓 Educational Content
- **Heart Rate**: Understanding resting HR and fitness indicators
- **HRV**: Heart Rate Variability as a recovery marker
- **Steps**: Daily movement and activity goals
- **Sleep**: Sleep quality and duration importance
- **Interactive Learning**: Tabbed content with tips and normal ranges

### 🏆 Motivation System
- **Streak Tracking**: Daily logging streaks with visual progress
- **Achievements**: Unlockable badges for consistency
- **Motivational Messages**: Personalized encouragement
- **Progress Dashboard**: Visual overview of your health journey

### 🔔 Smart Reminders
- **Gentle Notifications**: Morning and evening reminders
- **Achievement Alerts**: Celebrate your milestones
- **Customizable**: Adjust times and frequency
- **Offline Support**: Works even when the app is closed

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/satishskid/vital.git
   cd vital
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL script from `supabase-setup.sql` in your Supabase SQL editor
   - Copy your project URL and anon key

4. **Configure environment**
   ```bash
   # Create .env file
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 Detailed Setup

For complete setup instructions, see [VERSION-1-SETUP.md](VERSION-1-SETUP.md)

## 🏗️ Architecture

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **React Icons**: Comprehensive icon library

### Backend
- **Supabase**: PostgreSQL database with real-time capabilities
- **Row Level Security**: Complete data isolation between users
- **Authentication**: Secure email/password auth with session management
- **Real-time**: Live updates when data changes

### PWA Features
- **Service Worker**: Offline functionality and notifications
- **Web App Manifest**: Install as native app
- **Push Notifications**: Background reminders and achievements
- **Offline Storage**: Local data persistence

## 📁 Project Structure

```
src/
├── components/
│   ├── Auth/              # Authentication components
│   ├── Dashboard/         # Main dashboard
│   ├── ManualEntry/       # Manual data entry system
│   ├── DataImport/        # Import guidance
│   ├── Education/         # Educational content
│   ├── Navigation/        # App navigation
│   └── ...
├── context/               # React context providers
├── lib/                   # Utilities and services
│   ├── supabase.js       # Supabase client
│   └── reminderSystem.js # Notification system
└── ...
```

## 🔒 Privacy & Security

### Data Protection
- **Row Level Security**: Users can only access their own data
- **Local Processing**: All validation happens client-side
- **No Tracking**: No analytics or third-party tracking scripts
- **User Control**: Complete control over what data to enter

### Authentication
- **Supabase Auth**: Industry-standard authentication
- **Session Management**: Secure session handling
- **Password Security**: Encrypted password storage
- **Data Isolation**: Complete separation between user accounts

## 🛣️ Roadmap

### Version 1 ✅ (Current)
- Manual data entry system
- Data import guidance
- Educational content
- Reminder system
- Privacy-first approach

### Version 2 🔄 (Next)
- Phone sensor integration (camera-based HRV, accelerometer)
- Real-time health monitoring
- Advanced data validation
- Sensor calibration system

### Version 3 📱 (Future)
- Health Connect integration (Android)
- Device synchronization
- Cross-platform compatibility
- Enhanced data sources

### Version 4 💎 (Premium)
- Commercial API integrations
- Advanced analytics
- Cloud synchronization
- Subscription features

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for the amazing backend-as-a-service platform
- **React Team** for the incredible frontend framework
- **Tailwind CSS** for the utility-first CSS framework
- **Health tracking community** for inspiration and feedback

## 📞 Support

- **Documentation**: [VERSION-1-SETUP.md](VERSION-1-SETUP.md)
- **Issues**: [GitHub Issues](https://github.com/satishskid/vital/issues)
- **Discussions**: [GitHub Discussions](https://github.com/satishskid/vital/discussions)

## 🌟 Star History

If you find this project helpful, please consider giving it a star! ⭐

---

**Built with ❤️ for privacy-conscious health enthusiasts**
