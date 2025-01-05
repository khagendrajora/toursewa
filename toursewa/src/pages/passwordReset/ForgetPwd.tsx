/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { URL } from "../../config/Config";
import { Link } from "react-router-dom";

export const ForgetPwd = () => {
  const [inputs, setInputs] = useState({
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${URL}/api/forgetpwd`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };
  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="flex mt-5 gap-5 md:gap-10 xl:gap-32 ">
        <div className="w-2/3 hidden md:block z-10  relative ">
          <div
            className=" min-h-72 inset-0  bg-contain bg-center"
            style={{
              backgroundImage: `url('/loginPic.jpg')`,
              opacity: "70%",
              backgroundColor: "rgba(244, 134, 111 )",
              backgroundBlendMode: "overlay",
              backgroundSize: "cover",
              minHeight: "450px",
            }}
          ></div>
          <img src="/logo.png" className="absolute top-0 left-5 w-1/3" />
          <p className="absolute w-11/12 bottom-[80px] text-center left-1/2 transform -translate-x-1/2 text-xl  font-normal text-white">
            Welcome back!
            <br />
            We are glad to see you again!
          </p>
        </div>
        <div className="flex flex-col w-full gap-10 md:gap-7 mt-10 lg:gap-12 ">
          <div className="flex  items-center gap-3 flex-col">
            <h1 className="font-bold text-2xl">Forgot Password?</h1>
            <p className="text-xs">Reset Your Password Easily</p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col items-center lg:gap-y-4 gap-2"
          >
            <div className="w-3/4 max-w-96 space-y-2">
              <label className="font-semibold">Email</label>
              <input
                type="email"
                placeholder="Email"
                className="border border-slate-700 rounded-lg  p-2 lg:p-3 w-full "
                required
                value={inputs.email}
                onChange={(e) =>
                  setInputs({ ...inputs, email: e.target.value })
                }
              />
            </div>
            <div className="flex w-3/4 max-w-96 justify-end">
              <div className="flex gap-1">
                <Link
                  to="/login"
                  className="text-button hover:text-[#06243C] text-end"
                >
                  Back to login
                </Link>
              </div>
            </div>

            <div className="w-3/4 max-w-96">
              <button className="bg-button hover:bg-[#06243C] text-white p-2 rounded-lg w-full">
                Send Reset Link
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
