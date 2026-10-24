
export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

const TOKEN_KEY = "linkpulse_jwt_token";
const USER_KEY = "linkpulse_auth_user";
const HAS_ACCOUNT_KEY = "linkpulse_has_account";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    userId: string;
    name: string;
    email: string;
    token: string;
  };
}

function getApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error("Backend API URL is not configured.");
  }

  return API_BASE_URL.replace(/\/+$/, "");
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function hasRegisteredBefore(): boolean {
  if (typeof window === "undefined") return false;

  return localStorage.getItem(HAS_ACCOUNT_KEY) === "true";
}

export function setAuthSession(
  token: string,
  user: AuthUser
): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(HAS_ACCOUNT_KEY, "true");
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function signupUser(
  name: string,
  email: string,
  password: string
): Promise<AuthUser> {
  const res = await fetch(
    `${getApiBaseUrl()}/api/auth/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      }),
    }
  );

  const body: AuthResponse = await res.json().catch(() => ({
    success: false,
    message: "Invalid response from server.",
  }));

  if (!res.ok || !body.success || !body.data) {
    throw new Error(body.message || "Signup failed. Please try again.");
  }

  const data = body.data;

  const user: AuthUser = {
    id: data.userId,
    name: data.name,
    email: data.email,
  };

  setAuthSession(data.token, user);

  return user;
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthUser> {
  const res = await fetch(
    `${getApiBaseUrl()}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
      }),
    }
  );

  const body: AuthResponse = await res.json().catch(() => ({
    success: false,
    message: "Invalid response from server.",
  }));

  if (!res.ok || !body.success || !body.data) {
    throw new Error(body.message || "Invalid email or password.");
  }

  const data = body.data;

  const user: AuthUser = {
    id: data.userId,
    name: data.name,
    email: data.email,
  };

  setAuthSession(data.token, user);

  return user;
}
