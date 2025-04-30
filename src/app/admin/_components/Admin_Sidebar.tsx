'use client';
import React from 'react'
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useRouterGuard } from '@/app/_hooks/useRouteGuard';

export const Sidebar: React.FC = () => {
  useRouterGuard();
  const pathname = usePathname();
  const isSelected = (href: string) => {
    return pathname.includes(href)
  }
  return (
    <div
      className="w-1/4 bg-slate-200 flex flex-col "
    >
      <Link
        href="/admin/posts"
        className={`p-4 block hover:bg-blue-100 ${
          isSelected('/admin/posts') && 'bg-blue-100'
        }`}
      >
        記事一覧
      </Link>
      <Link
        href="/admin/category"
        className={`p-4 block hover:bg-blue-100 ${
          isSelected('/admin/category') && 'bg-blue-100'
        }`}
      >
        カテゴリー一覧
      </Link>
    </div>
  )
}