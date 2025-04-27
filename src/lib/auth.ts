
export const setUserRole = (role: 'mentor' | 'learner') => {
  localStorage.setItem('userRole', role);
};

export const getUserRole = (): 'mentor' | 'learner' | null => {
  const role = localStorage.getItem('userRole');
  return (role as 'mentor' | 'learner' | null);
};

export const clearUserRole = () => {
  localStorage.removeItem('userRole');
};
