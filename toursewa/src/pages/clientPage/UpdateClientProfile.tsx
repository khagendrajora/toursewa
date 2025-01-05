/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormik } from "formik";
import { useState } from "react";
import * as React from "react";
import { toast, ToastContainer } from "react-toastify";
import { IUser } from "../../../../backend/src/models/User/userModel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faXmark } from "@fortawesome/free-solid-svg-icons";
import { IMAGE_URL, URL } from "../../config/Config";
interface UserProps {
  client: IUser;
}
export const UpdateClientProfile: React.FC<UserProps> = ({ client }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [existingUserImage, setExistingUserImage] = useState<string | null>(
    client.userImage || null
  );

  const formik = useFormik({
    initialValues: {
      userName: client.userName,
      userEmail: client.userEmail,
      userImage: null,
    },
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("userName", values.userName);
      formData.append("userEmail", values.userEmail);

      if (values.userImage) {
        formData.append("userImage", values.userImage);
      } else if (existingUserImage) {
        formData.append("userImage", existingUserImage);
      }
      try {
        const res = await fetch(`${URL}/api/updateclient/${client._id}`, {
          method: "PUT",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          toast.success(data.message);
          resetForm();
        }
      } catch (error: any) {
        toast.error(error);
      } finally {
        setIsLoading(false);
        console.log(formData);
      }
    },
  });

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      formik.setFieldValue("userImage", event.target.files[0]);
    }
  };
  const removeImage = (isExisting: boolean) => {
    if (isExisting) {
      setExistingUserImage(null);
      formik.setFieldValue("userImage", null);
    }
  };
  console.log(existingUserImage);
  return (
    <>
      <ToastContainer theme="colored" position="top-right" />

      <div className="flex flex-col items-center mt-20 ">
        <div className="flex">
          <div className="font-semibold">Update Profile Details</div>
        </div>

        <div className="mt-10 w-11/12 flex flex-col items-center">
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-wrap flex-col md:gap-10 gap-5"
          >
            <div className="">
              <input
                type="text"
                name="userName"
                placeholder="User Name"
                className="border shadow rounded-lg appearance-none p-2 md:w-96"
                value={formik.values.userName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.userName && formik.errors.userName && (
                <div className="text-red-500">{formik.errors.userName}</div>
              )}
            </div>

            <div>
              <input
                type="email"
                name="userEmail"
                placeholder="Email"
                className="border shadow rounded-lg appearance-none p-2 md:w-96"
                value={formik.values.userEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.userEmail && formik.errors.userEmail && (
                <div className="text-red-500">{formik.errors.userEmail}</div>
              )}
            </div>

            <div>
              <input
                type="file"
                name="userImage"
                className=""
                onChange={handleImageChange}
                onBlur={formik.handleBlur}
              />
              {existingUserImage && (
                <div>
                  <FontAwesomeIcon
                    icon={faXmark}
                    onClick={() => removeImage(true)}
                    className="cursor-pointer hover:scale-110"
                  />
                  <img
                    src={`${IMAGE_URL}/${existingUserImage}`}
                    className="w-1/4"
                  />
                </div>
              )}
              {formik.touched.userImage && formik.errors.userImage && (
                <div className="text-red-500">{formik.errors.userImage}</div>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="bg-blue-600 text-white p-3 rounded-xl w-1/2 gap-1  hover:bg-blue-800"
              >
                Save
                {isLoading ? (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    size="xl"
                    style={{ color: "#04fa00" }}
                  />
                ) : (
                  ""
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
