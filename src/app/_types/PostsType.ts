export type Post = {
  id: number;
  title: string;
  thumbnailUrl: string;
  categories: string[];
  content: string;
  createdAt: string;
}

export type Posts = {
  posts: Post[];
};

export type ApiResponse = {
  message: string;
  post: Post;
};