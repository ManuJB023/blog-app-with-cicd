import axios from 'axios';
import { BlogPost, CreatePostRequest } from '../types/blog';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const blogApi = {
  getAllPosts: (): Promise<BlogPost[]> => 
    api.get('/posts').then(res => res.data),
  
  getPost: (id: string): Promise<BlogPost> => 
    api.get(`/posts/${id}`).then(res => res.data),
  
  createPost: (post: CreatePostRequest): Promise<BlogPost> => 
    api.post('/posts', post).then(res => res.data),
  
  deletePost: (id: string): Promise<void> => 
    api.delete(`/posts/${id}`).then(() => undefined),
};
