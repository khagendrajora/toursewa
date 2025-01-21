/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import { IMAGE_URL, URL } from "../../../config/Config";
import { toast, ToastContainer } from "react-toastify";
import { PageLoader } from "../../../utils/PageLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { IDriver } from "../../../.../../SharedTypes/Drivers/Driver";
import { ButtonLoader } from "../../../utils/ButtonLoader";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export const GetDrivers = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthContext();
  const businessId = authUser?.bId;
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<IDriver[]>([]);
  const [driver, setDriver] = useState<IDriver[] | null>(null);
  const [isButton, setIsButton] = useState<string>("");
  const [paginationData, setPaginationData] = useState<IDriver[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 5;
  let totalPages = 0;

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const res = await fetch(`${URL}/api/getdriverbybid/${businessId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.error);
        } else {
          const sortData = data.sort((a: any, b: any) =>
            a.driverName.localeCompare(b.driverName)
          );
          setDriver(sortData);
        }
      } catch (error: any) {
        toast.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDriver();
  }, [businessId]);

  const Delete = async (id: string | undefined) => {
    try {
      const confirmed = window.confirm("Delete Driver");
      if (confirmed) {
        setIsButton(id || "");
        const response = await axios.delete(
          `${URL}/api/deletedriver/${id}?updatedBy:${businessId}@action=Delete`
        );
        const data = response.data;
        if (data.message) {
          toast.success(data.message);
          setDriver((prev) => prev?.filter((v) => v._id !== id) || null);
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

  totalPages = Math.ceil(filter?.length / itemPerPage);

  const handlePageChange = (page: number) => {
    if (currentPage > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    if (!driver) {
      setFilter([]);
      return;
    }
    const newSearch = search
      ? driver?.filter(
          (b) =>
            b.driverName?.toLowerCase().includes(search.toLowerCase()) ||
            b.driverEmail?.toLowerCase().includes(search.toLowerCase()) ||
            b.driverPhone?.includes(search) ||
            b.driverId?.toLowerCase().includes(search.toLowerCase())
        )
      : driver || [];
    setFilter(newSearch);
  }, [search, driver]);

  useEffect(() => {
    setPaginationData(
      filter.slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage)
    );
  }, [currentPage, filter]);

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="h-screen flex flex-col gap-5">
        <div className="flex justify-between">
          <div>
            <h1 className="md:text-3xl text-lg font-bold">Driver List</h1>
            <p className="mt-2 text-xs md:text-lg">List of Drivers</p>
          </div>
          <Link
            to="/business/drivers/adddriver"
            className="bg-button p-1 h-fit min-w-[85px] text-center max-w-[120px] text-xs hover:bg-[#06243C] text-white  rounded-md md:text-lg"
          >
            Add Driver
          </Link>
        </div>
        <div className="flex mt-5 w-[88%] mx-auto justify-end ">
          <div className="relative">
            <input
              type="text"
              value={search}
              placeholder="Search"
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
              {!Array.isArray(filter) || filter.length === 0 ? (
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
                      <th className="px-3  py-3">Email</th>
                      <th className="px-3  py-3">Phone</th>
                      <th className="px-3  py-3">Age</th>
                      <th className="px-3  py-3">Vehicle&nbsp;Name</th>
                      <th className="px-3  py-3">Status</th>
                      <th className="px-3  py-3">Is&nbsp;Verified</th>
                      <th className="px-3  py-3">Image</th>
                      <th className="px-3  py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {paginationData &&
                      paginationData.map((filter, i) => (
                        <tr
                          key={filter?._id}
                          className={`${
                            i % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="px-3  py-3">
                            {" "}
                            {(currentPage - 1) * itemPerPage + i + 1}
                          </td>
                          <td className="px-3  py-3">{filter?.driverId}</td>
                          <td className="px-3  py-3">{filter?.driverName}</td>
                          <td className="px-3  py-3">{filter?.driverEmail}</td>
                          <td className="px-3  py-3">{filter?.driverPhone}</td>
                          <td className="px-3  py-3">{filter?.driverAge}</td>
                          <td className=" px-3  py-3">{filter?.vehicleName}</td>

                          <td className="px-3  py-3">{filter?.status}</td>

                          <td className="px-3  py-3">
                            {filter?.isVerified == true ? (
                              <p>Yes</p>
                            ) : (
                              <p>No</p>
                            )}
                          </td>
                          <td className="px-3  py-3">
                            {filter?.driverImage && (
                              <div className="">
                                <img
                                  src={`${IMAGE_URL}/${filter?.driverImage}`}
                                  className="rounded-md "
                                />
                              </div>
                            )}
                          </td>
                          <td className="px-3  py-3">
                            <div className="flex gap-5 md:gap-7">
                              <button
                                onClick={() => {
                                  navigate(
                                    `/business/drivers/updatedriver/${filter._id}`
                                  );
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faPenToSquare}
                                  size="lg"
                                  className="hover:scale-110"
                                  style={{ color: "#005af5" }}
                                />
                              </button>

                              <button onClick={() => Delete(filter?._id)}>
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  size="lg"
                                  style={{ color: "#ff0000" }}
                                  className="hover:scale-110"
                                />
                                {isButton === filter?._id ? (
                                  <ButtonLoader />
                                ) : (
                                  ""
                                )}
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
                  {Math.min(currentPage * itemPerPage, filter.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {filter.length}
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
