'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { categoryOption, FormErrorsPostsType } from '@/app/_types/AdminType';
import { postsValidate } from '@/app/admin/_components/Validate';
import { usePostForm } from '@/app/_hooks/usePostForm';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { convertToOptions } from '../../_components/ConvertToOptions';
import PostForm from '../../_components/PostForm';



const PostNew: React.FC = () => {

  const initialFormState = { id: "", title: "", content: "", thumbnailUrl: "http://placehold.jp/800×400.png", createdAt: "", categories: [], };
  const { formValues, setFormValues, formErrors, setFormErrors, handleChange } = usePostForm(initialFormState);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [categoryList, setCategoryList] = useState<{ id: number; name: string }[]>([]);
  const [selectOptions, setSelectOptions] = useState<categoryOption[]>([]);

  const animatedComponents = makeAnimated();

  // 🔽 thumbnailが空なら自動で "http://placehold.jp/800×400.png" にする
  const finalThumbnail = formValues.thumbnailUrl || "http://placehold.jp/800×400.png";

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: formValues.title,
      content: formValues.content,
      thumbnailUrl: finalThumbnail,
      categories: formValues.categories.map(c => ({ id: c.id }))
    }),
  };


  const resetForm = () => {
    setFormValues(initialFormState);
    setFormErrors({});
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("🚀 handleSubmit called");
    //バリデーションチェックを行い、エラーを取得
    const errors = postsValidate(formValues);
    setFormErrors(errors);
    setIsSubmit(true);
    //エラーがなければ送信する
    if (Object.keys(errors).length > 0) {
      setIsSubmit(false); // ✅ バリデーションNG時にも解除
      return;
    }
    setIsSubmit(false);
    console.log("✅ バリデーション通過しました");
    try {
      const response = await fetch("/api/admin/posts", options);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("fetch error:", errorText);
        throw new Error("送信に失敗しました。")
      };
      const data = await response.json();
      alert("送信が完了しました。");
      resetForm();
      window.location.href = "/admin/posts";
      return (data);

    } catch (e: unknown) {
      if (e instanceof Error) {
        alert(e.message || "エラーが発生しました。");

      } else {
        alert("エラーが発生しました。");
      }
      return e;
    } finally {
      setIsSubmit(false);
    }


  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories");
        const catData = await response.json();
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
        onReset={resetForm}
        setFormValues={setFormValues}
        mode="new"
      />    </>
  )
}





export default PostNew;