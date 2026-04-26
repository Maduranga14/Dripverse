const API_BASE_URL = "http://localhost:8080/api"

export const getAuthToken = () => localStorage.getItem("token");

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = errorText || `Error: ${response.status} ${response.statusText}`;
        try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.message) errorMessage = errorJson.message;
            else if (errorJson.errors && errorJson.errors.length > 0) {
                errorMessage = errorJson.errors.map((e: any) => e.defaultMessage || e.message).join(", ");
            }
        } catch (e) {}
        throw new Error(errorMessage);
    }

    const text = await response.text();
    try {
        return JSON.parse(text);
    } catch (e) {
        return text;
    }
};

export const fetchWithoutAuth = async (endpoint: string, options: RequestInit = {}) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = errorText || `Error: ${response.status} ${response.statusText}`;
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.message) errorMessage = errorJson.message;
      else if (errorJson.errors && errorJson.errors.length > 0) {
        errorMessage = errorJson.errors.map((e: any) => e.defaultMessage || e.message).join(", ");
      }
    } catch (e) {}
    throw new Error(errorMessage);
  }

  const text = await response.text();
  try {
      return JSON.parse(text);
  } catch (e) {
      return text;
  }
};