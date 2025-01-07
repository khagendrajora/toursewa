/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  faCartPlus,
  faCircleInfo,
  faMagnifyingGlass,
  faPenToSquare,
  faPersonCirclePlus,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { IVeh } from "../../../.../../SharedTypes/Product/vehicle";
import { URL } from "../../../config/Config";
import axios from "axios";
import { useAuthContext } from "../../../context/AuthContext";
import { PageLoader } from "../../../utils/PageLoader";
import { ButtonLoader } from "../../../utils/ButtonLoader";
import { Link, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";

export const GetVeh = () => {
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  const bId = authUser?.bId;
  const [isLoading, setIsLoading] = useState(true);
  const [vehicle, setVehicle] = useState<IVeh[] | null>(null);
  const [isButton, setIsButton] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<IVeh[] | null>([]);
  const [availability, setAvailability] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`${URL}/api/getvehicle/${bId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.error);
        } else {
          setVehicle(data);
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
      const confirmed = window.confirm("Delete Business");
      if (confirmed) {
        setIsButton(id || "");
        const response = await axios.delete(`${URL}/api/deleteprod/${id}`);
        const data = response.data;
        if (data.message) {
          toast.success(data.message);
          setVehicle((prev) => prev?.filter((v) => v._id !== id) || null);
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
    if (!vehicle) {
      setFilter(null);
      return;
    }
    const newSearch = search
      ? vehicle?.filter(
          (b) =>
            b.name?.toLowerCase().includes(search.toLowerCase()) ||
            b.vehNumber?.toLowerCase().includes(search.toLowerCase()) ||
            b.vehId?.toLowerCase().includes(search.toLowerCase())
        )
      : vehicle;
    setFilter(newSearch);
  }, [search, vehicle]);

  const isBooked = (date: Date, id: string) => {
    return (
      vehicle?.some((veh) => {
        if (veh._id === id) {
          return veh.operationDates?.some((operationalDates) => {
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

  const Feature = async (
    id: string | undefined,
    name: string,
    vehId: string
  ) => {
    try {
      const confirmed = window.confirm("Request to Add in Featured ");
      if (confirmed) {
        setIsButton(id + "feature" || "");
        const response = await axios.post(`${URL}/api/requestfeature/${id}`, {
          businessName: authUser?.businessName,
          name: name,
          productId: vehId,
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

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="h-screen flex flex-col gap-5">
        <div className="flex justify-between flex-wrap gap-y-5">
          <div>
            <h1 className="md:text-3xl text-lg font-bold">Vehicle List</h1>
            <p className="mt-2 text-xs md:text-lg">
              List of Vehicles on Toursewa
            </p>
          </div>
          <Link
            to="/business/vehicle/addvehicle"
            className="bg-button p-1 h-fit min-w-[85px] text-center max-w-[120px] text-xs hover:bg-[#06243C] text-white  rounded-md md:text-lg"
          >
            Add Vehicle
          </Link>
        </div>
        <div className="flex  justify-end">
          <div className="relative">
            <input
              type="text"
              placeholder="search"
              className="border border-gray-500  text-black rounded-md shadow-sm w-[130px] md:w-auto p-1 md:p-3 pl-7 md:pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-2 top-1/4 text-gray-400 md:h-5 md:left-3  transform -trangray-y-1/2 text-black-500 pointer-events-none"
            />
          </div>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : (
          <div className=" flex justify-center items-center text-xs">
            <div className="overflow-x-auto space-y-5 ">
              {!filter || filter.length === 0 ? (
                <p className="flex justify-center items-center text-xs">
                  No data Found
                </p>
              ) : (
                <table className="table-auto border-collapse  border border-gray-500 text-xs md:text-lg ">
                  <thead className="bg-neutral-400 text-white">
                    <tr>
                      <th className="border font-normal border-gray-500 ">
                        SN
                      </th>
                      <th className="border font-normal border-gray-500 p-1">
                        ID
                      </th>
                      <th className="border font-normal border-gray-500 p-1 min-w-[130px]">
                        Vehicle Name
                      </th>
                      <th className="border font-normal  border-gray-500 p-">
                        Category
                      </th>
                      <th className="border font-normal border-gray-500  p-1 min-w-[100px]">
                        Made Year
                      </th>
                      <th className="border font-normal border-gray-500 p-1">
                        Number
                      </th>
                      <th className="border font-normal border-gray-500 p-1">
                        Capacity
                      </th>
                      <th className="border font-normal border-gray-500  min-w-[120px] md:min-w-[160px] max-w-[110px] ">
                        Operational Dates
                      </th>
                      <th className="border font-normal border-gray-500 p-1 ">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {filter &&
                      filter.map((filter, i) => (
                        <tr className="" key={filter._id}>
                          <td className="border border-gray-500 text-center p-1">
                            {i + 1}
                          </td>
                          <td className="border border-gray-500 text-center p-1">
                            {filter.vehId}
                          </td>
                          <td className="border border-gray-500 text-center p-1">
                            {filter.name}
                          </td>
                          <td className="border  border-gray-500 min-w-[100px]  text-center">
                            {filter.vehCategory}
                          </td>

                          <td className=" border border-gray-500 text-center p-1">
                            {filter.madeYear
                              ? filter.madeYear.toString().split("-")[0]
                              : ""}
                          </td>
                          <td className="border border-gray-500 min-w-[120px] text-center p-1">
                            {filter.vehNumber}
                          </td>

                          <td className="border border-gray-500 text-center p-1">
                            {filter.capacity}
                          </td>

                          <td className="border border-gray-500 text-center">
                            <span
                              className="cursor-pointer  text-blue-400"
                              onClick={() =>
                                changeAvailability(filter._id || "")
                              }
                            >
                              {filter.operationDates?.length}

                              {availability === filter._id && (
                                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                                  <div
                                    className="relative bg-white p-5 rounded-lg shadow-md"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Calendar
                                      tileDisabled={({ date }) =>
                                        isBooked(date, filter._id || "")
                                      }
                                      minDate={new Date()}
                                      className="z-10"
                                      tileClassName={({ date, view }) =>
                                        `${
                                          view === "month" ? "custom-tile" : ""
                                        } ${
                                          isBooked(date, filter._id || "")
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
                            </span>
                          </td>
                          <td className="flex justify-between flex-col border gap-6 border-b-0  text-white p-1 ">
                            <div className="flex gap-4 md:gap-7">
                              <button
                                onClick={() =>
                                  navigate(
                                    `/business/vehicle/vehicledetail/${filter?.vehId}`
                                  )
                                }
                                title="Full Info"
                              >
                                <FontAwesomeIcon
                                  icon={faCircleInfo}
                                  size="lg"
                                  className="hover:scale-110"
                                  style={{ color: "#06d01e" }}
                                />
                              </button>
                              <button
                                onClick={() =>
                                  navigate(
                                    `/business/vehicle/updateVehicle/${filter.vehId}`
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

                              {filter.isFeatured ? (
                                <button
                                  onClick={() => Remove(filter?._id)}
                                  className="hover:scale-110"
                                  title="Remove from Feature"
                                >
                                  <FontAwesomeIcon
                                    icon={faCartPlus}
                                    size="lg"
                                    className="text-red-600"
                                  />

                                  {isButton === filter?._id + "Rfeature" ? (
                                    <ButtonLoader />
                                  ) : (
                                    ""
                                  )}
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    Feature(
                                      filter?._id,
                                      filter?.name,
                                      filter?.vehId
                                    )
                                  }
                                  className="hover:scale-110"
                                  title="Add to Feature"
                                >
                                  <FontAwesomeIcon
                                    icon={faCartPlus}
                                    size="lg"
                                    className="text-lime-700"
                                  />

                                  {isButton === filter?._id + "feature" ? (
                                    <ButtonLoader />
                                  ) : (
                                    ""
                                  )}
                                </button>
                              )}

                              <button onClick={() => Delete(filter._id)}>
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  size="lg"
                                  style={{ color: "#ff0000" }}
                                  className="hover:scale-110"
                                  title="Delete"
                                />
                                {isButton == filter._id ? <ButtonLoader /> : ""}
                              </button>

                              <Link
                                to={`/business/vehicle/adddriver/${filter.vehId}`}
                                className=" text-lime-500 rounded-lg"
                                title="Add Driver"
                              >
                                <FontAwesomeIcon
                                  size="lg"
                                  className="hover:scale-110"
                                  icon={faPersonCirclePlus}
                                />
                              </Link>
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
