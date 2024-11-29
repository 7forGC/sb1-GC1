import axiosInstance from './axiosConfig';
import { Post, Story } from '../../types';

export class ApiService {
  // Posts
  static async getPosts(page = 1, limit = 10) {
    const { data } = await axiosInstance.get(`/posts?page=${page}&limit=${limit}`);
    return data;
  }

  static async createPost(formData: FormData) {
    const { data } = await axiosInstance.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }

  static async likePost(postId: string) {
    const { data } = await axiosInstance.post(`/posts/${postId}/likes`);
    return data;
  }

  static async unlikePost(postId: string) {
    const { data } = await axiosInstance.delete(`/posts/${postId}/likes`);
    return data;
  }

  // Stories
  static async getStories() {
    const { data } = await axiosInstance.get('/stories');
    return data;
  }

  static async createStory(formData: FormData) {
    const { data } = await axiosInstance.post('/stories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }

  // Comments
  static async getComments(postId: string, page = 1, limit = 10) {
    const { data } = await axiosInstance.get(
      `/posts/${postId}/comments?page=${page}&limit=${limit}`
    );
    return data;
  }

  static async createComment(postId: string, content: string) {
    const { data } = await axiosInstance.post(`/posts/${postId}/comments`, {
      content,
    });
    return data;
  }

  // User
  static async updateProfile(userData: FormData) {
    const { data } = await axiosInstance.put('/users/profile', userData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }

  static async searchUsers(query: string) {
    const { data } = await axiosInstance.get(`/search/users?q=${query}`);
    return data;
  }
}