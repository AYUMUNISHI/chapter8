'use client';

import { useEffect, useState } from 'react';
import { categoryValidate } from '@/app/admin/_components/Validate';
import { useCategoryForm } from '@/app/_hooks/useCategoryForm';
import { CategoryForm } from '../../_components/CategoryForm';





const CategoryNew: React.FC = () => {
  const initialFormState = { name: "", };
  const { formValues, setFormValues, formErrors, setFormErrors, handleChange } = useCategoryForm(initialFormState);
  const [isSubmit, setIsSubmit] = useState(false);

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: formValues.name,
    }),
  };



  const resetFrom = () => {
    setFormValues(initialFormState);
    setFormErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("🚀 handleSubmit called");
    setIsSubmit(true);

    const errors = categoryValidate(formValues);
    setFormErrors(errors);
    setIsSubmit(true);

    if (Object.keys(errors).length > 0) {
      setIsSubmit(false); // ✅ バリデーションNG時にも解除
      return;
    }
    console.log("✅ バリデーション通過しました");
    try {
      const response = await fetch(`/api/admin/categories`, options);

      if (!response.ok) {
        throw new Error("送信に失敗しました。")
      };

      const data = await response.json();
      alert("送信が完了しました。");
      setIsSubmit(false);
      return (data);

    } catch (e: unknown) {
      if (e instanceof Error) {
        alert(e.message || " エラーが発生しました。");
      } else {
        alert("エラーが発生しました。");
      }
      return e;
    }

  }




  return (
    <CategoryForm
      formValues={formValues}
      formErrors={formErrors}
      isSubmit={isSubmit}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      onReset={resetFrom}
      mode="new"
    />
  )
}

export default CategoryNew;