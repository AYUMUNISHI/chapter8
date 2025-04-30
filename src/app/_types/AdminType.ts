
export type createPostRequestBody = {
// 記事作成のリクエストボディの型 
  id:string;
  title: string;
  content: string;
  createdAt: string;
  categories: { id: number }[];
  thumbnailImageKey: string;
}

export type createCategoryRequestBody = {
  id: string;
  name: string;
  createdAt: string;
}

export type Posts = {
  status: string;
  posts: [];
}

export type categoryType ={
  status: string;
  categories:[];
}


export type FormErrorsPostsType = {
  title?: string;
  content?: string;
  thumbnailImageKey?: string;
};

export type FormErrorsCategoryType = {
  name?: string;

};

export type categoryOption = {
  label: string;
  value: number;
};

export type categoryFormProps ={
  formValues:createCategoryRequestBody;
  formErrors:FormErrorsCategoryType;
  isSubmit:boolean;
  handleChange:(e: React.ChangeEvent<HTMLInputElement>)=> void;
  handleSubmit:(e: React.FormEvent<HTMLFormElement>)=> void;
  onReset?:() => void;
  onDelete?:() => void;
  mode: "new"|"edit";
}

export type postFormProps ={
  formValues:createPostRequestBody;
  formErrors:FormErrorsPostsType  ;
  selectOptions:categoryOption[];
  isSubmit:boolean;
  handleChange:(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>)=> void;
  onReset?:() => void;
  onDelete?:() => void;
  setFormValues: (v: any) => void;
  setIsSubmit: (isSubmit: boolean) => void;
  setFormErrors: (errors: FormErrorsPostsType) => void;
  mode: "new"|"edit";
  id?: string | number; // オプションでOK
}

export type categoriesType = { id: number; name: string };