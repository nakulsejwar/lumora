import { fetchUserAttributes } from "./auth-service";

function getCookie(name: string) {
  if (typeof window !== "undefined") {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  }
  return null;
}

export async function getToken() {
  return getCookie("local_auth");
}

export async function getUsername() {
  try {
    const user = await fetchUserAttributes();
    return user.username;
  } catch (e) {
    return "mock_user";
  }
}

export async function getEmail() {
  try {
    const user = await fetchUserAttributes();
    return user.email;
  } catch (e) {
    return "mock_user@example.com";
  }
}

export async function referralCode() {
  try {
    const user = await fetchUserAttributes();
    return user["custom:ReferralCode"];
  } catch (e) {
    return "mock_ref";
  }
}

export async function verifyUser() {
  return true;
}
