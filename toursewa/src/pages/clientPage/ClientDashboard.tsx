/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthContext } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { URL } from "../../config/Config";
import { IStatus, IVRev } from "../../SharedTypes/Reservations/vehReserv";
import { ButtonLoader } from "../../utils/ButtonLoader";
import { ITuRev } from "../../SharedTypes/Reservations/TourReservation/tourRevModel";
import { ITrRev } from "../../SharedTypes/Reservations/TrekReservation/TrekRevModel";

export const ClientDashboard = () => {
  const { authUser } = useAuthContext();
  const id = authUser?.userId;
  const [vehRev, setVehRev] = useState<IVRev[] | null>([]);
  const [tourRev, setTourRev] = useState<ITuRev[] | null>([]);
  const [trekRev, setTrekRev] = useState<ITrRev[] | null>([]);
  const [search, setSearch] = useState<string>("");
  const [filterSearch, SetFilterSearch] = useState<IVRev[] | null>(null);
  const [isButton, setIsButton] = useState(false);

  useEffect(() => {
    const fetchVehRev = async () => {
      try {
        const res = await fetch(`${URL}/api/getclientrev/${id}`);
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

  console.log(vehRev);

  useEffect(() => {
    const fetchVehRev = async () => {
      try {
        const res = await fetch(`${URL}/api/gettourrevbyuserid/${id}`);
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          const sortedData = data.sort(
            (a: ITuRev, b: ITuRev) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
          );
          setTourRev(sortedData);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchVehRev();
  }, []);
  useEffect(() => {
    const fetchVehRev = async () => {
      try {
        const res = await fetch(`${URL}/api/gettrekrevbyuserid/${id}`);
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          const sortedData = data.sort(
            (a: ITrRev, b: ITrRev) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
          );
          setTrekRev(sortedData);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchVehRev();
  }, []);

  const updateRev = async (
    id: string,
    updateInput: {
      status: string;
      bookingId: string;
      email: string;
    }
  ) => {
    try {
      const confirmed = window.confirm("Cancel Booking");
      if (confirmed) {
        setIsButton(true);
        const res = await fetch(`${URL}/api/updateRevStatusbyclient/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateInput),
        });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error);
        } else {
          toast.success("Booking Canceled");
          setVehRev((prevData) =>
            prevData
              ? prevData.map((rev) =>
                  rev.bookingId === id
                    ? { ...rev, status: updateInput.status as IStatus }
                    : rev
                )
              : null
          );
        }
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsButton(false);
    }
  };

  const updateTrRev = async (
    id: string,
    updateInput: {
      status: string;
      bookingId: string;
      email: string;
    }
  ) => {
    try {
      const confirmed = window.confirm("Cancel Booking");
      if (confirmed) {
        setIsButton(true);
        const res = await fetch(
          `${URL}/api/updatetrekRevStatusbyclient/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateInput),
          }
        );
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error);
        } else {
          toast.success("Booking Canceled");
          setVehRev((prevData) =>
            prevData
              ? prevData.map((rev) =>
                  rev.bookingId === id
                    ? { ...rev, status: updateInput.status as IStatus }
                    : rev
                )
              : null
          );
        }
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsButton(false);
    }
  };

  const updateTuRev = async (
    id: string,
    updateInput: {
      status: string;
      bookingId: string;
      email: string;
    }
  ) => {
    try {
      const confirmed = window.confirm("Cancel Booking");
      if (confirmed) {
        setIsButton(true);
        const res = await fetch(
          `${URL}/api/updatetourRevStatusbyclient/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateInput),
          }
        );
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error);
        } else {
          toast.success("Booking Canceled");
          setVehRev((prevData) =>
            prevData
              ? prevData.map((rev) =>
                  rev.bookingId === id
                    ? { ...rev, status: updateInput.status as IStatus }
                    : rev
                )
              : null
          );
        }
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsButton(false);
    }
  };

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

  return (
    <>
      <ToastContainer theme="colored" position="top-center" />
      <div className="w-full  bg-blue-50 p-10">
        <div className="flex flex-col gap-10">
          <h1 className="font-semibold text-xl">My Reservations</h1>
          <div className=" flex w-full flex-wrap flex-col md:flex-row justify-center gap-5 p-2 mx-auto">
            <div className="w-full  md:w-2/3 rounded-2xl p-1 pt-3 ">
              <div className="flex flex-col gap-y-10">
                {/* {vehRev && vehRev.length > 0 ? ( */}
                <div className="w-full flex justify-center">
                  <input
                    type="text"
                    placeholder="search"
                    className="p-3 w-full rounded-md border sm:w-1/2"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                {/* ) : (
                  ""
                )} */}
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
                            {filter.status != "Fulfilled" &&
                              filter.status != "Canceled" &&
                              filter.status != "Approved" && (
                                <div className="flex justify-start">
                                  <button
                                    className="bg-red-500 p-1 rounded-md hover:bg-red-600"
                                    onClick={() => {
                                      const updateInputs = {
                                        bookingId: filter.bookingId,
                                        email: filter.email || "",
                                        status: "Canceled",
                                      };
                                      updateRev(filter._id || "", updateInputs);
                                    }}
                                  >
                                    Cancel {isButton ? <ButtonLoader /> : ""}
                                  </button>
                                </div>
                              )}
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
                {vehRev && vehRev?.length > 0 && (
                  <h1 className="font-semibold text-xl">
                    Vehicle Reservations
                  </h1>
                )}
                {vehRev &&
                  filterSearch?.length === 0 &&
                  vehRev.map((data, i) => (
                    <>
                      <div
                        key={i}
                        className="w-full  bg-white p-4 text-xs  md:text-sm rounded-lg"
                      >
                        {/* <h1>{i + 1}.</h1> */}
                        <div className="flex flex-wrap gap-y-5 justify-between">
                          <div className="w-full md:w-1/3 lg:w-1/5 overflow-x-auto  flex flex-col justify-evenly gap-y-4">
                            <img src="/BoudhanathStupa.jpg" alt="image" />
                            {data.status != "Fulfilled" &&
                              data.status != "Canceled" &&
                              data.status != "Approved" && (
                                <div className="flex justify-start">
                                  <button
                                    className="bg-red-500 p-1 rounded-md hover:bg-red-600"
                                    onClick={() => {
                                      const updateInputs = {
                                        bookingId: data.bookingId,
                                        email: data.email || "",
                                        status: "Canceled",
                                      };
                                      updateRev(data._id || "", updateInputs);
                                    }}
                                  >
                                    Cancel {isButton ? <ButtonLoader /> : ""}
                                  </button>
                                </div>
                              )}
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
                {trekRev && trekRev.length > 0 && (
                  <h1 className="font-semibold text-xl">Trek Reservations</h1>
                )}
                {trekRev &&
                  filterSearch?.length === 0 &&
                  trekRev.map((data, i) => (
                    <>
                      <div
                        key={i}
                        className="w-full  bg-white p-4 text-xs  md:text-sm rounded-lg"
                      >
                        {/* <h1>{i + 1}.</h1> */}
                        <div className="flex flex-wrap gap-y-5 justify-between">
                          <div className="w-full md:w-1/3 lg:w-1/5 overflow-x-auto  flex flex-col justify-evenly gap-y-4">
                            <img src="/BoudhanathStupa.jpg" alt="image" />
                            {data.status != "Completed" &&
                              data.status != "Canceled" &&
                              data.status != "Approved" && (
                                <div className="flex justify-start">
                                  <button
                                    className="bg-red-500 p-1 rounded-md hover:bg-red-600"
                                    onClick={() => {
                                      const updateInputs = {
                                        bookingId: data.bookingId,
                                        email: data.email || "",
                                        status: "Canceled",
                                      };
                                      updateTrRev(data._id || "", updateInputs);
                                    }}
                                  >
                                    Cancel {isButton ? <ButtonLoader /> : ""}
                                  </button>
                                </div>
                              )}
                          </div>
                          <div className="space-y-4">
                            <h1 className="flex gap-3 font-semibold">
                              Booking Id:{" "}
                              <span className="font-normal text-zinc-500">
                                {data.bookingId}
                              </span>
                            </h1>

                            <h1 className="flex gap-3 font-semibold">
                              Trek Name{" "}
                              <span className="font-normal text-zinc-500">
                                {" "}
                                {data.trekName}
                              </span>
                            </h1>

                            <h1 className="flex gap-3 font-semibold">
                              Start Date :
                              <span className="font-normal text-zinc-500">
                                {data.date?.toString().split("T")[0]}
                              </span>
                            </h1>
                          </div>
                          <div className="space-y-4"> </div>
                          <div className="space-y-4">
                            <h1 className="flex gap-3 font-semibold">
                              Booking Name:{" "}
                              <span className="font-normal text-zinc-500">
                                {data.passengerName}{" "}
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
                                    : data.status === "Completed"
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
                {tourRev && tourRev.length > 0 && (
                  <h1 className="font-semibold text-xl">Tour Reservations</h1>
                )}
                {tourRev &&
                  filterSearch?.length === 0 &&
                  tourRev.map((data, i) => (
                    <>
                      <div
                        key={i}
                        className="w-full  bg-white p-4 text-xs  md:text-sm rounded-lg"
                      >
                        {/* <h1>{i + 1}.</h1> */}
                        <div className="flex flex-wrap gap-y-5 justify-between">
                          <div className="w-full md:w-1/3 lg:w-1/5 overflow-x-auto  flex flex-col justify-evenly gap-y-4">
                            <img src="/BoudhanathStupa.jpg" alt="image" />
                            {data.status != "Completed" &&
                              data.status != "Canceled" &&
                              data.status != "Approved" && (
                                <div className="flex justify-start">
                                  <button
                                    className="bg-red-500 p-1 rounded-md hover:bg-red-600"
                                    onClick={() => {
                                      const updateInputs = {
                                        bookingId: data.bookingId,
                                        email: data.email || "",
                                        status: "Canceled",
                                      };
                                      updateTuRev(data._id || "", updateInputs);
                                    }}
                                  >
                                    Cancel {isButton ? <ButtonLoader /> : ""}
                                  </button>
                                </div>
                              )}
                          </div>
                          <div className="space-y-4">
                            <h1 className="flex gap-3 font-semibold">
                              Booking Id:{" "}
                              <span className="font-normal text-zinc-500">
                                {data.bookingId}
                              </span>
                            </h1>

                            <h1 className="flex gap-3 font-semibold">
                              Tour Name{" "}
                              <span className="font-normal text-zinc-500">
                                {" "}
                                {data.tourName}
                              </span>
                            </h1>

                            <h1 className="flex gap-3 font-semibold">
                              Start Date :
                              <span className="font-normal text-zinc-500">
                                {data.date?.toString().split("T")[0]}
                              </span>
                            </h1>
                          </div>
                          <div className="space-y-4"> </div>
                          <div className="space-y-4">
                            <h1 className="flex gap-3 font-semibold">
                              Booking Name:{" "}
                              <span className="font-normal text-zinc-500">
                                {data.passengerName}{" "}
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
                                    : data.status === "Completed"
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
