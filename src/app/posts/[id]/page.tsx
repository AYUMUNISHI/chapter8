'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { API_BASE_URL } from '../../_Constants';
import { ShowPost,ShowPostResponse } from '../../_types/PostsType';






const Show: React.FC = () => {
  const { id } = useParams()
  const [post, setPost] = useState<ShowPost | null>(null)
  const [loading, setLoading] = useState<boolean>(false)



  useEffect(() => {
    const fetcher = async () => {
      setLoading(true)
      //fetchの後ろに管理画面から取得したエンドポイントを入力
      const res = await fetch(`/api/admin/posts/${id}`, {
      });

      const json = (await res.json()) as ShowPostResponse;
      console.log(json)
      setPost(json.post);
      setLoading(false)
    }
    fetcher()
  }, [id])

  if (loading) {
    return <div>読み込み中...</div>
  }

  if (!post) {
    return <div>記事がありません</div>
  }

  return (
    <>
      <div
        className="container mx-auto my-12 p-4 h-screen :"
      >
        <div className="w-full h-[60%]">
          {post && (
            <Image
              src={post.thumbnailUrl || "http://placehold.jp/800×400.png"}
              alt={post.title}
              className="object-cover h-full w-full "
              width={1000} height={280}
            />
          )}
        </div>
        <div className="p-10">
          <div
            className="flex justify-between items-start "
          >
            <div
              className="text-gray-300 text-xs"
            >
              {post && new Date(post.createdAt).toLocaleDateString()}
            </div>
            <div
              className="flex justify-between  text-category text-sm"
            >
              {
                post && post.postCategories?.map((pc) => {
                  return (
                    <div
                      key={pc.category.name}
                      className="border border-category rounded px-1 py-0.5 mr-2"
                    >
                      {pc.category.name}
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div
            className="mt-2 mb-4 text-gray-500 text-2xl"
          >
            {post.title}
          </div>
          <div
            className="text-gray-500 text-base "
            dangerouslySetInnerHTML={{ __html: `${post && post.content}` }}
          >
          </div>

        </div>
      </div>

    </>

  )
}

export default Show;