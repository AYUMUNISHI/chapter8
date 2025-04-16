import { useState } from 'react';
import { FormErrorsPostsType, FormErrorsCategoryType } from '../_types/AdminType';

export const UsePostForm = (initialFormState: any) => {
  const [formValues, setFormValues] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<FormErrorsPostsType>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    // selectタグの場合だけmultipleとselectedOptionsを使う
    if (e.target instanceof HTMLSelectElement && e.target.multiple) {
      const values = Array.from(e.target.selectedOptions).map((option) => Number(option.value));
      setFormValues({ ...formValues, [name]: values }); // ←配列のまま
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  return {
    formValues,
    setFormValues,
    formErrors,
    setFormErrors,
    handleChange,
  };
};


export const UseCategoryForm = (initialFormState: any) => {
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