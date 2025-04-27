export const setUserRole = (role: "mentor" | "learner") => {
  localStorage.setItem("userRole", role);
};

export const getUserRole = (): "mentor" | "learner" | null => {
  const role = localStorage.getItem("userRole");
  return role as "mentor" | "learner" | null;
};

export const clearUserRole = () => {
  localStorage.removeItem("userRole");
};

export const setUserName = (name: string) => {
  localStorage.setItem("userName", name);
};

export const getUserName = (): string | null => {
  return localStorage.getItem("userName");
};

export const setUserId = (userId: string) => {
  localStorage.setItem("userId", userId);
};

export const getUserId = () => {
  return localStorage.getItem("userId");
};

export const clearUserData = () => {
  localStorage.removeItem("userRole");
  localStorage.removeItem("userName");
};

export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem("userName");
};
