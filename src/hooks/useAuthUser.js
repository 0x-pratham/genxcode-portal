// src/hooks/useAuthUser.js
import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { ADMIN_EMAILS } from "../lib/adminEmails";

export const useAuthUser = () => {
  const [user, setUser] = useState(null);
  const [profileRole, setProfileRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load authenticated user
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Fetch role from profiles table
  useEffect(() => {
    if (!isSupabaseConfigured() || !user?.id) {
      setProfileRole(null);
      return;
    }

    let cancelled = false;

    supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        setProfileRole(error ? null : data?.role ?? null);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const email = user?.email || "";
  const userMeta = user?.user_metadata || {};
  const appMeta = user?.app_metadata || {};

  const isAdmin =
    profileRole === "admin" ||
    (!!user && (
      userMeta.role === "admin" ||
      userMeta.is_admin === true ||
      userMeta.is_admin === "true" ||
      appMeta.role === "admin" ||
      (Array.isArray(appMeta.roles) && appMeta.roles.includes("admin")) ||
      ADMIN_EMAILS.includes(email)
    ));

  return {
    user,
    profileRole,
    isAdmin,
    loading,
  };
};