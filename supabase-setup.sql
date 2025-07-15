-- Vita Health App Database Setup
-- Run this SQL in your Supabase SQL editor to set up the database

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  age INTEGER,
  goals TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health_entries table for manual data entry
CREATE TABLE IF NOT EXISTS health_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  entry_date DATE NOT NULL,
  entry_time TIME WITH TIME ZONE DEFAULT NOW(),
  entry_type TEXT NOT NULL DEFAULT 'manual', -- 'morning', 'evening', 'manual'
  source TEXT NOT NULL DEFAULT 'manual_entry',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Heart metrics
  heart_rate INTEGER,
  hrv NUMERIC,
  
  -- Activity metrics
  steps INTEGER,
  activity_level TEXT, -- 'sedentary', 'light', 'moderate', 'vigorous'
  
  -- Sleep metrics
  sleep_duration NUMERIC, -- in hours
  sleep_quality INTEGER, -- 1-10 scale
  
  -- Additional fields
  notes TEXT,
  
  -- Unique constraint to prevent duplicate entries for same day/type
  UNIQUE(user_id, entry_date, entry_type)
);

-- Create reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  time TIME NOT NULL,
  days TEXT[] NOT NULL, -- ['monday', 'tuesday', etc.]
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  achievement_type TEXT NOT NULL, -- 'streak', 'milestone', etc.
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create streaks table
CREATE TABLE IF NOT EXISTS streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_entry_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create education_progress table
CREATE TABLE IF NOT EXISTS education_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  content_id TEXT NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, content_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create RLS policies for health_entries
CREATE POLICY "Users can view own health entries" 
  ON health_entries FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health entries" 
  ON health_entries FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health entries" 
  ON health_entries FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own health entries" 
  ON health_entries FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for reminders
CREATE POLICY "Users can view own reminders" 
  ON reminders FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reminders" 
  ON reminders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders" 
  ON reminders FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders" 
  ON reminders FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for achievements
CREATE POLICY "Users can view own achievements" 
  ON achievements FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" 
  ON achievements FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for streaks
CREATE POLICY "Users can view own streaks" 
  ON streaks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streaks" 
  ON streaks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks" 
  ON streaks FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for education_progress
CREATE POLICY "Users can view own education progress" 
  ON education_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own education progress" 
  ON education_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own education progress" 
  ON education_progress FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (NEW.id, '', '');
  
  INSERT INTO public.streaks (user_id, current_streak, longest_streak)
  VALUES (NEW.id, 0, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_entries_user_date ON health_entries(user_id, entry_date);
CREATE INDEX IF NOT EXISTS idx_health_entries_date ON health_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_reminders_user_active ON reminders(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_streaks_user ON streaks(user_id);

-- Insert some sample educational content IDs
INSERT INTO education_progress (user_id, content_id, completed) 
SELECT 
  auth.uid(),
  unnest(ARRAY['heart_rate', 'hrv', 'steps', 'sleep']),
  false
WHERE auth.uid() IS NOT NULL
ON CONFLICT (user_id, content_id) DO NOTHING;

-- Create a view for user dashboard data
CREATE OR REPLACE VIEW user_dashboard_data AS
SELECT 
  p.id as user_id,
  p.first_name,
  p.last_name,
  s.current_streak,
  s.longest_streak,
  (SELECT COUNT(*) FROM health_entries he WHERE he.user_id = p.id) as total_entries,
  (SELECT entry_date FROM health_entries he WHERE he.user_id = p.id ORDER BY entry_date DESC LIMIT 1) as last_entry_date
FROM profiles p
LEFT JOIN streaks s ON p.id = s.user_id;

-- Grant access to the view
GRANT SELECT ON user_dashboard_data TO authenticated;

-- Create RLS policy for the view
CREATE POLICY "Users can view own dashboard data" 
  ON user_dashboard_data FOR SELECT 
  USING (auth.uid() = user_id);

COMMENT ON TABLE profiles IS 'User profile information extending Supabase auth.users';
COMMENT ON TABLE health_entries IS 'Manual health data entries from users';
COMMENT ON TABLE reminders IS 'User-configured health tracking reminders';
COMMENT ON TABLE achievements IS 'User achievements and milestones';
COMMENT ON TABLE streaks IS 'User streak tracking for consistent health logging';
COMMENT ON TABLE education_progress IS 'Track which educational content users have viewed';

-- Success message
SELECT 'Vita Health App database setup completed successfully!' as message;
