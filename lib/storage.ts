// Simple localStorage-based auth & data for demo

export interface User {
  id: string;
  name: string;
  email: string;
  age: string;
  gender: string;
  location: string;
  createdAt: string;
}

export interface Assessment {
  id: string;
  userId: string;
  symptoms: string[];
  severity: string;
  duration: string;
  riskLevel: "low" | "moderate" | "high";
  score: number;
  date: string;
  recommendations: string[];
}

export const getUsers = (): Record<string, User & { password: string }> => {
  if (typeof window === "undefined") return {};
  return JSON.parse(localStorage.getItem("erinde_users") || "{}");
};

export const saveUser = (user: User & { password: string }) => {
  const users = getUsers();
  users[user.email] = user;
  localStorage.setItem("erinde_users", JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("erinde_current_user");
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) localStorage.setItem("erinde_current_user", JSON.stringify(user));
  else localStorage.removeItem("erinde_current_user");
};

export const getAssessments = (userId: string): Assessment[] => {
  if (typeof window === "undefined") return [];
  const all = JSON.parse(localStorage.getItem("erinde_assessments") || "[]");
  return all.filter((a: Assessment) => a.userId === userId);
};

export const saveAssessment = (assessment: Assessment) => {
  const all = JSON.parse(localStorage.getItem("erinde_assessments") || "[]");
  all.unshift(assessment);
  localStorage.setItem("erinde_assessments", JSON.stringify(all));
};
