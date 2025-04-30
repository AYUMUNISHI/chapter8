'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { usePostForm } from '@/app/_hooks/usePostForm';
import makeAnimated from 'react-select/animated';
import { categoryOption} from '@/app/_types/AdminType';
import { convertToOptions } from '../../_components/ConvertToOptions';
import PostForm from '../../_components/PostForm';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';







const PostEdit: React.FC = () => {
  const { id: rawId } = useParams();
  const id = Array.isArray(rawId) ? rawId[0] : rawId; // ← ここで型解決
  const initialFormState = { id: "", title: "", content: "", thumbnailImageKey: "http://placehold.jp/800×400.png", createdAt: "", categories: [], };
  const { formValues, setFormValues, formErrors, setFormErrors, handleChange } = usePostForm(initialFormState);
  const [categoryList, setCategoryList] = useState<{ id: number; name: string }[]>([]);
  const [selectOptions, setSelectOptions] = useState<categoryOption[]>([]);
  const [isSubmit, setIsSubmit] = useState<boolean>(true);
  const animatedComponents = makeAnimated();
  const { token } = useSupabaseSession();




  useEffect(() => {
    if(!token) return;
    const fetcherData = async () => {
      try {
        const response = await fetch(`/api/admin/posts/${id}`,{
          headers:{
            Authorization:`Bearer ${token}`,
          }
        },

        );
        const data = await response.json();
        console.log("📦 APIからの実データ:", data); // ←これで確認！
        //投稿データ
        const selectedCategories = data.post.postCategories.map((pc: any) => pc.category);
        const selectedCategoryIds = selectedCategories.map((cat: any) => cat.id);

        //全カテゴリー
        const catRes = await fetch(`/api/admin/categories`,{
          headers:{
            Authorization:`Bearer ${token}`,
          }
        });
        const catData = await catRes.json();


        setFormValues({
          id: data.post.id,
          title: data.post.title,
          content: data.post.content,
          thumbnailImageKey: data.post.thumbnailImageKey,
          categories: selectedCategoryIds.map((id: number) => ({ id })),
          createdAt: data.post.createdAt,
        });


        setCategoryList(catData.categories);
      } catch (error) {
        console.error("データ取得エラー：", error);
      } finally {
        setIsSubmit(false)
      }
    };
    fetcherData()
  }, [id,token])





  const handleDelete = async () => {
    if(!token) return;
    const confirmDelete = confirm("本当に削除してよろしいですか？");
    if (!confirmDelete) return;
    setIsSubmit(true);

    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
        headers:{
          Authorization:`Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("削除エラー：", errorText);
        throw new Error("削除に失敗しました。");
      }

      alert("記事を削除しました！");
      //一覧ページにリダイレクトする
      window.location.href = "/admin/posts";
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message || "エラーが発生しました。");
      } else {
        alert("エラーが発生しました。");
      }
    } finally {
      setIsSubmit(false);
    }
  }

  useEffect(() => {
    if(!token)return;
    const fetchCategories = async () => {
      try {
        const catRes = await fetch(`/api/admin/categories`,{
          headers:{
            Authorization:`Bearer ${token}`,
          }
        });
        const catData = await catRes.json();
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
        onDelete={handleDelete}
        setFormValues={setFormValues}
        setFormErrors={setFormErrors}
        setIsSubmit={setIsSubmit}
        mode="edit"
        id={id}
      />
    </>
  )
}





export default PostEdit;