/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { ButtonLoader } from "../../utils/ButtonLoader";
import { useFormik } from "formik";
import { URL } from "../../config/Config";
import { toast } from "react-toastify";
import { useAuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();
  const [isButton, setIsButton] = useState(false);
  const formik = useFormik({
    initialValues: {
      adminEmail: "",
      adminPwd: "",
    },
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setIsButton(true);
      try {
        const res = await fetch(`${URL}/api/adminlogin`, {
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
          // toast.success(data.message);
          setAuthUser(data);
          setTimeout(() => {
            navigate("/admin/admdashboard");
          }, 1000);

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
      <div className="flex flex-col items-center justify-center min-h-screen ">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-y-5">
          <div>
            <input
              type="text"
              name="adminEmail"
              className="border shadow rounded-lg appearance-none p-2 md:w-96"
              placeholder="Admin Email"
              value={formik.values.adminEmail}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.adminEmail && formik.errors.adminEmail && (
              <div className="text-red-500">{formik.errors.adminEmail}</div>
            )}
          </div>
          <div>
            <input
              type="password"
              name="adminPwd"
              value={formik.values.adminPwd}
              placeholder="Password"
              className="border shadow rounded-lg appearance-none p-2 md:w-96"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.adminPwd && formik.errors.adminPwd && (
              <div className="text-red-500">{formik.errors.adminPwd}</div>
            )}
          </div>

          <Link to="/forgetpwd" className="text-blue-500 text-end">
            Reset Password?
          </Link>

          <div>
            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded-xl w-full"
            >
              Login {isButton ? <ButtonLoader /> : ""}
            </button>
          </div>
          {/* <div className="flex gap-3 items-center">
          <p>Login with:</p>
          <img
            width="35"
            height="35"
            className="bg-white shadow-lg p-1 cursor-pointer"
            src="https://img.icons8.com/fluency/48/google-logo.png"
            alt="google-logo"
          />
        </div> */}
        </form>
      </div>
    </>
  );
};
