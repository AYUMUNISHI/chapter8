import React from 'react'
import Link from "next/link";

export const Sidebar: React.FC = () => {
  return (
    <div
      className="w-1/4 bg-slate-200 flex flex-col "
    >
      <Link
        href="/admin/posts"
        className="text-2xl p-5 hover:bg-blue-200 "
      >
        記事一覧
      </Link>
      <Link
        href="/admin/category"
        className="text-2xl p-5 hover:bg-blue-200 "
      >
        カテゴリー一覧
      </Link>
    </div>
  )
}