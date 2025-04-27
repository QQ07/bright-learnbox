import { getUserRole } from '@/lib/auth';

const API_URL = 'http://localhost:8080/learnspace';

export interface LoginRequest {
  email: string;
  password: string;
  role: string;
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

export interface ClassroomDTO {
  classroomId: number;
  classroomName: string;
  classroomCode: string;
  fileNames: string[];
  learnerEmails: string[];
}

export interface FileDTO {
  fileId: number;
  fileName: string;
  fileType: string;
  fileData?: any[];
  classroomId: number;
  uploadedById: number;
}

export const api = {
  auth: {
    login: async (role: 'mentor' | 'learner', credentials: LoginRequest) => {
      const response = await fetch(`${API_URL}/${role}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...credentials, role: role.toUpperCase() }),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      return response.json();
    },
    signup: async (role: 'mentor' | 'learner', data: SignupData) => {
      const response = await fetch(`${API_URL}/${role}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, role: data.role.toUpperCase() }),
      });
      
      if (!response.ok) {
        throw new Error('Signup failed');
      }
      
      return response.json();
    },
    logout: async () => {
      const role = getUserRole();
      if (!role) throw new Error('No user role found');
      
      const response = await fetch(`${API_URL}/${role}/logout`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      
      return response.json();
    },
  },
  classroom: {
    create: async (classroomName: string) => {
      const response = await fetch(`${API_URL}/mentor/createClassroom?classroomName=${encodeURIComponent(classroomName)}`, {
        method: 'POST',
      });
      return response.json();
    },
    getAll: async (role: 'mentor' | 'learner') => {
      const response = await fetch(`${API_URL}/${role}/myClassrooms`);
      return response.json();
    },
    getById: async (role: 'mentor' | 'learner', classroomId: string) => {
      const response = await fetch(`${API_URL}/${role}/classrooms/${classroomId}`);
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
    update: async (id: string, newName: string) => {
      const response = await fetch(`${API_URL}/mentor/updateClassroom/${id}?newName=${encodeURIComponent(newName)}`, {
        method: 'PUT',
      });
      return response.json();
    },
    leave: async (id: string) => {
      const response = await fetch(`${API_URL}/learner/leaveClassroom/${id}`, {
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
    deleteAll: async (classroomId: string) => {
      const response = await fetch(`${API_URL}/mentor/classroom/files/delete-all/${classroomId}`, {
        method: 'DELETE',
      });
      return response.json();
    },
    getMetadata: async (fileId: string) => {
      const response = await fetch(`${API_URL}/learner/files/metadata/${fileId}`);
      return response.json();
    },
    preview: async (fileId: string) => {
      const response = await fetch(`${API_URL}/learner/files/preview/${fileId}`);
      return response.json();
    },
  },
};

export default api;
