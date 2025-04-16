'use client';

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/app/_Constants";
import Link from "next/link";
import { Posts, CreatePostRequestBody } from "@/app/_types/AdminType";



export default function AdminHome() {

  const [posts, setPosts] = useState<CreatePostRequestBody[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetcher = async () => {
      setLoading(true);
      try {
        //fetchのAPIから取得したエンドポイントを入力
        const response = await fetch(`/api/admin/posts`, {
          //fetch関数の第二引数にheadersを設定でき、その中にAPIキーを設定します
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('ネットワークエラー');
        }

        const data = await response.json() as Posts;
        setPosts(data.posts);
      } catch (error) {
        console.error("データの取得に失敗しました", error);
      } finally {
        setLoading(false);
      }
    };
    fetcher();
  }, []);

  if (loading) {
    return <div>読み込み中...</div>
  }

  if (!posts.length) {
    return <div>記事がありません</div>
  }

  return (
    <>
      <div className="mx-auto w-full">


        <div className=" px-10  h-screen">
          <div className="flex justify-between items-center py-10">
            <h1 className="text-2xl font-bold">記事一覧</h1>
            <Link
              href="/admin/posts/new"
            >
              <button className="bg-blue-500 px-5 py-3 rounded-xl text-white hover:bg-blue-400">新規作成</button>
            </Link>
          </div>
          <div className="h-[70%] overflow-y-auto border rounded p-2">
          {
            posts.map((post) => (
              <div key={post.id}
              className="">
                <div className=" ">
                  <Link
                    href={`/admin/posts/${post.id}`}
                  >
                    <div className="border-b-gray-500 border-b px-5 pb-4 mt-4 ">
                      <h1 className="font-bold text-xl mb-2">
                        {post.title}
                      </h1>
                      <p className="">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>


                </div>
              </div>
            ))
          }
          </div>


        </div>

      </div>
    </>
  );

}
