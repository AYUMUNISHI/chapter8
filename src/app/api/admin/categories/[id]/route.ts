import { NextRequest, NextResponse } from "next/server";
import { PrismaClient,  } from "@prisma/client";
import { headers } from "next/headers";
import { supabase } from "@/utils/supabase";

const prisma = new PrismaClient()

interface UpdateCategoryRequestBody{
  name:string
}

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string }},
) => {

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
  const { id } = params

  try{
    const category = await prisma.category.findUnique({
      where:{
        id: parseInt(id),
      },
    })

    return NextResponse.json({status: 'OK', category}, {status: 200})
  }catch(error){
    if(error instanceof Error)
      return NextResponse.json({status: error.message}, {status: 400})
  }
}

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) =>{
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

  // paramsの中にidが入っているので、それを取り出す
  const { id } = params

  // リクエストのbodyを取得
  const { name }: UpdateCategoryRequestBody = await request.json()

  try{
  // idを指定して、Categoryを更新
    const category = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: name
      },
    })

  //レスポンスを返す
    return NextResponse.json({status: 'OK',category}, {status: 200})
  }catch(error){
    if(error instanceof Error)
      return NextResponse.json({ status: error.message}, {status:400})
  }

}

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) =>{
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
  
  const { id } = params

  try{
    //idを指定してcategoryを削除
    await prisma.category.delete({
      where:{
        id: parseInt(id),
      },
    })

    //レスポンスを返す
    return NextResponse.json({status: 'OK' }, {status: 200})
  }catch(error){
    if(error instanceof Error)
      return NextResponse.json({ status: error.message}, {status:400})
  }
}