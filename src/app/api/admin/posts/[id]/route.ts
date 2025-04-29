import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()


// 記事の更新時に送られてくるリクエストのbodyの型
interface UpdatePostRequestBody{
  title: string
  content: string
  categories: { id: number}[]
  thumbnailImageKey: string
}

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }, // ここでリクエストパラメータを受け取る
) => {
  // paramsの中にidが入っているので、それを取り出す
  const { id } = params

  try {
    // idを元にPostをDBから取得
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
      // カテゴリーも含めて取得
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                // カテゴリーのidとnameだけ取得
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    // レスポンスを返す
    return NextResponse.json({ status: 'OK', post: post }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

//PUTという命名にすることで、PUTリクエストの時にこの関数が呼ばれる
export const PUT = async (
  request:NextRequest,
  { params }: { params: { id: string } }
) =>{
   // paramsの中にidが入っているので、それを取り出す
  const { id } = params

   // リクエストのbodyを取得
   const { title, content, categories, thumbnailImageKey }: UpdatePostRequestBody = await request.json()

  try{
    // idを指定して、Postを更新
    const post = await prisma.post.update({
      where:{
        id: parseInt(id),
      },
      data:{
        title,
        content,
        thumbnailImageKey,
      },
    })

     // 一旦、記事とカテゴリーの中間テーブルのレコードを全て削除
     await prisma.postCategory.deleteMany({
      where: {
        postId: parseInt(id),
      },
     })

    // 記事とカテゴリーの中間テーブルのレコードをDBに生成
    // 本来複数同時生成には、createManyというメソッドがあるが、sqliteではcreateManyが使えないので、for文1つずつ実施
    for (const category of categories){
      await prisma.postCategory.create({
        data:{
          postId: post.id,
          categoryId: category.id,
        },
      })
    }

    //レスポンスを返す
    return NextResponse.json({status: 'OK', post: post}, {status: 200})
  }catch(error){
    if(error instanceof Error)
      return NextResponse.json({status: error.message}, {status:400})
  }
}


//DELETEという命名することで、DELETEリクエストの時にこの関数が呼び出される
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }, //ここでリクエストパラメータを受け取る
) =>{
//paramsの中にidが入っているので、それを取り出す
  const { id } = params

  try{
    //idを指定して、postを削除
    await prisma.post.delete({
      where:{
        id: parseInt(id),
      },
    })

    //レスポンスを返す
    return NextResponse.json({status: 'OK'}, {status: 200})
  }catch(error){
    if(error instanceof Error)
      return NextResponse.json({status: error.message}, { status: 400})
  }
}
