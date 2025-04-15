
const API_URL = 'http://localhost:8080/learnspace';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  dob: string;
  gender: string;
  phone: string;
  role: 'MENTOR' | 'LEARNER';
}

export const api = {
  auth: {
    login: async (role: 'mentor' | 'learner', credentials: LoginCredentials) => {
      const response = await fetch(`${API_URL}/${role}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      return response.json();
    },
    signup: async (role: 'mentor' | 'learner', data: SignupData) => {
      const response = await fetch(`${API_URL}/${role}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
  },
  classroom: {
    create: async (classroomName: string) => {
      const response = await fetch(`${API_URL}/mentor/createClassroom?classroomName=${classroomName}`, {
        method: 'POST',
      });
      return response.json();
    },
    getAll: async (role: 'mentor' | 'learner') => {
      const response = await fetch(`${API_URL}/${role}/myClassrooms`);
      return response.json();
    },
    join: async (code: string) => {
      const response = await fetch(`${API_URL}/learner/joinClassroom/${code}`, {
        method: 'POST',
      });
      return response.json();
    },
    delete: async (id: string) => {
      const response = await fetch(`${API_URL}/mentor/deleteClassroom/${id}`, {
        method: 'DELETE',
      });
      return response.json();
    },
  },
  files: {
    upload: async (classroomId: string, file: File) => {
      const formData = new FormData();
      formData.append('classroomId', classroomId);
      formData.append('file', file);
      
      const response = await fetch(`${API_URL}/mentor/classroom/files/upload`, {
        method: 'POST',
        body: formData,
      });
      return response.json();
    },
    getAll: async (role: 'mentor' | 'learner', classroomId: string) => {
      const response = await fetch(`${API_URL}/${role}/classroom/files/all/${classroomId}`);
      return response.json();
    },
    download: async (role: 'mentor' | 'learner', fileId: string) => {
      const response = await fetch(`${API_URL}/${role}/classroom/files/download/${fileId}`);
      return response.blob();
    },
    delete: async (fileId: string) => {
      const response = await fetch(`${API_URL}/mentor/classroom/files/delete/${fileId}`, {
        method: 'DELETE',
      });
      return response.json();
    },
  },
};

export default api;
