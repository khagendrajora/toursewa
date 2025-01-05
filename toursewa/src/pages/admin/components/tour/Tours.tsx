/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ITour } from "../../../../../../backend/src/models/Product/tour";
import { toast, ToastContainer } from "react-toastify";
import { URL } from "../../../../config/Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faMagnifyingGlass,
  faPenToSquare,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { PageLoader } from "../../../../utils/PageLoader";
import { ButtonLoader } from "../../../../utils/ButtonLoader";
import Calendar from "react-calendar";

export const Tours = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<ITour[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tour, setTour] = useState<ITour[] | null>([]);
  const [isButton, setIsButton] = useState<string | null>(null);
  const [availability, setAvailability] = useState<string | null>(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await fetch(`${URL}/api/gettour`);
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          setTour(data);
        }
      } catch (error: any) {
        toast.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTour();
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
          setTour((prev) => prev?.filter((tour) => tour?._id != id) || []);
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

  useEffect(() => {
    if (!tour) {
      setFilter(null);
      return;
    }
    const newSearch = search
      ? tour?.filter(
          (b) =>
            b.name?.toLowerCase().includes(search.toLowerCase()) ||
            b.businessId?.toLowerCase().includes(search.toLowerCase())
        )
      : tour;
    setFilter(newSearch);
  }, [search, tour]);

  const isBooked = (date: Date, id: string) => {
    return (
      tour?.some((tour) => {
        if (tour._id === id) {
          return tour.operationDates?.some((operationalDates) => {
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

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="h-screen flex flex-col gap-5">
        <div className="flex justify-between flex-wrap gap-y-5">
          <div>
            <h1 className="md:text-3xl sm:text-lg font-bold">Tour List</h1>
            <p className="mt-2 text-xs md:text-lg">List of Tours on Toursewa</p>
          </div>
          <Link
            to="/admin/addtour"
            className="bg-button p-1 h-fit min-w-[85px] text-center max-w-[120px] text-xs hover:bg-[#06243C] text-white  rounded-md md:text-lg"
          >
            Add Tour
          </Link>
        </div>
        <div className="flex mt-  justify-end">
          <div className="relative">
            <input
              type="text"
              value={search}
              placeholder="Search Tour"
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-400  text-black rounded-md shadow-sm w-[130px] md:w-auto p-1 md:p-3 pl-7 md:pl-10"
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute text-gray-400 left-2 top-1/4 md:h-5 md:left-3 transform -trangray-y-1/2 text-black-500 pointer-events-none"
            />
          </div>
        </div>
        {isLoading ? (
          <PageLoader />
        ) : (
          <div className=" flex justify-center items-center text-xs">
            <div className="overflow-x-auto space-y-5 ">
              {!filter || Object.keys(filter).length === 0 ? (
                <>
                  <p>Empty</p>
                </>
              ) : (
                <table className="table-auto border-collapse  border border-gray-500 text-xs md:text-lg ">
                  <thead className="bg-neutral-400 text-white">
                    <tr>
                      <th className="border font-normal border-gray-500 p-1">
                        SN
                      </th>
                      <th className="border font-normal border-gray-500 p-1">
                        ID
                      </th>
                      <th className="border font-normal border-gray-500 min-w-[90px] md:min-w-[120px] p-2">
                        Business Id
                      </th>
                      <th className="border font-normal border-gray-500 p-1">
                        Name
                      </th>
                      <th className="border font-normal  border-gray-500 p-1">
                        Category
                      </th>

                      <th className="border font-normal border-gray-500  p-1">
                        Duration
                      </th>

                      <th className="border font-normal  border-gray-500 p-1">
                        Capacity
                      </th>

                      <th className="border font-normal border-gray-500 p-1">
                        Phone
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
                      filter.map((tour, i) => (
                        <tr key={tour?._id}>
                          <td className="border border-gray-500 p-3 text-center">
                            {i + 1}
                          </td>
                          <td className="border border-gray-500 p-3 text-center">
                            {tour?.tourId}
                          </td>
                          <td className="p-3 border-gray-500  text-center border">
                            {tour?.businessId}
                          </td>
                          <td className="border p-3 border-gray-500 text-center">
                            {tour?.name}
                          </td>
                          <td className="border p-3 border-gray-500 text-center">
                            {tour?.prodCategory}
                          </td>

                          <td className="p-3 border-gray-500 border text-center">
                            {tour?.duration}
                          </td>

                          <td className="p-3 border-gray-500 border text-center">
                            {tour?.capacity}
                          </td>

                          <td className=" border p-3 border-gray-500 text-center">
                            {tour?.phone}
                          </td>
                          <td className="p-3 border border-gray-500 text-center">
                            <span
                              className="cursor-pointer text-blue-400"
                              onClick={() => changeAvailability(tour._id || "")}
                            >
                              {tour.operationDates?.length}
                            </span>
                            {availability === tour._id && (
                              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                                <div
                                  className="relative bg-white p-5 rounded-lg shadow-md"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Calendar
                                    tileDisabled={({ date }) =>
                                      isBooked(date, tour._id || "")
                                    }
                                    minDate={new Date()}
                                    className="z-10"
                                    tileClassName={({ date, view }) =>
                                      `${
                                        view === "month" ? "custom-tile" : ""
                                      } ${
                                        isBooked(date, tour._id || "")
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
                                    `/admin/tour/tourdetails/${tour.tourId}`
                                  )
                                }
                                className="  hover:scale-110"
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
                                    `/admin/tour/updatetour/${tour.tourId}`
                                  )
                                }
                                className="p-1 rounded-lg hover:scale-110"
                                title="Edit"
                              >
                                <FontAwesomeIcon
                                  icon={faPenToSquare}
                                  size="lg"
                                  style={{ color: "#005af5" }}
                                />
                              </button>

                              <button
                                onClick={() => Delete(tour?._id)}
                                className="hover:scale-110"
                                title="Delete"
                              >
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  size="lg"
                                  style={{ color: "#ff0000" }}
                                />{" "}
                                {isButton === tour._id ? <ButtonLoader /> : ""}
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
