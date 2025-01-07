/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast, ToastContainer } from "react-toastify";
import { IMAGE_URL, URL } from "../../config/Config";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { newPassword } from "../../validation/FormValidations";
import { useAuthContext } from "../../context/AuthContext";
import { ButtonLoader } from "../../utils/ButtonLoader";
import { IUser } from "../../SharedTypes/User/userModel";
import { UpdateClientProfile } from "./UpdateClientProfile";

export const ClientProfile = () => {
  const [activeButton, setActiveButton] = useState<string>("profiledetails");
  const [isbutton, setIsButton] = useState(false);
  const { setAuthUser, authUser } = useAuthContext();
  const [profile, setProfile] = useState<IUser | null>(null);
  const [editProfile, setEditProfile] = useState<IUser | null>(null);

  const id = authUser?.clientId;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${URL}/api/getusersbyid/${id}`);
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          setProfile(data);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchProfile();
  }, [id]);
  console.log(profile);
  const formik = useFormik({
    initialValues: {
      userPwd: "",
      newPwd: "",
    },
    validationSchema: newPassword,
    onSubmit: async (values, { resetForm }) => {
      setIsButton(true);
      try {
        const res = await fetch(`${URL}/api/changepwd/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        const newData = await res.json();
        if (!res.ok) {
          toast.error(newData.error);
        } else {
          toast.success(newData.message);
          setTimeout(() => {
            setAuthUser(null);
            localStorage.removeItem("authUser");
          }, 3000);
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
      {editProfile ? (
        <div className="w-full text-center mb-10 ">
          <UpdateClientProfile client={editProfile} />
          <button
            className=" p-1 rounded-lg text-blue-500  "
            onClick={() => {
              setEditProfile(null);
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-center p-14  gap-x-8 w-11/12">
            <div
              className="font-semibold cursor-pointer"
              onClick={() => {
                setActiveButton("profiledetails");
              }}
            >
              Profile Details{" "}
              <div
                className={`${
                  activeButton == "profiledetails"
                    ? "h-[2px] w-30 bg-blue-700 translate-x-0"
                    : "-translate-x-full"
                } transition-all duration-500 ease-in-out`}
              ></div>
            </div>
            <div
              className="font-semibold cursor-pointer"
              onClick={() => {
                setActiveButton("chandepwd");
              }}
            >
              Change Password{" "}
              <div
                className={`${
                  activeButton == "chandepwd"
                    ? "h-[2px] w-30 bg-blue-700 translate-x-0"
                    : "-translate-x-full"
                } transition-all duration-500 ease-in-out`}
              ></div>
            </div>
          </div>

          <div className="justify-center mt-5 mb-16 p-5 w-11/12 flex">
            {activeButton === "profiledetails" ? (
              <div className="flex flex-wrap md:gap-10 gap-5">
                <div className="">
                  <div className="border shadow  rounded-lg appearance-none p-2 md:w-96">
                    {profile?.userName}
                  </div>
                </div>

                <div>
                  <div className="border  rounded-lg appearance-none p-2 md:w-96">
                    {profile?.userEmail}
                  </div>
                </div>

                <div>
                  <div>
                    <img
                      src={`${IMAGE_URL}/${profile?.userImage}`}
                      className=""
                    />
                  </div>
                </div>
                <div className=" ">
                  <button
                    className="bg-lime-600  p-2 text-lg rounded-sm"
                    onClick={() => {
                      setEditProfile(profile);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mt-10 w-11/12 flex justify-center">
                  <form
                    onSubmit={formik.handleSubmit}
                    className="flex flex-wrap md:gap-10 gap-5"
                  >
                    <div className="">
                      <input
                        type="password"
                        name="userPwd"
                        placeholder="Old Password"
                        className="border shadow rounded-lg appearance-none p-2 md:w-96"
                        value={formik.values.userPwd}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.userPwd && formik.errors.userPwd && (
                        <div className="text-red-500">
                          {formik.errors.userPwd}
                        </div>
                      )}
                    </div>

                    <div>
                      <input
                        type="password"
                        name="newPwd"
                        placeholder="New Password"
                        className="border shadow rounded-lg appearance-none p-2 md:w-96"
                        value={formik.values.newPwd}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.newPwd && formik.errors.newPwd && (
                        <div className="text-red-500">
                          {formik.errors.newPwd}
                        </div>
                      )}
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white p-3 rounded-xl w-full gap-1  hover:bg-blue-800"
                      >
                        Save
                        {isbutton ? <ButtonLoader /> : ""}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};
