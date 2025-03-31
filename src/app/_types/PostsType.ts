export type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  thumbnail: thumbnail[];
  categories: Category[];
}


export type Posts = {
  contents: Post[];
  totalCount: number;
  offset: number;
  limit: number;
};


export type Category = {
  id: string
  name: string
}

export type thumbnail = {
  url: string;
  height: string;
  width: string
}