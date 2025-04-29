'use client'
import React from 'react'
import Link from "next/link";
import { supabase } from '@/utils/supabase';
import { useSupabaseSession } from '../_hooks/useSupabaseSession';

export const Header: React.FC = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const { session, isLoading } = useSupabaseSession()

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
      {!isLoading && (
        <div>
          {session ? (
            <>
              <Link
                href="/admin/posts"
                className="header-link hover:text-purple-300 ml-8"
              >
                記事登録
              </Link>
              <button onClick={handleLogout}>ログアウト</button>
            </>
          ) : (
            <>
              <Link
                href="/contact"
                className="header-link hover:text-purple-300"
              >
                お問い合わせ
              </Link>        <Link
                href="/login"
                className="header-link hover:text-purple-300"
              >
                ログイン
              </Link>
            </>
          )}
        </div>
      )}
      <div className=''>



      </div>
    </header>
  )
}