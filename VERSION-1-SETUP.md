# 🚀 Vita Health App - Version 1 Setup Guide

## 📋 Overview

Version 1 is the **Manual Data Entry MVP** of the Vita Health App. This version focuses on:

- ✅ Manual health data input (Heart Rate, HRV, Steps, Sleep, Activity)
- ✅ Data import guidance from existing health apps
- ✅ Educational content about health metrics
- ✅ Gentle reminder system with achievements
- ✅ Privacy-first approach with Supabase backend
- ✅ Progressive Web App capabilities

## 🛠️ Setup Instructions

### 1. Supabase Database Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Run Database Setup**
   - Open your Supabase project dashboard
   - Go to SQL Editor
   - Copy and paste the contents of `supabase-setup.sql`
   - Run the script to create all tables and policies

3. **Configure Environment Variables**
   ```bash
   # Create .env file in project root
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 2. Update Supabase Configuration

Update `src/lib/supabase.js` with your actual Supabase credentials:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 3. Install Dependencies

```bash
npm install @supabase/supabase-js
npm install framer-motion
npm install react-icons
```

### 4. Enable PWA Features

1. **Update `public/manifest.json`**:
   ```json
   {
     "short_name": "Vita Health",
     "name": "Vita Health - Manual Entry",
     "icons": [
       {
         "src": "icon-192x192.png",
         "sizes": "192x192",
         "type": "image/png"
       },
       {
         "src": "icon-512x512.png",
         "sizes": "512x512",
         "type": "image/png"
       }
     ],
     "start_url": ".",
     "display": "standalone",
     "theme_color": "#10b981",
     "background_color": "#ffffff"
   }
   ```

2. **Add PWA Icons**:
   - Add `icon-192x192.png` and `icon-512x512.png` to `public/` folder
   - Add `badge-72x72.png` for notification badge

### 5. Configure Notifications

The service worker (`public/sw.js`) is already set up for:
- Push notifications
- Offline functionality
- Background sync

To enable notifications in production:
1. Ensure HTTPS is enabled
2. Users will be prompted for notification permissions
3. Reminders will work locally through the service worker

## 🎯 Features Included

### 📝 Manual Data Entry
- **Heart Health**: Heart Rate & HRV input with validation
- **Activity**: Daily steps and activity level selection
- **Sleep**: Duration and quality rating (1-10 scale)
- **Notes**: Optional text notes for each entry
- **Smart Validation**: Input validation with helpful error messages

### 📊 Data Import Guidance
- **Apple Health**: Step-by-step export instructions
- **Google Fit**: Data export and manual entry guidance
- **Samsung Health**: Export process walkthrough
- **Fitbit**: Account export instructions
- **Privacy-First**: No automatic data access, user controls everything

### 🎓 Educational Content
- **Heart Rate**: Understanding resting HR and fitness indicators
- **HRV**: Heart Rate Variability as recovery marker
- **Steps**: Daily movement and activity goals
- **Sleep**: Sleep quality and duration importance
- **Interactive Learning**: Tabbed content with tips and normal ranges

### 🏆 Motivation System
- **Streak Tracking**: Daily logging streaks with visual progress
- **Achievements**: Unlockable badges for consistency
- **Motivational Messages**: Personalized encouragement based on progress
- **Progress Overview**: Visual dashboard with key metrics

### 🔔 Gentle Reminders
- **Smart Scheduling**: Morning and evening reminder options
- **Achievement Notifications**: Celebrate milestones
- **Customizable**: Users can adjust reminder times and frequency
- **Offline Support**: Works even when app is closed

## 🔒 Privacy & Security

### Data Protection
- **Row Level Security**: Supabase RLS ensures users only see their data
- **Local Processing**: All data validation happens client-side
- **No Third-Party Tracking**: No analytics or tracking scripts
- **User Control**: Users decide what data to enter and when

### Authentication
- **Supabase Auth**: Secure email/password authentication
- **Session Management**: Automatic session handling
- **Profile Creation**: Automatic profile setup on signup
- **Data Isolation**: Complete separation between user accounts

## 🚀 Deployment

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Connect your GitHub repository
2. Set environment variables in deployment settings
3. Deploy with automatic builds on push

## 📱 User Experience

### First Time Users
1. **Sign Up**: Email/password registration
2. **Profile Setup**: Basic information (optional)
3. **Onboarding**: Introduction to manual entry features
4. **First Entry**: Guided health data input
5. **Reminders**: Optional notification setup

### Daily Workflow
1. **Morning Entry**: Log sleep data and morning metrics
2. **Evening Entry**: Log daily activity and wellness
3. **Progress Review**: Check streaks and achievements
4. **Learn**: Read educational content about health metrics

### Data Import Workflow
1. **Choose Source**: Select existing health app
2. **Export Data**: Follow step-by-step instructions
3. **Manual Entry**: Use exported data as reference
4. **Consistency**: Build daily logging habit

## 🔧 Customization Options

### Reminder Settings
- Adjust notification times
- Choose active days
- Customize reminder messages
- Enable/disable specific reminders

### Data Entry Preferences
- Skip optional fields
- Set default activity levels
- Customize sleep quality scale
- Add personal notes

### Educational Content
- Mark content as read
- Track learning progress
- Access metric explanations anytime

## 📈 Next Steps (Version 2)

Version 1 provides the foundation for:
- **Phone Sensor Integration**: Camera-based HRV, accelerometer steps
- **Advanced Analytics**: Trend analysis and insights
- **Health Connect**: Android device integration
- **Premium Features**: Advanced APIs and cloud sync

## 🆘 Troubleshooting

### Common Issues

**Database Connection**
- Verify Supabase URL and keys in environment variables
- Check RLS policies are enabled
- Ensure user authentication is working

**Notifications Not Working**
- Check browser notification permissions
- Verify service worker registration
- Ensure HTTPS in production

**Data Not Saving**
- Check browser console for errors
- Verify user is authenticated
- Check network connectivity

### Support
For issues with Version 1 setup:
1. Check browser console for errors
2. Verify Supabase configuration
3. Test with sample data entry
4. Review network requests in dev tools

## ✅ Version 1 Checklist

- [ ] Supabase project created and configured
- [ ] Database tables created with RLS policies
- [ ] Environment variables set
- [ ] App builds and runs locally
- [ ] User registration/login works
- [ ] Manual data entry saves to database
- [ ] Reminders system functional
- [ ] Educational content accessible
- [ ] PWA features enabled
- [ ] Ready for user testing

**Congratulations! You now have a fully functional Version 1 of the Vita Health App! 🎉**
