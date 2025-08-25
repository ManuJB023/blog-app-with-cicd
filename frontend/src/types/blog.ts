export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface CreatePostRequest {
  title: string;
  content: string;
  author: string;
  tags: string[];
}
