'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; 
import { API_BASE_URL } from '../../_Constants';
import { Post } from '../../_types/PostsType';






const Show: React.FC = () => {
  const { id } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading]= useState<boolean>(false)


  
  useEffect(() =>{
    const fetcher = async () => {
      setLoading(true)
        //fetchの後ろに管理画面から取得したエンドポイントを入力
        const res = await fetch(`https://gr93pbkkbx.microcms.io/api/v1/posts/${id}`,{
          //fetch関数の第二引数にheadersを設定でき、その中にAPIキーを設定します
          headers: {
            'X-MICROCMS-API-KEY' :process.env.NEXT_PUBLIC_MICRO_CMS_API_KEY as string,
          }
       });

      const  postData = (await res.json()) as Post ;
      console.log(postData)
      setPost(postData);
      setLoading(false)
    }
    fetcher()
  },[id])

  if(loading){
    return <div>読み込み中...</div>
  }
  
  if(!post){
    return <div>記事がありません</div>
  }

  return (
    <>
      <div
      className="container mx-auto my-12 p-4 :"
    >
      <div className="bg-slate-800">
      {post && (
        <Image src={post.thumbnail.url} alt="" className="object-cover h-full w-full" width={1000} height={280}/>
      )}
      </div>
      <div className="p-4">
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
          post && post.categories.map((category) => {
            return (
            <div
              key={category.name}
              className="border border-category rounded px-1 py-0.5 mr-2"
            >
              {category.name}
            </div>
            )
          })
        } 
          </div>
        </div>
        <div
          className="mt-2 mb-4 text-gray-500 text-2xl"
        >
          {post && post.title}
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