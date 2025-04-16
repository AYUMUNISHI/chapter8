
export type CreatePostRequestBody = {
// 記事作成のリクエストボディの型 
  id:string;
  title: string;
  content: string;
  createdAt: string;
  categories: { id: number }[];
  thumbnailUrl: string;
}

export type CreateCategoryRequestBody = {
  id: string;
  name: string;
  createdAt: string;
}

export type Posts = {
  status: string;
  posts: [];
}

export type CategoryType ={
  status: string;
  categories:[];
}


export type FormErrorsPostsType = {
  title?: string;
  content?: string;
  thumbnail?: string;
};

export type FormErrorsCategoryType = {
  name?: string;

};

export type CategoryOption = {
  label: string;
  value: number;
};

