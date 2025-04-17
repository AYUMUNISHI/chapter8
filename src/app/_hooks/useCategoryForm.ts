import { useState } from "react";
import { FormErrorsCategoryType } from "../_types/AdminType";


export const useCategoryForm = (initialFormState: any) => {
  const [formValues, setFormValues] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<FormErrorsCategoryType>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return {
    formValues,
    setFormValues,
    formErrors,
    setFormErrors,
    handleChange,
  };
};