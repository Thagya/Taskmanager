import axiosInstance from './axios';
import { Task, TaskFormData, TaskFilters, TaskStats, ApiResponse } from '../types';

export const taskApi = {
  getAllTasks: async (filters?: TaskFilters): Promise<ApiResponse<Task[]>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const response = await axiosInstance.get<ApiResponse<Task[]>>(`/tasks?${params.toString()}`);
    return response.data;
  },

  getTask: async (id: string): Promise<ApiResponse<Task>> => {
    const response = await axiosInstance.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (data: TaskFormData): Promise<ApiResponse<Task>> => {
    const response = await axiosInstance.post<ApiResponse<Task>>('/tasks', data);
    return response.data;
  },

  updateTask: async (id: string, data: Partial<TaskFormData>): Promise<ApiResponse<Task>> => {
    const response = await axiosInstance.put<ApiResponse<Task>>(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/tasks/${id}`);
    return response.data;
  },

  toggleTaskCompletion: async (id: string): Promise<ApiResponse<Task>> => {
    const response = await axiosInstance.patch<ApiResponse<Task>>(`/tasks/${id}/toggle-complete`);
    return response.data;
  },

  getTaskStats: async (): Promise<ApiResponse<TaskStats>> => {
    const response = await axiosInstance.get<ApiResponse<TaskStats>>('/tasks/stats');
    return response.data;
  },
};