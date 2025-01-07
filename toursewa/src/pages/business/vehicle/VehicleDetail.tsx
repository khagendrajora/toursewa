/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { IVeh } from "../../../.../../SharedTypes/Product/vehicle";
import { IMAGE_URL, URL } from "../../../config/Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const VehicleDetail = () => {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  const [availability, setAvailability] = useState(false);
  const [veh, setVeh] = useState<IVeh | null>(null);
  const [showServices, setShowServices] = useState(false);
  const [showAmenities, setShowAmenities] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${URL}/api/getvehdetails/${id}`);
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error);
        } else {
          setVeh(data);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchData();
  }, [id]);

  const isBooked = (date: Date) => {
    if (!Array.isArray(veh?.operationDates)) return false;
    return (
      veh?.operationDates.some((operationalDate) => {
        const bookedDate = new Date(operationalDate);
        return (
          bookedDate.getDate() === date.getDate() &&
          bookedDate.getMonth() === date.getMonth() &&
          bookedDate.getFullYear() === date.getFullYear()
        );
      }) || false
    );
  };

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="flex justify-center items-center w-full">
        <div className="p-1 m-3 w-11/12">
          <div className=" text-center p-5">
            {veh?.vehImages &&
              veh?.vehImages.map((image, i) => (
                <img
                  key={i}
                  src={`${IMAGE_URL}/${image}`}
                  className="rounded-md"
                />
              ))}
          </div>
          <table className="table-auto  border-collapse border border-slate-600 w-full mt-10 text-center">
            <tbody>
              <tr className="border border-slate-600">
                <th className="p-3">Vehicle Name</th>
                <td className="border border-slate-600">{veh?.name}</td>
              </tr>
              <tr className="border border-slate-600">
                <th className="p-3">Vehicle Category</th>
                <td className="border border-slate-600">{veh?.vehCategory}</td>
              </tr>
              <tr className="border border-slate-600">
                <th className="p-3">Vehicle Sub Category</th>
                <td className="border border-slate-600">
                  {veh?.vehSubCategory}
                </td>
              </tr>
              <tr className="border border-slate-600">
                <th className="p-3">Services</th>
                <td className="border border-slate-600 ">
                  <span
                    className="cursor-pointer text-blue-500"
                    onClick={() => setShowServices(true)}
                  >
                    {veh?.services?.length}
                    {showServices && (
                      <div className="fixed inset-0 flex items-center text-black justify-center bg-opacity-50 z-50">
                        <div
                          className="p-1 relative bg-white md:w-1/3 w-1/2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FontAwesomeIcon
                            icon={faXmark}
                            size="lg"
                            className=" absolute cursor-pointer right-1 text-red-500"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowServices(false);
                            }}
                          />
                          <h3 className="text-sm font-semibold text-center mb-4">
                            Services
                          </h3>
                          <div className="max-h-40 overflow-y-auto">
                            {veh?.services.map((service) => (
                              <ol className="text-start">
                                <li className="p-1">{service}</li>
                              </ol>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </span>
                </td>
              </tr>
              <tr className="border border-slate-600">
                <th className="p-3">Amenities</th>
                <td className="border border-slate-600">
                  <span
                    className="cursor-pointer text-blue-500"
                    onClick={() => setShowAmenities(true)}
                  >
                    {veh?.amenities.length}
                    {showAmenities && (
                      <div className="fixed inset-0 flex items-center text-black justify-center bg-opacity-50 z-50">
                        <div
                          className="p-1 relative bg-white md:w-1/3 w-1/2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FontAwesomeIcon
                            icon={faXmark}
                            size="lg"
                            className=" absolute cursor-pointer right-1 text-red-500"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowAmenities(false);
                            }}
                          />
                          <h3 className="text-sm font-semibold text-center mb-4">
                            Services
                          </h3>
                          <div className="max-h-40 overflow-y-auto">
                            {veh?.amenities.map((amenities) => (
                              <ol className="text-start">
                                <li>{amenities}</li>
                              </ol>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </span>
                </td>
              </tr>
              <tr className="border border-slate-600">
                <th className="p-3">Vehicle Condition</th>
                <td className="border border-slate-600">{veh?.vehCondition}</td>
              </tr>
              <tr className="border border-slate-600">
                <th className="p-3">Vehicle Number</th>
                <td className="border border-slate-600">{veh?.vehNumber}</td>
              </tr>
              <tr className="border border-slate-600">
                <th className="p-3">Capacity</th>
                <td className="border border-slate-600">{veh?.capacity}</td>
              </tr>

              <tr className="border border-slate-600">
                <th className="p-3">Operation Dates</th>
                <td className="border border-slate-600">
                  <span
                    className="cursor-pointer text-blue-400"
                    onClick={() => setAvailability(!availability)}
                  >
                    {veh?.operationDates?.length}
                  </span>
                  {availability && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                      <div
                        className="relative bg-white p-5 rounded-lg shadow-md"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Calendar
                          tileDisabled={({ date }) => isBooked(date)}
                          minDate={new Date()}
                          className="z-10"
                          tileClassName={({ date, view }) =>
                            `${view === "month" ? "custom-tile" : ""} ${
                              isBooked(date) ? "disable-date" : ""
                            }`.trim()
                          }
                        />
                        <FontAwesomeIcon
                          icon={faXmark}
                          className="absolute top-1 right-1 cursor-pointer text-red-600"
                          size="lg"
                          onClick={() => setAvailability(false)}
                        />
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-center mt-10 w-full">
            <button
              className=" rounded-lg p-3 w-3/4 md:w-1/3 text-sm text-white bg-button hover:bg-orange-700 md:text-xl"
              onClick={() => {
                navigate(`/business/vehicle/updateVehicle/${veh?.vehId}`);
              }}
            >
              Edit Details
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleDetail;
