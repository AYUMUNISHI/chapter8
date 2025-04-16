'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PostsValidate } from '@/app/_components/Validate';
import { UsePostForm } from '@/app/_hooks/UsePostForm';
import { PostsCategory, ConvertToOptions } from '@/app/_components/PostsCategory';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { CategoryOption } from '@/app/_types/AdminType';







const PostEdit: React.FC = () => {
  const { id } = useParams();
  const initialFormState = { title: "", content: "", thumbnail: "http://placehold.jp/800×400.png", category: [] as number[], };
  const { formValues, setFormValues, formErrors, setFormErrors, handleChange } = UsePostForm(initialFormState);
  const [categoryList, setCategoryList] = useState<{ id: number; name: string }[]>([]);
  const [selectOptions, setSelectOptions] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const animatedComponents = makeAnimated();

  // 🔽 thumbnailが空なら自動で "http://placehold.jp/800×400.png" にする
  const finalThumbnail = formValues.thumbnail || "http://placehold.jp/800×400.png";

  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: formValues.title,
      content: formValues.content,
      thumbnailUrl: finalThumbnail,
      categories: formValues.category.map((id: number) => ({ id })),
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
          title: data.post.title,
          content: data.post.content,
          thumbnail: data.post.thumbnailUrl,
          category: selectedCategoryIds,
        });

        setCategoryList(catData.categories);
      } catch (error) {
        console.error("データ取得エラー：", error);
      } finally {
        setLoading(false)
      }
    };
    fetcherData()
  }, [id])


  const resetForm = () => {
    setFormValues(initialFormState);
    setFormErrors({});
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("🚀 handleSubmit called");
    //バリデーションチェックを行い、エラーを取得
    const errors = PostsValidate(formValues);
    setFormErrors(errors);
    //エラーがなければ送信する
    if (Object.keys(errors).length === 0) {
      console.log("✅ バリデーション通過しました");
      try {
        const response = await fetch(`/api/admin/posts/${id}`, options);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("fetch error:", errorText);
          throw new Error("更新に失敗しました。")
        };
        const data = await response.json();
        alert("更新が完了しました。");
        window.location.href = "/admin/posts";
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

  }



  const handleDelete = async () => {
    const confirmDelete = confirm("本当に削除してよろしいですか？");
    if (!confirmDelete) return;

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
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catRes = await fetch(`/api/admin/categories`);
        const catData = await catRes.json();
        setCategoryList(catData.categories);
        setSelectOptions(ConvertToOptions(catData.categories));
      } catch (error) {
        console.error("カテゴリー取得失敗：", error);
      }
    };
    fetchCategories();
  }, []);




  return (
    <>
      <div className="mx-auto w-full">
        <div className=" px-10 ">
          <div className="py-10">
            <h1 className="text-2xl font-bold">記事作成</h1>
          </div>
          <form
            onSubmit={handleSubmit}
            className=" px-6"
          >
            <label htmlFor="title">
              <p className=" text-lg ">タイトル</p>
              <input
                type="text"
                id='title'
                name='title'
                className='border border-gray-300 rounded-lg p-4 w-full'
                value={formValues.title}
                onChange={handleChange}
              />
              <p className="text-red-700 text-xs mb-10">{formErrors.title}</p>
            </label>
            <label htmlFor="content">
              <p className="text-lg ">内容</p>
              <textarea
                id='content'
                name='content'
                className='border border-gray-300 rounded-lg p-2 w-full h-32 resize-none '
                value={formValues.content}
                onChange={handleChange}
              />
              <p className="text-red-700 text-xs mb-10">{formErrors.content}</p>
            </label>
            <label htmlFor="thumbnail">
              <p className=" text-lg ">サムネイルURL</p>
              <input
                type="text"
                id='thumbnail'
                name='thumbnail'
                placeholder="http://placehold.jp/800×400.png"
                className='border border-gray-300 rounded-lg p-4 w-full '
                value={formValues.thumbnail}
                onChange={handleChange}
              />
              <p className="text-red-700 text-xs mb-10">{formErrors.thumbnail}</p>

            </label>
            <label htmlFor="category">
              <p className=" text-lg ">カテゴリー</p>
              <Select< CategoryOption, true>
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={selectOptions}
                value={selectOptions.filter(option =>
                  formValues.category.includes(Number(option.value)) // ← value は string 型なので Number にする
                )}
                onChange={(selected) => {
                  setFormValues({
                    ...formValues,
                    category: selected.map(s => Number(s.value)) // ← state 更新用
                  });
                }}
                className='mb-10 '
              />

            </label>
            <div >
              <button
                className='text-lg bg-blue-900 text-white rounded-xl px-4 py-2 hover:bg-blue-700 mr-3'
                type='submit'
              >更新</button>
              <button className='text-lg bg-red-600 text-white rounded-xl px-4 py-2 hover:bg-red-400'
                onClick={handleDelete}
                type='button'
              >削除
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  )
}





export default PostEdit;