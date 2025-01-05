/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { ITrekking } from "../../../../../../backend/src/models/Product/trekking";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faMagnifyingGlass,
  faPenToSquare,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { URL } from "../../../../config/Config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { PageLoader } from "../../../../utils/PageLoader";
import { ButtonLoader } from "../../../../utils/ButtonLoader";
import Calendar from "react-calendar";

export const MAnageTreck = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<ITrekking[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trek, settrek] = useState<ITrekking[] | null>(null);
  const [isButton, setIsButton] = useState<string | null>(null);
  const [availability, setAvailability] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(
          "https://tourbackend-rdtk.onrender.com/api/gettrek"
        );
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          settrek(data);
        }
      } catch (error: any) {
        toast.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategory();
  }, []);

  const Delete = async (id: string | undefined) => {
    try {
      const confirmed = window.confirm("Delete Tour");
      if (confirmed) {
        setIsButton(id || "");
        const response = await axios.delete(`${URL}/api/deleteprod/${id}`);
        const data = response.data;
        if (data.message) {
          toast.success(data.message);
          settrek((prev) => prev?.filter((t) => t._id != id) || []);
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

  const isBooked = (date: Date, id: string) => {
    return (
      trek?.some((trek) => {
        if (trek._id === id) {
          return trek.operationDates?.some((operationalDates) => {
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

  useEffect(() => {
    if (!trek) {
      setFilter(null);
      return;
    }
    const newSearch = search
      ? trek?.filter(
          (b) =>
            b.name?.toLowerCase().includes(search.toLowerCase()) ||
            b.businessId?.toLowerCase().includes(search.toLowerCase())
        )
      : trek;
    setFilter(newSearch);
  }, [search, trek]);

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="h-screen flex flex-col gap-5">
        <div className="flex justify-between flex-wrap gap-y-5">
          <div>
            <h1 className="md:text-3xl sm:text-lg font-bold">Trek List</h1>
            <p className="mt-2 text-xs md:text-lg">List of Treks on Toursewa</p>
          </div>
          <Link
            to="/admin/addtrek"
            className="bg-button p-1 h-fit min-w-[85px] text-center max-w-[120px] text-xs hover:bg-[#06243C] text-white  rounded-md md:text-lg"
          >
            Add Trek
          </Link>
        </div>
        <div className="flex mt-  justify-end">
          <div className="relative">
            <input
              type="text"
              value={search}
              placeholder="Search Trek"
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-400  text-black rounded-md shadow-sm w-[130px] md:w-auto p-1 md:p-3 pl-7 md:pl-10"
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-2 text-gray-400 top-1/4 md:h-5 md:left-3 transform -trangray-y-1/2 text-black-500 pointer-events-none"
            />
          </div>
        </div>
        {isLoading ? (
          <PageLoader />
        ) : (
          <div className=" flex justify-center items-center text-xs">
            <div className="overflow-x-auto space-y-5 ">
              {!trek || Object.keys(trek).length === 0 ? (
                <p>Empty</p>
              ) : (
                <table className="table-auto border-collapse font-normal  border border-gray-500 text-xs md:text-lg ">
                  <thead className="bg-neutral-400 font-normal  text-white">
                    <tr>
                      <th className="border font-normal  border-gray-500 ">
                        SN
                      </th>
                      <th className="border font-normal border-gray-500 ">
                        ID
                      </th>
                      <th className="border font-normal border-gray-500 min-w-[90px] md:min-w-[120px] p-2">
                        Business Id
                      </th>
                      <th className="border font-normal border-gray-500 p-2">
                        Name
                      </th>
                      <th className="border font-normal  border-gray-500 p-2">
                        Category
                      </th>

                      <th className="border font-normal border-gray-500 p-2">
                        Days
                      </th>

                      <th className="border font-normal border-gray-500 p-2">
                        Number
                      </th>
                      <th className="border  font-normal border-gray-500 p-2">
                        Capacity
                      </th>

                      <th className="border font-normal  border-gray-500 min-w-[120px] md:min-w-[170px] p-2">
                        Operational Dates
                      </th>

                      <th className="border font-normal border-gray-500 p-2">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="">
                    {filter &&
                      filter.map((trek, i) => (
                        <tr key={trek?._id}>
                          <td className="border border-gray-500 p-2 text-center">
                            {i + 1}
                          </td>
                          <td className="border border-gray-500 p-2 text-center">
                            {trek?.trekId}
                          </td>
                          <td className="p-2 border border-gray-500 text-center">
                            {trek?.businessId}
                          </td>
                          <td className=" border p-2 border-gray-500 text-center">
                            {trek?.name}
                          </td>
                          <td className="border p-2 border-gray-500 text-center">
                            {trek?.prodCategory}
                          </td>

                          <td className=" border p-2 border-gray-500 text-center">
                            {trek?.days}
                          </td>

                          <td className="border p-2 border-gray-500 text-center">
                            {trek?.numbers}
                          </td>

                          <td className="border p-2 border-gray-500 text-center">
                            {trek?.capacity}
                          </td>

                          <td className="p-2 border border-gray-500 text-center">
                            <span
                              className="cursor-pointer text-blue-400"
                              onClick={() => changeAvailability(trek._id || "")}
                            >
                              {trek.operationDates?.length}
                            </span>
                            {availability === trek._id && (
                              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                                <div
                                  className="relative bg-white p-5 rounded-lg shadow-md"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Calendar
                                    tileDisabled={({ date }) =>
                                      isBooked(date, trek._id || "")
                                    }
                                    minDate={new Date()}
                                    className="z-10"
                                    tileClassName={({ date, view }) =>
                                      `${
                                        view === "month" ? "custom-tile" : ""
                                      } ${
                                        isBooked(date, trek._id || "")
                                          ? "disable-date"
                                          : ""
                                      }`.trim()
                                    }
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
                          </td>
                          <td className="flex justify-between flex-col border gap-6 border-b-0  text-white p-2 ">
                            <div className="flex gap-5 md:gap-7">
                              <button
                                onClick={() =>
                                  navigate(
                                    `/admin/trek/trekdetails/${trek.trekId}`
                                  )
                                }
                                className=" hover:scale-110"
                                title="Full Info"
                              >
                                <FontAwesomeIcon
                                  icon={faCircleInfo}
                                  size="lg"
                                  style={{ color: "#06d01e" }}
                                />
                              </button>
                              <button
                                onClick={() =>
                                  navigate(
                                    `/admin/trek/updatetrek/${trek.trekId}`
                                  )
                                }
                                className="hover:scale-110"
                                title="Edit"
                              >
                                <FontAwesomeIcon
                                  icon={faPenToSquare}
                                  size="lg"
                                  style={{ color: "#005af5" }}
                                />
                              </button>

                              <button
                                onClick={() => Delete(trek?._id)}
                                className="hover:scale-110"
                                title="Delete"
                              >
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  size="lg"
                                  style={{ color: "#ff0000" }}
                                />
                                {isButton == trek._id ? <ButtonLoader /> : ""}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
