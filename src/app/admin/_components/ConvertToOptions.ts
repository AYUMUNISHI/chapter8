

import { categoriesType, categoryOption } from "@/app/_types/AdminType";


export const convertToOptions = (categories: categoriesType[]): categoryOption[] => {
  return categories.map((category) => ({
    value: category.id, // または category.name にすることも可能
    label: category.name,
  }));
}