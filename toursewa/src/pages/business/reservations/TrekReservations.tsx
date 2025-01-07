import { toast, ToastContainer } from "react-toastify";
import { URL } from "../../../config/Config";
import { useEffect, useState } from "react";
import {
  ITrRev,
  IStatus,
} from "../../../.../../SharedTypes/Reservations/TrekReservation/TrekRevModel";
import { useAuthContext } from "../../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { PageLoader } from "../../../utils/PageLoader";
import { ButtonLoader } from "../../../utils/ButtonLoader";

export const TrekReservations = () => {
  const { authUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const businessId = authUser?.bId;
  const [search, setSearch] = useState<string>("");
  const [filterSearch, SetFilterSearch] = useState<ITrRev[] | null>(null);
  const [isButton, setIsButton] = useState("");
  const [revData, setRevData] = useState<ITrRev[] | null>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${URL}/api/gettrekrevbybid/${businessId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data);
        } else {
          const sortedData = data.sort(
            (a: ITrRev, b: ITrRev) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
          );
          setRevData(sortedData);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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
        const res = await fetch(`${URL}/api/updatetrekRevStatusbybid/${id}`, {
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
          setRevData((prevData) =>
            prevData
              ? prevData.map((rev) =>
                  rev._id === id
                    ? { ...rev, status: updateInputs.status as IStatus }
                    : rev
                )
              : null
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
        const bookingName = data.passengerName?.toLowerCase().trim() || "";
        const phone = data.phone?.toLowerCase().trim() || "";
        const email = data.email?.toLowerCase().trim() || "";

        return (
          bookingId.includes(search.toLowerCase().trim()) ||
          bookingName.includes(search.toLowerCase().trim()) ||
          phone.includes(search.toLowerCase().trim()) ||
          email.includes(search.toLowerCase().trim())
        );
      });
      SetFilterSearch(filter ?? []);
    } else {
      SetFilterSearch([]);
    }
  }, [search, revData]);
  return (
    <>
      <ToastContainer theme="colored" position="top-center" />
      <div className="w-full lg:w-11/12 flex flex-col gap-5">
        <div className="flex justify-between">
          <div>
            <h1 className="md:text-3xl text-lg font-bold">Reservation List</h1>
            <p className="mt-2 text-xs md:text-lg">List of Reservations</p>
          </div>
        </div>
        <div className="flex mt-  justify-end">
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
          <div className=" flex justify-center items-center text-xs">
            <div className="overflow-x-auto space-y-10 ">
              {filterSearch &&
                filterSearch.map((filter) => (
                  <>
                    <div className="space-y-1">
                      <table className="table-auto border-collapse  border border-gray-500 text-xs ">
                        <thead className="bg-neutral-400 text-white">
                          <tr>
                            <th className="border  border-gray-500 p-1">
                              Status
                            </th>
                            <th className="border border-gray-500 p-1 min-w-[80px] ">
                              Booking ID
                            </th>

                            <th className="border  border-gray-500 p-1 min-w-[100px]">
                              Tour name
                            </th>

                            <th className="border border-gray-500  p-1">
                              Passenger Name
                            </th>

                            <th className="border border-gray-500  p-1">
                              Phone
                            </th>
                            <th className="border border-gray-500  p-1">
                              Email
                            </th>

                            <th className="border border-gray-500  p-1">
                              Date
                            </th>
                            <th className="border border-gray-500  p-1">
                              No. of Passengers
                            </th>
                          </tr>
                        </thead>

                        <tbody className="">
                          <tr key={filter?._id} className="">
                            <td className="border border-gray-500 text-red-600 text-center p-1">
                              {filter?.status}
                            </td>
                            <td className="border border-gray-500 text-center p-1">
                              {filter?.bookingId}
                            </td>

                            <td className="border  border-gray-500 text-center p-1">
                              {filter?.trekName}
                            </td>

                            <td className=" border border-gray-500 text-center p-1">
                              {filter?.passengerName}
                            </td>

                            <td className="border border-gray-500 text-center p-1">
                              {filter?.phone}
                            </td>
                            <td className="border border-gray-500 text-center p-1">
                              {filter?.email}
                            </td>
                            <td className="border border-gray-500 text-center p-1">
                              {filter?.date.toString().split("T")[0]}
                            </td>
                            <td className="border border-gray-500 text-center p-1">
                              {filter?.tickets}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="flex text-white gap-5  text-xs  w-full">
                        {filter.status === "Completed" ? (
                          ""
                        ) : filter.status != "Canceled" ? (
                          <button
                            className="p-1 rounded-sm bg-lime-500 hover:bg-lime-700 "
                            onClick={() => {
                              const updateInputs = {
                                bookingId: filter.bookingId,
                                status: "Completed",
                                email: filter.email || "",
                                updatedBy: authUser?.bId || "",
                              };
                              update(filter._id || "", updateInputs);
                            }}
                          >
                            Mark Completed{" "}
                            {isButton === `${filter.bookingId}Completed` ? (
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
                          filter.status === "Completed" ? (
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
                            Make Pending{" "}
                            {isButton === `${filter._id}Pending` ? (
                              <ButtonLoader />
                            ) : (
                              ""
                            )}
                          </button>
                        )}

                        {filter.status === "Canceled" ||
                        filter.status === "Completed" ? (
                          ""
                        ) : (
                          <button
                            className="p-1 rounded-sm bg-red-500 hover:bg-red-700"
                            onClick={() => {
                              const updateInputs = {
                                bookingId: filter.bookingId,
                                status: "Canceled",
                                email: filter.email || "",
                                updatedBy: authUser?.bId || "",
                              };
                              update(filter._id || "", updateInputs);
                            }}
                          >
                            Cancel{" "}
                            {isButton === `${filter.bookingId}Canceled` ? (
                              <ButtonLoader />
                            ) : (
                              ""
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                ))}
              {revData &&
                filterSearch?.length === 0 &&
                revData.map((data) => (
                  <>
                    <div className="space-y-1">
                      <table className="table-auto border-collapse  border border-gray-500 text-xs ">
                        <thead className="bg-neutral-400 text-white">
                          <tr>
                            <th className="border  border-gray-500 p-1">
                              Status
                            </th>
                            <th className="border border-gray-500 p-1 min-w-[80px] ">
                              Booking ID
                            </th>

                            <th className="border  border-gray-500 p-1 min-w-[100px]">
                              Tour name
                            </th>

                            <th className="border border-gray-500  p-1">
                              Passenger Name
                            </th>

                            <th className="border border-gray-500  p-1">
                              Phone
                            </th>
                            <th className="border border-gray-500  p-1">
                              Email
                            </th>

                            <th className="border border-gray-500  p-1">
                              Date
                            </th>
                            <th className="border border-gray-500  p-1">
                              No. of Passengers
                            </th>
                          </tr>
                        </thead>

                        <tbody className="">
                          <tr key={data?._id} className="">
                            <td className="border border-gray-500 text-center text-button p-1">
                              {data?.status}
                            </td>
                            <td className="border border-gray-500 text-center p-1">
                              {data?.bookingId}
                            </td>

                            <td className="border  border-gray-500 text-center p-1">
                              {data?.trekName}
                            </td>

                            <td className=" border border-gray-500 text-center p-1">
                              {data?.passengerName}
                            </td>

                            <td className="border border-gray-500 text-center p-1">
                              {data?.phone}
                            </td>
                            <td className="border border-gray-500 text-center p-1">
                              {data?.email}
                            </td>
                            <td className="border border-gray-500 text-center p-1">
                              {data?.date.toString().split("T")[0]}
                            </td>
                            <td className="border border-gray-500 text-center p-1">
                              {data?.tickets}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="flex text-white gap-5  text-xs  w-full">
                        {data.status === "Completed" ? (
                          ""
                        ) : data.status != "Canceled" ? (
                          <button
                            className="p-1 rounded-sm bg-lime-500 hover:bg-lime-700 "
                            onClick={() => {
                              const updateInputs = {
                                bookingId: data.bookingId,
                                status: "Completed",
                                email: data.email || "",
                                updatedBy: authUser?.bId || "",
                              };
                              update(data._id || "", updateInputs);
                            }}
                          >
                            Mark Completed{" "}
                            {isButton === `${data.bookingId}Completed` ? (
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
                          data.status === "Completed" ? (
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
                            Make Pending{" "}
                            {isButton === `${data._id}Pending` ? (
                              <ButtonLoader />
                            ) : (
                              ""
                            )}
                          </button>
                        )}

                        {data.status === "Canceled" ||
                        data.status === "Completed" ? (
                          ""
                        ) : (
                          <button
                            className="p-1 rounded-sm bg-red-500 hover:bg-red-700"
                            onClick={() => {
                              const updateInputs = {
                                bookingId: data.bookingId,
                                status: "Canceled",
                                email: data.email || "",
                                updatedBy: authUser?.bId || "",
                              };
                              update(data._id || "", updateInputs);
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
                    </div>
                  </>
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
