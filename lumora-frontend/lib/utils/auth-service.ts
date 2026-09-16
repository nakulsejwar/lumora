const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : "http://127.0.0.1:8000/api";

function setCookie(name: string, value: string, days = 7) {
  if (typeof window !== "undefined") {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
  }
}

function getCookie(name: string) {
  if (typeof window !== "undefined") {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  }
  return null;
}

function deleteCookie(name: string) {
  if (typeof window !== "undefined") {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
  }
}

export class AuthError extends Error {}

export const signIn = async ({ username, password }: any) => {
  const res = await fetch(`${API_BASE_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new AuthError(data.detail || data.non_field_errors?.[0] || "Failed to sign in");
  }
  setCookie("local_auth", data.access);
  return data;
};

export const signOut = async () => {
  deleteCookie("local_auth");
};

export const signUp = async ({ username, password }: any) => {
  const res = await fetch(`${API_BASE_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new AuthError(data.detail || data.username?.[0] || "Failed to sign up");
  }
  return data;
};

export const fetchUserAttributes = async () => {
  const token = getCookie("local_auth");
  if (!token) throw new AuthError("Not authenticated");
  
  const res = await fetch(`${API_BASE_URL}/me/`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new AuthError("Failed to fetch user info");
  
  return await res.json();
};

export const fetchAuthSession = async () => {
  const token = getCookie("local_auth");
  if (!token) throw new AuthError("No session");
  return { tokens: { accessToken: token } };
};

export const getCurrentUser = async () => {
  const data = await fetchUserAttributes();
  return { username: data.username || data.email };
};

// Mocks for unused auth flows
export const confirmSignUp = async (...args: any[]) => ({});
export const resendSignUpCode = async (...args: any[]) => ({});
export const resetPassword = async ({ username }: { username: string }) => {
  const res = await fetch(`${API_BASE_URL}/request-password-reset-otp/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: username }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new AuthError(data.error || data.detail || "Failed to send reset OTP code");
  }
  return data;
};

export const confirmResetPassword = async ({
  username,
  confirmationCode,
  newPassword,
}: {
  username: string;
  confirmationCode: string;
  newPassword: string;
}) => {
  const res = await fetch(`${API_BASE_URL}/verify-password-reset-otp/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: username,
      otp: confirmationCode,
      password: newPassword,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new AuthError(data.error || data.detail || "Failed to reset password");
  }
  return data;
};
export const signInWithRedirect = async (...args: any[]) => ({});
export type FetchUserAttributesOutput = any;
