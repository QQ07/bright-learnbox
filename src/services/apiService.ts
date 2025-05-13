// filepath: d:\Coding\learnspace\bright-learnbox\src\services\apiService.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/learnspace";

const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getClassrooms = async (userId: number) => {
    const role = localStorage.getItem("userRole");
    const endpoint = role === "mentor" ? `/mentor/myClassrooms` : `/learner/myClassrooms`;
    const response = await apiService.get(endpoint, {
        params: { userId },
    });
    return response.data;
};

export const joinClassroom = async (userId: number, classroomCode: string) => {
    const role = localStorage.getItem("userRole");
    const endpoint = role === "mentor" ? `/mentor/joinClassroom/{classroomCode}` : `/learner/joinClassroom/{classroomCode}`;
    const response = await apiService.post(endpoint, null, {
        params: { userId, classroomCode },
    });
    return response.data;
};

export const createClassroom = async (classroomName: string) => {
  const response = await apiService.post(`/mentor/createClassroom`, null, {
    params: { classroomName, userId: localStorage.getItem("userId") },
  });
  return response.data;
};

export default apiService;
