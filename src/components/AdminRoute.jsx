// src/components/AdminRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { ADMIN_EMAILS } from "../lib/adminEmails";

// AdminRoute: allow access when profiles.role === 'admin' OR email is in ADMIN_EMAILS
export default function AdminRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [adminEmail, setAdminEmail] = useState(null);
  const [profileError, setProfileError] = useState(null);

  const check = async () => {
    if (!isSupabaseConfigured()) {
      setAllowed(false);
      setChecking(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setAllowed(false);
        setChecking(false);
        setAdminEmail(null);
        return;
      }

      const email = data.user.email || "";
      setAdminEmail(email);

      // Check profiles table for admin role
      const { data: profile, error: pErr } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();

      if (pErr) {
        console.error('Profile fetch error:', pErr);
        setProfileError(pErr);
      } else {
        setProfileError(null);
      }

      const hasAdminRole = !pErr && profile?.role === 'admin';
      const isEmailAdmin = ADMIN_EMAILS.includes(email);

      setAllowed(hasAdminRole || isEmailAdmin);
    } catch (err) {
      console.error('AdminRoute check error:', err);
      setAllowed(false);
      setAdminEmail(null);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    check();
  }, []);

  if (checking) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-400">Checking admin access…</p>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-2xl bg-slate-900/70 border border-white/5 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Admin access required</h2>
          <p className="text-sm text-slate-400">Your account <span className="font-mono">{adminEmail || '—'}</span> does not have admin privileges.</p>
          <p className="text-sm text-slate-400">If you should have access, add a profile with <code>role='admin'</code> in the Supabase SQL editor or ask an existing admin to promote you.</p>

          {profileError && (
            <div className="rounded p-3 bg-amber-900/10 border border-amber-700/20 text-amber-200 text-sm">
              <p className="font-semibold">Profile fetch error</p>
              <p className="text-xs mt-1">{profileError.code || ''} {profileError.message || String(profileError)}</p>
              <pre className="mt-2 p-2 bg-slate-900/60 rounded text-xs font-mono">{JSON.stringify(profileError, null, 2)}</pre>
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={() => { navigator.clipboard?.writeText(JSON.stringify({ email: adminEmail, profileError })); alert('Diagnostics copied to clipboard'); }} className="px-3 py-1 rounded bg-slate-800 text-slate-200 text-sm">Copy diagnostics</button>
            <button onClick={() => { setChecking(true); check(); }} className="px-3 py-1 rounded bg-cyan-500/20 text-cyan-300 text-sm">Re-check</button>
            <a href="/" className="px-3 py-1 rounded bg-slate-800 text-slate-200 text-sm">Go home</a>
          </div>
        </div>
      </main>
    );
  }

  return children;
}
