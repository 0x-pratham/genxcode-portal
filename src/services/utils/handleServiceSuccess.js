// src/services/utils/handleServiceSuccess.js

export const handleServiceSuccess = (data) => {
  return {
    success: true,
    data,
    error: null,
  };
};