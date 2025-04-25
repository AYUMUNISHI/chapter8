import React from 'react'
import Link from "next/link";

export const Header: React.FC = () => {
  return (
    <header
      className="header flex justify-between items-center p-6 font-bold text-white bg-gray-500"
    >
      <Link
        href="/"
        className="header-link hover:text-purple-300"
      >
        Blog
      </Link>
      <div className=''>
        <Link
          href="/contact"
          className="header-link hover:text-purple-300"
        >
          お問い合わせ
        </Link>
        <Link
          href="/admin/posts"
          className="header-link hover:text-purple-300 ml-8"
        >
          記事登録
        </Link>

      </div>
    </header>
  )
}