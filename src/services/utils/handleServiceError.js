// src/services/utils/handleServiceError.js

export const handleServiceError = (error) => {
  console.error("Service Error:", error);

  return {
    success: false,
    data: null,
    error: {
      message: error?.message || "Something went wrong",
      code: error?.code || "UNKNOWN_ERROR",
      details: error || null,
    },
  };
};