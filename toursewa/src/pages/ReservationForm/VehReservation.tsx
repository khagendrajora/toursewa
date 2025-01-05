/* eslint-disable @typescript-eslint/no-explicit-any */
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAuthContext } from "../../context/AuthContext";
import { IRDates } from "../../../../backend/src/models/Reservations/ReservedDated";
import { ButtonLoader } from "../../utils/ButtonLoader";
import { IVeh } from "../../../../backend/src/models/Product/vehicle";
import { ILocation } from "../../../../backend/src/models/Locations/location";
import { URL } from "../../config/Config";

const VehReservation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    startDate,
    ednDate,
    baseLocation,
    dropLocation,
    time,
    destinationAddress,
    sourceAddress,
  } = location.state;
  const { name } = location.state;
  const [isButton, setIsButton] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [veh, setVeh] = useState<IVeh | null>(null);
  const [locations, setLocation] = useState<ILocation[]>([]);
  const { authUser } = useAuthContext();
  const loginedId = authUser?.businesId
    ? authUser.businesId
    : authUser?.userId
    ? authUser?.userId
    : authUser?.driverId;

  const loginedName = authUser?.adminName
    ? authUser?.adminName
    : authUser?.businessName
    ? authUser?.businessName
    : authUser?.userName
    ? authUser?.userName
    : authUser?.driverName;

  const params = useParams();
  const id = params.id;
  const [dates, setDates] = useState<IRDates[]>([]);
  const [inputs, setInputs] = useState<{
    age: number | null;
    email: string;
    phone: string;
    sourceAddress: string;
    destinationAddress: string;
    startDate: DateObject | null;
    endDate: DateObject | null;
    address: string;
    bookingName: string;
    numberOfPassengers: number | null;
    time: string;
  }>({
    age: null,
    email: "",
    time: time || "",
    phone: "",
    sourceAddress: baseLocation || sourceAddress || "",
    destinationAddress: dropLocation || destinationAddress || "",
    startDate: startDate || null,
    endDate: ednDate || null,
    address: "",
    bookingName: "",
    numberOfPassengers: null,
  });
  let isAvailable = true;

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch(`${URL}/api/getlocation`);
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          setLocation(data);
        }
      } catch (error: any) {
        console.error(error);
      }
    };
    fetchLocation();
  }, []);

  useEffect(() => {
    const newStartDate = inputs.startDate
      ? new Date(inputs.startDate as unknown as string)
      : null;

    const newEndDate = inputs.endDate
      ? new Date(inputs.endDate as unknown as string)
      : null;

    if (newStartDate && newEndDate) {
      const dateRange: Date[] = [];
      while (newStartDate <= newEndDate) {
        dateRange.push(new Date(newStartDate));
        newStartDate.setDate(newStartDate.getDate() + 1);
      }
      for (const date of dateRange) {
        for (const dateValues of dates) {
          if (
            dateValues.bookingDate.some((d) => {
              const bookedDate = new Date(d);
              return (
                bookedDate.getDate() === date.getDate() &&
                bookedDate.getMonth() === date.getMonth() &&
                bookedDate.getFullYear() === date.getFullYear()
              );
            })
          ) {
            isAvailable = false;
            break;
          }
        }
        if (!isAvailable) break;
      }
    }
  }, [inputs.startDate, inputs.endDate, dates]);

  useEffect(() => {
    const newStartDate = inputs.startDate
      ? new Date(inputs.startDate as unknown as string)
      : null;

    const newEndDate = inputs.endDate
      ? new Date(inputs.endDate as unknown as string)
      : null;

    if (newStartDate && newEndDate) {
      const dateRange: Date[] = [];
      while (newStartDate <= newEndDate) {
        dateRange.push(new Date(newStartDate));
        newStartDate.setDate(newStartDate.getDate() + 1);
      }
      for (const date of dateRange) {
        // for (const dateValues of veh) {
        if (
          veh?.operationDates?.some((d) => {
            const bookedDate = new Date(d);
            return (
              bookedDate.getDate() === date.getDate() &&
              bookedDate.getMonth() === date.getMonth() &&
              bookedDate.getFullYear() === date.getFullYear()
            );
          })
        ) {
          isAvailable = false;
          break;
          // }
        }
        if (!isAvailable) break;
      }
    }
  }, [inputs.startDate, inputs.endDate, dates]);

  const validatePhone = (num: string) => {
    if (num.startsWith("9") && num.length === 10) {
      return true;
    } else if (num.startsWith("0") && num.length === 9) {
      return true;
    }
    return false;
  };

  const bookVeh = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsButton(true);
    try {
      if (!isAvailable) {
        return toast.error("Date not availale");
      }

      if (
        inputs.startDate &&
        inputs.endDate &&
        inputs.startDate > inputs.endDate
      ) {
        return toast.error("Invalid Dates");
      }
      if (!validatePhone(inputs.phone)) {
        setError(true);
        return;
      }
      const res = await fetch(
        `https://tourbackend-rdtk.onrender.com/api/addRev/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            bookedBy: String(loginedId),
            bookedByName: loginedName,
            email: inputs.email,
            phone: inputs.phone,
            age: inputs.age,
            sourceAddress: inputs.sourceAddress,
            destinationAddress: inputs.destinationAddress,
            startDate: inputs.startDate || null,
            endDate: inputs.endDate || null,
            address: inputs.address,
            bookingName: inputs.bookingName,
            numberOfPassengers: inputs.numberOfPassengers,
            time: inputs.time,
          }),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        setInputs({
          bookingName: "",
          age: null,
          email: "",
          phone: "",
          sourceAddress: "",
          destinationAddress: "",
          startDate: null,
          endDate: null,
          address: "",
          time: "",
          numberOfPassengers: null,
        });

        setTimeout(() => {
          navigate(-1);
        }, 2000);
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsButton(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://tourbackend-rdtk.onrender.com/api/getvehdetails/${id}`
        );
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error);
        } else {
          setVeh(data);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const res = await fetch(
          `https://tourbackend-rdtk.onrender.com/api/reservdates/${id}`
        );
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          setDates(data);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchDates();
  }, [id]);
  const cancel = async () => {
    navigate(`/vehiclelist/vehicledetails/${id}`);
  };

  console.log(destinationAddress), console.log(sourceAddress);
  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="flex justify-center mt-16 items-center">
        <div className="flex flex-col justify-center items-center relative ">
          <h1 className="pb-5 font-bold text-xl">Fill the Details</h1>
          <FontAwesomeIcon
            icon={faXmark}
            size="2x"
            style={{
              position: "absolute",
              right: "20px",
              top: "10px",
              cursor: "pointer",
            }}
            onClick={cancel}
          />
          <form
            onSubmit={bookVeh}
            className="flex flex-wrap mt-5 justify-center items-center md:mt-8 text-sm lg:text-xl"
          >
            <div className="flex flex-wrap justify-center gap-5 w-11/12 ">
              <div className="flex flex-wrap justify-center sm:justify-between gap-4 w-full ">
                <div className="flex flex-col gap-y-2 w-3/4 sm:w-1/4 min-w-52">
                  <label>Vehicle Name</label>
                  <input
                    type="text"
                    value={name}
                    readOnly
                    placeholder="Vehicle Name"
                    className="border border-gray-400 p-2 rounded-lg"
                  />
                </div>

                <div className="flex flex-col gap-y-2 w-3/4 sm:w-1/4 min-w-52">
                  <label>Journey From</label>
                  <select
                    value={inputs.sourceAddress}
                    required
                    onChange={(e) =>
                      setInputs({ ...inputs, sourceAddress: e.target.value })
                    }
                    className="border border-gray-400 p-2 rounded-lg"
                  >
                    <option value="" disabled className="">
                      Journey From
                    </option>
                    {locations &&
                      locations.map((data, i) => (
                        <option value={data.fullLocation} key={i}>
                          {sourceAddress ? sourceAddress : data.fullLocation}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex flex-col gap-y-2 w-3/4 sm:w-1/4 min-w-52 ">
                  <label>Journey To</label>
                  <select
                    value={inputs.destinationAddress}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        destinationAddress: e.target.value,
                      })
                    }
                    className="border border-gray-400 p-2 rounded-lg"
                  >
                    {" "}
                    <option value="" disabled className="">
                      Journey To
                    </option>
                    {locations &&
                      locations.map((data, i) => (
                        <option value={data.fullLocation} key={i}>
                          {destinationAddress
                            ? destinationAddress
                            : data.fullLocation}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-between gap-5 w-full ">
                <div className="flex flex-col gap-y-2 w-3/4 sm:w-1/4 min-w-52 ">
                  <label>Number of Passengers</label>
                  <input
                    type="number"
                    value={inputs.numberOfPassengers ?? ""}
                    max={veh?.capacity}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        numberOfPassengers: parseInt(e.target.value),
                      })
                    }
                    placeholder={`1 to ${veh?.capacity}`}
                    className="border border-gray-400 p-2 rounded-lg"
                  />
                </div>

                <div className="flex flex-col gap-y-2 w-3/4 sm:w-1/4 min-w-52 ">
                  <label>Passenger Name</label>
                  <input
                    type="text"
                    value={inputs.bookingName}
                    onChange={(e) =>
                      setInputs({ ...inputs, bookingName: e.target.value })
                    }
                    placeholder="Passenger Name"
                    className="border border-gray-400 p-2 rounded-lg"
                  />
                </div>

                <div className="flex flex-col gap-y-2 w-3/4 sm:w-1/4 min-w-52 ">
                  <label>Passenger Age</label>
                  <input
                    type="number"
                    placeholder="Passenger Age"
                    value={inputs.age ?? ""}
                    onChange={(e) =>
                      setInputs({ ...inputs, age: parseInt(e.target.value) })
                    }
                    className="border border-gray-400 p-2 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-between gap-5  w-full ">
                <div className="flex flex-col gap-y-2  w-3/4 sm:w-1/4 min-w-52">
                  <label>Passenger Phone</label>
                  <input
                    type="number"
                    placeholder="Passenger Phone"
                    value={inputs.phone}
                    onChange={(e) => {
                      setError(false);
                      setInputs({ ...inputs, phone: e.target.value });
                    }}
                    className="border border-gray-400 p-2 rounded-lg"
                  />
                  {error && (
                    <span className="text-xs text-red-500">Invalid Number</span>
                  )}
                </div>

                <div className="flex flex-col gap-y-2 w-3/4 sm:w-1/4 min-w-52 ">
                  <label>Passenger Email</label>
                  <input
                    type="email"
                    value={inputs.email}
                    onChange={(e) =>
                      setInputs({ ...inputs, email: e.target.value })
                    }
                    placeholder="example@gmail.com"
                    className="border border-gray-400 p-2 rounded-lg"
                  />
                </div>

                <div className="flex flex-col gap-y-2 w-3/4 sm:w-1/4 min-w-52">
                  <label>Passenger Address</label>
                  <input
                    type="text"
                    value={inputs.address}
                    onChange={(e) =>
                      setInputs({ ...inputs, address: e.target.value })
                    }
                    placeholder="Passenger Address"
                    className="border border-gray-400 p-2 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex flex-wrap  justify-center sm:justify-between gap-5 w-full ">
                <div className="flex flex-col gap-y-2 w-3/4 sm:w-1/4 min-w-52 ">
                  <label>Booked By</label>
                  <input
                    type="text"
                    value={loginedName}
                    className="border border-gray-400 p-2 rounded-lg"
                  />
                </div>

                <div className="flex flex-col gap-y-2  w-3/4 sm:w-1/4 min-w-52 ">
                  <label>Start Date</label>
                  <DatePicker
                    style={{
                      backgroundColor: "",
                      height: "auto",
                      borderRadius: "8px",
                      width: "auto",
                      fontSize: "14px",
                      padding: "8px 8px",
                    }}
                    placeholder="Start Date"
                    minDate={new Date()}
                    value={inputs.startDate}
                    onChange={(newDates: DateObject) => {
                      setInputs((prev) => ({
                        ...prev,
                        startDate: newDates,
                      }));
                    }}
                    mapDays={({ date }) => {
                      const isRev = dates.some((reserv) => {
                        if (Array.isArray(reserv.bookingDate)) {
                          return reserv.bookingDate.some((booked) => {
                            const bookedDate = new Date(booked);
                            return (
                              bookedDate.getDate() === date.day &&
                              bookedDate.getMonth() === date.month.index &&
                              bookedDate.getFullYear() === date.year
                            );
                          });
                        }
                        return false;
                      });

                      const isOperational = veh?.operationDates?.some(
                        (operationalDate) => {
                          const operationalDateObj = new Date(operationalDate);
                          return (
                            operationalDateObj.getDate() === date.day &&
                            operationalDateObj.getMonth() ===
                              date.month.index &&
                            operationalDateObj.getFullYear() === date.year
                          );
                        }
                      );

                      if (isOperational || isRev)
                        return {
                          disabled: true,
                          style: { color: "red", backgroundColor: "#f5f5f5" },
                        };
                    }}
                  />
                </div>
                <div className="flex flex-col gap-y-2 w-3/4 sm:w-1/4 min-w-52">
                  <label>End Date</label>
                  <DatePicker
                    style={{
                      backgroundColor: "",
                      height: "auto",
                      borderRadius: "8px",
                      width: "auto",
                      fontSize: "14px",
                      padding: "8px 8px",
                    }}
                    placeholder="End Date"
                    minDate={new Date()}
                    value={inputs.endDate}
                    onChange={(newDates: DateObject) => {
                      setInputs((prev) => ({
                        ...prev,
                        endDate: newDates,
                      }));
                    }}
                    mapDays={({ date }) => {
                      const isRev = dates.some((reserv) => {
                        if (Array.isArray(reserv.bookingDate)) {
                          return reserv.bookingDate.some((booked) => {
                            const bookedDate = new Date(booked);
                            return (
                              bookedDate.getDate() === date.day &&
                              bookedDate.getMonth() === date.month.index &&
                              bookedDate.getFullYear() === date.year
                            );
                          });
                        }
                        return false;
                      });

                      const isOperational = veh?.operationDates?.some(
                        (operationalDate) => {
                          const operationalDateObj = new Date(operationalDate);
                          return (
                            operationalDateObj.getDate() === date.day &&
                            operationalDateObj.getMonth() ===
                              date.month.index &&
                            operationalDateObj.getFullYear() === date.year
                          );
                        }
                      );

                      if (isOperational || isRev)
                        return {
                          disabled: true,
                          style: { color: "red", backgroundColor: "#f5f5f5" },
                        };
                    }}
                  />
                  {/* </div> */}
                </div>

                <div className="flex flex-col gap-y-2 w-3/4 sm:w-1/4 min-w-52">
                  <label>End Time (Optional)</label>
                  <input
                    type="time"
                    value={inputs.time}
                    onChange={(e) =>
                      setInputs({ ...inputs, time: e.target.value })
                    }
                    placeholder="End Time"
                    className="border border-gray-400 p-2 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex w-3/4 justify-center mt-8 md:w-1/3  ">
                <button className="bg-button w-full hover:bg-red-600 p-1 border border-slate-500 rounded-md text-xl md:text-3xl   text-white">
                  Book {isButton ? <ButtonLoader /> : ""}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default VehReservation;
