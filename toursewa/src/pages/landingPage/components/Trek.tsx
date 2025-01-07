import { useEffect, useState } from "react";
import { ITrekking } from "../../../.../../SharedTypes/Product/trekking";
import { URL } from "../../../config/Config";
import { Link, useNavigate } from "react-router-dom";

export const Trek = () => {
  const navigate = useNavigate();
  const [trek, setTrek] = useState<ITrekking[]>([]);
  useEffect(() => {
    const fetchTrek = async () => {
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
    fetchTrek();
  }, []);
  return (
    <>
      <div className="flex flex-col mt-4 overflow-y-auto bg-white gap-3 p-2">
        <div className="flex justify-between">
          <h1 className="w-full text-button  font-bold text-lg">
            Trek Packages
          </h1>
          <Link
            to="/trekpage"
            className="min-w-24 hover:text-button text-sky-950 font-semibold cursor-pointer"
          >
            View More:
          </Link>
        </div>
        <div className="flex overflow-x-auto p-1 gap-5">
          {trek.length > 0 &&
            trek.map((trek, i) => (
              <div
                className=" font-medium flex gap-2 flex-shrink-0 w-full sm:w-1/2 sm:min-w-[400px] md:w-1/3 lg:w-1/4 text-sky-950 "
                key={i}
                onClick={() => {
                  navigate(`/trekpage/trekdetails/${trek.trekId}`);
                }}
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
                    {/* <p>Duration: {trek.duration} Days</p> */}
                    <p>
                      Itineary:{" "}
                      <Link to="" className="italic">
                        View Itinerary
                      </Link>
                    </p>
                    <p>Rate: NRP 7500 Per Person</p>
                    <p>Operated by: {trek.businessId}</p>
                    <div className="flex justify-center">
                      <button className="bg-button hover:bg-orange-700 text-white font-semibold p-1 rounded-2xl">
                        Learn More:
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
