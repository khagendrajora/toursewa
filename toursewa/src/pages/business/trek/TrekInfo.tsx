import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ITrekking } from "../../../../../backend/src/models/Product/trekking";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Calendar from "react-calendar";
import HTMLReactParser from "html-react-parser";

export const TrekInfo = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const [availability, setAvailability] = useState(false);
  const [trek, settrek] = useState<ITrekking>();
  const [showInclusions, setShowInclusions] = useState(false);

  const isBooked = (date: Date) => {
    if (!Array.isArray(trek?.operationDates)) return false;
    return (
      trek?.operationDates.some((operationalDate) => {
        const bookedDate = new Date(operationalDate);
        return (
          bookedDate.getDate() === date.getDate() &&
          bookedDate.getMonth() === date.getMonth() &&
          bookedDate.getFullYear() === date.getFullYear()
        );
      }) || false
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://tourbackend-rdtk.onrender.com/api/gettrekdetails/${id}`
        );
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error);
        } else {
          settrek(data);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <h1 className="text-xl font-semibold">Trek Details</h1>
      <div className="flex justify-center  items-center w-full">
        <div className="p-5 w-11/12">
          {trek && (
            <>
              <table className="table-auto md:text-lg text-xs border-collapse border border-slate-600 w-full text-center">
                <tbody>
                  <tr className="border border-slate-600">
                    <th className="p-2">Trek ID</th>
                    <td className="border border-slate-600">{trek.trekId}</td>
                  </tr>
                  <tr className="border border-slate-600">
                    <th className="p-2">Business Id</th>
                    <td className="border border-slate-600">
                      {trek.businessId}
                    </td>
                  </tr>
                  <tr className="border border-slate-600">
                    <th>Trek Name</th>
                    <td className="border border-slate-600">
                      {trek.prodCategory}
                    </td>
                  </tr>
                  <tr className="border border-slate-600">
                    <th>Category</th>
                    <td className="border border-slate-600">
                      {trek.prodsubCategory}
                    </td>
                  </tr>

                  <tr className="border border-slate-600">
                    <th className="p-2">Sub Category</th>
                    <td className="border border-slate-600">
                      {trek.prodsubCategory}
                    </td>
                  </tr>

                  <tr className="border border-slate-600">
                    <th className="p-2">Destination</th>
                    <td className="border border-slate-600">{trek.dest}</td>
                  </tr>

                  <tr className="border border-slate-600">
                    <th className="p-2">Duration</th>
                    <td className="border border-slate-600">{trek.days}</td>
                  </tr>

                  <tr className="border border-slate-600">
                    <th className="p-2">Capacity</th>
                    <td className="border border-slate-600">{trek.capacity}</td>
                  </tr>

                  <tr className="border border-slate-600">
                    <th className="p-2">Phone</th>
                    <td className="border border-slate-600">{trek.numbers}</td>
                  </tr>

                  <tr className="border border-slate-600">
                    <th className="p-2">Trek Inclusions</th>

                    <td className="border border-slate-600">
                      <span
                        className="cursor-pointer text-blue-500"
                        onClick={() => setShowInclusions(true)}
                      >
                        {trek?.inclusion?.length}
                        {showInclusions && (
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
                                  setShowInclusions(false);
                                }}
                              />
                              <h3 className="text-sm font-semibold text-center mb-4">
                                Inclusions
                              </h3>
                              <div className="max-h-40 overflow-y-auto">
                                {trek?.inclusion.map((inclusion) => (
                                  <ol className="text-start">
                                    <li className="p-1">{inclusion}</li>
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
                    <th className="p-2">Operational Days</th>
                    <td className="border border-slate-600">
                      <span
                        className="cursor-pointer text-blue-400"
                        onClick={() => setAvailability(!availability)}
                      >
                        {trek?.operationDates?.length}
                      </span>
                      {availability && (
                        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                          <div
                            className="relative bg-white p-5 rounded-lg shadow-md"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Calendar
                              tileClassName={({ date }) =>
                                isBooked(date) ? "bg-red-500" : ""
                              }
                              minDate={new Date()}
                              className="z-10"
                            />

                            <FontAwesomeIcon
                              icon={faXmark}
                              className="absolute top-1 right-1 cursor-pointer text-red-600"
                              size="lg"
                              onClick={() => setAvailability(!availability)}
                            />
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-10 flex flex-col gap-5">
                <h1 className="text-xl font-semibold">Itinerary</h1>
                <span className="bg-white p-1">
                  {HTMLReactParser(trek.itinerary)}
                </span>
              </div>
              <div className="flex justify-center mt-10 w-full">
                <button
                  className=" rounded-lg p-3 w-3/4 md:w-1/3 text-sm text-white bg-button hover:bg-orange-700 md:text-xl"
                  onClick={() =>
                    navigate(`/business/trek/updatebusinesstrek/${trek.trekId}`)
                  }
                >
                  Edit Details
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
