# Environment Variables Setup Guide

## Required Environment Variables

Create a `.env` file in the root directory of the project with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

For **production** (e.g. Vercel) if you use the Recruitment form: add `FORMSPARK_KEY` in your host’s environment (the `/api/submit` serverless function uses it to forward submissions).

## How to Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project or select an existing one
3. Navigate to **Settings** → **API**
4. Copy the following:
   - **Project URL** → Use as `VITE_SUPABASE_URL`
   - **anon/public key** → Use as `VITE_SUPABASE_ANON_KEY`

## Example `.env` File

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQxMjM0NTY3LCJleHAiOjE5NTY4MTA1Njd9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Important Notes

- **Never commit your `.env` file to version control**
- The `.env` file is already in `.gitignore`
- Restart your development server after creating/updating `.env`
- Environment variables must start with `VITE_` to be accessible in Vite
- `FORMSPARK_KEY` is only used server-side (Vercel/host env) for the Recruitment form API

## Troubleshooting

### "Missing Supabase environment variables" Error

If you see this error in the console:
1. Make sure you've created a `.env` file in the root directory
2. Check that variable names are exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Restart your development server (`npm run dev`)
4. Verify your `.env` file doesn't have any syntax errors

### Variables Not Loading

- Make sure there are no spaces around the `=` sign
- Don't wrap values in quotes unless necessary
- Restart the dev server after changes

