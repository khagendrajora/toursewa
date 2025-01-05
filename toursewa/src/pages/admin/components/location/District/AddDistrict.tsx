import { useEffect, useState } from "react";
import { IDistrict } from "../../../../../../../backend/src/models/Locations/Districts";
import { IState } from "../../../../../../../backend/src/models/Locations/state";
import { useNavigate } from "react-router-dom";
import { URL } from "../../../../../config/Config";
import { toast, ToastContainer } from "react-toastify";
// import { ICountry } from "../../../../../../../backend/src/models/Locations/country";
import { useFormik } from "formik";
import { districtData } from "../../../../../validation/FormValidations";

export const AddDistrict = () => {
  // const [country, setCountry] = useState<ICountry[]>([]);
  const [district, setDistrict] = useState<IDistrict[]>([]);
  const [state, setState] = useState<IState[]>([]);
  const [filterDistrict, setFilterDistrict] = useState<IDistrict[]>([]);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchLocations = async () => {
  //     try {
  //       const res = await fetch(`${URL}/api/getcountry`);
  //       const data = await res.json();
  //       if (!res.ok) {
  //         console.error(data.error);
  //       } else {
  //         setCountry(data);
  //       }
  //     } catch (error: any) {
  //       toast.error(error);
  //     }
  //   };
  //   fetchLocations();
  // }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${URL}/api/getstate`);
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          setState(data);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${URL}/api/getdistrict`);
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          setDistrict(data);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchLocations();
  }, []);

  const formik = useFormik({
    initialValues: {
      state: "",
      district: "",
    },
    validationSchema: districtData,
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await fetch(`${URL}/api/adddistrict`, {
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

  useEffect(() => {
    const filtered = district.filter((item) =>
      item.state.includes(formik.values.state)
    );
    setFilterDistrict(filtered);
  }, [district, formik.values.state]);

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="flex p-1 ">
        <div className="md:p-5 w-full">
          <div className="flex flex-col  rounded-3xl">
            <div className="font-sans text-black   text-start  ">
              <h1 className="font-bold text-center md:text-xl lg:text-2xl">
                Add District
              </h1>
            </div>

            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-wrap justify-center mt-4 md:mt-14 lg:text-sm text-sm gap-y-5 gap-x-12"
            >
              {/* <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Country Name</label>
                <select
                  name="country"
                  className="border rounded-md p-2 text-xs md:text-lg shadow appearance-none"
                  value="Nepal"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                > */}
              {/* <option value="" disabled>
                    Choose Country
                  </option>
                  {country &&
                    country.map((c, i) => (
                      <option key={i} value={c.country}>
                        {c.country}
                      </option>
                    ))} */}
              {/* </select> */}
              {/* {formik.touched && formik.errors && (
                  <div className="text-red-500">{formik.errors}</div>
                )} */}
              {/* </div> */}

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>State Name</label>
                <select
                  name="state"
                  className="border rounded-md p-2 text-xs md:text-lg shadow appearance-none"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {" "}
                  <option value="" disabled>
                    Choose State
                  </option>
                  {state &&
                    state.map((s, i) => (
                      <option key={i} value={s.state}>
                        {s.state}
                      </option>
                    ))}
                </select>
                {formik.touched.state && formik.errors.state && (
                  <div className="text-red-500">{formik.errors.state}</div>
                )}
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>District</label>
                <select
                  // type="text"
                  name="district"
                  // placeholder="Municipality"
                  className="border rounded-md p-2 text-xs md:text-lg shadow appearance-none"
                  value={formik.values.district}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="" disabled>
                    Choose District
                  </option>
                  {filterDistrict &&
                    filterDistrict.map((s, i) => (
                      <option key={i} value={s.district}>
                        {s.district}
                      </option>
                    ))}
                </select>
                {formik.touched.district && formik.errors.district && (
                  <div className="text-red-500">{formik.errors.district}</div>
                )}
              </div>

              <div className="flex w-full justify-center">
                <button
                  type="submit"
                  className="rounded-lg p-3 w-1/3 text-sm text-white bg-blue-800 md:text-xl"
                >
                  Register
                </button>
              </div>
            </form>
            <div className="flex justify-end">
              <div className="flex gap-1">
                <button
                  onClick={() => navigate(-1)}
                  className="text-gray-500 text-end"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
