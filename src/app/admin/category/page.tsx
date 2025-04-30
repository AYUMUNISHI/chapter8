'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { categoryType, createCategoryRequestBody } from "@/app/_types/AdminType";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";



export default function Category() {

  const [posts, setPosts] = useState<createCategoryRequestBody[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useSupabaseSession();

  useEffect(() =>{
    if ( !token ) return;

    const fetcher = async() =>{
      setLoading(true);
      try{
        //fetchのAPIから取得したデータを入力
        const response = await fetch(`/api/admin/categories`,{
          headers: {
            'Create-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        });

        if(!response.ok){
          throw new Error('ネットワークエラー');

        }

        const data = await response.json() as categoryType;
        setPosts(data.categories);
      }catch(error){
        console.error("データ取得に失敗しました" , error);
      }finally{
        setLoading(false);
      }
    };
    fetcher();
  },[token]);



  return (
    <>
      <div className="mx-auto w-full">


        <div className=" px-10 h-screen">
          <div className="flex justify-between items-center py-10">
            <h1 className="text-2xl font-bold">カテゴリー一覧</h1>
            <Link
              href= "/admin/category/new"
            >
              <button className="bg-blue-500 px-5 py-3 rounded-xl text-white hover:bg-blue-400">新規作成</button>
            </Link>
          </div>
          <div className="h-[70%] overflow-y-auto border rounded p-2">
            { loading ? (
              <div> 読み込み中...</div>
            ) :!posts.length ?(
              <div> 記事がありません</div>
            ):
            posts.map((post) =>(
              <div 
                key={post.id}
                className="">
              <Link
                href={`/admin/category/${post.id}`}
              >
              <div className="border-b-gray-500 border-b px-5 py-5 ">
                <p className="font-bold text-xl ">
                  {post.name}
                </p>
              </div>
              </Link>
            </div>
  
            ))
          }
          </div>
        </div>

      </div>
    </>
  );

}
