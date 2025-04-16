export type ShowPost = {
  id: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  createdAt: string;
  postCategories: {
    category: {
      id: number;
      name: string;
    }
  }[];
};


export type ShowPostResponse = {
  status: string;
  post: ShowPost;
}


export type CategoryType ={
  status: string;
  categories:[];
}

export type thumbnail = {
  url: string;
  height: string;
  width: string
}