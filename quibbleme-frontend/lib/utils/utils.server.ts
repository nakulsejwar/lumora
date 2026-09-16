// mocked server utils
import { cookies } from "next/headers";

export async function getTokenServer() {
  const cookieStore = cookies();
  const token = cookieStore.get("local_auth");
  return token?.value || null;
}

export async function getUserServer() {
  const token = await getTokenServer();
  if (!token) return null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error(e);
  }
  return { username: "mock_user", email: "mock_user@example.com", "custom:ReferralCode": "mock_ref" };
}

export async function getEmailServer() {
  const user = await getUserServer();
  return user?.email || "mock_user@example.com";
}

export async function getReferralCodeSSR() {
  const user = await getUserServer();
  return user?.["custom:ReferralCode"] || "mock_ref";
}

export async function verifyUserSSR() {
  return true;
}
