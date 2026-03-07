import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

const withTimeout = (promise, ms, label = "operation") =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);

  const fetchUserRole = useCallback(async (userId) => {
    if (!userId) {
      setIsAdmin(false);
      return;
    }

    if (!supabase) {
      setIsAdmin(false);
      return;
    }

    setRoleLoading(true);
    try {
      const { data, error } = await withTimeout(
        supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle(),
        8000,
        "role fetch"
      );

      if (error) {
        console.error("Role fetch error:", error);
        setIsAdmin(false);
      } else {
        setIsAdmin(data?.role === "admin");
      }
    } catch (err) {
      console.error("Role fetch exception:", err);
      setIsAdmin(false);
    } finally {
      setRoleLoading(false);
    }
}, []);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      if (!supabase) {
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        return;
      }

      const { data } = await withTimeout(supabase.auth.getSession(), 8000, "getSession");
      const currentSession = data.session;

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user?.id) {
        // Do not block app rendering on role fetch
        fetchUserRole(currentSession.user.id);
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("Auth refresh exception:", err);
      setSession(null);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
}, [fetchUserRole]);

  useEffect(() => {
  let mounted = true;

  const initializeAuth = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        if (!mounted) return;
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        return;
      }

      const { data } = await withTimeout(supabase.auth.getSession(), 8000, "getSession");
      const currentSession = data.session;

      if (!mounted) return;

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user?.id) {
        // Do not block app rendering on role fetch
        fetchUserRole(currentSession.user.id);
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("Auth init exception:", err);
      if (!mounted) return;
      setSession(null);
      setUser(null);
      setIsAdmin(false);
    } finally {
      if (mounted) setLoading(false);
    }
  };

  initializeAuth();

  if (!supabase) {
    return () => {
      mounted = false;
    };
  }

  const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
    if (!mounted) return;
    setLoading(true);
    try {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user?.id) {
        // Do not block app rendering on role fetch
        fetchUserRole(nextSession.user.id);
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("Auth state change exception:", err);
      setSession(null);
      setUser(null);
      setIsAdmin(false);
    } finally {
      if (mounted) setLoading(false);
    }
  });

  return () => {
    mounted = false;
    listener?.subscription?.unsubscribe?.();
  };
}, [fetchUserRole]);

  return (
    <AuthContext.Provider
  value={{
    session,
    user,
    isAdmin,
    loading,
    roleLoading,
    refreshUser,
  }}
>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);