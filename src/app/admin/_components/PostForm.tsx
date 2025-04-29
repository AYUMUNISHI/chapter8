'use client';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {  categoryOption, createPostRequestBody, postFormProps } from '@/app/_types/AdminType';
import { postsValidate } from './Validate';
import { supabase } from '@/utils/supabase';
import { v4 as uuidv4 } from 'uuid'  // 固有IDを生成するライブラリ
import { useEffect, useState } from 'react';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';

const PostForm: React.FC<postFormProps> = ({
  formValues,
  formErrors,
  selectOptions,
  isSubmit,
  handleChange,
  setIsSubmit,
  onReset,
  onDelete,
  setFormValues,
  setFormErrors,
  mode,
  id,
}) => {
  const isNew = mode === "new";
  const animatedComponents = makeAnimated();
  const [thumbnailImageKey, setThumbnailImageKey] = useState('')
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(null)
  const { token } = useSupabaseSession();

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      // 画像が選択されていないのでreturn
      return
    }

    const file = event.target.files[0] // 選択された画像を取得
    const ext = file.name.split('.').pop(); // ファイル名から拡張子を取得
    const filePath = `private/${uuidv4()}.${ext}` // ファイルパスを指定

    // Supabaseに画像をアップロード
    const { data, error } = await supabase.storage
      .from('post-thumbnail') // ここでバケット名を指定
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    // アップロードに失敗したらエラーを表示して終了
    if (error) {
      alert(error.message)
      return
    }

    if (data?.path) {
      const { data: publicUrlData } = await supabase.storage
        .from('post-thumbnail')
        .getPublicUrl(data.path);
  
      setThumbnailImageKey(data.path);
      setThumbnailImageUrl(publicUrlData.publicUrl || '');
  
      // 📌 フォームに保存するのは「https://〜」の公開URL！
      setFormValues((prev:createPostRequestBody) => ({
        ...prev,
        thumbnailImageKey: publicUrlData.publicUrl || '',
      }));
    }
  }

  useEffect(() =>{
    if(!thumbnailImageKey) return;
    if(!token) return;
    //アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得
    const fetcher = async() =>{
      const {
        data: {publicUrl},
      } = await supabase.storage
      .from('post-thumbnail')
      .getPublicUrl(thumbnailImageKey)

      setThumbnailImageUrl(publicUrl)
    }

    fetcher()
  },[thumbnailImageKey])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmit(true);
    console.log("🚀 handleSubmit called");
    console.log("🚀 token:", token); // ←ここ
    console.log("🚀 Authorizationヘッダー:", `Bearer ${token}`); // ←ここ

    const errors = postsValidate(formValues);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setIsSubmit(false); // ✅ バリデーションNG時にも解除
      return;
    }
    const url = isNew ? `/api/admin/posts` : `/api/admin/posts/${id}`;
    const method = isNew ? 'POST' : 'PUT';
    // 🔽 thumbnailが空なら自動で "http://placehold.jp/800×400.png" にする
    const finalThumbnail = formValues.thumbnailImageKey || "http://placehold.jp/800×400.png";

    console.log("✅ バリデーション通過しました");

    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization:`Bearer ${token}`,
      },
      body: JSON.stringify({
        title: formValues.title,
        content: formValues.content,
        thumbnailImageKey: finalThumbnail,
        categories: formValues.categories.map(c => ({ id: c.id }))
      }),
    };


    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("fetch error:", errorText);
        throw new Error("更新に失敗しました。");
      }

      const data = await response.json();
      alert(isNew ? "送信が完了しました" :"更新が完了しました。");
      if(isNew && onReset) onReset();

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
                disabled={isSubmit}
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
                disabled={isSubmit}
              />
              <p className="text-red-700 text-xs mb-10">{formErrors.content}</p>
            </label>
            <label htmlFor="thumbnailImageKey">
              <p className=" text-lg ">サムネイルURL</p>
              <input
                type="file"
                id='thumbnailImageKey'
                name='thumbnailImageKey'
                placeholder="http://placehold.jp/800×400.png"
                className='border border-gray-300 rounded-lg p-4 w-full '
                onChange={handleImageChange}
                accept='image/*'
                disabled={isSubmit}
              />
              <p className="text-red-700 text-xs mb-10">{formErrors.thumbnailImageKey}</p>

            </label>
            {thumbnailImageUrl &&(
              <div className='mt-2'>
                <img 
                  src= {thumbnailImageUrl}
                  alt="thumbnail preview"
                  width={400}
                  height={400}
                  />
              </div>
            )}
            <label htmlFor="category">
              <p className=" text-lg ">カテゴリー</p>
              <Select< categoryOption, true>
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={selectOptions}
                value={selectOptions.filter(option =>
                  formValues.categories.map(c => c.id).includes(option.value)
                )}
                onChange={(selected) => {
                  setFormValues({
                    ...formValues,
                    categories: selected.map(s => ({ id: Number(s.value) })), // ✅ これでOK
                  });
                }}
                className='mb-10 '
                isDisabled={isSubmit}
              />

            </label>
            <div >
              <button
                className='text-lg bg-blue-900 text-white rounded-xl px-4 py-2 hover:bg-blue-700 mr-3'
                type='submit'
                disabled={isSubmit}
              >{isSubmit ? "更新中..." : isNew ? "投稿" : "更新"}
              </button>

              {onDelete && (
                <button className='text-lg bg-red-600 text-white rounded-xl px-4 py-2 hover:bg-red-400'
                  onClick={onDelete}
                  type='button'
                  disabled={isSubmit}
                >{isSubmit ? "送信中..." : "削除"}
                </button>
              )}
              {onReset && (
                <button className='text-lg bg-red-600 text-white rounded-xl px-4 py-2 hover:bg-red-400'
                  onClick={onReset}
                  type='button'
                  disabled={isSubmit}
                >{isSubmit ? "リセット中..." : "リセット"}
                </button>

              )}
            </div>

          </form>
        </div>
      </div>
    </>

  )
}
export default PostForm;