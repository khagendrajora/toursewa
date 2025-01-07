import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ITrekking } from "../../../.../../SharedTypes/Product/trekking";
import { useAuthContext } from "../../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faXmark } from "@fortawesome/free-solid-svg-icons";
import HTMLReactParser from "html-react-parser";
import { ButtonLoader } from "../../../utils/ButtonLoader";
import { useFormik } from "formik";
import { tourBookForm } from "../../../validation/FormValidations";

export const TrekDetailPage = () => {
  const params = useParams();
  const [isButton, setIsButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [trek, setTrek] = useState<ITrekking | null>(null);
  const [watchDates, setWatchDates] = useState(false);
  const id = params.id;
  const { authUser } = useAuthContext();

  useEffect(() => {
    const fetchTrek = async () => {
      try {
        const res = await fetch(
          `https://tourbackend-rdtk.onrender.com/api/gettrekdetails/${id}`
        );
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          setTrek(data);
        }
      } catch (error: any) {
        toast.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrek();
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      passengerName: "",
      tickets: "",
      date: "",
      phone: "",
      bookedBy: authUser?.userId,
      trekId: id,
    },
    validationSchema: tourBookForm,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      if (values.tickets > (trek?.capacity || "")) {
        toast.error("No. of peoples are greater than the Capacity");
        return;
      }
      setIsButton(true);
      try {
        const res = await fetch(
          `https://tourbackend-rdtk.onrender.com/api/addtrekrev/${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error);
        } else {
          toast.success(data.message);
          // setAuthUser(data);

          resetForm();
        }
      } catch (error: any) {
        toast.error(error);
      } finally {
        setIsButton(false);
      }
    },
  });

  const filterDates = trek
    ? trek.operationDates?.filter((d) => new Date(d) >= new Date())
    : [];

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="flex p-5 mt-14 justify-center">
        <div className="w-3/4 ">
          {isLoading ? (
            <div className="flex justify-center items-center h-44">
              <FontAwesomeIcon
                icon={faSpinner}
                spin
                size="2xl"
                style={{ color: "#011def" }}
              />
              <p>Loading....</p>
            </div>
          ) : (
            trek && (
              <div className="flex flex-col gap-7 ">
                <h1 className="font-semibold text-3xl  w-full">{trek.name}</h1>
                <div className="flex justify-center w-full min-h-52 max-h-64">
                  <img
                    src="/BoudhanathStupa.jpg"
                    style={{
                      width: "100%",
                    }}
                  />
                </div>
                <div className="w-full space-y-8">
                  <h1 className="font-semibold text-xl w-fit">
                    Itineary <div className="h-[1px]  bg-black"></div>
                  </h1>
                  <div>{HTMLReactParser(trek.itinerary)}</div>
                </div>
                <div className="w-full flex max-w-[30rem] border shadow-md ">
                  <table className="border w-full max-w-[30rem]">
                    <tbody className="">
                      <tr className="border ">
                        <td className="border  p-3">Destination</td>
                        <td className="p-3">{trek.dest}</td>
                      </tr>
                      <tr className="border ">
                        <td className="border p-3">Duration</td>
                        <td className="border p-3">{trek.days}</td>
                      </tr>
                      <tr className="border ">
                        <td className="border p-3">Capacity</td>
                        <td className="border p-3">{trek.capacity}</td>
                      </tr>
                      <tr className="border ">
                        <td className="border p-3">Phone</td>
                        <td className="border p-3">{trek.numbers}</td>
                      </tr>
                      <tr className="border ">
                        <td className="border p-3">Operational Dates</td>
                        <td className="border p-2">
                          <span
                            className="cursor-pointer text-blue-500"
                            onClick={() => setWatchDates(!watchDates)}
                          >
                            {filterDates?.length} Dates Available
                            {watchDates && (
                              <div className="fixed inset-0 flex items-center text-black md:justify-start justify-center md:left-52 bg-opacity-50 z-50">
                                <div
                                  className="p-3 relative bg-white w-1/2 border"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <FontAwesomeIcon
                                    icon={faXmark}
                                    size="xl"
                                    className=" absolute cursor-pointer right-1 text-red-500"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setWatchDates(false);
                                    }}
                                  />
                                  <h3 className="text-sm font-semibold text-center mb-4">
                                    Operational Dates
                                  </h3>

                                  <div className="max-h-40 overflow-y-auto">
                                    {filterDates &&
                                      filterDates.map((d, i) => (
                                        <ol className=" text-start">
                                          <li className="p-3">
                                            {i + 1}. {d.toString()}
                                          </li>
                                        </ol>
                                      ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* <div> */}
                <div className="flex border border-collapse shadow-md rounded-md w-full justify-start items-start max-w-[30rem]">
                  <div className="max-w-[30rem] p-1 flex flex-col items-start rounded-md bg-gray-100">
                    <h1 className="font-semibold text-2xl mb-5 mt-1">
                      Book Trek
                      <div className="h-[1px] bg-black"></div>
                    </h1>
                    <form
                      onSubmit={formik.handleSubmit}
                      className="flex flex-wrap justify-center gap-5"
                    >
                      <div className="w-11/12">
                        <input
                          type="text"
                          name="passengerName"
                          className="border shadow rounded-sm appearance-none p-2 w-full "
                          placeholder="Name"
                          value={formik.values.passengerName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.passengerName &&
                          formik.errors.passengerName && (
                            <div className="text-red-500">
                              {formik.errors.passengerName}
                            </div>
                          )}
                      </div>
                      <div className="w-11/12">
                        <input
                          type="email"
                          name="email"
                          className="border shadow rounded-sm appearance-none p-2 w-full "
                          placeholder="Email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.email && formik.errors.email && (
                          <div className="text-red-500">
                            {formik.errors.email}
                          </div>
                        )}
                      </div>
                      <div className="w-11/12">
                        <input
                          type="number"
                          name="phone"
                          className="border shadow rounded-sm appearance-none p-2 w-full"
                          placeholder="Contact Number"
                          value={formik.values.phone}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.phone && formik.errors.phone && (
                          <div className="text-red-500">
                            {formik.errors.phone}
                          </div>
                        )}
                      </div>
                      <div className="w-11/12">
                        <input
                          type="number"
                          name="tickets"
                          value={formik.values.tickets}
                          placeholder="No. of People"
                          className="border shadow rounded-sm appearance-none p-2 w-full "
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.tickets && formik.errors.tickets && (
                          <div className="text-red-500">
                            {formik.errors.tickets}
                          </div>
                        )}
                      </div>
                      <div className="w-11/12">
                        <select
                          name="date"
                          value={formik.values.date}
                          className="border shadow rounded-sm  appearance-none p-2 w-full "
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        >
                          <option value="" disabled>
                            Select Trek Date{" "}
                          </option>

                          {filterDates &&
                            filterDates
                              .filter((d) => new Date(d) > new Date())
                              .map((d, i) => (
                                <option
                                  key={i}
                                  value={d.toString()}
                                  onClick={() => {
                                    // formik.values.d
                                  }}
                                >
                                  {d.toString()}
                                </option>
                              ))}
                        </select>
                        {formik.touched.date && formik.errors.date && (
                          <div className="text-red-500">
                            {formik.errors.date}
                          </div>
                        )}
                      </div>

                      <div className="w-11/12">
                        <button
                          type="submit"
                          className="bg-button hover:bg-red-700 text-white p-2 rounded-sm w-full"
                        >
                          Send{isButton ? <ButtonLoader /> : ""}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              // </div>
            )
          )}
        </div>
      </div>
    </>
  );
};
