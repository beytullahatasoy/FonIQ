export const Config = {
  TEFAS_BASE_URL: "https://www.tefas.gov.tr/api/DB",
  GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY || "",
  GEMINI_API_URL:
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
};
