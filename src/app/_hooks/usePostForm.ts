import { useState } from 'react';
import { FormErrorsPostsType, createPostRequestBody } from '../_types/AdminType';

export const usePostForm = (initialFormState: any) => {
  const [formValues, setFormValues] = useState<createPostRequestBody>(initialFormState);
  const [formErrors, setFormErrors] = useState<FormErrorsPostsType>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  return {
    formValues,
    setFormValues,
    formErrors,
    setFormErrors,
    handleChange,
  };
};


