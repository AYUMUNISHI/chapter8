'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { postsValidate } from '@/app/admin/_components/Validate';
import { usePostForm } from '@/app/_hooks/usePostForm';
import { postsCategory } from '@/app/admin/_components/PostsCategory';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { categoryOption, createPostRequestBody } from '@/app/_types/AdminType';
import { convertToOptions } from '../../_components/ConvertToOptions';
import PostForm from '../../_components/PostForm';







const PostEdit: React.FC = () => {
  const { id } = useParams();
  const initialFormState = { id: "", title: "", content: "", thumbnailUrl: "http://placehold.jp/800×400.png", createdAt: "", categories: [], };
  const { formValues, setFormValues, formErrors, setFormErrors, handleChange } = usePostForm(initialFormState);
  const [categoryList, setCategoryList] = useState<{ id: number; name: string }[]>([]);
  const [selectOptions, setSelectOptions] = useState<categoryOption[]>([]);
  const [isSubmit, setIsSubmit] = useState<boolean>(true);
  const animatedComponents = makeAnimated();

  // 🔽 thumbnailが空なら自動で "http://placehold.jp/800×400.png" にする
  const finalThumbnail = formValues.thumbnailUrl || "http://placehold.jp/800×400.png";

  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: formValues.title,
      content: formValues.content,
      thumbnailUrl: finalThumbnail,
      categories: formValues.categories.map(c => ({ id: c.id }))
    }),
  };


  useEffect(() => {
    const fetcherData = async () => {
      try {
        const response = await fetch(`/api/admin/posts/${id}`);
        const data = await response.json();
        console.log("📦 APIからの実データ:", data); // ←これで確認！
        //投稿データ
        const selectedCategories = data.post.postCategories.map((pc: any) => pc.category);
        const selectedCategoryIds = selectedCategories.map((cat: any) => cat.id);

        //全カテゴリー
        const catRes = await fetch(`/api/admin/categories`);
        const catData = await catRes.json();


        setFormValues({
          id:data.post.id,
          title: data.post.title,
          content: data.post.content,
          thumbnailUrl: data.post.thumbnailUrl,
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
  }, [id])



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmit(true);
    console.log("🚀 handleSubmit called");
  
    const errors = postsValidate(formValues);
    setFormErrors(errors);
  
    if (Object.keys(errors).length > 0) {
      setIsSubmit(false); // ✅ バリデーションNG時にも解除
      return;
    }
  
    console.log("✅ バリデーション通過しました");
  
    try {
      const response = await fetch(`/api/admin/posts/${id}`, options);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("fetch error:", errorText);
        throw new Error("更新に失敗しました。");
      }
  
      const data = await response.json();
      alert("更新が完了しました。");
      window.location.href = "/admin/posts";
      return data;
  
    } catch (e: unknown) {
      if (e instanceof Error) {
        alert(e.message || "エラーが発生しました。");
      } else {
        alert("エラーが発生しました。");
      }
      return e;
  
    } finally {
      setIsSubmit(false); // ✅ 成功でも失敗でも解除
    }
  };


  const handleDelete = async () => {
    const confirmDelete = confirm("本当に削除してよろしいですか？");
    if (!confirmDelete) return;
    setIsSubmit(true);

    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
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
    }finally{
      setIsSubmit(false);
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catRes = await fetch(`/api/admin/categories`);
        const catData = await catRes.json();
        setCategoryList(catData.categories);
        setSelectOptions(convertToOptions(catData.categories));
      } catch (error) {
        console.error("カテゴリー取得失敗：", error);
      }
    };
    fetchCategories();
  }, []);




  return (
    <>
        <PostForm
        formValues={formValues}
        formErrors={formErrors}
        selectOptions={selectOptions}
        isSubmit={isSubmit}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        onDelete={handleDelete}
        setFormValues={setFormValues}
        mode="edit"
      />
          </>
  )
}





export default PostEdit;