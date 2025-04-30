import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createCategoryRequestBody } from "@/app/_types/AdminType";
import { headers } from "next/headers";
import { supabase } from "@/utils/supabase";

const prisma = new PrismaClient()


export const GET = async (request: NextRequest) => {
  const headersList = headers();
  const authorization = headersList.get('authorization'); // 小文字！

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return NextResponse.json({ status: 'This endpoint requires a Bearer token' }, { status: 400 });
  }

  const token = authorization.split(' ')[1];

  //supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })
  // tokenが正しい場合、以降が実行される
  try {
    //カテゴリーの一覧をDBから取得
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: 'desc', //作成日時の降順で取得
      },
    })
    //レスポンスを返す
    return NextResponse.json({ status: 'OK', categories }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

export const POST = async (request: NextRequest, category: any) => {
  const headersList = headers();
  const authorization = headersList.get('authorization'); // 小文字！

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return NextResponse.json({ status: 'This endpoint requires a Bearer token' }, { status: 400 });
  }

  const token = authorization.split(' ')[1];

  //supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if(error) 
  return NextResponse.json({ status: error.message }, { status: 400 })
  // tokenが正しい場合、以降が実行される
  
  try {
    //リクエストのbodyを取得
    const body = await request.json()
    console.log("受け取ったデータ:", body)
    //bodyの中からnameを取り出す
    const { name }: createCategoryRequestBody = body

    //カテゴリーをDBに生成
    const data = await prisma.category.create({
      data: {
        name,
      },
    })

    //レスポンスを返す
    return NextResponse.json({
      status: 'OK',
      message: '作成しました',
      id: data.id,
    })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}