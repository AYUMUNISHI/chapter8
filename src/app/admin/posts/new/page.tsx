'use client';

import { useEffect, useState } from 'react';
import { categoryOption,} from '@/app/_types/AdminType';
import { usePostForm } from '@/app/_hooks/usePostForm';
import { convertToOptions } from '../../_components/ConvertToOptions';
import PostForm from '../../_components/PostForm';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';



const PostNew: React.FC = () => {

  const initialFormState = { id: "", title: "", content: "", thumbnailImageKey: "http://placehold.jp/800×400.png", createdAt: "", categories: [], };
  const { formValues, setFormValues, formErrors, setFormErrors, handleChange } = usePostForm(initialFormState);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [categoryList, setCategoryList] = useState<{ id: number; name: string }[]>([]);
  const [selectOptions, setSelectOptions] = useState<categoryOption[]>([]);
  const { token } = useSupabaseSession();




  const resetForm = () => {
    setFormValues(initialFormState);
    setFormErrors({});
  }


  useEffect(() => {
    if(!token) return;
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories",{
          headers:{
            Authorization:`Bearer ${token}`,
          }
        });
        const catData = await response.json();
        setCategoryList(catData.categories);
        setSelectOptions(convertToOptions(catData.categories));
      } catch (error) {
        console.error("カテゴリー取得失敗：", error);
      }
    };
    fetchCategories();
  }, [token]);



  return (
    <>
      <PostForm
        
        formValues={formValues}
        formErrors={formErrors}
        selectOptions={selectOptions}
        isSubmit={isSubmit}
        handleChange={handleChange}
        setIsSubmit={setIsSubmit}
        setFormErrors={setFormErrors}
        onReset={resetForm}
        setFormValues={setFormValues}
        mode="new"
      />
      </>
  )
}





export default PostNew;