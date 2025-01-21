/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  IStatus,
  IVRev,
} from "../../../.../../SharedTypes/Reservations/vehReserv";
import { useAuthContext } from "../../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { URL } from "../../../config/Config";
import { PageLoader } from "../../../utils/PageLoader";
import { ButtonLoader } from "../../../utils/ButtonLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export const Reservations = () => {
  const { authUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const businessId = authUser?.bId;
  const [revData, setRevData] = useState<IVRev[]>([]);
  const [search, setSearch] = useState<string>("");
  const [filterSearch, SetFilterSearch] = useState<IVRev[] | null>(null);
  const [isButton, setIsButton] = useState("");
  const [paginationData, setPaginationData] = useState<IVRev[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 5;
  let totalPages = 0;

  useEffect(() => {
    const fetchRev = async () => {
      try {
        const res = await fetch(`${URL}/api/getbusinessrev/${businessId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.error);
        } else {
          const sortedData = data.sort(
            (a: IVRev, b: IVRev) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
          );
          setRevData(sortedData);
        }
      } catch (error: any) {
        toast.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRev();
  }, [businessId]);

  const updateRev = async (
    id: string,
    updateInputs: {
      status: string;
      email: string;
      updatedBy: string | "";
    }
  ) => {
    try {
      const confirmed = window.confirm(
        `Change the status to ${updateInputs.status}`
      );
      if (confirmed) {
        setIsButton(`${id}${updateInputs.status}`);
        const res = await fetch(`${URL}/api/updateRevbybid/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateInputs),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          toast.success("Booking Updated");
          setRevData(
            (prevData) =>
              prevData &&
              prevData.map((rev) =>
                rev.bookingId === id
                  ? { ...rev, status: updateInputs.status as IStatus }
                  : rev
              )
          );
        }
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsButton("");
    }
  };

  const update = async (
    id: string,
    updateInputs: {
      status: string;
      bookingId: string;
      email: string;
      updatedBy: string | "";
    }
  ) => {
    try {
      const confirmed = window.confirm(
        `Change the Status to ${updateInputs.status}`
      );
      if (confirmed) {
        setIsButton(`${id}${updateInputs.status}`);
        const res = await fetch(`${URL}/api/updateRevStatusbybid/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateInputs),
        });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error);
        } else {
          toast.success("Booking Updated");
          setRevData(
            (prevData) =>
              prevData &&
              prevData.map((rev) =>
                rev._id === id
                  ? { ...rev, status: updateInputs.status as IStatus }
                  : rev
              )
          );
        }
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsButton("");
    }
  };

  useEffect(() => {
    if (search) {
      const filter = revData?.filter((data) => {
        const bookingId = data.bookingId?.toLowerCase().trim() || "";
        const bookingName = data.bookingName?.toLowerCase().trim() || "";
        const phone = data.phone?.toLowerCase().trim() || "";
        const email = data.email?.toLowerCase().trim() || "";
        const bookedByName = data.bookedByName?.toLowerCase().trim() || "";
        const vehicleNumber = data.vehicleNumber?.trim() || "";
        return (
          bookingId.includes(search.toLowerCase().trim()) ||
          bookingName.includes(search.toLowerCase().trim()) ||
          phone.includes(search.toLowerCase().trim()) ||
          email.includes(search.toLowerCase().trim()) ||
          bookedByName.includes(search.toLowerCase().trim()) ||
          vehicleNumber.includes(search.toLowerCase().trim())
        );
      });
      SetFilterSearch(filter ?? []);
    } else {
      SetFilterSearch([]);
    }
  }, [search, revData]);

  totalPages = Math.ceil(revData?.length / itemPerPage);

  const handlePageChange = (page: number) => {
    if (currentPage > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    setPaginationData(
      revData.slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage)
    );
  }, [currentPage, revData]);

  return (
    <>
      <ToastContainer theme="colored" position="top-center" />
      <div className="h-screen flex flex-col gap-5">
        <div className="flex justify-between">
          <div>
            <h1 className="md:text-3xl text-lg font-bold">Reservation List</h1>
            <p className="mt-2 text-xs md:text-lg">Vehicle Reservations</p>
          </div>
        </div>
        <div className="flex mt-5 w-[88%] mx-auto justify-end">
          <div className="relative">
            <input
              type="text"
              value={search}
              placeholder="Search Reservation"
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-400  text-black rounded-md shadow-sm w-[140px] md:w-auto p-1 md:p-3 pl-7 md:pl-10"
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute text-gray-400 left-2 top-1/4 md:h-5 md:left-3 transform -trangray-y-1/2 text-black-500 pointer-events-none"
            />
          </div>
        </div>
        {isLoading ? (
          <PageLoader />
        ) : !revData || revData.length === 0 ? (
          <>
            <p className="text-center">Empty</p>
          </>
        ) : (
          <div className=" flex justify-center pr-5 w-full flex-col items-center text-xs">
            <div className="relative overflow-x-auto  scrollbar-hidden shadow-md rounded-sm ">
              <table className="w-full text-sm text-left rtl:text-right  text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-300  dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3  py-3 ">Booking&nbsp;ID</th>
                    <th className="px-3  py-3">Vehicle&nbsp;Number</th>
                    <th className="px-1  py-3">Capacity</th>
                    <th className="px-1  py-3">Passengers</th>
                    <th className="px-3  py-3">Booked&nbsp;By</th>
                    <th className="px-3  py-3">Booing&nbsp;Name</th>
                    <th className="px-3  py-3">Phone</th>
                    <th className="px-3  py-3">Email</th>
                    <th className="px-3  py-3">From-To</th>
                    <th className="px-3  py-3">Date</th>
                    <th className="px-3  py-3">Action</th>
                  </tr>
                </thead>

                <tbody className="">
                  {filterSearch &&
                    filterSearch.map((filter, i) => (
                      <>
                        <tr
                          key={filter?._id}
                          className={`${
                            i % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="px-3 py-3 text-red-600">
                            {filter?.status}
                          </td>
                          <td className="px-3  py-3">{filter?.bookingId}</td>

                          <td className="px-3  py-3">
                            {filter?.vehicleNumber}
                          </td>

                          <td className=" px-3  py-3">{filter?.email}</td>

                          <td className="px-1  py-3">{filter?.capacity}</td>
                          <td className="px-1  py-3">
                            {filter?.numberOfPassengers}
                          </td>
                          <td className="px-3  py-3">{filter?.bookedByName}</td>
                          <td className="px-3  py-3">{filter?.bookingName}</td>
                          <td className="px-3  py-3">{filter?.phone}</td>
                          <td className="px-3  py-3">
                            {filter?.sourceAddress} -{" "}
                            {filter?.destinationAddress}
                          </td>
                          <td className="px-3  py-3">
                            {filter?.startDate?.toString().split("T")[0]} to{" "}
                            {filter?.endDate?.toString().split("T")[0]}
                          </td>

                          <td className="px-3  py-3">
                            <div className="">
                              {filter.status === "Fulfilled" ? (
                                ""
                              ) : filter.status != "Canceled" ? (
                                <button
                                  className="p-1 rounded-sm bg-lime-500 hover:bg-lime-700 "
                                  onClick={() => {
                                    const updateInputs = {
                                      status: "Fulfilled",
                                      email: filter.email || "",
                                      updatedBy: authUser?.bId || "",
                                    };
                                    updateRev(filter.bookingId, updateInputs);
                                  }}
                                >
                                  Mark&nbsp;Completed{" "}
                                  {isButton ===
                                  `${filter.bookingId}Fulfilled` ? (
                                    <ButtonLoader />
                                  ) : (
                                    ""
                                  )}
                                </button>
                              ) : (
                                ""
                              )}

                              {filter.status === "Pending" ? (
                                <button
                                  className="p-1 rounded-sm bg-lime-500 hover:bg-lime-700 "
                                  onClick={() => {
                                    const updateInputs = {
                                      status: "Approved",
                                      email: filter.email || "",
                                      bookingId: filter.bookingId,
                                      updatedBy: authUser?.businessName || "",
                                    };
                                    update(filter._id || "", updateInputs);
                                  }}
                                >
                                  Approve{" "}
                                  {isButton === `${filter._id}Approved` ? (
                                    <ButtonLoader />
                                  ) : (
                                    ""
                                  )}
                                </button>
                              ) : filter.status === "Canceled" ||
                                filter.status === "Fulfilled" ? (
                                ""
                              ) : (
                                <button
                                  className="p-1 rounded-sm bg-blue-500 hover:bg-lime-700 "
                                  onClick={() => {
                                    const updateInputs = {
                                      status: "Pending",
                                      email: filter.email || "",
                                      bookingId: filter.bookingId,
                                      updatedBy: authUser?.bId || "",
                                    };
                                    update(filter._id || "", updateInputs);
                                  }}
                                >
                                  Make&nbsp;Pending{" "}
                                  {isButton === `${filter._id}Pending` ? (
                                    <ButtonLoader />
                                  ) : (
                                    ""
                                  )}
                                </button>
                              )}

                              {filter.status === "Canceled" ||
                              filter.status === "Fulfilled" ? (
                                ""
                              ) : (
                                <button
                                  className="p-1 rounded-sm bg-red-500 hover:bg-red-700"
                                  onClick={() => {
                                    const updateInputs = {
                                      status: "Canceled",
                                      email: filter.email || "",
                                      updatedBy: authUser?.bId || "",
                                    };
                                    updateRev(filter.bookingId, updateInputs);
                                  }}
                                >
                                  Cancel{" "}
                                  {isButton ===
                                  `${filter.bookingId}Canceled` ? (
                                    <ButtonLoader />
                                  ) : (
                                    ""
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      </>
                    ))}

                  {paginationData &&
                    filterSearch?.length === 0 &&
                    paginationData.map((data, i) => (
                      <>
                        <tr
                          key={data?._id}
                          className={`scrollbar-hidden ${
                            i % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="px-3 text-red-500  py-3">
                            {data?.status}
                          </td>
                          <td className="px-3  py-3">{data?.bookingId}</td>

                          <td className="px-3  py-3">{data?.vehicleNumber}</td>

                          <td className=" px-1  py-3">{data?.capacity}</td>
                          <td className="px-1  py-3">
                            {data?.numberOfPassengers}
                          </td>
                          <td className="px-3  py-3">{data?.bookedByName}</td>
                          <td className="px-3  py-3">{data?.bookingName}</td>
                          <td className="px-3  py-3">{data?.phone}</td>
                          <td className="px-3  py-3">{data?.email}</td>
                          <td className="px-3  py-3">
                            {data?.sourceAddress} - {data?.destinationAddress}
                          </td>
                          <td className="min-w-[100px]">
                            {data?.startDate?.toString().split("T")[0]}
                            &nbsp;to&nbsp;
                            {data?.endDate?.toString().split("T")[0]}
                          </td>

                          <td className="px-1 py-1">
                            <div className="flex flex-col text-white gap-3 text-xs">
                              {data.status === "Fulfilled" ? (
                                ""
                              ) : data.status != "Canceled" ? (
                                <button
                                  className="p-1 rounded-sm bg-lime-500 hover:bg-lime-700 "
                                  onClick={() => {
                                    const updateInputs = {
                                      status: "Fulfilled",
                                      email: data.email || "",
                                      updatedBy: authUser?.bId || "",
                                    };
                                    updateRev(data.bookingId, updateInputs);
                                  }}
                                >
                                  Mark&nbsp;Completed{" "}
                                  {isButton === `${data.bookingId}Fulfilled` ? (
                                    <ButtonLoader />
                                  ) : (
                                    ""
                                  )}
                                </button>
                              ) : (
                                ""
                              )}

                              {data.status === "Pending" ? (
                                <button
                                  className="p-1 rounded-sm bg-lime-500 hover:bg-lime-700 "
                                  onClick={() => {
                                    const updateInputs = {
                                      status: "Approved",
                                      email: data.email || "",
                                      bookingId: data.bookingId,
                                      updatedBy: authUser?.businessName || "",
                                    };
                                    update(data._id || "", updateInputs);
                                  }}
                                >
                                  Approve{" "}
                                  {isButton === `${data._id}Approved` ? (
                                    <ButtonLoader />
                                  ) : (
                                    ""
                                  )}
                                </button>
                              ) : data.status === "Canceled" ||
                                data.status === "Fulfilled" ? (
                                ""
                              ) : (
                                <button
                                  className="p-1 rounded-sm bg-blue-500 hover:bg-lime-700 "
                                  onClick={() => {
                                    const updateInputs = {
                                      status: "Pending",
                                      email: data.email || "",
                                      bookingId: data.bookingId,
                                      updatedBy: authUser?.bId || "",
                                    };
                                    update(data._id || "", updateInputs);
                                  }}
                                >
                                  Make&nbsp;Pending{" "}
                                  {isButton === `${data._id}Pending` ? (
                                    <ButtonLoader />
                                  ) : (
                                    ""
                                  )}
                                </button>
                              )}

                              {data.status === "Canceled" ||
                              data.status === "Fulfilled" ? (
                                ""
                              ) : (
                                <button
                                  className="p-1 rounded-sm bg-red-500 hover:bg-red-700"
                                  onClick={() => {
                                    const updateInputs = {
                                      status: "Canceled",
                                      email: data.email || "",
                                      updatedBy: authUser?.bId || "",
                                    };
                                    updateRev(data.bookingId, updateInputs);
                                  }}
                                >
                                  Cancel{" "}
                                  {isButton === `${data.bookingId}Canceled` ? (
                                    <ButtonLoader />
                                  ) : (
                                    ""
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      </>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col w-full items-end text-xs p-2">
              <span className=" text-gray-700">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {(currentPage - 1) * itemPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {Math.min(currentPage * itemPerPage, revData.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {revData.length}
                </span>{" "}
                Entries
              </span>
              <div className="inline-flex mt-2 xs:mt-0">
                <button
                  className="flex items-center justify-center  text-xs  text-white bg-gray-700 p-2 rounded-s hover:bg-gray-900"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
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
                  className="flex items-center justify-center  text-xs  text-white bg-gray-700 p-2 hover:bg-gray-900"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
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
        )}
      </div>
    </>
  );
};
