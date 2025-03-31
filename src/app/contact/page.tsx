'use client';

import { useState } from "react";
import { API_BASE_URL } from "@/app/_Constants";

type ContactType={
  username:string;
  email:string;
  message:string;
}

type FormErrorsType = {
  username?: string;
  email?: string;
  message?: string;
};

const Contact= () =>{
  const initialFormState = {username:"", email:"" ,message:""};
  const [formValues, setFormValues] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<FormErrorsType>({});
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const options ={
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body:JSON.stringify({
      username:formValues.username,
      email: formValues.email,
      message: formValues.message,
    }),
  };


  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement| HTMLInputElement>) =>{
    const {name, value} =e.target;
    setFormValues({ ...formValues, [name]:value});
  };

  const resetForm = () =>{
    setFormValues(initialFormState);
    setFormErrors({});
  }


  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // バリデーションチェックを行い、エラーを取得
    const errors = validate(formValues);
    setFormErrors(errors);
    setIsSubmit(true);
    // エラーがなければ送信する
    if (Object.keys(errors).length === 0) {

      try{
        const response = await fetch(`${API_BASE_URL}/contacts`, options);

        if(!response.ok){
          throw new Error("送信に失敗しました。")
        };

        const data = await response.json();
        alert("送信が完了しました。");
        resetForm();
        return(data);

      } catch (e: unknown) {
        if (e instanceof Error) {
          alert(e.message || "エラーが発生しました。");
        } else {
          alert("エラーが発生しました。");
        }
        return e;
    }

    }
  };

  const validate =(values:ContactType) =>{
    const errors: ContactType = {
      username: "",
      email: "",
      message: ""
    };
    const regex =
    /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
    if (!values.username) {
      errors.username = "お名前は必須です。";
    } else if (values.username.length > 30) {
      errors.username = "お名前は30文字以内で入力してください。";
    }
    if (!values.email) {
      errors.email = "メールアドレスは必須です。";
    } else if (!regex.test(values.email)) {
      errors.email = "メールアドレスの形式が正しくありません。";
    }
    if (!values.message) {
      errors.message = "本文は必須です。";
    } else if (values.message.length > 500) {
      errors.message = "本文は500文字以内で入力してください。";
    }
    return errors;
  }


  return (
    <>
      <div>
        <div className="container mx-auto my-12 p-4">
          <form onSubmit={handleSubmit}>
            <h1 className="font-bold text-xl mb-10">問合わせフォーム</h1>
            <div className="flex justify-between items-center mb-6 ">
              <label className="text-black text-base w-[240px]">お名前</label>
              <div className="w-3/4">
                <input
                  type="text"
                  id="name"
                  name="username"
                  className="border border-gray-300 rounded-lg p-4 w-full"
                  value={formValues.username}
                  onChange={handleChange}
                />
                <p className="text-red-700 text-xs">{formErrors.username}</p>
              </div>
            </div>
            <div className="flex justify-between items-center mb-6 ">
              <label className="text-black text-base w-[240px]">メールアドレス</label>
              <div className="w-3/4">
                <input
                  id="email"
                  name="email"
                  type="text"
                  className="border border-gray-300 rounded-lg p-4 w-full"
                  value={formValues.email}
                  onChange={handleChange}
                />
                <p className="text-red-700 text-xs">{formErrors.email}</p>
              </div>
            </div>
            <div className="flex justify-between items-center mb-6 ">
              <label className="text-black text-base w-[240px]">本文</label>
              <div className="w-3/4">
                <textarea
                  id="message"
                  name="message"
                  className="border border-gray-300 rounded-lg p-4 w-full h-60"
                  value={formValues.message}
                  onChange={handleChange}
                />
                <p className="text-red-700 text-xs">{formErrors.message}</p>
              </div>
            </div>
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                type="submit"
                className="text-base bg-gray-800 px-4 py-2 text-white font-bold rounded-lg"
              >
                送信
              </button>
              <button
                type="button"
                className="text-base bg-gray-200 px-4 py-2 text-black font-bold rounded-lg"
                onClick={resetForm}
              >
                クリア
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );

}

export default Contact;