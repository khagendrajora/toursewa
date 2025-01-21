/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { URL } from "../../config/Config";
import { IVRev } from "../../SharedTypes/Reservations/vehReserv";
import { ITuRev } from "../../SharedTypes/Reservations/TourReservation/tourRevModel";
import { ITrRev } from "../../SharedTypes/Reservations/TrekReservation/TrekRevModel";
import { IFeature } from "../../SharedTypes/Featured/Feature";
import axios from "axios";
import { toast } from "react-toastify";
import { ButtonLoader } from "../../utils/ButtonLoader";
import { useAuthContext } from "../../context/AuthContext";

export const AdminDashboard = () => {
  const [reservation, setReservation] = useState<IVRev[] | []>([]);
  const [trekRev, setTrekRev] = useState<ITrRev[] | []>([]);
  const [tourRev, setTourRev] = useState<ITuRev[] | []>([]);
  const [feature, setFeature] = useState<IFeature[] | []>([]);
  const [isButton, setIsButton] = useState<string | null>(null);
  const [showFeature, setShowFeature] = useState("feature");
  const [showReservation, setShowReservation] = useState("vehicle");
  const { authUser } = useAuthContext();
  const [vehPagination, setVehPagination] = useState<IVRev[]>([]);
  const [vehCurrentPage, setVehCurrentPage] = useState(1);
  const [tourPagination, setTourPagination] = useState<ITuRev[]>([]);
  const [tourCurrentPage, setTourCurrentPage] = useState(1);
  const [trekPagination, setTrekPagination] = useState<ITrRev[]>([]);
  const [trekCurrentPage, setTrekCurrentPage] = useState(1);
  const [featurePagination, setFeaturePagination] = useState<IFeature[]>([]);
  const [featureCurrentPage, setFeatureCurrentPage] = useState(1);
  const [reqPagination, setReqPagination] = useState<IFeature[]>([]);
  const [reqCurrentPage, setReqCurrentPage] = useState(1);
  const itemPerPage = 5;
  let totalVehiclePages = 0;
  let totalTourPages = 0;
  let totalTrekPages = 0;
  let totalFeaturePages = 0;
  let totalReqPages = 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${URL}/api/getallreservations`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data);
        } else {
          const sortedData = data.sort(
            (a: IVRev, b: IVRev) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
          );
          setReservation(sortedData);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${URL}/api/getfeature`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data);
        } else {
          const sortedData = data.sort(
            (a: IFeature, b: IFeature) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
          );
          setFeature(sortedData);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${URL}/api/gettrekrev`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data);
        } else {
          const sortedData = data.sort(
            (a: ITrRev, b: ITrRev) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
          );
          setTrekRev(sortedData);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${URL}/api/gettourrev`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data);
        } else {
          const sortedData = data.sort(
            (a: ITuRev, b: ITuRev) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
          );
          setTourRev(sortedData);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const Accept = async (id: string) => {
    try {
      const confirmed = window.confirm("Add in Featured ?");
      if (confirmed) {
        setIsButton("feature");
        const response = await axios.put(`${URL}/api/addfeature/${id}`, {
          updatedBy: authUser?.loginedId,
        });
        const data = response.data;
        if (data.message) {
          toast.success(data.message);
          setFeature((prev) => prev?.filter((v) => v.Id !== id) || null);
        } else if (data.error) {
          toast.error(data.error);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsButton("");
    }
  };
  const Reject = async (id: string) => {
    try {
      const confirmed = window.confirm("Reject Request ?");
      if (confirmed) {
        setIsButton(id + "feature");
        const response = await axios.delete(
          `${URL}/api/deletefeaturerequest/${id}?updatedBy:${authUser?.loginedId}`
        );
        const data = response.data;
        if (data.message) {
          toast.success(data.message);
          setFeature((prev) => prev?.filter((v) => v.Id !== id) || null);
        } else if (data.error) {
          toast.error(data.error);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsButton("");
    }
  };
  const Remove = async (id: string) => {
    try {
      const confirmed = window.confirm("Remove  ?");
      if (confirmed) {
        setIsButton("feature");
        const response = await axios.delete(
          `${URL}/api/removefeature/${id}?updatedBy=${authUser?.loginedId}`
        );
        const data = response.data;
        if (data.message) {
          toast.success(data.message);
          setFeature((prev) => prev?.filter((v) => v.Id !== id) || null);
        } else if (data.error) {
          toast.error(data.error);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsButton("");
    }
  };

  const handleFeatureChange = (page: number) => {
    if (featureCurrentPage > 0 && page <= totalFeaturePages) {
      setFeatureCurrentPage(page);
    }
  };
  const handleReqChange = (page: number) => {
    if (reqCurrentPage > 0 && page <= totalReqPages) {
      setReqCurrentPage(page);
    }
  };
  const handleTourChange = (page: number) => {
    if (tourCurrentPage > 0 && page <= totalTourPages) {
      setTourCurrentPage(page);
    }
  };
  const handleTrekChange = (page: number) => {
    if (trekCurrentPage > 0 && page <= totalTrekPages) {
      setTrekCurrentPage(page);
    }
  };
  const handleVehChange = (page: number) => {
    if (vehCurrentPage > 0 && page <= totalVehiclePages) {
      setVehCurrentPage(page);
    }
  };

  const filterFeature = feature.filter((f) => f.status == "Pending");
  const AcceptedFeature = feature.filter((f) => f.status == "Accepted");
  totalVehiclePages = Math.ceil(reservation?.length / itemPerPage);
  totalTourPages = Math.ceil(tourRev?.length / itemPerPage);
  totalTrekPages = Math.ceil(trekRev?.length / itemPerPage);
  totalFeaturePages = Math.ceil(AcceptedFeature?.length / itemPerPage);
  totalReqPages = Math.ceil(filterFeature?.length / itemPerPage);

  useEffect(() => {
    setVehPagination(
      reservation.slice(
        (vehCurrentPage - 1) * itemPerPage,
        vehCurrentPage * itemPerPage
      )
    );
  }, [vehCurrentPage, reservation]);

  useEffect(() => {
    setTourPagination(
      tourRev.slice(
        (tourCurrentPage - 1) * itemPerPage,
        tourCurrentPage * itemPerPage
      )
    );
  }, [tourCurrentPage, tourRev]);

  useEffect(() => {
    setTrekPagination(
      trekRev.slice(
        (trekCurrentPage - 1) * itemPerPage,
        trekCurrentPage * itemPerPage
      )
    );
  }, [trekCurrentPage, trekRev]);

  useEffect(() => {
    setFeaturePagination(
      AcceptedFeature.slice(
        (featureCurrentPage - 1) * itemPerPage,
        featureCurrentPage * itemPerPage
      )
    );
  }, [featureCurrentPage, feature]);

  useEffect(() => {
    setReqPagination(
      filterFeature.slice(
        (reqCurrentPage - 1) * itemPerPage,
        reqCurrentPage * itemPerPage
      )
    );
  }, [reqCurrentPage, feature]);

  return (
    <>
      <div className="flex p-3 bg-white flex-col gap-5">
        <div className="flex">
          <button
            className={`border-2 p-1 ${
              showFeature == "feature" ? "bg-button" : ""
            }`}
            onClick={() => {
              setShowFeature("feature");
            }}
          >
            Featured Products{" "}
            <span className="text-lime-500">({AcceptedFeature.length})</span>
          </button>
          <button
            className={`border-2 p-1 ${
              showFeature == "request" ? "bg-button" : ""
            }`}
            onClick={() => {
              setShowFeature("request");
            }}
          >
            Add To Feature Requests{" "}
            <span className="text-red-800">({filterFeature.length})</span>
          </button>
        </div>
        {showFeature === "feature" && AcceptedFeature.length > 0 && (
          <div className="bg-white flex flex-col justify-start item-start  rounded-lg pt-4 pb-10 gap-5">
            <div className="font-semibold text-lg text-button underline w-fit p-2">
              Featured Products
            </div>
            <div className=" flex justify-start flex-col items-start text-xs">
              <div className="relative overflow-x-auto shadow-md rounded-sm">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="px-4  py-3">Product&nbsp;Name</th>
                      <th className="px-4  py-3">Requested&nbsp;By</th>
                      <th className="px-4  py-3">Status</th>
                      <th className="px-4  py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {featurePagination.map((data, i) => (
                      <>
                        <tr
                          key={data?._id}
                          className={`${
                            i % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="px-4  py-3">{data?.name}</td>
                          <td className="px-4  py-3">{data?.businessName}</td>
                          <td className="px-4  py-3">{data?.status}</td>
                          <td className="px-4  py-3">
                            <button
                              onClick={() => Remove(data.Id)}
                              className="bg-red-600 text-white hover:text-black  rounded p-1"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col w-full items-start text-slate-400 text-xs p-2">
                <span className=" ">
                  Showing{" "}
                  <span className="font-semibold">
                    {(featureCurrentPage - 1) * itemPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold ">
                    {Math.min(
                      featureCurrentPage * itemPerPage,
                      AcceptedFeature.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold">
                    {AcceptedFeature.length}
                  </span>{" "}
                  Entries
                </span>
                <div className="inline-flex mt-[1px] xs:mt-0">
                  <button
                    className="flex items-center justify-center cursor-pointer  text-xs p-1 rounded-s hover:text-black"
                    onClick={() => handleFeatureChange(featureCurrentPage - 1)}
                    disabled={featureCurrentPage === 1}
                  >
                    <svg
                      className="w-3 me-1 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 5H1m0 0 4 4M1 5l4-4"
                      />
                    </svg>
                    Prev
                  </button>

                  <button
                    className="flex items-center justify-center cursor-pointer  text-xs p-1 rounded-s hover:text-black"
                    onClick={() => handleFeatureChange(featureCurrentPage + 1)}
                    disabled={featureCurrentPage === totalFeaturePages}
                  >
                    Next
                    <svg
                      className="w-3 ms-1 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showFeature === "request" && filterFeature.length > 0 && (
          <div className="bg-white flex flex-col justify-start items-start rounded-lg pt-4 pb-10 gap-5">
            <div className="font-semibold text-lg underline text-button w-fit p-2">
              Add to Feature Requests
            </div>
            <div className=" flex justify-start flex-col items-center text-xs">
              <div className="relative overflow-x-auto shadow-md rounded-sm">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-200  dark:text-gray-400">
                    <tr>
                      <th className="px-4  py-3 ">Product Name</th>
                      <th className="px-4  py-3 ">Requested By</th>
                      <th className="px-4  py-3 ">Status</th>
                      <th className="px-4  py-3 ">Action</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {reqPagination.map((data) => (
                      <>
                        <tr key={data?._id}>
                          <td className="px-4  py-3 ">{data?.name}</td>
                          <td className="px-4  py-3 ">{data?.businessName}</td>
                          <td className="px-4  py-3 ">{data?.status}</td>
                          <td className="px-4  py-3 ">
                            <div className="flex gap-6">
                              {data.status == "Accepted" ? (
                                ""
                              ) : (
                                <button
                                  onClick={() => Accept(data.Id)}
                                  className="bg-lime-600 text-white hover:text-button rounded-md p-1"
                                >
                                  Accept{" "}
                                  {isButton == data.Id + "feature" ? (
                                    <ButtonLoader />
                                  ) : (
                                    ""
                                  )}
                                </button>
                              )}
                              <button
                                onClick={() => Reject(data.Id)}
                                className="bg-red-600 text-white hover:text-black rounded-md p-1"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col w-full items-start text-slate-400 text-xs p-2">
                <span className=" ">
                  Showing{" "}
                  <span className="font-semibold">
                    {(reqCurrentPage - 1) * itemPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold ">
                    {Math.min(
                      reqCurrentPage * itemPerPage,
                      filterFeature.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold">{filterFeature.length}</span>{" "}
                  Entries
                </span>
                <div className="inline-flex mt-[1px] xs:mt-0">
                  <button
                    className="flex items-center justify-center cursor-pointer  text-xs p-1 rounded-s hover:text-black"
                    onClick={() => handleReqChange(reqCurrentPage - 1)}
                    disabled={reqCurrentPage === 1}
                  >
                    <svg
                      className="w-3 me-1 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 5H1m0 0 4 4M1 5l4-4"
                      />
                    </svg>
                    Prev
                  </button>

                  <button
                    className="flex items-center justify-center cursor-pointer  text-xs p-1 rounded-s hover:text-black"
                    onClick={() => handleReqChange(reqCurrentPage + 1)}
                    disabled={reqCurrentPage === totalReqPages}
                  >
                    Next
                    <svg
                      className="w-3 ms-1 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex">
          <button
            className={`border-2 p-1 ${
              showReservation == "vehicle" ? "bg-button" : ""
            }`}
            onClick={() => {
              setShowReservation("vehicle");
            }}
          >
            Vehicle Reservation{" "}
            <span className="text-lime-500">({reservation.length})</span>
          </button>
          <button
            className={`border-2 p-1 ${
              showReservation == "trek" ? "bg-button" : ""
            }`}
            onClick={() => {
              setShowReservation("trek");
            }}
          >
            Trek Reservation{" "}
            <span className="text-red-800">({trekRev.length})</span>
          </button>
          <button
            className={`border-2 p-1 ${
              showReservation == "tour" ? "bg-button" : ""
            }`}
            onClick={() => {
              setShowReservation("tour");
            }}
          >
            Tour Reservation{" "}
            <span className="text-red-800">({tourRev.length})</span>
          </button>
        </div>
        {showReservation === "vehicle" && reservation.length > 0 && (
          <div className="bg-white flex flex-col justify-start items-start  rounded-lg pt-4 pb-10 gap-5">
            <div className="font-semibold underline text-lg text-button w-fit p-2">
              Recent Vehicle Reservations
            </div>
            <div className=" flex justify-start flex-col items-start text-xs">
              <div className="relative overflow-x-auto shadow-md rounded-sm">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="px-4  py-3">Booking&nbsp;ID</th>
                      <th className="px-4  py-3"> Vehicle&nbsp;Number</th>
                      <th className="px-4  py-3 "> Booked&nbsp;By</th>
                      <th className="px-4  py-3 "> Start&nbsp;Date</th>
                      <th className="px-4  py-3 "> End&nbsp;Date</th>
                      <th className="px-4  py-3 ">Status</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {vehPagination.map((data) => (
                      <>
                        <tr key={data?._id}>
                          <td className="px-4 py-3 ">{data?.bookingId}</td>
                          <td className="px-4 py-3">{data?.vehicleNumber}</td>
                          <td className="px-4  py-3">{data?.bookedByName}</td>
                          <td className="px-4  py-3">
                            {data?.startDate?.toString().split("T")[0]}
                          </td>
                          <td className="px-4  py-3">
                            {data?.endDate?.toString().split("T")[0]}
                          </td>
                          <td className=" px-4  py-3">{data?.status}</td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col w-full items-start text-slate-400 text-xs p-2">
                <span className=" ">
                  Showing{" "}
                  <span className="font-semibold">
                    {(vehCurrentPage - 1) * itemPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold ">
                    {Math.min(vehCurrentPage * itemPerPage, reservation.length)}
                  </span>{" "}
                  of <span className="font-semibold">{reservation.length}</span>{" "}
                  Entries
                </span>
                <div className="inline-flex mt-[1px] xs:mt-0">
                  <button
                    className="flex items-center justify-center cursor-pointer  text-xs p-1 rounded-s hover:text-black"
                    onClick={() => handleVehChange(vehCurrentPage - 1)}
                    disabled={vehCurrentPage === 1}
                  >
                    <svg
                      className="w-3 me-1 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 5H1m0 0 4 4M1 5l4-4"
                      />
                    </svg>
                    Prev
                  </button>

                  <button
                    className="flex items-center justify-center cursor-pointer  text-xs p-1 rounded-s hover:text-black"
                    onClick={() => handleVehChange(vehCurrentPage + 1)}
                    disabled={vehCurrentPage === totalVehiclePages}
                  >
                    Next
                    <svg
                      className="w-3 ms-1 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showReservation === "trek" && trekRev.length > 0 && (
          <div className="bg-white flex flex-col justify-start items-start rounded-lg pt-4 pb-10 gap-5">
            <div className="font-semibold underline text-lg text-button w-fit p-2">
              Recent Trek Reservations
            </div>
            <div className=" flex justify-start flex-col items-start text-xs">
              <div className="relative overflow-x-auto shadow-md rounded-sm">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="px-4  py-3 ">Booking&nbsp;ID</th>
                      <th className="px-4  py-3 ">Trek&nbsp;Name</th>
                      <th className="px-4  py-3 ">Booked&nbsp;By</th>
                      <th className="px-4  py-3 "> Booking&nbsp;Name</th>
                      <th className="px-4  py-3 "> Date</th>
                      <th className="px-4  py-3 ">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trekPagination.map((data) => (
                      <>
                        <tr key={data?._id}>
                          <td className="px-4  py-3 ">{data?.bookingId}</td>
                          <td className="px-4  py-3 ">{data?.trekName}</td>
                          <td className="px-4  py-3 ">{data?.bookedBy}</td>
                          <td className="px-4  py-3 ">{data?.passengerName}</td>
                          <td className="min-w-[80px]  py-3 ">
                            {data?.date?.toString().split("T")[0]}
                          </td>
                          <td className="px-4 py-3">{data?.status}</td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col w-full items-start text-slate-400 text-xs p-2">
                <span className=" ">
                  Showing{" "}
                  <span className="font-semibold">
                    {(trekCurrentPage - 1) * itemPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold ">
                    {Math.min(trekCurrentPage * itemPerPage, trekRev.length)}
                  </span>{" "}
                  of <span className="font-semibold">{trekRev.length}</span>{" "}
                  Entries
                </span>
                <div className="inline-flex mt-[1px] xs:mt-0">
                  <button
                    className="flex items-center justify-center cursor-pointer  text-xs p-1 rounded-s hover:text-black"
                    onClick={() => handleTrekChange(trekCurrentPage - 1)}
                    disabled={trekCurrentPage === 1}
                  >
                    <svg
                      className="w-3 me-1 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 5H1m0 0 4 4M1 5l4-4"
                      />
                    </svg>
                    Prev
                  </button>

                  <button
                    className="flex items-center justify-center cursor-pointer  text-xs p-1 rounded-s hover:text-black"
                    onClick={() => handleTrekChange(trekCurrentPage + 1)}
                    disabled={trekCurrentPage === totalTrekPages}
                  >
                    Next
                    <svg
                      className="w-3 ms-1 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showReservation === "tour" && tourRev.length > 0 && (
          <div className="bg-white flex flex-col justify-start items-start rounded-lg pt-4 pb-10 gap-5">
            <div className="font-semibold underline text-lg text-button w-fit p-2">
              Recent Tour Reservations
            </div>
            <div className=" flex justify-center flex-col items-center text-xs">
              <div className="relative overflow-x-auto shadow-md rounded-sm">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="px-4  py-3 ">Booking&nbsp;ID</th>
                      <th className="px-4  py-3 ">Tour&nbsp;Name</th>
                      <th className="px-4  py-3 ">Booked&nbsp;By</th>
                      <th className="px-4  py-3"> Booking&nbsp;Name</th>
                      <th className=" px-4  py-3"> Date </th>
                      <th className="px-4  py-3 ">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tourPagination.map((data) => (
                      <>
                        <tr key={data?._id}>
                          <td className="px-4  py-3 ">{data?.bookingId}</td>
                          <td className="px-4  py-3">{data?.tourName}</td>
                          <td className=" px-4  py-3">{data?.bookedBy}</td>
                          <td className="px-4  py-3 ">{data?.passengerName}</td>
                          <td className=" min-w-[80px]">
                            {data?.date?.toString().split("T")[0]}
                          </td>
                          <td className="px-4  py-3">{data?.status}</td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col w-full items-start text-slate-400 text-xs p-2">
                <span className=" ">
                  Showing{" "}
                  <span className="font-semibold">
                    {(tourCurrentPage - 1) * itemPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold ">
                    {Math.min(tourCurrentPage * itemPerPage, tourRev.length)}
                  </span>{" "}
                  of <span className="font-semibold">{tourRev.length}</span>{" "}
                  Entries
                </span>
                <div className="inline-flex mt-[1px] xs:mt-0">
                  <button
                    className="flex items-center justify-center cursor-pointer  text-xs p-1 rounded-s hover:text-black"
                    onClick={() => handleTourChange(tourCurrentPage - 1)}
                    disabled={tourCurrentPage === 1}
                  >
                    <svg
                      className="w-3 me-1 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 5H1m0 0 4 4M1 5l4-4"
                      />
                    </svg>
                    Prev
                  </button>

                  <button
                    className="flex items-center justify-center cursor-pointer  text-xs p-1 rounded-s hover:text-black"
                    onClick={() => handleTourChange(tourCurrentPage + 1)}
                    disabled={tourCurrentPage === totalTourPages}
                  >
                    Next
                    <svg
                      className="w-3 ms-1 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
