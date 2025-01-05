/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormik } from "formik";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { URL } from "../../config/Config";
import { useAuthContext } from "../../context/AuthContext";
import { ButtonLoader } from "../../utils/ButtonLoader";

export const Login = () => {
  const { setAuthUser, authUser } = useAuthContext();
  const [isButton, setIsButton] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      Pwd: "",
    },
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setIsButton(true);
      try {
        const res = await fetch(`${URL}/api/login`, {
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
          setAuthUser(data);

          resetForm();
        }
      } catch (error: any) {
        toast.error(error);
      } finally {
        setIsButton(false);
      }
    },
  });

  console.log(authUser);
  return (
    <>
      <ToastContainer theme="colored" position="top-center" />
      <div className="flex mt-5 gap-5 md:gap-10 xl:gap-32 ">
        <div className="w-2/3 hidden md:block z-10  relative ">
          <div
            className="absolute inset-0 bg-contain bg-center"
            style={{
              backgroundImage: `url('/loginPic.jpg')`,
              opacity: "70%",
              backgroundColor: "rgba(244, 134, 111 )",
              backgroundBlendMode: "overlay",
              backgroundSize: "cover",
              // height: "100vh",
            }}
          ></div>
          <img src="/logo.png" className="absolute  top-3 left-5 w-1/3" />
          <p className="absolute w-11/12 bottom-[80px] text-center left-1/2 transform -translate-x-1/2 text-xl  font-normal text-white">
            Welcome back!
            <br />
            We are glad to see you again!
          </p>
        </div>

        <div className="flex flex-col w-full gap-10 md:gap-7 mt-10 lg:gap-12">
          <div className="flex  items-center gap-3 flex-col">
            <h1 className="font-bold text-3xl">Login</h1>
            <p className="">Log into your Account</p>
          </div>
          <form
            onSubmit={formik.handleSubmit}
            className="flex w-full flex-col items-center lg:gap-y-4 mb-10 gap-5"
          >
            <div className="w-3/4 max-w-96 space-y-2">
              <label className="font-semibold">Email</label>
              <input
                type="text"
                name="email"
                className="border border-slate-700 rounded-lg  p-2 lg:p-3 w-full "
                placeholder="Email"
                value={formik.values.email.trim().toLowerCase()}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500">{formik.errors.email}</div>
              )}
            </div>
            <div className="w-3/4 max-w-96 space-y-2">
              <label className="font-semibold">Password</label>
              <input
                type="password"
                name="Pwd"
                value={formik.values.Pwd.trim()}
                placeholder="Password"
                className="border border-slate-700 rounded-lg p-2 lg:p-3 w-full "
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.Pwd && formik.errors.Pwd && (
                <div className="text-red-500">{formik.errors.Pwd}</div>
              )}
            </div>

            <div className="flex w-3/4 max-w-96 justify-end">
              <Link
                to="/forgetpwd"
                className="text-button hover:text-[#06243C] text-end"
              >
                Forgot Password?
              </Link>
            </div>
            <div className=" flex flex-col w-3/4 gap-4 max-w-96">
              <button
                type="submit"
                className="bg-button  hover:bg-[#06243C]  text-white p-2 rounded-lg w-full"
              >
                Login{isButton ? <ButtonLoader /> : ""}
              </button>
              <p className="text-center">OR</p>
              <Link
                to="/addclient"
                className="text-button hover:text-[#06243C] text-center"
              >
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
