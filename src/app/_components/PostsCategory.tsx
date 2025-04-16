'use client';

import React from "react";
import Select from 'react-select';
import { CategoryOption } from "../_types/AdminType";

 export const PostsCategory: React.FC<{ categories: { id: number; name: string }[] }> = ({ categories }) => {
  return (
    <>
      {categories.map((category) => (
        <option
          key={category.id}
          value={category.id}
        >
          {category.name}
        </option>
      ))}
    </>
  )
}


type Category = { id: number; name: string };


export const ConvertToOptions = (categories: Category[]): CategoryOption[] => {
  return categories.map((category) => ({
    value: category.id, // または category.name にすることも可能
    label: category.name,
  }));
};