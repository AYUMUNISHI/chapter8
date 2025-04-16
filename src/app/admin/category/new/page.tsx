'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { headers } from 'next/headers';
import { FormErrorsCategoryType } from '@/app/_types/AdminType';
import { CategoryValidate } from '@/app/_components/Validate';
import { UseCategoryForm } from '@/app/_hooks/UsePostForm';





const CategoryNew: React.FC = () => {
  const initialFormState = { name: "", };
    const { formValues, setFormValues, formErrors, setFormErrors, handleChange } = UseCategoryForm(initialFormState);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

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

    const errors = CategoryValidate(formValues);
    setFormErrors(errors);
    setIsSubmit(true);

    if (Object.keys(errors).length === 0) {
      console.log("✅ バリデーション通過しました");
      try {
        const response = await fetch(`/api/admin/categories`, options);

        if (!response.ok) {
          throw new Error("送信に失敗しました。")
        };

        const data = await response.json();
        alert("送信が完了しました。");
        resetFrom();
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
  }




  return (
    <>
      <div className="mx-auto w-full">
        <div className=" px-10 ">
          <div className="py-10">
            <h1 className="text-2xl font-bold">カテゴリー作成</h1>
          </div>
          <form
            className=" px-6"
            onSubmit={handleSubmit}
          >
            <label htmlFor="category">
              <p className=" text-lg ">カテゴリー名</p>
              <input
                type="text"
                id='category'
                name='name'
                value={formValues.name}
                onChange={handleChange}
                className='border border-gray-300 rounded-lg p-4 w-full '
              />
              <p className="text-red-700 text-xs mb-10">{formErrors.name}</p>
            </label>
            <div>
              <button className='text-lg bg-blue-900 text-white rounded-xl px-4 py-2 hover:bg-blue-700 mr-3'
                type='submit'
              >作成</button>
              <button className='text-lg bg-red-500 text-white rounded-xl px-4 py-2 hover:bg-red-400'
                onClick={resetFrom}
                type='button'
              >リセット</button>
            </div>


          </form>
        </div>
      </div>
    </>
  )
}

export default CategoryNew;