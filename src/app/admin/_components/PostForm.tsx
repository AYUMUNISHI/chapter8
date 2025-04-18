'use client';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { categoryOption, postFormProps } from '@/app/_types/AdminType';
import { postsValidate } from './Validate';


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
    const url = isNew ? `/api/admin/posts` : `/api/admin/posts/${id}`;
    const method = isNew ? 'POST' : 'PUT';
    // 🔽 thumbnailが空なら自動で "http://placehold.jp/800×400.png" にする
    const finalThumbnail = formValues.thumbnailUrl || "http://placehold.jp/800×400.png";

    console.log("✅ バリデーション通過しました");

    const options = {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formValues.title,
        content: formValues.content,
        thumbnailUrl: finalThumbnail,
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
            <label htmlFor="thumbnailUrl">
              <p className=" text-lg ">サムネイルURL</p>
              <input
                type="text"
                id='thumbnailUrl'
                name='thumbnailUrl'
                placeholder="http://placehold.jp/800×400.png"
                className='border border-gray-300 rounded-lg p-4 w-full '
                value={formValues.thumbnailUrl}
                onChange={handleChange}
                disabled={isSubmit}
              />
              <p className="text-red-700 text-xs mb-10">{formErrors.thumbnailUrl}</p>

            </label>
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