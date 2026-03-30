import type { User, Assessment } from "./storage";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

/** Returns true when the backend URL is configured */
export const hasBackend = (): boolean => !!API_URL;

// ─── Helpers ────────────────────────────────────────────────────────────────

const json = (token?: string | null) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const handle = async <T>(promise: Promise<Response>): Promise<T> => {
  const res = await promise;
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
};

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface RegisterInput {
  name: string; email: string; password: string;
  age?: string; gender?: string; location?: string;
}

export interface AuthResponse { user: User; token: string; }

export const apiRegister = (data: RegisterInput): Promise<AuthResponse> =>
  handle(fetch(`${API_URL}/api/auth/register`, {
    method: "POST", headers: json(), body: JSON.stringify(data),
  }));

export const apiLogin = (email: string, password: string): Promise<AuthResponse> =>
  handle(fetch(`${API_URL}/api/auth/login`, {
    method: "POST", headers: json(), body: JSON.stringify({ email, password }),
  }));

export const apiGetMe = (token: string): Promise<{ user: User }> =>
  handle(fetch(`${API_URL}/api/auth/me`, { headers: json(token) }));

export const apiUpdateMe = (token: string, data: Partial<Pick<User, "name" | "age" | "gender" | "location">>): Promise<{ user: User }> =>
  handle(fetch(`${API_URL}/api/auth/me`, {
    method: "PATCH", headers: json(token), body: JSON.stringify(data),
  }));

export const apiDeleteMe = (token: string): Promise<void> =>
  handle(fetch(`${API_URL}/api/auth/me`, { method: "DELETE", headers: json(token) }));

// ─── Assessments ─────────────────────────────────────────────────────────────

export interface AssessmentInput {
  symptoms: string[]; severity: string; duration: string;
  riskLevel: string; score: number; recommendations: string[];
}

export const apiCreateAssessment = (token: string, data: AssessmentInput): Promise<{ assessment: Assessment }> =>
  handle(fetch(`${API_URL}/api/assessments`, {
    method: "POST", headers: json(token), body: JSON.stringify(data),
  }));

export const apiGetAssessments = (token: string): Promise<{ assessments: Assessment[] }> =>
  handle(fetch(`${API_URL}/api/assessments`, { headers: json(token) }));

export const apiGetAssessment = (token: string, id: string): Promise<{ assessment: Assessment }> =>
  handle(fetch(`${API_URL}/api/assessments/${id}`, { headers: json(token) }));
