export type showPost = {
  id: number;
  title: string;
  content: string;
  thumbnailImageKey: string;
  createdAt: string;
  postCategories: {
    category: {
      id: number;
      name: string;
    }
  }[];
};


export type showPostResponse = {
  status: string;
  post: showPost;
}


export type categoryType ={
  status: string;
  categories:[];
}

export type thumbnail = {
  url: string;
  height: string;
  width: string
}