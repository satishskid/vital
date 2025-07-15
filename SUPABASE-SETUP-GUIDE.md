# 🔧 Supabase Setup Guide for Vita Health App

## Step 1: Create Supabase Project

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com
   - Sign in with GitHub (recommended for easy integration)

2. **Create New Project**
   - Click "New Project"
   - Project Name: `vita-health-app`
   - Database Password: Generate and save a strong password
   - Region: Choose closest to your location
   - Plan: Free (sufficient for development and testing)

3. **Wait for Setup**
   - Project creation takes 2-3 minutes
   - Don't close the browser tab

## Step 2: Get Project Credentials

1. **Navigate to Project Settings**
   - Go to Settings → API
   - Copy the following values:

2. **Required Credentials**
   ```
   Project URL: https://[your-project-id].supabase.co
   Anon Key: eyJ... (long string starting with eyJ)
   Service Role Key: eyJ... (keep this secret!)
   ```

## Step 3: Configure Environment Variables

1. **Create .env file in your project root**
   ```bash
   cd "/Users/spr/Downloads/project-files (4)"
   cp .env.example .env
   ```

2. **Edit .env file with your credentials**
   ```env
   REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Set Up Database Schema

1. **Open SQL Editor in Supabase**
   - Go to SQL Editor in your Supabase dashboard
   - Click "New Query"

2. **Run Database Setup Script**
   - Copy the entire contents of `supabase-setup.sql`
   - Paste into the SQL editor
   - Click "Run" to execute

3. **Verify Tables Created**
   - Go to Table Editor
   - You should see: profiles, health_entries, reminders, achievements, streaks, education_progress

## Step 5: Test the Connection

1. **Start Development Server**
   ```bash
   cd "/Users/spr/Downloads/project-files (4)"
   npm install
   npm run dev
   ```

2. **Test Authentication**
   - Open http://localhost:5173
   - Try signing up with a test email
   - Check if user appears in Supabase Auth → Users

3. **Test Data Entry**
   - Log some health data
   - Check if data appears in Table Editor → health_entries

## Step 6: Enable Row Level Security (RLS)

The setup script automatically enables RLS, but verify:

1. **Check RLS Status**
   - Go to Authentication → Policies
   - Verify policies exist for all tables

2. **Test Data Isolation**
   - Create two test users
   - Verify each user only sees their own data

## Step 7: Configure GitHub Integration (Optional)

1. **Connect Repository**
   - Go to Settings → Integrations
   - Connect your GitHub repository: https://github.com/satishskid/vital

2. **Set up Database Migrations**
   - This allows version control of database changes
   - Useful for team development

## Troubleshooting

### Common Issues

**Connection Error**
- Verify URL and anon key are correct
- Check for typos in .env file
- Ensure no extra spaces or quotes

**RLS Blocking Queries**
- Check if user is authenticated
- Verify RLS policies are correctly set
- Test with service role key (temporarily)

**Tables Not Created**
- Check SQL editor for error messages
- Run setup script in smaller chunks if needed
- Verify database permissions

### Testing Commands

```bash
# Test environment variables
echo $REACT_APP_SUPABASE_URL

# Check if .env is loaded
npm run dev
# Look for Supabase connection logs in console
```

## Security Checklist

- [ ] .env file is in .gitignore (already included)
- [ ] Never commit service role key to Git
- [ ] RLS policies are enabled on all tables
- [ ] Test data isolation between users
- [ ] Use anon key for client-side code only

## Next Steps

Once Supabase is connected:

1. **Test all features**
   - User registration/login
   - Manual data entry
   - Reminder system
   - Achievement tracking

2. **Deploy to production**
   - Set environment variables in hosting platform
   - Test with production Supabase instance

3. **Monitor usage**
   - Check Supabase dashboard for usage stats
   - Monitor for any errors or performance issues

## Support

If you encounter issues:
1. Check Supabase logs in dashboard
2. Review browser console for errors
3. Test connection with simple queries
4. Verify all environment variables are set correctly
