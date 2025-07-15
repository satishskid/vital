#!/bin/bash

# Vita Health App - Supabase Setup Script
# This script helps you set up Supabase for the Vita Health App

echo "🚀 Vita Health App - Supabase Setup"
echo "=================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "📝 .env file already exists"
fi

echo ""
echo "🔧 Next Steps:"
echo ""
echo "1. Create Supabase Project:"
echo "   - Go to https://supabase.com"
echo "   - Sign in with GitHub"
echo "   - Create new project: 'vita-health-app'"
echo ""
echo "2. Get Your Credentials:"
echo "   - Go to Settings → API in your Supabase dashboard"
echo "   - Copy Project URL and Anon Key"
echo ""
echo "3. Update .env file:"
echo "   - Edit .env file with your actual Supabase credentials"
echo "   - Replace 'your-project-id' and 'your-supabase-anon-key'"
echo ""
echo "4. Set Up Database:"
echo "   - Open SQL Editor in Supabase"
echo "   - Copy and run the contents of 'supabase-setup.sql'"
echo ""
echo "5. Test the Setup:"
echo "   - Run: npm install"
echo "   - Run: npm run dev"
echo "   - Open: http://localhost:5173"
echo "   - Try signing up and logging health data"
echo ""
echo "📚 For detailed instructions, see: SUPABASE-SETUP-GUIDE.md"
echo ""

# Check if npm is installed
if command -v npm &> /dev/null; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
    echo "🎯 Ready to start development!"
    echo "   Run: npm run dev"
else
    echo "⚠️  npm not found. Please install Node.js first."
fi

echo ""
echo "🔗 Useful Links:"
echo "   Supabase Dashboard: https://supabase.com/dashboard"
echo "   GitHub Repository: https://github.com/satishskid/vital"
echo "   Setup Guide: ./SUPABASE-SETUP-GUIDE.md"
