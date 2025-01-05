/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { BCategory } from "../../../../backend/src/models/Category/businessCategory";
import { useFormik } from "formik";
import { businessSignup } from "../../validation/FormValidations";
import { URL } from "../../config/Config";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useAuthContext } from "../../context/AuthContext";
import { IState } from "../../../../backend/src/models/Locations/state";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export const RegisterBusiness = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<BCategory[]>();
  const { authUser } = useAuthContext();
  const [location, setLocation] = useState<IState[]>([]);

  const isLargeScreen = window.innerWidth >= 1024;
  const dynamicInputStyle = {
    width: "100%",
    minHeight: isLargeScreen ? "2.9rem" : "2.1rem",
    border: "1px solid #4B5563",
    borderRadius: "0.375rem",
    fontSize: "1rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${URL}/api/getstate`);
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          setLocation(data);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`${URL}/api/getbusinesscategory`);
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          setCategory(data);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchCategory();
  }, []);

  const formik = useFormik({
    initialValues: {
      businessName: "",
      businessCategory: "",
      businessRegistration: {
        registrationNumber: "",
      },
      businessAddress: {
        country: "",
        state: "",
      },
      primaryEmail: "",
      primaryPhone: "",
      businessPwd: "",
    },
    validationSchema: businessSignup,
    onSubmit: async (values, { resetForm }) => {
      try {
        const endPoint = authUser?.adminEmail
          ? "addbusinessbyadmin"
          : "addbusiness";
        const res = await fetch(`${URL}/api/${endPoint}`, {
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
          resetForm();
          setTimeout(() => {
            navigate(-1);
          }, 2000);
        }
      } catch (error: any) {
        toast.error(error);
      }
    },
  });

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="flex mt-10">
        <div className="w-full">
          <div className="flex flex-col items-center">
            <div className="text-black flex flex-col gap-1 ">
              <h1 className="font-bold text-xl lg:text-2xl">
                Business Register
              </h1>
              <p>Add a Business on Toursewa</p>
            </div>
            <div className=" w-2/3 justify-start items-start mt-10">
              <FontAwesomeIcon
                onClick={() => navigate(-1)}
                icon={faArrowLeft}
                size="xl"
                className="text-gray-400 cursor-pointer"
                title="Back"
              />
            </div>
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-wrap justify-center  mt-10 md:mt-14 text-sm gap-y-5 gap-x-12"
            >
              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  placeholder="Business Name"
                  className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                  value={formik.values.businessName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.businessName && formik.errors.businessName && (
                  <div className="text-red-500">
                    {formik.errors.businessName}
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Business Category</label>
                <select
                  name="businessCategory"
                  className="border border-gray-600 rounded-md ps-1 text-xs lg:text-lg cursor-pointer min-h-8 lg:min-h-10 shadow appearance-none"
                  value={formik.values.businessCategory}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="" disabled>
                    Choose Business Category
                  </option>
                  {category &&
                    category.map((cat, i) => (
                      <option key={i} value={cat.categoryName}>
                        {cat.categoryName}
                      </option>
                    ))}
                </select>
                {formik.touched.businessCategory &&
                  formik.errors.businessCategory && (
                    <div className="text-red-500">
                      {formik.errors.businessCategory}
                    </div>
                  )}
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Tax Registration</label>
                <input
                  type="text"
                  name="businessRegistration[registrationNumber]"
                  placeholder="Tax Registration"
                  className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                  value={formik.values.businessRegistration.registrationNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.businessRegistration?.registrationNumber &&
                  formik.errors.businessRegistration?.registrationNumber && (
                    <div className="text-red-500">
                      {formik.errors.businessRegistration.registrationNumber}
                    </div>
                  )}
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Business Email</label>
                <input
                  type="email"
                  name="primaryEmail"
                  placeholder="example@gmail.com"
                  className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                  value={formik.values.primaryEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.primaryEmail && formik.errors.primaryEmail && (
                  <div className="text-red-500">
                    {formik.errors.primaryEmail}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Phone Number</label>
                <PhoneInput
                  country={"np"}
                  placeholder="Phone number"
                  onChange={(value: any) => {
                    const cleanedValue = value.replace(/\s+/g, "");
                    formik.setFieldValue("primaryPhone", cleanedValue);
                  }}
                  onBlur={() => formik.setFieldTouched("primaryPhone", true)}
                  inputClass="phone-input"
                  inputStyle={dynamicInputStyle}
                />
                {formik.touched.primaryPhone && formik.errors.primaryPhone && (
                  <div className="text-red-500">
                    {formik.errors.primaryPhone}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Address (Country)</label>
                <select
                  name="businessAddress[country]"
                  className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                  value={formik.values.businessAddress.country}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="" disabled>
                    Choose Country
                  </option>
                  <option value="Nepal">Nepal</option>
                </select>
                {formik.touched.businessAddress?.country &&
                  formik.errors.businessAddress?.country && (
                    <div className="text-red-500">
                      {formik.errors.businessAddress.country}
                    </div>
                  )}
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Address (State)</label>
                <select
                  name="businessAddress[state]"
                  className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                  value={formik.values.businessAddress.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="" disabled>
                    Choose State
                  </option>
                  {location &&
                    location.map((l) => (
                      <option value={l.state}>{l.state}</option>
                    ))}
                </select>
                {formik.touched.businessAddress?.state &&
                  formik.errors.businessAddress?.state && (
                    <div className="text-red-500">
                      {formik.errors.businessAddress.state}
                    </div>
                  )}
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Login Password</label>
                <input
                  type="password"
                  name="businessPwd"
                  placeholder="********"
                  className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                  value={formik.values.businessPwd}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.businessPwd && formik.errors.businessPwd && (
                  <div className="text-red-500">
                    {formik.errors.businessPwd}
                  </div>
                )}
              </div>

              <div className="flex w-full  mt-10 justify-center">
                <button
                  type="submit"
                  className="rounded-lg p-3 md:w-1/3 w-3/4 text-sm text-white bg-button hover:bg-[#06243C]  md:text-xl"
                >
                  Register
                </button>
              </div>
              {/* <div className="flex">
                <div className="flex gap-1">
                  <button className="text-gray-500">Back</button>
                </div>
              </div> */}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
