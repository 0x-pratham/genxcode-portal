# GenXCode Portal

A modern, full-featured portal for the GenXCode community - a coding club platform with challenges, leaderboards, member management, and more.

## 🚀 Features

- **User Authentication**: Secure signup/login with Supabase Auth
- **Member Dashboard**: Personal dashboard with points, league rankings, and progress tracking
- **Coding Challenges**: Submit solutions and earn points
- **Leaderboard**: Track rankings across different leagues (Bronze → Legend)
- **Announcements**: Community updates and news
- **Admin Panel**: Comprehensive admin interface for managing:
  - Member applications
  - Challenges
  - Submissions review
  - Announcements
  - Attendance sessions
- **Profile Management**: Update your profile information
- **Responsive Design**: Beautiful, modern UI with smooth animations

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Routing**: React Router v7

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Supabase account (free tier works)
- Git

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd genxcode-portal
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project settings → API
3. Copy your project URL and anon key

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Example:**
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Set Up Database Schema

1. Go to your Supabase project → SQL Editor
2. Run the SQL migration files **in order** (001 → 006):
   - `001_initial_schema.sql` - Creates all tables, triggers, and functions
   - `002_rls_policies.sql` - Row Level Security policies
   - `003_fix_leaderboard_trigger_rls.sql` - Fixes leaderboard updates when submissions are approved
   - `004_add_league_recalculation_trigger.sql` - League recalc on points change
   - `005_fix_league_calculation.sql` - League fixes and recalc helpers
   - `006_attendance_points_automation.sql` - **+10 points per attendance** (auto when you mark attendance)

**Important**: Run them in numeric order. New projects: run all six. Existing projects: run only migrations you haven’t applied yet.

**Quick Steps:**
1. Open Supabase Dashboard → SQL Editor
2. For each migration file (001 through 006), click "New query", paste the file contents, then "Run"

### 6. Create Your First Admin User

After running the schema, you can create an admin user in two ways:

**Option A: Via Supabase Dashboard**
1. Go to Authentication → Users
2. Create a new user or use an existing one
3. Go to Table Editor → `profiles`
4. Find your user and update `role` to `'admin'`

**Option B: Via SQL**
```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
```

### 7. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
genxcode-portal/
├── src/
│   ├── components/      # Reusable components (Navbar, AdminRoute, etc.)
│   ├── pages/          # Page components (Home, Dashboard, AdminPanel, etc.)
│   ├── lib/            # Utilities (supabaseClient, dbHelpers)
│   ├── data/           # Static data (league icons, etc.)
│   └── assets/         # Images and static assets
├── supabase/
│   └── migrations/     # Database migrations
│       ├── 001_initial_schema.sql  # Tables, functions, triggers
│       └── 002_rls_policies.sql   # Row Level Security policies
├── public/             # Public assets
└── package.json        # Dependencies
```

## 🗄️ Database Schema

The database includes the following tables:

- **profiles**: User profile information
- **leaderboard**: Points and league rankings
- **applications**: Member applications
- **challenges**: Coding challenges
- **submissions**: User challenge submissions
- **announcements**: Community announcements
- **attendance_sessions**: Event/session information
- **attendance_logs**: User attendance records

See `supabase/migrations/001_initial_schema.sql` for complete schema details.

## 🔐 Security

- Row Level Security (RLS) is enabled on all tables
- Users can only modify their own data
- Admin-only operations are protected by RLS policies
- Environment variables are used for sensitive credentials

## 🎨 Customization

### Changing Admin Email

Edit `src/components/AdminRoute.jsx` and `src/components/Navbar.jsx`:

```javascript
const ADMIN_EMAILS = ["your-admin@email.com"];
```

### Styling

The project uses Tailwind CSS. Customize styles in:
- `src/index.css` - Global styles and utilities
- `tailwind.config.js` - Tailwind configuration

### League Thresholds

Modify league point thresholds in `supabase/migrations/001_initial_schema.sql`:

```sql
-- In the calculate_league() function
WHEN points >= 8000 THEN RETURN 'Legend';
WHEN points >= 7000 THEN RETURN 'Titan';
-- ... etc
```

## 🚀 Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The built files will be in the `dist/` directory.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🐛 Troubleshooting

### "Missing Supabase environment variables"

Make sure you've created a `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

### "Permission denied" errors

Check that you've run `002_rls_policies.sql` and that your user has the correct role set in the `profiles` table.

### Database connection issues

1. Verify your Supabase project is active
2. Check that your API keys are correct
3. Ensure RLS policies are set up correctly

### Admin panel not accessible

1. Make sure your user's `role` in the `profiles` table is set to `'admin'`
2. Or add your email to `ADMIN_EMAILS` in `AdminRoute.jsx` and `Navbar.jsx`

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For contributions, please contact the project maintainers.

## 📧 Support

For issues or questions, please contact: ofc.genxcode@gmail.com

---

Built with ❤️ for the GenXCode community
