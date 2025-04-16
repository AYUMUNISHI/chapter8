'use client';
import { FormErrorsPostsType, FormErrorsCategoryType } from "@/app/_types/AdminType";
import React from "react";


export const PostsValidate = (values: FormErrorsPostsType) => {
  const errors: FormErrorsPostsType = {};

  console.log("validate 結果:", errors); // ここ重要！！
  if (!values.title) {
    errors.title = "タイトルを入力してください";
  }
  if (!values.content) {
    errors.content = "内容は必須です。";
  }
  if (!values.thumbnail) {
    errors.thumbnail = "サムネイル画像URLは必須です。";
  } else if (
    !/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp|svg)$/i.test(values.thumbnail)
  ) {
    errors.thumbnail = "有効な画像URLを入力してください。(.jpg/.pngなど)";
  }
  return errors;
}

export const CategoryValidate = (value: FormErrorsCategoryType) => {
  const errors: FormErrorsCategoryType = {};

  console.log("validate 結果：", errors);
  if(!value.name) errors.name = "カテゴリーを入力してください。";
  return errors;
}
