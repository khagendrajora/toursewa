/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { URL } from "../../config/Config";
import { IVRev } from "../../../../backend/src/models/Reservations/vehReserv";
import { ITuRev } from "../../../../backend/src/models/Reservations/TourReservation/tourRevModel";
import { ITrRev } from "../../../../backend/src/models/Reservations/TrekReservation/TrekRevModel";
import { IFeature } from "../../../../backend/src/models/Featured/Feature";
import axios from "axios";
import { toast } from "react-toastify";
import { ButtonLoader } from "../../utils/ButtonLoader";

export const AdminDashboard = () => {
  const [reservation, setReservation] = useState<IVRev[] | []>([]);
  const [trekRev, setTrekRev] = useState<ITrRev[] | []>([]);
  const [tourRev, setTourRev] = useState<ITuRev[] | []>([]);
  const [feature, setFeature] = useState<IFeature[] | []>([]);
  const [isButton, setIsButton] = useState<string | null>(null);
  const [showFeature, setShowFeature] = useState("feature");
  const [showReservation, setShowReservation] = useState("vehicle");

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
      const confirmed = window.confirm("Request to Add in Featured ");
      if (confirmed) {
        setIsButton("feature");
        const response = await axios.put(`${URL}/api/addfeature/${id}`);
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
          `${URL}/api/deletefeaturerequest/${id}`
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
        const response = await axios.delete(`${URL}/api/removefeature/${id}`);
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

  const filterFeature = feature.filter((f) => f.status == "Pending");

  const AcceptedFeature = feature.filter((f) => f.status == "Accepted");

  console.log(tourRev);
  return (
    <>
      <div className="flex p-3 bg-white flex-col gap-5">
        {/* <div className="flex flex-wrap justify-center lg:justify-between mt-3  gap-6">
          <div className="bg-[#7dd3fc] w-11/12 sm:max-w-60 md:max-w-80 text-center text-white font-bold   rounded-md">
            <div className="flex flex-col justify-center p-5 ">
              <h2>Users</h2>
            </div>
            <div className="mb-auto w-full bg-black/10">
              <Link to="">
                More Info &nbsp;
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
          </div>

          <div className="bg-[#f43f5e] w-11/12 sm:max-w-60 md:max-w-80 text-center text-white font-bold    rounded-md">
            <div className="flex flex-col justify-center p-5 ">
              <h2>Blogs</h2>
            </div>
            <div className="mb-auto w-full bg-black/10 cursor-pointer">
              <Link
                to="/admin/blogs"
                className={`${isActive("/admin/blogs") ? "bg-blue-500" : ""}`}
              >
                More Info
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
          </div>

          <div className="bg-[#3b82f6] w-11/12 sm:max-w-60 md:max-w-80 text-center text-white font-bold   rounded-md">
            <div className="flex flex-col justify-center p-5 ">
              <h2>Tour</h2>
            </div>
            <div className="mb-auto w-full bg-black/10 cursor-pointer">
              <Link to="/admin/tour">
                More Info
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
          </div>

          <div className="bg-[#3b82f6] w-11/12 sm:max-w-60 md:max-w-80 text-center text-white font-bold   rounded-md">
            <div className="flex flex-col justify-center p-5 ">
              <h2>Trek</h2>
            </div>
            <div className="mb-auto w-full bg-black/10 cursor-pointer">
              <Link to="/admin/trek">
                More Info
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
          </div>

          <div className="bg-[#22c55e] w-11/12 sm:max-w-60 md:max-w-80 text-center text-white font-bold   rounded-md">
            <div className="flex flex-col justify-center p-5 ">
              <h2>Business</h2>
            </div>
            <div className="mb-auto w-full bg-black/10">
              <Link
                to="/admin/business"
                className={`${
                  isActive("/admin/business") ? "bg-blue-500" : ""
                }`}
              >
                More Info
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
          </div>
          <div className="bg-[#22c55e] w-11/12 sm:max-w-60 md:max-w-80 text-center text-white font-bold   rounded-md">
            <div className="flex flex-col justify-center p-5 ">
              <h2>Vehicle</h2>
            </div>
            <div className="mb-auto w-full bg-black/10">
              <Link
                to="/admin/vehicle"
                className={`${isActive("/admin/vehicle") ? "bg-blue-500" : ""}`}
              >
                More Info
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
          </div>
        </div> */}
        <div className="flex">
          <button
            className={`border p-1 ${
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
            className={`border p-1 ${
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
          <div className="bg-white flex flex-col justify-center items-center  rounded-lg p-3 gap-5">
            <div className="font-semibold text-lg text-button w-fit p-2">
              Featured Products
            </div>
            <div className="w-full max-w-full flex justify-center overflow-x-auto">
              <table className="table-auto border-collapse border border-slate-400 text-xs md:text-sm">
                <thead>
                  <tr>
                    <th className="border border-slate-400 p-1 min-w-[70px] font-semibold">
                      Product Name
                    </th>
                    <th className="border border-slate-400 p-1 min-w-[70px] font-semibold">
                      Requested By
                    </th>
                    <th className="border  border-slate-400 p-1 min-w-[100px] font-semibold">
                      Status
                    </th>
                    <th className="border border-slate-400 p-2 font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {AcceptedFeature.slice(0, 5).map((data) => (
                    <>
                      <tr key={data?._id}>
                        <td className="border border-slate-400 text-center">
                          {data?.name}
                        </td>
                        <td className="border border-slate-400 text-center">
                          {data?.businessName}
                        </td>
                        <td className="border border-slate-400 text-center">
                          {data?.status}
                        </td>
                        <td className="border  border-slate-400 text-center p-2">
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
          </div>
        )}
        {showFeature === "request" && filterFeature.length > 0 && (
          <div className="bg-white flex flex-col justify-center items-center rounded-lg p-3 gap-5">
            <div className="font-semibold text-lg text-button w-fit p-2">
              Add to Feature Requests
            </div>
            <div className="w-full max-w-full flex  justify-center overflow-x-auto">
              <table className="table-auto border-collapse border border-slate-400 text-xs md:text-sm">
                <thead>
                  <tr>
                    <th className="border border-slate-400 p-1 min-w-[70px] font-semibold">
                      Product Name
                    </th>
                    <th className="border border-slate-400 p-1 min-w-[70px] font-semibold">
                      Requested By
                    </th>
                    <th className="border  border-slate-400 p-1 min-w-[100px] font-semibold">
                      Status
                    </th>
                    <th className="border border-slate-400 p-2 font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {filterFeature.slice(0, 5).map((data) => (
                    <>
                      <tr key={data?._id}>
                        <td className="border border-slate-400 text-center">
                          {data?.name}
                        </td>
                        <td className="border border-slate-400 text-center">
                          {data?.businessName}
                        </td>
                        <td className="border border-slate-400 text-center">
                          {data?.status}
                        </td>
                        <td className="border  border-slate-400 text-center  text-white p-2">
                          <div className="flex gap-6">
                            {data.status == "Accepted" ? (
                              ""
                            ) : (
                              <button
                                onClick={() => Accept(data.Id)}
                                className="bg-lime-600  hover:text-button rounded-md p-1"
                                title="Full Info"
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
                              className="bg-red-600  hover:text-black rounded-md p-1"
                              // title="Full Info"
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
          </div>
        )}

        <div className="flex">
          <button
            className={`border p-1 ${
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
            className={`border p-1 ${
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
            className={`border p-1 ${
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
          <div className="bg-white flex flex-col justify-center items-center  rounded-lg p-3 gap-5">
            <div className="font-semibold text-lg text-button w-fit p-2">
              Recent Vehicle Reservations
            </div>
            <div className="w-full max-w-full flex  justify-center overflow-x-auto">
              <table className="table-auto border-collapse border border-slate-400 text-xs md:text-sm">
                <thead>
                  <tr>
                    <th className="border border-slate-400 p-1 min-w-[70px] font-semibold">
                      Booking ID
                    </th>
                    <th className="border border-slate-400 p-1 min-w-[70px] font-semibold">
                      Vehicle ID
                    </th>
                    <th className="border  border-slate-400 p-1 min-w-[100px] font-semibold">
                      {" "}
                      Vehicle Number
                    </th>

                    <th className="border border-slate-400  p-2 font-semibold">
                      {" "}
                      BookedBy
                    </th>
                    <th className="border border-slate-400 p-2 min-w-[110px] font-semibold">
                      {" "}
                      Booking Name
                    </th>

                    <th className="border border-slate-400 p-2 font-semibold">
                      {" "}
                      Phone{" "}
                    </th>
                    <th className="border border-slate-400 p-2 min-w-[75px] font-semibold">
                      {" "}
                      Start Date
                    </th>
                    <th className="border border-slate-400 p-2 min-w-[75px] font-semibold">
                      {" "}
                      End Date{" "}
                    </th>
                    <th className="border border-slate-400 p-2 font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {reservation.slice(0, 5).map((data) => (
                    <>
                      <tr key={data?._id}>
                        <td className="border border-slate-400 text-center">
                          {data?.bookingId}
                        </td>
                        <td className="border border-slate-400 text-center">
                          {data?.vehicleId}
                        </td>
                        <td className="border  border-slate-400 text-center">
                          {data?.vehicleNumber}
                        </td>

                        <td className="border border-slate-400 p-1 text-center">
                          {data?.bookedByName}
                        </td>

                        <td className="border border-slate-400  p-1 text-center">
                          {data?.bookingName}
                        </td>

                        <td className="border border-slate-400 p-2 text-center">
                          {data?.phone}
                        </td>

                        <td className="border border-slate-400 p-1 text-center">
                          {data?.startDate?.toString().split("T")[0]}
                        </td>
                        <td className="border border-slate-400 p-1 text-center">
                          {data?.endDate?.toString().split("T")[0]}
                        </td>
                        <td className="border border-slate-400 p-1 text-button text-center">
                          {data?.status}
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {showReservation === "trek" && trekRev.length > 0 && (
          <div className="bg-white flex flex-col justify-center items-center rounded-lg p-3 gap-5">
            <div className="font-semibold text-lg text-button w-fit p-2">
              Recent Trek Reservations
            </div>
            <div className="w-full max-w-full flex  justify-center overflow-x-auto">
              <table className="table   border-collapse border border-slate-400 text-xs md:text-sm">
                <thead>
                  <tr>
                    <th className="border border-slate-400 p-1 min-w-[70px] font-semibold">
                      Booking ID
                    </th>
                    <th className="border border-slate-400 p-1 min-w-[70px] font-semibold">
                      Trek Name
                    </th>
                    {/* <th className="border  border-slate-400 p-2 font-semibold">
                      {" "}
                      Vehicle Number
                    </th> */}

                    <th className="border border-slate-400  p-2 font-semibold">
                      {" "}
                      BookedBy
                    </th>
                    <th className="border border-slate-400 p-2 min-w-[100px] font-semibold">
                      {" "}
                      Booking Name
                    </th>

                    <th className="border border-slate-400 p-2 font-semibold">
                      {" "}
                      Phone{" "}
                    </th>
                    <th className="border border-slate-400 p-2 font-semibold">
                      {" "}
                      Date
                    </th>
                    {/* <th className="border border-slate-400 p-2 font-semibold"> End Date </th> */}
                    <th className="border border-slate-400 p-2 font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {trekRev.slice(0, 5).map((data) => (
                    <>
                      <tr key={data?._id}>
                        <td className="border border-slate-400 text-center">
                          {data?.bookingId}
                        </td>
                        <td className="border border-slate-400 p-1 text-center">
                          {data?.trekName}
                        </td>
                        <td className="border  border-slate-400 text-center">
                          {data?.bookedBy}
                        </td>

                        <td className="border border-slate-400 text-center">
                          {data?.passengerName}
                        </td>

                        <td className="border border-slate-400 p-2 text-center">
                          {data?.phone}
                        </td>

                        <td className="border border-slate-400 min-w-[80px] text-center">
                          {data?.date?.toString().split("T")[0]}
                        </td>
                        {/* <td className="border border-slate-400 text-center">
                          {data?.endDate?.toString().split("T")[0]}
                        </td> */}
                        <td className="border border-slate-400 text-button text-center">
                          {data?.status}
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {showReservation === "tour" && tourRev.length > 0 && (
          <div className="bg-white flex flex-col justify-center items-center rounded-lg p-3 gap-5">
            <div className="font-semibold text-lg text-button w-fit p-2">
              Recent Tour Reservations
            </div>
            <div className="w-full max-w-full flex justify-center overflow-x-auto">
              <table className="table border-collapse border border-slate-400 text-xs md:text-sm">
                <thead className="">
                  <tr>
                    <th className="border border-slate-400 p-1 min-w-[70px] font-semibold">
                      Booking ID
                    </th>
                    <th className="border border-slate-400 p-1 min-w-[70px] font-semibold">
                      Tour Name
                    </th>
                    {/* <th className="border  border-slate-400 p-2 font-semibold">
                      {" "}
                      Vehicle Number
                    </th> */}

                    <th className="border border-slate-400  p-2 font-semibold">
                      {" "}
                      BookedBy
                    </th>
                    <th className="border border-slate-400 p-1 min-w-[100px] font-semibold">
                      {" "}
                      Booking Name
                    </th>

                    <th className="border border-slate-400 p-2 font-semibold">
                      {" "}
                      Phone{" "}
                    </th>
                    {/* <th className="border border-slate-400 p-2 font-semibold"> Start Date</th> */}
                    <th className="border border-slate-400 p-2 font-semibold">
                      {" "}
                      Date{" "}
                    </th>
                    <th className="border border-slate-400 p-2 font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tourRev.slice(0, 5).map((data) => (
                    <>
                      <tr key={data?._id}>
                        <td className="border border-slate-400 text-center">
                          {data?.bookingId}
                        </td>
                        <td className="border border-slate-400 p-1 text-center">
                          {data?.tourName}
                        </td>
                        <td className="border  border-slate-400 text-center">
                          {data?.bookedBy}
                        </td>

                        <td className="border border-slate-400 text-center">
                          {data?.passengerName}
                        </td>

                        <td className="border border-slate-400  p-2 text-center">
                          {data?.phone}
                        </td>

                        {/* <td className="border border-slate-400 text-center">
                          {data?.phone}
                        </td> */}

                        {/* <td className="border border-slate-400 text-center">
                          {data?.startDate?.toString().split("T")[0]}
                        </td> */}
                        <td className="border border-slate-400 min-w-[80px] text-center">
                          {data?.date?.toString().split("T")[0]}
                        </td>
                        <td className="border border-slate-400 p-1 text-button text-center">
                          {data?.status}
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
