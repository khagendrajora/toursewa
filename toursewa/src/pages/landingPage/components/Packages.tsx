/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ITour } from "../../../.../../SharedTypes/Product/tour";
import { URL } from "../../../config/Config";
import { Link, useNavigate } from "react-router-dom";
import { ITrekking } from "../../../.../../SharedTypes/Product/trekking";
import { IVeh } from "../../../.../../SharedTypes/Product/vehicle";

const Packages = () => {
  const [tour, settour] = useState<ITour[]>([]);
  const [trek, setTrek] = useState<ITrekking[]>([]);
  const [veh, setVeh] = useState<IVeh[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`${URL}/api/gettour`);
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          settour(data);
        }
      } catch (error: any) {
        console.error(error);
      }
    };
    fetchCategory();
  }, []);
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`${URL}/api/gettrek`);
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          setTrek(data);
        }
      } catch (error: any) {
        console.error(error);
      }
    };
    fetchCategory();
  }, []);
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`${URL}/api/getveh`);
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          setVeh(data);
        }
      } catch (error: any) {
        console.error(error);
      }
    };
    fetchCategory();
  }, []);

  const featureTour = tour.filter((tour) => tour.isFeatured);
  const featureVeh = veh.filter((v) => v.isFeatured);
  const featureTrek = trek.filter((trek) => trek.isFeatured);
  // console.log(featureTrek);
  // console.log(featureVeh);
  // console.log(featureTour);
  return (
    <>
      <div className="flex flex-col mt-4  bg-white gap-3 p-2">
        <div className="flex justify-between">
          <h1 className="w-full text-button  font-bold text-lg">
            You May Love !
          </h1>
          <Link
            to="/tourpage"
            className="min-w-24 text-sky-950 font-semibold cursor-pointer hover:text-button"
          >
            View More:
          </Link>
        </div>
        <div className="flex overflow-x-auto scrollbar-hidden p-1 gap-5">
          {featureTour.length > 0 &&
            featureTour.map((tour, i) => (
              <div
                className=" font-medium flex gap-2 flex-shrink-0 w-full sm:w-1/2 sm:min-w-[400px] md:w-1/3 lg:w-1/4 text-sky-950 "
                key={i}
                onClick={() => {
                  navigate(`/tourpage/tourdetails/${tour.tourId}`);
                }}
              >
                <div className="w-3/4">
                  <img
                    src="dubai.jpg"
                    alt={`${tour.name}`}
                    className="w-full h-full"
                  />
                </div>
                <div className="flex flex-col  p-1 text-center text-xs text-sky-950 font-normal text gap-y-2">
                  <h1 className="text-button text-start font-semibold">
                    Tour Package
                  </h1>
                  <div className="text-start flex flex-col gap-y-2 sm:min-w-[150px]">
                    <p className="font-semibold">
                      {tour.duration} Days &nbsp;
                      {tour.name}{" "}
                    </p>
                    <p className="flex flex-wrap">Attractions:</p>
                    <p>Duration: {tour.duration} Days</p>
                    <p>
                      Itineary:{" "}
                      <Link to="" className="italic">
                        View Itinerary
                      </Link>
                    </p>
                    <p>Rate: NRP 7500 Per Person</p>
                    <p>Operated by: {tour.businessId}</p>
                    <div className="flex justify-center">
                      <button
                        className="bg-button hover:bg-[#06243C]  text-white font-semibold w-[85px] p-1 rounded-2xl"
                        onClick={() => {
                          navigate(`/tourpage/tourdetails/${tour.tourId}`);
                        }}
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          {featureTrek.length > 0 &&
            featureTrek.map((trek, i) => (
              <div
                className=" font-medium flex gap-2 flex-shrink-0 w-full sm:w-1/2 sm:min-w-[400px] md:w-1/3 lg:w-1/4 text-sky-950 "
                key={i}
              >
                <div className="w-3/4">
                  <img
                    src="dubai.jpg"
                    alt={`${trek.name}`}
                    className="w-full h-full"
                  />
                </div>
                <div className="flex flex-col  p-1 text-center text-xs text-sky-950 font-normal text gap-y-2">
                  <h1 className="text-button text-start font-semibold">
                    Trek Package
                  </h1>
                  <div className="text-start flex flex-col gap-y-2 sm:min-w-[150px]">
                    <p className="font-semibold">
                      {trek.days} Days &nbsp;
                      {trek.name}{" "}
                    </p>
                    <p className="flex flex-wrap">Attractions:</p>
                    <p>Duration: {trek.days} Days</p>
                    <p>
                      Itineary:{" "}
                      <Link to="" className="italic">
                        View Itinerary
                      </Link>
                    </p>
                    <p>Rate: NRP 7500 Per Person</p>
                    <p>Operated by: {trek.businessId}</p>
                    <div className="flex justify-center">
                      <button
                        className="bg-button hover:bg-[#06243C] text-white font-semibold w-[85px] p-1 rounded-2xl"
                        onClick={() => {
                          navigate(`/trekpage/trekdetails/${trek.trekId}`);
                        }}
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          {featureVeh.length > 0 &&
            featureVeh.map((veh, i) => (
              <div
                className=" font-medium flex gap-2 flex-shrink-0 w-full sm:w-1/2 sm:min-w-[400px] md:w-1/3 lg:w-1/4 text-sky-950 "
                key={i}
              >
                <div className="w-3/4">
                  <img
                    src="dubai.jpg"
                    alt={`${veh.name}`}
                    className="w-full h-full"
                  />
                </div>
                <div className="flex flex-col h-full p-1 text-center text-xs text-sky-950 font-normal text gap-y-2">
                  <h1 className="text-button text-start font-semibold">
                    Vehicle Rent
                  </h1>
                  <div className="text-start flex flex-col gap-y-2 flex-1 sm:min-w-[150px]">
                    <p className="font-semibold">{veh.name} </p>
                    <p className="flex flex-wrap">Capacity: {veh.capacity}</p>

                    <p>Rate: NRP 7500 Per Person</p>
                    <p>Operated by: {veh.businessId}</p>
                    <div className="flex justify-center mt-auto">
                      <button
                        className="bg-button hover:bg-[#06243C]  text-white font-semibold p-1 w-[85px] rounded-2xl"
                        onClick={() => {
                          navigate(`/vehiclelist/vehicledetails/${veh.vehId}`);
                        }}
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Packages;
