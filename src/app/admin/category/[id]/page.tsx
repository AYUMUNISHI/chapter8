'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { categoryValidate } from '@/app/admin/_components/Validate';
import { useCategoryForm } from '@/app/_hooks/useCategoryForm';
import { CategoryForm } from '../../_components/CategoryForm';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';





const CategoryEdit: React.FC = () => {

  const { id } = useParams();
  const initialFormState = { name: "", };
  const { formValues, setFormValues, formErrors, setFormErrors, handleChange } = useCategoryForm(initialFormState);
  const [isSubmit, setIsSubmit] = useState(true);
  const { token } = useSupabaseSession();


  const options = {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,

    },
    body: JSON.stringify({
      name: formValues.name,
    }),

  };


  useEffect(() => {
    if (!token) return;
    const fetcherData = async () => {
      try {
        const response = await fetch(`/api/admin/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        const data = await response.json();
        console.log("📦 APIからの実データ:", data);

        setFormValues({
          name: data.category.name,
        });
      } catch (error) {
        console.error("データ取得エラー：", error);
      } finally {
        setIsSubmit(false)
      }
    };
    fetcherData()
  }, [id, token])





  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    console.log("🚀 handleSubmit called");
    setIsSubmit(true);

    const errors = categoryValidate(formValues);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setIsSubmit(false); // ✅ バリデーションNG時にも解除
      return;
    }
    try {
      const response = await fetch(`/api/admin/categories/${id}`, options);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("fetch error:", errorText);
        throw new Error("更新に失敗しました。")
      };

      const data = await response.json()
      alert("更新が完了しました。");
      window.location.href = "/admin/category"
      setIsSubmit(false);
      return (data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        alert(e.message || "エラーが発生しました。");
      } else {
        alert("エラーが発生しました。");
      }
      return e;
    }

  }



  const handleDelete = async () => {
    const confirmDelete = confirm("本当に削除してよろしいですか？");
    if (!confirmDelete) return;
    if (!token) return;
    setIsSubmit(true);

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization:`Bearer ${token}`,
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("削除エラー：", errorText);
        throw new Error("削除に失敗しました。");

      }


      alert("記事を削除しました！");
      window.location.href = "/admin/category";

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



  return (
    <CategoryForm
      formValues={formValues}
      formErrors={formErrors}
      isSubmit={isSubmit}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      onDelete={handleDelete}
      mode="edit"
    />
  )
}

export default CategoryEdit;