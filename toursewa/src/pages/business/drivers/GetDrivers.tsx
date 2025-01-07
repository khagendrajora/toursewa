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
  const [filter, setFilter] = useState<IDriver[] | null>([]);
  const [driver, setDriver] = useState<IDriver[] | null>(null);
  const [isButton, setIsButton] = useState<string>("");

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const res = await fetch(`${URL}/api/getdriverbybid/${businessId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.error);
        } else {
          setDriver(data);
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
        const response = await axios.delete(`${URL}/api/deletedriver/${id}`);
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

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="w-11/12 flex flex-col gap-5">
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
        <div className="flex mt-  justify-end">
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
          <div className=" flex justify-center w-full items-center text-xs">
            <div className="overflow-x-auto  ">
              {!Array.isArray(filter) || filter.length === 0 ? (
                <>
                  <p>Empty</p>
                </>
              ) : (
                <table className="table-auto border-collapse w-full border border-gray-500 text-xs md:text-sm">
                  <thead className="bg-neutral-400 text-white">
                    <tr>
                      <th className="border font-normal border-gray-500 p-1">
                        SN
                      </th>
                      <th className="border font-normal border-gray-500 p-1">
                        ID
                      </th>
                      <th className="border font-normal border-gray-500 p-1">
                        Name
                      </th>
                      <th className="border font-normal  border-gray-500 p-1">
                        Email
                      </th>
                      <th className="border font-normal  border-gray-500 p-2">
                        Phone
                      </th>
                      <th className="border font-normal  border-gray-500 p-2">
                        Age
                      </th>
                      <th className="border font-normal border-gray-500 p-2 min-w-[85px] md:min-w-[95px]">
                        Vehicle Name
                      </th>
                      <th className="border font-normal border-gray-500 p-2">
                        Status
                      </th>
                      <th className="border font-normal border-gray-500 p-2 min-w-[70px]">
                        Is Verified
                      </th>
                      <th className="border font-normal border-gray-500 p-2">
                        Image
                      </th>
                      <th className="border font-normal border-gray-500 p-2">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {filter &&
                      filter.map((filter, i) => (
                        <tr className="" key={filter?._id}>
                          <td className="border border-gray-500 p-2 text-center">
                            {i + 1}
                          </td>
                          <td className="border border-gray-500 p-2 text-center">
                            {filter?.driverId}
                          </td>
                          <td className="border border-gray-500 p-2 text-center">
                            {filter?.driverName}
                          </td>
                          <td className="border border-gray-500 p-2 text-center">
                            {filter?.driverEmail}
                          </td>
                          <td className="border border-gray-500 p-2 text-center">
                            {filter?.driverPhone}
                          </td>
                          <td className="border border-gray-500 p-2 text-center">
                            {filter?.driverAge}
                          </td>
                          <td className=" border border-slate-400 text-center">
                            {filter?.vehicleName}
                          </td>

                          <td className="border border-gray-500 p-2 text-center">
                            {filter?.status}
                          </td>

                          <td className="border border-gray-500 p-2 text-center">
                            {filter?.isVerified == true ? (
                              <p>Yes</p>
                            ) : (
                              <p>No</p>
                            )}
                          </td>
                          <td className="border border-gray-500 p-2 text-center">
                            {filter?.driverImage && (
                              <div className="">
                                <img
                                  src={`${IMAGE_URL}/${filter?.driverImage}`}
                                  className="rounded-md "
                                />
                              </div>
                            )}
                          </td>
                          <td className="border border-gray-500 p-1 text-center">
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
          </div>
        )}
      </div>
    </>
  );
};
