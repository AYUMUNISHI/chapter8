'use client';

import React from "react";
import { categoryFormProps } from "@/app/_types/AdminType";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";


export const CategoryForm: React.FC<categoryFormProps> = ({
  formValues,
  formErrors,
  isSubmit,
  handleChange,
  handleSubmit,
  onReset,
  onDelete,
  mode,
}) => {
  const isNew = mode === "new";
  const { token } = useSupabaseSession();

  return (

    <>
      <div className="mx-auto w-full">
        <div className=" px-10 ">
          <div className="py-10">
            <h1 className="text-2xl font-bold">
              {isNew ? "カテゴリー作成" : "カテゴリー編集"}
            </h1>
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
                disabled={isSubmit}
              />
              <p className="text-red-700 text-xs mb-10">{formErrors.name}</p>
            </label>
            <div>
              <button className='text-lg bg-blue-900 text-white rounded-xl px-4 py-2 hover:bg-blue-700 mr-3'
                type='submit'
                disabled={isSubmit}
              >{isSubmit ? "送信中..." : isNew ? "作成" : "更新"}</button>



              {onReset && (
                <button className='text-lg bg-red-500 text-white rounded-xl px-4 py-2 hover:bg-red-400'
                  onClick={onReset}
                  type='button'
                  disabled={isSubmit}
                >{isSubmit ? "送信中..." : "リセット"}
                </button>)}

              {onDelete && (
                <button
                  className='text-lg bg-red-600 text-white rounded-xl px-4 py-2 hover:bg-red-400 hover:text-red-900'
                  type='button'
                  onClick={onDelete}
                  disabled={isSubmit}
                >{isSubmit ? "送信中..." : "削除"}
                </button>
              )}
            </div>


          </form>
        </div>
      </div>
    </>

  )
}