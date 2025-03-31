'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; 
import { API_BASE_URL } from '../../_Constants';
import {ApiResponse, Post} from '../../types/PostsType';






const Show: React.FC = () => {
  const { id } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading]= useState<boolean>(false)


  
  useEffect(() =>{
    const fetcher = async () => {
      setLoading(true)
      const ser =  await fetch(`${API_BASE_URL}/posts/${id}`)
      const  postData = (await ser.json()) as ApiResponse ;
      console.log(postData)
      setPost(postData.post)
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
        <Image src={post.thumbnailUrl} alt="" className="object-cover h-full w-full" width={1000} height={280}/>
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
              key={category}
              className="border border-category rounded px-1 py-0.5 mr-2"
            >
              {category}
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