import { supabase } from "../lib/supabaseClient";
import { handleServiceError } from "./utils/handleServiceError";
import { handleServiceSuccess } from "./utils/handleServiceSuccess";

export const submitApplication = async (formData) => {
  try {
    const { data, error } = await supabase
      .from("applications")
      .insert([formData]);

    if (error) throw error;

    return handleServiceSuccess(data);
  } catch (error) {
    return handleServiceError(error);
  }
};

export const getUserApplications = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;

    return handleServiceSuccess(data);
  } catch (error) {
    return handleServiceError(error);
  }
};