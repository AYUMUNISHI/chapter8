import { NextRequest, NextResponse } from "next/server";
import { PrismaClient,  } from "@prisma/client";

const prisma = new PrismaClient()

interface UpdateCategoryRequestBody{
  name:string
}

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string }},
) => {
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