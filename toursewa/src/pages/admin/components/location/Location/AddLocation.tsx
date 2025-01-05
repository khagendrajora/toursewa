import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import { locationData } from "../../../../../validation/FormValidations";
import { URL } from "../../../../../config/Config";
import { IMunicipality } from "../../../../../../../backend/src/models/Locations/municipality";
import { IState } from "../../../../../../../backend/src/models/Locations/state";
import { useEffect, useState } from "react";
// import { ICountry } from "../../../../../../../backend/src/models/Locations/country";
import { IDistrict } from "../../../../../../../backend/src/models/Locations/Districts";

const AddLocation = () => {
  const navigate = useNavigate();
  const [municipality, setMunicipality] = useState<IMunicipality[]>([]);
  const [state, setState] = useState<IState[]>([]);
  const [district, setDistrict] = useState<IDistrict[]>([]);
  const [filterDistrict, setFilterDistrict] = useState<IDistrict[]>([]);
  const [filtermunicipality, setFilterMunicipality] = useState<IMunicipality[]>(
    []
  );

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${URL}/api/getmunicipality`);
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          setMunicipality(data);
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
      country: "",
      state: "",
      district: "",
      municipality: "",
      locationName: "",
      geo: "",
    },
    validationSchema: locationData,
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await fetch(`${URL}/api/addlocation`, {
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

  // useEffect(() => {
  //   const filtered = state.filter((item) =>
  //     item.country.includes(formik.values.country)
  //   );
  //   setFilterState(filtered);
  // }, [state, formik.values.country]);
  useEffect(() => {
    const filtered = district.filter((item) =>
      item.state.includes(formik.values.state)
    );
    setFilterDistrict(filtered);
  }, [district, formik.values.state]);

  useEffect(() => {
    const filtered = municipality.filter((item) =>
      item.district.includes(formik.values.district)
    );
    setFilterMunicipality(filtered);
  }, [municipality, formik.values.district]);
  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="flex p-1 ">
        <div className="md:p-5 w-full">
          <div className="flex flex-col  rounded-3xl">
            <div className="font-sans text-black   text-start  ">
              <h1 className="font-bold text-center md:text-xl lg:text-2xl">
                Add Location
              </h1>
            </div>

            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-wrap justify-center mt-4 md:mt-14 lg:text-sm text-sm gap-y-5 gap-x-12"
            >
              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Country Name</label>
                <select
                  name="country"
                  className="border rounded-md p-2 text-xs md:text-lg shadow appearance-none"
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="" disabled>
                    Choose Country
                  </option>
                  <option value="Nepal">Nepal</option>
                  {/* {country &&
                    country.map((c, i) => (
                      <option key={i} value={c.country}>
                        {c.country}
                      </option>
                    ))} */}
                </select>

                {formik.touched.country && formik.errors.country && (
                  <div className="text-red-500">{formik.errors.country}</div>
                )}
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>State</label>
                <select
                  name="state"
                  className="border rounded-md p-2 text-xs md:text-lg shadow appearance-none"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="" disabled>
                    Choose State
                  </option>
                  {state &&
                    state.map((c, i) => (
                      <option key={i} value={c.state}>
                        {c.state}
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
                  name="district"
                  className="border rounded-md p-2 text-xs md:text-lg shadow appearance-none"
                  value={formik.values.district}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="" disabled>
                    Choose District
                  </option>
                  {filterDistrict &&
                    filterDistrict.map((c, i) => (
                      <option key={i} value={c.district}>
                        {c.district}
                      </option>
                    ))}
                </select>
                {formik.touched.state && formik.errors.state && (
                  <div className="text-red-500">{formik.errors.state}</div>
                )}
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Municipality</label>
                <select
                  name="municipality"
                  className="border rounded-md p-2 text-xs md:text-lg shadow appearance-none"
                  value={formik.values.municipality}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="" disabled>
                    Choose Municipality
                  </option>
                  {filtermunicipality &&
                    filtermunicipality.map((c, i) => (
                      <option key={i} value={c.municipality}>
                        {c.municipality}
                      </option>
                    ))}
                </select>
                {formik.touched.municipality && formik.errors.municipality && (
                  <div className="text-red-500">
                    {formik.errors.municipality}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Location</label>
                <input
                  type="text"
                  name="locationName"
                  placeholder="Location"
                  className="border rounded-md p-2 text-xs md:text-lg shadow appearance-none"
                  value={formik.values.locationName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.locationName && formik.errors.locationName && (
                  <div className="text-red-500">
                    {formik.errors.locationName}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Geo Coordinates</label>
                <input
                  type="text"
                  name="geo"
                  placeholder="Geo Location"
                  className="border rounded-md p-2 text-xs md:text-lg shadow appearance-none"
                  value={formik.values.geo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.geo && formik.errors.geo && (
                  <div className="text-red-500">{formik.errors.geo}</div>
                )}
              </div>

              <div className="flex w-full flex-col gap-5 items-center justify-center">
                <button
                  type="submit"
                  className="rounded-lg p-3 w-1/3 text-sm text-white bg-blue-800 md:text-xl"
                >
                  Submit
                </button>
              </div>
            </form>
            <div className="flex justify-center">
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

export default AddLocation;
