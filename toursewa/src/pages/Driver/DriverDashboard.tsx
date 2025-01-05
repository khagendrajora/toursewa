/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { URL } from "../../config/Config";
import { useAuthContext } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { IVRev } from "../../../../backend/src/models/Reservations/vehReserv";
import { IVeh } from "../../../../backend/src/models/Product/vehicle";
import Calendar from "react-calendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { ButtonLoader } from "../../utils/ButtonLoader";
import { hotDeals } from "../../validation/FormValidations";
import { IHotDeal } from "../../../../backend/src/models/HotDeals/HotDeals";
import axios from "axios";
import { IRDates } from "../../../../backend/src/models/Reservations/ReservedDated";

export const DriverDashboard = () => {
  const { authUser } = useAuthContext();
  const vehicleId = authUser?.vehicleId;
  const driverId = authUser?.driverId;
  const navigate = useNavigate();
  const [vehRev, setVehRev] = useState<IVRev[] | null>(null);
  const [vehicle, setVehicle] = useState<IVeh[] | null>(null);
  const [search, setSearch] = useState<string>("");
  const [availability, setAvailability] = useState<string | null>(null);
  const [filterSearch, SetFilterSearch] = useState<IVRev[] | null>(null);
  const [showForm, setShowForm] = useState<string>("");
  const [isButton, setIsButton] = useState(false);
  const [hotDealsData, setHotDealsData] = useState<IHotDeal[] | null>([]);
  const [dates, setDates] = useState<IRDates[]>([]);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const res = await fetch(
          `https://tourbackend-rdtk.onrender.com/api/reservdates/${vehicleId}`
        );
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          setDates(data);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchDates();
  }, [vehicleId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${URL}/api/gethotdealbyvehid/${vehicleId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.error);
        } else {
          setHotDealsData(data);
        }
      } catch (error: any) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${URL}/api/getdrivervehicle/${vehicleId}`);
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
    fetchData();
  }, []);

  useEffect(() => {
    const fetchVehRev = async () => {
      try {
        const res = await fetch(
          `${URL}/api/getrevbyvehid/${authUser?.vehicleId}`
        );
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          const sortedData = data.sort(
            (a: IVRev, b: IVRev) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
          );
          setVehRev(sortedData);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchVehRev();
  }, []);

  useEffect(() => {
    if (search) {
      const filter = vehRev?.filter((data) => {
        const bookingId = data.bookingId?.toLowerCase().trim() || "";
        const bookingName = data.bookingName?.toLowerCase().trim() || "";
        const phone = data.phone?.toLowerCase().trim() || "";
        return (
          bookingId.includes(search.toLowerCase().trim()) ||
          bookingName.includes(search.toLowerCase().trim()) ||
          phone.includes(search.toLowerCase().trim())
        );
      });
      SetFilterSearch(filter ?? []);
    } else {
      SetFilterSearch([]);
    }
  }, [search, vehRev]);

  const isBooked = (date: Date, id: string) => {
    return (
      vehicle?.some((veh) => {
        if (veh._id === id) {
          return veh.operationDates?.some((operationalDates) => {
            const operationalDateObj = new Date(operationalDates);
            return (
              operationalDateObj.getDate() === date.getDate() &&
              operationalDateObj.getMonth() === date.getMonth() &&
              operationalDateObj.getFullYear() === date.getFullYear()
            );
          });
        }
        return false;
      }) || false
    );
  };

  const changeAvailability = (id: string) => {
    setAvailability((prev) => (prev === id ? null : id));
  };

  const formik = useFormik({
    initialValues: {
      sourceAddress: "",
      destAddress: "",
      price: "",
      driverId: driverId,
      date: "",
      time: "",
      termsAndCondition: "",
    },
    validationSchema: hotDeals,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setIsButton(true);
      try {
        const res = await fetch(`${URL}/api/addhotdeals/${showForm}`, {
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
        }
      } catch (error: any) {
        toast.error(error);
      } finally {
        setIsButton(false);
      }
    },
  });

  const removeFromHotDeals = async (id: string | undefined) => {
    try {
      const confirmed = window.confirm("Remove Form Hot deals");
      if (confirmed) {
        setIsButton(true);
        const response = await axios.delete(`${URL}/api/deletehotdeal/${id}`);
        const data = response.data;
        if (data.message) {
          toast.success(data.message);
          setHotDealsData(
            (prev) => prev?.filter((v) => v.vehicleId !== id) || null
          );
        } else if (data.error) {
          toast.error(data.error);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsButton(false);
    }
  };

  const checkDateAndTime = (
    selectedDate: Date | null,
    selectedTime: Date | null
  ) => {
    if (!selectedDate) return;
    const isRev = dates.some((reserv) => {
      if (Array.isArray(reserv.bookingDate) && reserv.bookingDate.length > 0) {
        const lastBookedDate = new Date(
          reserv.bookingDate[reserv.bookingDate.length - 1]
        );

        if (
          lastBookedDate.getDate() === selectedDate.getDate() &&
          lastBookedDate.getMonth() === selectedDate.getMonth() &&
          lastBookedDate.getFullYear() === selectedDate.getFullYear()
        ) {
          if (reserv.time) {
            if (selectedTime) {
              const bookedTime = new Date(`2000-01-01T${reserv.time}:00`);
              bookedTime.setHours(bookedTime.getHours() + 1);

              if (selectedTime < bookedTime) {
                alert("Date Not Available");
                formik.setFieldValue("time", "");
                formik.setFieldValue("date", "");
                return true;
              }
            } else {
              alert("Time is required for this date.");
              formik.setFieldValue("date", "");
              formik.setFieldValue("time", "");
              return true;
            }
          } else {
            alert("Date is unavailable");
            formik.setFieldValue("date", "");
            formik.setFieldValue("time", "");
            return true;
          }
        }

        for (let i = 0; i < reserv.bookingDate.length - 1; i++) {
          const bookedDate = new Date(reserv.bookingDate[i]);
          if (
            bookedDate.getDate() === selectedDate.getDate() &&
            bookedDate.getMonth() === selectedDate.getMonth() &&
            bookedDate.getFullYear() === selectedDate.getFullYear()
          ) {
            alert("This date is not available");
            formik.setFieldValue("time", "");
            formik.setFieldValue("date", "");
            return true;
          }
        }
      }
      return false;
    });

    const isOperational = Array.isArray(vehicle)
      ? vehicle.some((veh) =>
          veh.operationDates?.some((operationalDate) => {
            const operationalDateObj = new Date(operationalDate);
            return (
              operationalDateObj.getDate() === selectedDate.getDate() &&
              operationalDateObj.getMonth() === selectedDate.getMonth() &&
              operationalDateObj.getFullYear() === selectedDate.getFullYear()
            );
          })
        )
      : false;

    if (isRev || isOperational) {
      return true;
    }
  };

  return (
    <>
      <ToastContainer theme="colored" position="top-center" />
      <div className="w-full  bg-blue-50 p-10">
        <div className="flex flex-col gap-10">
          <div className=" flex justify-center items-center text-xs">
            <div className="overflow-x-auto space-y-4  ">
              {vehicle &&
                vehicle.map((filter, i) => (
                  <>
                    <table className="table-auto border-collapse  border border-gray-500 text-xs md:text-lg ">
                      <thead className="bg-neutral-400 text-white">
                        <tr>
                          <th className="border font-normal border-gray-500 ">
                            SN
                          </th>
                          <th className="border font-normal border-gray-500 p-1">
                            ID
                          </th>
                          <th className="border font-normal border-gray-500 p-1 min-w-[130px]">
                            Vehicle Name
                          </th>
                          <th className="border font-normal  border-gray-500 p-1">
                            Category
                          </th>
                          <th className="border font-normal border-gray-500  p-1 min-w-[100px]">
                            Made Year
                          </th>
                          <th className="border font-normal border-gray-500 p-1">
                            Number
                          </th>
                          <th className="border font-normal border-gray-500 p-1">
                            Capacity
                          </th>
                          <th className="border font-normal border-gray-500 p-1 min-w-[120px] md:min-w-[170px]">
                            Operational Dates
                          </th>
                          <th className="border font-normal border-gray-500 p-2 ">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody className="">
                        <tr className="" key={filter._id}>
                          <td className="border border-gray-500 text-center p-2">
                            {i + 1}
                          </td>
                          <td className="border border-gray-500 text-center p-2">
                            {filter.vehId}
                          </td>
                          <td className="border border-gray-500 text-center p-2">
                            {filter.name}
                          </td>
                          <td className="border  border-gray-500 min-w-[100px]  text-center p-2">
                            {filter.vehCategory}
                          </td>

                          <td className=" border border-gray-500 text-center p-2">
                            {filter.madeYear
                              ? filter.madeYear.toString().split("-")[0]
                              : ""}
                          </td>
                          <td className="border border-gray-500 min-w-[120px] text-center p-2">
                            {filter.vehNumber}
                          </td>

                          <td className="border border-gray-500 text-center p-2">
                            {filter.capacity}
                          </td>

                          <td className="border border-gray-500 text-center">
                            <span
                              className="cursor-pointer  text-blue-400"
                              onClick={() =>
                                changeAvailability(filter._id || "")
                              }
                            >
                              {filter.operationDates?.length}

                              {availability === filter._id && (
                                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                                  <div
                                    className="relative bg-white p-5 rounded-lg shadow-md"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Calendar
                                      tileDisabled={({ date }) =>
                                        isBooked(date, filter._id || "")
                                      }
                                      minDate={new Date()}
                                      className="z-10"
                                    />
                                    <FontAwesomeIcon
                                      icon={faXmark}
                                      className="absolute top-1 right-1 cursor-pointer text-red-600"
                                      size="lg"
                                      onClick={() => setAvailability(null)}
                                    />
                                  </div>
                                </div>
                              )}
                            </span>
                          </td>
                          <td className="flex justify-between flex-col border gap-6 border-b-0  text-white p-2 ">
                            <div className="flex gap-4 md:gap-7">
                              <button
                                onClick={() =>
                                  navigate(
                                    `/driver/vehicleinfo/${filter?.vehId}`
                                  )
                                }
                                title="Full Info"
                              >
                                <FontAwesomeIcon
                                  icon={faCircleInfo}
                                  size="lg"
                                  className="hover:scale-110"
                                  style={{ color: "#06d01e" }}
                                />
                              </button>
                              {/* <button */}
                              {/* // onClick={() => */}
                              {/* //   navigate(
                                //     `/business/vehicle/updateVehicle/${filter.vehId}`
                                //   )
                                // }
                              //   className="hover:scale-110"
                              //   title="Add To Hot Deals"
                              // >
                              //   <FontAwesomeIcon */}
                              {/* //     icon={faCartPlus}
                              //     style={{ color: "#f70808" }}
                              //   />
                              // </button> */}

                              {/* <button onClick={() => Delete(filter._id)}>
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  size="lg"
                                  style={{ color: "#ff0000" }}
                                  className="hover:scale-110"
                                  title="Delete"
                                />
                                {isButton ? <ButtonLoader /> : ""}
                              </button> */}

                              {/* <Link
                                to={`/business/vehicle/adddriver/${filter.vehId}`}
                                className=" text-lime-500 rounded-lg"
                                title="Add Driver"
                              >
                                <FontAwesomeIcon
                                  size="lg"
                                  className="hover:scale-110"
                                  icon={faPersonCirclePlus}
                                />
                              </Link> */}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="flex justify-end ">
                      {hotDealsData &&
                      hotDealsData.some((d) => d.vehicleId === filter.vehId) ? (
                        <button
                          className="bg-button p-1 hover:bg-red-700 text-white rounded-sm"
                          onClick={() => {
                            removeFromHotDeals(filter.vehId);
                          }}
                        >
                          Remove From Hot Deals
                        </button>
                      ) : (
                        <button
                          className="bg-button p-1 hover:bg-red-700 text-white rounded-sm"
                          onClick={() => {
                            setShowForm(filter.vehId);
                          }}
                        >
                          Add to Hot Deals
                        </button>
                      )}
                    </div>

                    {showForm && (
                      <div className=" inset-1  flex items-center  overflow-x-auto  justify-center z-50">
                        <div className="bg-white p-4 rounded overflow-x-auto shadow-md w-2/3">
                          <h2 className="text-xl font-bold mb-4">
                            Add to Hot Deals
                          </h2>

                          <form onSubmit={formik.handleSubmit}>
                            <div className="mb-4">
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                From
                              </label>
                              <input
                                type="text"
                                name="sourceAddress"
                                className="w-full border rounded px-3 py-2"
                                placeholder="From"
                                value={formik.values.sourceAddress}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                required
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                To
                              </label>
                              <input
                                type="text"
                                name="destAddress"
                                className="w-full border rounded px-3 py-2"
                                placeholder="To"
                                value={formik.values.destAddress}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                required
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                Time
                              </label>
                              <input
                                type="time"
                                name="time"
                                className="w-full border rounded px-3 py-2"
                                placeholder="Time"
                                value={formik.values.time}
                                // onChange={formik.handleChange}
                                onChange={(e) => {
                                  const selectedDate = formik.values.date
                                    ? new Date(formik.values.date)
                                    : null;
                                  const selectedTime = e.target.value
                                    ? new Date(
                                        `2000-01-01T${e.target.value}:00`
                                      )
                                    : null;

                                  if (
                                    checkDateAndTime(selectedDate, selectedTime)
                                  ) {
                                    return;
                                  }

                                  formik.setFieldValue("time", e.target.value);
                                }}
                                onBlur={formik.handleBlur}
                                required
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                Date
                              </label>
                              <div className={`relative`}>
                                <input
                                  type="date"
                                  name="date"
                                  className={`w-full border rounded px-3 py-2 `}
                                  value={formik.values.date}
                                  min={new Date().toISOString().split("T")[0]}
                                  onChange={(e) => {
                                    const selectedDate = new Date(
                                      e.target.value
                                    );
                                    const selectedTime = formik.values.time
                                      ? new Date(
                                          `2000-01-01T${formik.values.time}:00`
                                        )
                                      : null;

                                    if (
                                      checkDateAndTime(
                                        selectedDate,
                                        selectedTime
                                      )
                                    ) {
                                      return;
                                    }

                                    formik.handleChange(e);
                                  }}
                                  onBlur={formik.handleBlur}
                                  required
                                />
                              </div>
                            </div>

                            <div className="mb-4">
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                Price
                              </label>
                              <input
                                type="number"
                                name="price"
                                className="w-full border rounded px-3 py-2"
                                placeholder="Price"
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                required
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                Terms And Condition
                              </label>
                              <textarea
                                name="termsAndCondition"
                                className="w-full border rounded px-3 py-2"
                                placeholder="Terms And Conditions"
                                value={formik.values.termsAndCondition}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                required
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <button
                                type="button"
                                className="px-4 py-2 bg-gray-300 text-black rounded"
                                onClick={() => setShowForm("")}
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-2 bg-button text-white rounded hover:bg-red-700"
                              >
                                Save {isButton ? <ButtonLoader /> : ""}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </>
                ))}
            </div>
          </div>
          <h1 className="font-semibold text-xl">My Reservations</h1>
          <div className=" flex w-full flex-wrap flex-col md:flex-row justify-center gap-5 p-2 mx-auto">
            <div className="w-full  md:w-2/3 rounded-2xl p-1 pt-3 ">
              <div className="flex flex-col gap-y-10">
                {vehRev && vehRev.length > 0 ? (
                  <div className="w-full flex justify-center">
                    <input
                      type="text"
                      placeholder="search"
                      className="p-3 w-full rounded-md border sm:w-1/2"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                ) : (
                  ""
                )}
                {filterSearch &&
                  filterSearch.map((filter, i) => (
                    <>
                      <div
                        key={i}
                        className="w-full  bg-white p-4 text-xs md:text-sm rounded-lg"
                      >
                        <div className="flex flex-wrap gap--y-5 justify-between">
                          <div className="w-full md:w-1/3 lg:w-1/5 overflow-x-auto  flex flex-col justify-evenly gap-4">
                            <h1 className="text-lime-500">{i + 1}.</h1>
                            <img src="/BoudhanathStupa.jpg" alt="image" />
                          </div>
                          <div className="space-y-4">
                            <h1 className="flex gap-3 font-semibold">
                              Booking Id:{" "}
                              <span className="font-normal text-zinc-500">
                                {filter.bookingId}
                              </span>
                            </h1>

                            <h1 className="flex gap-3 font-semibold">
                              Vehicle Number{" "}
                              <span className="font-normal text-zinc-500">
                                {" "}
                                {filter.vehicleNumber}
                              </span>
                            </h1>

                            <h1 className="flex gap-3 font-semibold">
                              Start Date :
                              <span className="font-normal text-zinc-500">
                                {filter.startDate?.toString().split("T")[0]}
                              </span>
                            </h1>
                            <h1 className="flex gap-3 font-semibold">
                              Start Date :
                              <span className="font-normal text-zinc-500">
                                {filter.endDate?.toString().split("T")[0]}
                              </span>
                            </h1>
                          </div>
                          <div className="space-y-4">
                            {" "}
                            <h1 className="flex gap-3 font-semibold">
                              From:{" "}
                              <span className="font-normal text-zinc-500">
                                {" "}
                                {filter.sourceAddress}{" "}
                              </span>
                            </h1>
                            <h1 className="flex gap-3 font-semibold">
                              To:{" "}
                              <span className="font-normal text-zinc-500">
                                {filter.destinationAddress}{" "}
                              </span>
                            </h1>
                          </div>
                          <div className="space-y-4">
                            <h1 className="flex gap-3 font-semibold">
                              Booking Name:{" "}
                              <span className="font-normal text-zinc-500">
                                {filter.bookingName}{" "}
                              </span>
                            </h1>
                            <h1 className="flex gap-3 font-semibold">
                              Phone:{" "}
                              <span className="font-normal text-zinc-500">
                                {filter.phone}{" "}
                              </span>
                            </h1>
                            <h1 className="flex gap-3 font-semibold">
                              Email:{" "}
                              <span className="font-normal text-zinc-500">
                                {filter.email}{" "}
                              </span>
                            </h1>
                            <h1 className="flex gap-3 font-semibold">
                              Status:{" "}
                              <span
                                className={`${
                                  filter.status === "Canceled"
                                    ? "bg-red-600"
                                    : filter.status === "Fulfilled"
                                    ? "bg-lime-500"
                                    : filter.status === "Pending"
                                    ? "bg-red-400"
                                    : "bg-blue-400"
                                } p-1 rounded-lg text-xs text-white`}
                              >
                                {filter.status}
                              </span>{" "}
                            </h1>
                          </div>
                        </div>
                      </div>
                    </>
                  ))}

                {vehRev &&
                  filterSearch?.length === 0 &&
                  vehRev.map((data, i) => (
                    <>
                      <div
                        key={i}
                        className="w-full  bg-white p-4 text-xs  md:text-sm rounded-lg"
                      >
                        <h1>{i + 1}.</h1>
                        <div className="flex flex-wrap gap-y-5 justify-between">
                          <div className="w-full md:w-1/3 lg:w-1/5 overflow-x-auto  flex flex-col justify-evenly gap-y-4">
                            <img src="/BoudhanathStupa.jpg" alt="image" />
                          </div>
                          <div className="space-y-4">
                            <h1 className="flex gap-3 font-semibold">
                              Booking Id:{" "}
                              <span className="font-normal text-zinc-500">
                                {data.bookingId}
                              </span>
                            </h1>

                            <h1 className="flex gap-3 font-semibold">
                              Vehicle Number{" "}
                              <span className="font-normal text-zinc-500">
                                {" "}
                                {data.vehicleNumber}
                              </span>
                            </h1>

                            <h1 className="flex gap-3 font-semibold">
                              Start Date :
                              <span className="font-normal text-zinc-500">
                                {data.startDate?.toString().split("T")[0]}
                              </span>
                            </h1>
                            <h1 className="flex gap-3 font-semibold">
                              Start Date :
                              <span className="font-normal text-zinc-500">
                                {data.endDate?.toString().split("T")[0]}
                              </span>
                            </h1>
                          </div>
                          <div className="space-y-4">
                            {" "}
                            <h1 className="flex gap-3 font-semibold">
                              From:{" "}
                              <span className="font-normal text-zinc-500">
                                {" "}
                                {data.sourceAddress}{" "}
                              </span>
                            </h1>
                            <h1 className="flex gap-3 font-semibold">
                              To:{" "}
                              <span className="font-normal text-zinc-500">
                                {data.destinationAddress}{" "}
                              </span>
                            </h1>
                          </div>
                          <div className="space-y-4">
                            <h1 className="flex gap-3 font-semibold">
                              Booking Name:{" "}
                              <span className="font-normal text-zinc-500">
                                {data.bookingName}{" "}
                              </span>
                            </h1>
                            <h1 className="flex gap-3 font-semibold">
                              Phone:{" "}
                              <span className="font-normal text-zinc-500">
                                {data.phone}{" "}
                              </span>
                            </h1>
                            <h1 className="flex gap-3 font-semibold">
                              Email:{" "}
                              <span className="font-normal text-zinc-500">
                                {data.email}{" "}
                              </span>
                            </h1>
                            <h1 className="flex  gap-3 font-semibold">
                              Status:{" "}
                              <span
                                className={`${
                                  data.status === "Canceled"
                                    ? "bg-red-600"
                                    : data.status === "Fulfilled"
                                    ? "bg-lime-500"
                                    : data.status === "Pending"
                                    ? "bg-red-400"
                                    : "bg-blue-400"
                                } p-1 rounded-lg text-xs text-white`}
                              >
                                {data.status}
                              </span>{" "}
                            </h1>
                          </div>
                        </div>
                      </div>
                    </>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
