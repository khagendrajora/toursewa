/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormik } from "formik";
import { clientSignup } from "../../validation/FormValidations";
import { URL } from "../../config/Config";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { ButtonLoader } from "../../utils/ButtonLoader";

export const RegisterUser = () => {
  const [isButton, setIsButton] = useState(false);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      userName: "",
      userEmail: "",
      userPwd: "",
      cPwd: "",
    },
    validationSchema: clientSignup,
    onSubmit: async (values, { resetForm }) => {
      setIsButton(true);

      try {
        const res = await fetch(`${URL}/api/adduser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          toast.success(data.message);
          setTimeout(() => {
            navigate("/login");
          }, 2000);
          resetForm();
        }
      } catch (error: any) {
        toast.error(error);
      } finally {
        setIsButton(false);
      }
    },
  });

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="flex mt-5 gap-5  md:gap-10 xl:gap-32">
        <div className="w-2/3  hidden md:block z-10  relative ">
          {/* <img src="/public/loginPic.jpg" className="max-h-screen w-full" /> */}
          <div
            className="absolute inset-0 bg-contain bg-center"
            style={{
              backgroundImage: `url('/loginPic.jpg')`,
              opacity: "70%",
              backgroundColor: "rgba(244, 134, 111 )",
              backgroundBlendMode: "overlay",
              backgroundSize: "cover",
            }}
          ></div>
          <img src="/logo.png" className="absolute top-3 left-5 w-1/3" />
          <p className="absolute w-11/12 bottom-[80px] text-center left-1/2 transform -translate-x-1/2 text-xl  font-normal text-white">
            Welcome back!
            <br />
            We are glad to see you!
          </p>
        </div>

        <div className="flex flex-col w-full gap-10 md:gap-7 mt-10 lg:gap-12 ">
          <div className="flex  items-center gap-3 flex-col">
            <h1 className="font-bold text-3xl">Sign Up</h1>
            <p className="">Create your Account</p>
          </div>
          <form
            onSubmit={formik.handleSubmit}
            className="flex w-full flex-col items-center lg:gap-y-4 gap-5"
          >
            <div className="w-3/4 max-w-96 space-y-2">
              <label className="font-semibold ">Name</label>
              <input
                type="text"
                name="userName"
                placeholder="Full Name"
                className="border border-slate-700 rounded-lg p-2  w-full "
                value={formik.values.userName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.userName && formik.errors.userName && (
                <div className="text-red-500">{formik.errors.userName}</div>
              )}
            </div>

            <div className="w-3/4 max-w-96 space-y-2">
              <label className="font-semibold ">Email</label>
              <input
                type="email"
                name="userEmail"
                placeholder="Email"
                className="border border-slate-700  rounded-lg p-2  w-full "
                value={formik.values.userEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.userEmail && formik.errors.userEmail && (
                <div className="text-red-500">{formik.errors.userEmail}</div>
              )}
            </div>
            <div className="w-3/4 max-w-96 space-y-2">
              <label className="font-semibold ">Password</label>
              <input
                type="password"
                name="userPwd"
                placeholder="Password"
                className="border border-slate-700 rounded-lg p-2  w-full "
                value={formik.values.userPwd}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.userPwd && formik.errors.userPwd && (
                <div className="text-red-500">{formik.errors.userPwd}</div>
              )}
            </div>
            <div className="w-3/4 max-w-96 space-y-2">
              <label className="font-semibold ">Confirm Password</label>
              <input
                type="password"
                name="cPwd"
                value={formik.values.cPwd.trim()}
                placeholder="Confirm Password"
                className="border border-slate-700 rounded-lg p-2 w-full "
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.cPwd && formik.errors.cPwd && (
                <div className="text-red-500">{formik.errors.cPwd}</div>
              )}
            </div>

            <div className="w-3/4 mt-10 md:mt-5 flex flex-col max-w-96 gap-4">
              <button
                type="submit"
                className="bg-button  hover:bg-[#06243C]  text-white p-2 rounded-lg w-full"
              >
                Register {isButton ? <ButtonLoader /> : ""}
              </button>
              <p className="text-sm">
                Already have an Account ?{" "}
                <Link
                  to="/login"
                  className="text-button text-[20px] hover:text-[#06243C]"
                >
                  Login
                </Link>
              </p>
              <p className="text-center w-full">OR</p>
              <Link
                to="/addbusiness"
                className="text-button text-center text-[20px] hover:text-[#06243C] mb-10"
              >
                Register New Business
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
