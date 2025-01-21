/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  faCartPlus,
  faCircleInfo,
  faMagnifyingGlass,
  faPenToSquare,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { URL } from "../../../config/Config";
import axios from "axios";
import { ITour } from "../../../.../../SharedTypes/Product/tour";
import { useAuthContext } from "../../../context/AuthContext";
import { PageLoader } from "../../../utils/PageLoader";
import { ButtonLoader } from "../../../utils/ButtonLoader";
import { Link, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";

export const GetTour = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthContext();
  const id = authUser?.bId;
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<ITour[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tour, setTour] = useState<ITour[]>([]);
  const [isButton, setIsButton] = useState<string | null>(null);
  const [availability, setAvailability] = useState<string | null>(null);
  const [paginationData, setPaginationData] = useState<ITour[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 5;
  let totalPages = 0;

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`${URL}/api/gettour/${id}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.error);
        } else {
          setTour(data);
        }
      } catch (error: any) {
        toast.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicle();
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
          setTour((prev) => prev?.filter((v) => v._id !== id) || null);
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

  const Feature = async (
    id: string | undefined,
    name: string,
    tourId: string
  ) => {
    try {
      const confirmed = window.confirm("Request to Add in Featured ");
      if (confirmed) {
        setIsButton(id + "feature" || "");
        const response = await axios.post(`${URL}/api/requestfeature/${id}`, {
          businessName: authUser?.businessName,
          name: name,
          productId: tourId,
        });
        const data = response.data;
        if (data.message) {
          toast.success(data.message);
          // setTour((prev) => prev?.filter((v) => v._id !== id) || null);
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

  const Remove = async (id: string | undefined) => {
    try {
      const confirmed = window.confirm("Remove ?");
      if (confirmed) {
        setIsButton(id + "Rfeature");
        const response = await axios.delete(`${URL}/api/removefeature/${id}`);
        const data = response.data;
        if (data.message) {
          toast.success(data.message);
          //  setFeature((prev) => prev?.filter((v) => v.Id !== id) || null);
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
      ? tour?.filter((b) =>
          b.name?.toLowerCase().includes(search.toLowerCase())
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
  totalPages = Math.ceil(tour?.length / itemPerPage);

  const handlePageChange = (page: number) => {
    if (currentPage > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    setPaginationData(
      tour.slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage)
    );
  }, [currentPage, tour]);

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="h-screen flex flex-col gap-5">
        <div className="flex justify-between">
          <div>
            <h1 className="md:text-3xl text-lg font-bold">Tour List</h1>
            <p className="mt-2 text-xs md:text-lg">List of Tours on Toursewa</p>
          </div>
          <Link
            to="/business/tour/addtour"
            className="bg-button p-1 h-fit min-w-[85px] text-center max-w-[120px] text-xs hover:bg-[#06243C] text-white  rounded-md md:text-lg"
          >
            Add Tour
          </Link>
        </div>
        <div className="flex mt-5 w-[88%] mx-auto justify-end">
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
          <div className=" flex justify-center flex-col w-full items-center text-xs">
            <div className="relative overflow-x-auto shadow-md rounded-sm ">
              {!filter || Object.keys(filter).length === 0 ? (
                <>
                  <p>Empty</p>
                </>
              ) : (
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="px-3  py-3">SN</th>
                      <th className="px-3  py-3">ID</th>

                      <th className="px-3  py-3">Name</th>
                      <th className="px-3  py-3">Category</th>

                      <th className="px-3  py-3">Duration</th>

                      <th className="px-3  py-3">Capacity</th>

                      <th className="px-3  py-3">Phone</th>
                      <th className="px-3  py-3">Operational&nbsp;Dates</th>
                      <th className="px-3  py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {paginationData &&
                      paginationData.map((tour, i) => (
                        <tr
                          key={tour?._id}
                          className={`${
                            i % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="px-3  py-3">{i + 1}</td>
                          <td className="px-3  py-3">{tour?.tourId}</td>

                          <td className="px-3  py-3">{tour?.name}</td>
                          <td className="px-3  py-3">{tour?.prodCategory}</td>

                          <td className="px-3  py-3">{tour?.duration}</td>

                          <td className="px-3  py-3">{tour?.capacity}</td>

                          <td className=" px-3  py-3">{tour?.phone}</td>
                          <td className="px-3  py-3">
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

                          <td className="px-3  py-3">
                            <div className="flex gap-5 md:gap-7">
                              <button
                                onClick={() =>
                                  navigate(
                                    `/business/tour/tourdetails/${tour.tourId}`
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
                                    `/business/tour/updatebusinesstour/${tour.tourId}`
                                  )
                                }
                                className=" hover:scale-110"
                                title="Edit"
                              >
                                <FontAwesomeIcon
                                  icon={faPenToSquare}
                                  size="lg"
                                  style={{ color: "#005af5" }}
                                />
                              </button>
                              {tour.isFeatured ? (
                                <button
                                  onClick={() => Remove(tour?._id)}
                                  className="hover:scale-110"
                                  title="Remove from Feature"
                                >
                                  <FontAwesomeIcon
                                    icon={faCartPlus}
                                    size="lg"
                                    className="text-red-600"
                                  />

                                  {isButton === tour?._id + "Rfeature" ? (
                                    <ButtonLoader />
                                  ) : (
                                    ""
                                  )}
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    Feature(tour?._id, tour?.name, tour?.tourId)
                                  }
                                  className="hover:scale-110"
                                  title="Add to Feature"
                                >
                                  <FontAwesomeIcon
                                    icon={faCartPlus}
                                    size="lg"
                                    className="text-lime-700"
                                  />

                                  {isButton === tour?._id + "feature" ? (
                                    <ButtonLoader />
                                  ) : (
                                    ""
                                  )}
                                </button>
                              )}
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
            <div className="flex flex-col w-full items-end text-xs p-2">
              <span className=" text-gray-700">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {(currentPage - 1) * itemPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {Math.min(currentPage * itemPerPage, tour.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {tour.length}
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
