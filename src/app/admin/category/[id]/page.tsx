'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CategoryValidate } from '@/app/_components/Validate';
import { UseCategoryForm } from '@/app/_hooks/UsePostForm';





const CategoryEdit: React.FC = () => {

  const { id } = useParams();
  const initialFormState = { name: "",};
  const { formValues, setFormValues, formErrors, setFormErrors, handleChange } = UseCategoryForm(initialFormState);
  const [loading, setLoading] = useState<boolean>(true);


  const options = {
    method: "PUT",
    headers: {"Content-type": "application/json"},
    body: JSON.stringify({
      name: formValues.name,
    }),

  };


  useEffect(() => {
    const fetcherData = async() => {
      try{
        const response = await fetch(`/api/admin/categories/${id}`);
        const data = await response.json();
        console.log("📦 APIからの実データ:", data) ;

        setFormValues({
          name: data.category.name,
        });
      }catch(error){
        console.error("データ取得エラー：",error);
      }finally{
        setLoading(false)
      }
    };
    fetcherData()
  },[id])





  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("🚀 handleSubmit called");
    const errors = CategoryValidate(formValues);
    setFormErrors(errors);

    if(Object.keys(errors).length === 0 ){
      try{
        const response =await fetch(`/api/admin/categories/${id}`,options);

        if(!response.ok){
          const errorText = await response.text();
          console.error("fetch error:", errorText);
          throw new Error("更新に失敗しました。")
        };

        const data = await response.json()
        alert("更新が完了しました。");
        window.location.href = "/admin/category"
        return(data);
      }catch(e: unknown) {
        if(e instanceof Error){
          alert(e.message || "エラーが発生しました。");
        }else{
          alert("エラーが発生しました。");
        }
        return e;
      }
    }
  }



  const handleDelete = async() => {
    const confirmDelete = confirm("本当に削除してよろしいですか？");
    if(!confirmDelete)return;

    try{
      const response =await fetch(`/api/admin/category/${id}`,{
        method: "DELETE",
      });

      if(!response.ok){
        const errorText =await response.text();
        console.error("削除エラー：", errorText);
        throw new Error("削除に失敗しました。");

      }


      alert("記事を削除しました！");
      window.location.href = "/admin/category";

    }catch(error: unknown){
      if(error instanceof Error){
        alert(error.message || "エラーが発生しました。");
      }else{
        alert("エラーが発生しました。");
      }
    }
  }



  return (
    <>
      <div className="mx-auto w-full">
        <div className=" px-10 ">
          <div className="py-10">
            <h1 className="text-2xl font-bold">カテゴリー編集</h1>
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
            <div className=''>
              <button 
                className='text-lg bg-blue-900 text-white rounded-xl px-4 py-2 mr-2 hover:bg-blue-500'
                type='submit'
                
              >更新</button>
              <button 
                className='text-lg bg-red-600 text-white rounded-xl px-4 py-2 hover:bg-red-400 hover:text-red-900'
                type='button'
                onClick={handleDelete}
              >削除</button>
            </div>

          </form>
        </div>
      </div>
    </>
  )
}

export default CategoryEdit;