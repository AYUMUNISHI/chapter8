'use client';
import { FormErrorsPostsType, FormErrorsCategoryType } from "@/app/_types/AdminType";
import React from "react";


export const postsValidate = (values: FormErrorsPostsType) => {
  const errors: FormErrorsPostsType = {};

  console.log("validate 結果:", errors); // ここ重要！！
  if (!values.title) {
    errors.title = "タイトルを入力してください";
  }
  if (!values.content) {
    errors.content = "内容は必須です。";
  }
  if (!values.thumbnailImageKey) {
    errors.thumbnailImageKey = "サムネイル画像URLは必須です。";
  } else if (
    !/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(values.thumbnailImageKey)
  ) {
    errors.thumbnailImageKey = "有効な画像URLを入力してください。(.jpg/.pngなど)";
  }
  return errors;
}

export const categoryValidate = (value: FormErrorsCategoryType) => {
  const errors: FormErrorsCategoryType = {};

  console.log("validate 結果：", errors);
  if(!value.name) errors.name = "カテゴリーを入力してください。";
  return errors;
}
