import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

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

  setRoleLoading(true);

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Role fetch error:", error);
    setIsAdmin(false);
  } else {
    setIsAdmin(data?.role === "admin");
  }

  setRoleLoading(false);
}, []);

  const refreshUser = useCallback(async () => {
  setLoading(true);

  const { data } = await supabase.auth.getSession();
  const currentSession = data.session;

  setSession(currentSession);
  setUser(currentSession?.user ?? null);

  if (currentSession?.user?.id) {
    await fetchUserRole(currentSession.user.id);
  } else {
    setIsAdmin(false);
  }

  setLoading(false);
}, [fetchUserRole]);

  useEffect(() => {
  let mounted = true;

  const initializeAuth = async () => {
    setLoading(true);

    const { data } = await supabase.auth.getSession();
    const currentSession = data.session;

    if (!mounted) return;

    setSession(currentSession);
    setUser(currentSession?.user ?? null);

    if (currentSession?.user?.id) {
      await fetchUserRole(currentSession.user.id);
    } else {
      setIsAdmin(false);
    }

    if (mounted) setLoading(false);
  };

  initializeAuth();

  const { data: listener } = supabase.auth.onAuthStateChange(
    async (_event, session) => {
      if (!mounted) return;

      setLoading(true);

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user?.id) {
        await fetchUserRole(session.user.id);
      } else {
        setIsAdmin(false);
      }

      if (mounted) setLoading(false);
    }
  );

  return () => {
    mounted = false;
    listener.subscription.unsubscribe();
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