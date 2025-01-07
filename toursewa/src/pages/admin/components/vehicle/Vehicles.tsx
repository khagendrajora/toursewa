/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { IVeh } from "../../../../SharedTypes/Product/vehicle";
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
import "react-calendar/dist/Calendar.css";

const Vehicles = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<IVeh[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [vehicle, setVehicle] = useState<IVeh[] | null>(null);
  const [availability, setAvailability] = useState<string | null>(null);
  const [isButton, setIsButton] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`${URL}/api/getveh`);
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
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
      setIsButton(id || "");
      const confirmed = window.confirm("Delete Vehicle");
      if (confirmed) {
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
            b.vehId?.toLowerCase().includes(search.toLowerCase()) ||
            b.businessName?.toLowerCase().includes(search.toLowerCase())
        )
      : vehicle;
    setFilter(newSearch);
  }, [search, vehicle]);

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="h-screen flex flex-col gap-5">
        <div className="flex justify-between flex-wrap gap-y-5">
          <div>
            <h1 className="md:text-3xl sm:text-lg font-bold">Vehicle List</h1>
            <p className="mt-2 text-xs md:text-lg">
              List of Vehicles on Toursewa
            </p>
          </div>
          <Link
            to="/admin/addveh"
            className="bg-button p-1 h-fit min-w-[85px] text-center max-w-[120px] text-xs hover:bg-[#06243C] text-white  rounded-md md:text-lg"
          >
            Add Vehicle
          </Link>
        </div>
        <div className="flex  justify-end">
          <div className="relative">
            <input
              type="text"
              value={search}
              placeholder="Search Vehicle"
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-500  text-black rounded-md shadow-sm w-[130px] md:w-auto p-1 md:p-3 pl-7 md:pl-10"
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
              {!filter || Object.keys(filter).length === 0 ? (
                <p className="flex justify-center items-center text-xs">
                  Empty
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
                      <th className="border font-normal  border-gray-500 p-1">
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
                      <th className="border font-normal border-gray-500 p-1 min-w-[120px] md:min-w-[170px]">
                        Operational Dates
                      </th>
                      <th className="border font-normal border-gray-500 p-2 ">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {filter &&
                      filter.map((vehicle, i) => (
                        <tr key={vehicle?._id} className="relative">
                          <td className="border border-gray-500 text-center">
                            {i + 1}
                          </td>
                          <td className="border border-gray-500 text-center p-2">
                            {vehicle?.vehId}
                          </td>
                          <td className="border border-gray-500 text-center p-2">
                            {vehicle?.name}
                          </td>
                          <td className="border  border-gray-500 min-w-[100px]  text-center p-2">
                            {vehicle?.vehCategory}
                          </td>

                          <td className=" border border-gray-500 text-center p-2">
                            {vehicle?.madeYear
                              ? new Date(vehicle?.madeYear).getFullYear()
                              : ""}
                          </td>
                          <td className="border border-gray-500 min-w-[120px] text-center p-2">
                            {vehicle?.vehNumber}
                          </td>

                          <td className="border border-gray-500 text-center">
                            {vehicle?.capacity}
                          </td>
                          <td className="border border-gray-500 text-center">
                            <span
                              className="cursor-pointer  text-blue-400"
                              onClick={() =>
                                changeAvailability(vehicle._id || "")
                              }
                            >
                              {vehicle.operationDates?.length}

                              {availability === vehicle._id && (
                                <div
                                  className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
                                  // onClick={() => setAvailability(null)}
                                >
                                  <div
                                    className="relative bg-white p-5 rounded-lg shadow-md"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Calendar
                                      tileDisabled={({ date }) =>
                                        isBooked(date, vehicle._id || "")
                                      }
                                      minDate={new Date()}
                                      className="z-10"
                                      tileClassName={({ date, view }) =>
                                        `${
                                          view === "month" ? "custom-tile" : ""
                                        } ${
                                          isBooked(date, vehicle._id || "")
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

                          <td className="flex justify-between flex-col border gap-6 border-b-0  text-white p-2 ">
                            <div className="flex gap-7 md:gap-10">
                              <Link
                                to={`/admin/vehicle/vehdetails/${vehicle.vehId}`}
                                className="hover:scale-110 "
                                title="Full Info"
                              >
                                <FontAwesomeIcon
                                  icon={faCircleInfo}
                                  size="lg"
                                  style={{ color: "#06d01e" }}
                                />
                              </Link>

                              <button
                                onClick={() =>
                                  navigate(
                                    `/admin/vehicle/updatevehicle/${vehicle.vehId}`
                                  )
                                }
                                className="hover:scale-110 "
                                title="Edit"
                              >
                                <FontAwesomeIcon
                                  icon={faPenToSquare}
                                  size="lg"
                                  style={{ color: "#005af5" }}
                                />
                              </button>

                              <button onClick={() => Delete(vehicle?._id)}>
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  size="lg"
                                  className="hover:scale-110 "
                                  style={{ color: "#ff0000" }}
                                  title="Delete"
                                />
                                {isButton == vehicle._id ? (
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

export default Vehicles;
