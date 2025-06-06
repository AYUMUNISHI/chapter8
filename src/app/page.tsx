'use client';

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/app/_Constants";
import {showPost, } from './_types/PostsType';
import { headers } from "next/headers";


export default function Home(){

  const [posts, setPosts] = useState<showPost[]>([])
  const [loading, setLoading] =useState<boolean>(false)

  useEffect(() => {
    const fetcher = async () => {
      setLoading(true);
      try {
        //fetchの後ろに管理画面から取得したエンドポイントを入力
        const res = await fetch(`/api/posts`,{

       });

        if (!res.ok) {
          throw new Error('ネットワークエラー');
        }
        const data = await res.json() ; 
        setPosts(data.posts); // APIから取得したデータを使用
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };
    fetcher();
  }, []);

  if(loading){
    return<div>読み込み中...</div>
  }

  if(!posts.length){
    return<div>記事がありません</div>
  }

  return (
    <>
      {
        posts.map((post) => (
          <div key={post.id}>
            <Link href={`/posts/${post.id}`}>
              <div
                className="container mx-auto border border-gray-300 my-12 p-4"
              >

                <div
                  className="flex justify-between items-center "
                >
                  <div
                    className="text-gray-300 text-xs"
                  >
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <div
                    className="flex justify-between gap-2 text-category text-sm"
                  >
                    {
                      post.postCategories?.map((pc) => {
                        return (
                          <div
                            key={pc.category.name}
                            className="border border-category rounded px-1 py-0.5 "
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
                  className="text-gray-500 text-base line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: `${post.content}` }}
                >

                </div>
              </div>

            </Link>

          </div>

        ))
      }
    </>
  )
}