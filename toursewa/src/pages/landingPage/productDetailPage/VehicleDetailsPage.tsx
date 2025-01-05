/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { IVeh } from "../../../../../backend/src/models/Product/vehicle";
import { IRDates } from "../../../../../backend/src/models/Reservations/ReservedDated";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { IMAGE_URL } from "../../../config/Config";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAuthContext } from "../../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import HTMLReactParser from "html-react-parser";

export const VehicleDetailsPage = () => {
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const [veh, setVeh] = useState<IVeh>();
  const capacity = veh?.capacity;
  const name = veh?.name;
  const [dates, setDates] = useState<IRDates[]>([]);
  const [availability, setAvailability] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://tourbackend-rdtk.onrender.com/api/getvehdetails/${id}`
        );
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rep = await fetch(
          `https://tourbackend-rdtk.onrender.com/api/reservdates/${id}`
        );
        const datas = await rep.json();
        if (!rep.ok) {
          toast.error(datas.error);
        } else {
          setDates(Array.isArray(datas) ? datas : []);
          // console.log(datas);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchData();
  }, []);

  const isBooked = (date: Date) => {
    if (!Array.isArray(dates) || !Array.isArray(veh?.operationDates))
      return false;

    const isReserved = dates.some((reserv) =>
      reserv.bookingDate.some((booked) => {
        const bookedDate = new Date(booked);
        return (
          bookedDate.getDate() === date.getDate() &&
          bookedDate.getMonth() === date.getMonth() &&
          bookedDate.getFullYear() === date.getFullYear()
        );
      })
    );

    const isOperational = veh.operationDates.some((operationalDate) => {
      const operationalDateObj = new Date(operationalDate);
      return (
        operationalDateObj.getDate() === date.getDate() &&
        operationalDateObj.getMonth() === date.getMonth() &&
        operationalDateObj.getFullYear() === date.getFullYear()
      );
    });
    return isReserved || isOperational;
  };

  const bookingForm = async () => {
    if (authUser) {
      navigate(`/reservationform/${id}`, {
        state: { capacity: capacity, name: name },
      });
    } else {
      navigate(`/login`);
    }
  };
  return (
    <>
      <ToastContainer theme="colored" position="top-center" />
      <div className="flex mx-auto  w-11/12">
        <div className="flex w-full ">
          {veh ? (
            <>
              <div className="w-full flex flex-wrap justify-center ">
                <div className="w-1/2 p-10">
                  <img
                    src={`${IMAGE_URL}/${veh.vehImages}`}
                    className="w-full h-auto"
                  />
                  <div className="pt-10 pb-5 w-fit ">
                    <button
                      className="bg-button relative z-10 text-white text-xs md:text-xl md:px-2 p-2 rounded-lg md:p-2 mt-1 hover:bg-red-800"
                      onClick={() => setAvailability(!availability)}
                    >
                      Check Availabilaty{" "}
                    </button>
                    {availability && (
                      <div className="flex">
                        <Calendar
                          tileDisabled={({ date }) => isBooked(date)}
                          minDate={new Date()}
                          className="absolute z-10 mt-10"
                          tileClassName={({ date, view }) =>
                            `${view === "month" ? "custom-tile" : ""} ${
                              isBooked(date) ? "disable-date" : ""
                            }`.trim()
                          }
                        />
                        <div className="flex relative cursor-pointer mt-4 z-10">
                          <FontAwesomeIcon
                            icon={faXmark}
                            size="xl"
                            className="absolute "
                            onClick={() => setAvailability(!availability)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-white w-[500px] md:p-5 rounded-sm md:shadow-sm ">
                  <div className=" space-y-5">
                    <div className="text-3xl font-bold">{veh.name}</div>
                    <p className="font-serif  ">
                      {veh.description && HTMLReactParser(veh.description)}
                    </p>
                    <div className=" ">
                      <table className="table-auto text-lg w-11/12">
                        <tbody className="">
                          <tr className="">
                            <th className="text-button text-start font-semibold  py-3">
                              Vehicle Category
                            </th>
                            <td className="text-start">:{veh?.vehCategory}</td>
                          </tr>
                          <tr className="">
                            <th className="text-button text-start font-semibold  py-3">
                              Vehicle Sub Category
                            </th>
                            <td className="text-start">
                              :{veh.vehSubCategory}
                            </td>
                          </tr>
                          <tr className="">
                            <th className="text-button text-start font-semibold  py-3">
                              Services
                            </th>
                            <td className="text-start">
                              <div className="flex gap-3">
                                {veh?.services &&
                                  veh?.services.map((services, i) => (
                                    <p key={i}>{services},</p>
                                  ))}
                              </div>
                            </td>
                          </tr>
                          <tr className="mt-5">
                            <th className="text-button text-start font-semibold py-3">
                              Amenities
                            </th>
                            <td className="text-start ">
                              <div className="flex gap-3">
                                {veh.amenities &&
                                  veh?.amenities &&
                                  veh.amenities.map((amenities, i) => (
                                    <p key={i}>{amenities},</p>
                                  ))}
                              </div>
                            </td>
                          </tr>
                          <tr className="">
                            <th className="text-button text-start font-semibold  py-3">
                              Vehicle condition
                            </th>
                            <td className="text-start">:{veh.vehCondition}</td>
                          </tr>
                          <tr className="">
                            <th className="text-button text-start font-semibold  py-3">
                              Vehicle Number
                            </th>
                            <td className="text-start">:{veh.vehNumber}</td>
                          </tr>
                          <tr className="">
                            <th className="text-button text-start font-semibold  py-3">
                              Capacity
                            </th>
                            <td className="text-start">:{veh.capacity}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <button
                      className="bg-blue-900 text-white text-xl px-3 p-2 mt-2 hover:bg-blue-700"
                      onClick={bookingForm}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};
