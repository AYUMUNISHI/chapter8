export type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  thumbnail: {url: string; height: string; width: string};
  categories: {id: string; name: string}[];
}


export type Posts = {
  contents: Post[];
  totalCount: number;
  offset: number;
  limit: number;
};


export type Categories ={
  id: string
  name: string
}