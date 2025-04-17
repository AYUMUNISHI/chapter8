'use client';

import React from "react";

 export const postsCategory: React.FC<{ categories: { id: number; name: string }[] }> = ({ categories }) => {
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





