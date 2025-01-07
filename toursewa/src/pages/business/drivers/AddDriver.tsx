/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast, ToastContainer } from "react-toastify";
import { ButtonLoader } from "../../../utils/ButtonLoader";
import { useFormik } from "formik";
import { useAuthContext } from "../../../context/AuthContext";
import { driverData } from "../../../validation/FormValidations";
import { URL } from "../../../config/Config";
import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
import { IVeh } from "../../../.../../SharedTypes/Product/vehicle";
import { useNavigate, useParams } from "react-router-dom";

export const AddDriver = () => {
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id;
  const { authUser } = useAuthContext();
  const [isButton, setIsButton] = useState(false);
  const [vehicle, setVehicle] = useState<IVeh[] | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`${URL}/api/getvehicle/${authUser?.bId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.error);
        } else {
          setVehicle(data);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchVehicle();
  }, []);

  const formik = useFormik({
    initialValues: {
      businessId: authUser?.bId || "",
      driverName: "",
      driverAge: "",
      driverPhone: "",
      driverEmail: "",
      vehicleId: "",
      driverImage: null,
      driverPwd: "",
    },
    validationSchema: driverData,
    onSubmit: async (values, { resetForm }) => {
      setIsButton(true);
      const formData = new FormData();
      formData.append("driverName", values.driverName);
      formData.append("driverAge", values.driverAge);
      formData.append("driverPhone", values.driverPhone);
      formData.append("driverEmail", values.driverEmail);
      formData.append("vehicleId", values.vehicleId);
      formData.append("driverPwd", values.driverPwd);
      formData.append("businessId", values.businessId);
      if (values.driverImage) {
        formData.append("driverImage", values.driverImage);
      }
      try {
        const res = await fetch(`${URL}/api/adddriver`, {
          method: "POST",

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
        setIsButton(false);
      }
    },
  });

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      formik.setFieldValue("driverImage", event.target.files[0]);
    }
  };

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="flex">
        <div className="w-full">
          <div className="flex flex-col">
            <div className="flex justify-between">
              <div className="text-black flex flex-col gap-1 ">
                <h1 className="font-bold text-xl lg:text-2xl">Add Driver</h1>
                <p>Add a Driver on Toursewa</p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="bg-button p-1 px-2 h-fit min-w-[85px] text-center max-w-[120px] text-xs hover:bg-[#06243C] text-white  rounded-md md:text-lg"
              >
                Back to List
              </button>
            </div>
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-wrap justify-center mt-10 md:mt-14 text-sm  gap-x-12 w-full gap-y-5"
            >
              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Vehicle</label>
                <select
                  name="vehicleId"
                  className="border border-gray-600 rounded-md ps-1 text-xs lg:text-lg cursor-pointer min-h-8 lg:min-h-10 shadow appearance-none"
                  value={id || formik.values.vehicleId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="" disabled>
                    Choose Vehicle
                  </option>
                  {vehicle?.map((data, i) => (
                    <option key={i} value={data.vehId}>
                      {data.name}
                    </option>
                  ))}
                </select>
                {formik.touched.vehicleId && formik.errors.vehicleId && (
                  <div className="text-red-500">{formik.errors.vehicleId}</div>
                )}
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Driver`s Name</label>
                <input
                  type="text"
                  name="driverName"
                  placeholder="Driver`s Name"
                  className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                  value={formik.values.driverName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.driverName && formik.errors.driverName && (
                  <div className="text-red-500">{formik.errors.driverName}</div>
                )}
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Email</label>
                <input
                  type="email"
                  name="driverEmail"
                  placeholder="Email"
                  className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                  value={formik.values.driverEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.driverEmail && formik.errors.driverEmail && (
                  <div className="text-red-500">
                    {formik.errors.driverEmail}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Phone Number</label>
                <input
                  type="number"
                  name="driverPhone"
                  placeholder="Phone Number"
                  className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                  value={formik.values.driverPhone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.driverPhone && formik.errors.driverPhone && (
                  <div className="text-red-500">
                    {formik.errors.driverPhone}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Age</label>
                <input
                  type="number"
                  name="driverAge"
                  placeholder="Age"
                  className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                  value={formik.values.driverAge}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.driverAge && formik.errors.driverAge && (
                  <div className="text-red-500">{formik.errors.driverAge}</div>
                )}
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Password</label>
                <input
                  type="password"
                  name="driverPwd"
                  placeholder="********"
                  className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                  value={formik.values.driverPwd}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.driverPwd && formik.errors.driverPwd && (
                  <div className="text-red-500">{formik.errors.driverPwd}</div>
                )}
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Image</label>
                <input
                  type="file"
                  name="userImage"
                  className="border border-gray-600 rounded-md cursor-pointer p-2 text-xs lg:text-lg shadow appearance-none"
                  onChange={handleImageChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.driverImage && formik.errors.driverImage && (
                  <div className="text-red-500">
                    {formik.errors.driverImage}
                  </div>
                )}
              </div>

              <div className="flex justify-center w-full ">
                <button
                  type="submit"
                  className="rounded-lg p-3 w-3/4 md:w-1/3 text-sm text-white bg-button hover:bg-orange-700 md:text-xl"
                >
                  Add Driver {isButton ? <ButtonLoader /> : ""}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
