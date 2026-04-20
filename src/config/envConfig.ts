// export const baseURL = "http://72.62.231.103:8080/happy-hospital/api/v1";
export const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8000/api/v1";

export const getBaseUrl = (): string => {
  return baseURL;
};

export const googleClientId =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
