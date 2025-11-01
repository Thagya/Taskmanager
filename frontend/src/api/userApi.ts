import axiosInstance from './axios';
import { User, ApiResponse } from '../types';

export const userApi = {
  getAllUsers: async (search?: string): Promise<ApiResponse<User[]>> => {
    const params = search ? `?search=${search}` : '';
    const response = await axiosInstance.get<ApiResponse<User[]>>(`/users${params}`);
    return response.data;
  },

  getUser: async (id: string): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: { name: string; email: string; password: string; role?: string }): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.post<ApiResponse<User>>('/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/users/${id}`);
    return response.data;
  },
};