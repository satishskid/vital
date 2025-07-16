# 📱 Vita Health App - Simple User Guide

## 🚀 **Getting Started**

### **Where to Get the App**
- **Beta Testing Version**: `http://localhost:4175/` (Development)
- **Production Preview**: `http://localhost:4176/` (Stable Build)
- **Future Production**: Will be available at custom domain

### **System Requirements**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Email address for registration
- Camera access (optional, for HRV measurement)
- Notification permissions (optional, for smart data capture)

---

## 👤 **How to Register**

### **Step 1: Create Account**
1. Visit the app URL
2. Click **"Create Account"**
3. Fill in your details:
   - First Name
   - Last Name
   - Email Address
   - Password (8+ characters)
   - Confirm Password
4. Click **"Sign Up"**

### **Step 2: Verify Email**
1. Check your email inbox
2. Click the verification link
3. Return to the app
4. Sign in with your credentials

### **Step 3: Start Using**
- You're now ready to track your health!

---

## 📊 **How to Use the App**

### **Main Navigation (Bottom Tabs)**
- 🏠 **Home**: Dashboard overview
- ✏️ **Log Data**: Manual health entry
- 📱 **Apps**: Health app recommendations  
- 📈 **Activity**: Smart notification capture
- ❤️ **HRV**: Heart rate measurement
- 🧘 **Mind**: Breathing exercises
- 👥 **Social**: Social wellness tracking
- 👤 **Profile**: Settings and account

### **Daily Health Tracking**

#### **Option 1: Manual Entry (Recommended)**
1. Tap **"Log Data"** tab
2. Fill in your daily health data:
   - Sleep duration and quality
   - Activity level and steps
   - Mood and energy
   - Heart rate (if known)
3. Takes less than 2 minutes
4. Tap **"Save"** when done

#### **Option 2: Smart Notification Capture**
1. Tap **"Activity"** tab
2. Enable notification intelligence
3. Grant permissions when asked
4. App automatically captures data from health apps
5. Review and confirm captured data

### **Key Features**

#### **🎯 Vitality Orb**
- Toggle to "Vitality" theme on home screen
- See your wellness in three states:
  - 🟡 **Recovering**: Rest and recharge
  - 🟢 **In Balance**: Steady and stable
  - 🔵 **Primed & Ready**: Peak performance
- Three rings show Recovery, Resilience, and Fuel

#### **❤️ HRV Measurement**
1. Tap **"HRV"** tab
2. Allow camera access
3. Place finger over camera lens
4. Hold still for 30 seconds
5. Get heart rate variability reading

#### **🧘 Breathing Exercises**
1. Tap **"Mind"** tab
2. Choose breathing technique
3. Follow visual guide
4. Track weekly progress

#### **👥 Social Wellness**
1. Tap **"Social"** tab
2. Add friends and family
3. Track social interactions
4. See health correlations

---

## 📈 **Understanding Your Data**

### **Dashboard Overview**
- **Today's Summary**: Current day health snapshot
- **Weekly Progress**: 7-day trends and patterns
- **Achievements**: Streaks and milestones
- **Insights**: Personalized recommendations

### **Vitality States Explained**
- **Recovering (Yellow)**: Focus on rest, sleep, and gentle activities
- **In Balance (Green)**: Maintain current habits, steady progress
- **Primed & Ready (Blue)**: Peak state, ready for challenges

### **Health Metrics**
- **Sleep**: Duration (hours) and quality (1-10 scale)
- **Activity**: Steps, active minutes, exercise intensity
- **Mood**: Energy and emotional state (1-10 scale)
- **HRV**: Heart rate variability (higher = better recovery)
- **Social**: Connection frequency and quality

---

## 🔒 **Privacy & Security**

### **Your Data is Safe**
- All data encrypted and stored securely
- Only you can see your health information
- No data sharing without your permission
- Local processing for notification intelligence

### **Permissions Explained**
- **Camera**: For HRV heart rate measurement only
- **Notifications**: To capture health data from other apps
- **Location**: Not used or requested
- **Contacts**: Only for social circle (optional)

---

## 🆘 **Getting Help**

### **Common Issues**
- **Can't log in**: Check email verification
- **Data not saving**: Check internet connection
- **Camera not working**: Allow camera permissions
- **Notifications not working**: Enable notification permissions

### **Contact Support**
- **Email**: satish@skids.health
- **Response Time**: Within 24 hours
- **Include**: Browser type, device, and description of issue

---

## 🔧 **Admin Monitoring Guide**

### **Firebase Console Access**
- **URL**: https://console.firebase.google.com/
- **Project**: `vital-b788d`
- **Login**: Use admin Google account

### **User Analytics Dashboard**
1. Go to Firebase Console
2. Select "Analytics" → "Events"
3. Monitor key metrics:
   - Daily active users
   - Health data entries
   - Feature usage
   - Error rates

### **User Feedback Monitoring**

#### **Real-time User Activity**
```
Firebase Console → Analytics → Realtime
- Current active users
- Popular screens
- User flows
- Geographic data
```

#### **Health Data Usage**
```
Firebase Console → Firestore → Data
- health_entries collection
- User engagement patterns
- Data entry frequency
- Feature adoption rates
```

#### **Error Monitoring**
```
Firebase Console → Crashlytics
- App crashes and errors
- Performance issues
- User-reported bugs
- System stability metrics
```

#### **User Feedback Collection**
```
Firebase Console → Analytics → Custom Events
- Track: user_feedback_submitted
- Track: feature_rating
- Track: support_request
- Track: bug_report
```

### **Key Metrics to Monitor**
- **Daily Active Users (DAU)**
- **Health Data Entry Rate**: % users logging daily
- **Feature Adoption**: Which features are most used
- **Retention Rate**: Users returning after 1 week
- **Error Rate**: < 5% target
- **Load Time**: < 3 seconds target

### **Weekly Admin Checklist**
- [ ] Review user analytics dashboard
- [ ] Check error rates and crashes
- [ ] Monitor data entry patterns
- [ ] Review user feedback submissions
- [ ] Check system performance metrics
- [ ] Respond to support requests
- [ ] Update feature usage reports

### **Monthly Admin Tasks**
- [ ] Generate user growth report
- [ ] Analyze feature usage trends
- [ ] Review and prioritize user feedback
- [ ] Plan feature improvements
- [ ] Security audit and updates
- [ ] Performance optimization review

---

## 📞 **Quick Reference**

### **For Users**
- **App URL**: `http://localhost:4175/`
- **Support Email**: satish@skids.health
- **Daily Usage**: 2-5 minutes for health logging
- **Best Practice**: Log data at same time daily

### **For Admin**
- **Firebase Console**: https://console.firebase.google.com/
- **Project ID**: `vital-b788d`
- **Monitor**: Daily active users, error rates, feedback
- **Response Time**: Support requests within 24 hours

---

**🎯 Ready to start your health journey with Vita? Visit the app and create your account today!**
