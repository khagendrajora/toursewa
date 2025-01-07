/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { IDest } from "../../../.../../SharedTypes/Pages/LandingPage/Destination";
import { URL } from "../../../config/Config";

const Destination = () => {
  const [dest, setDest] = useState<IDest[]>([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`${URL}/api/getDest`);
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          setDest(data);
        }
      } catch (error: any) {
        console.error(error);
      }
    };
    fetchCategory();
  }, []);
  return (
    <>
      <div className="flex flex-col mt-4  bg-white gap-3 p-2">
        <div className="flex justify-between">
          <h1 className="w-full text-button  font-bold text-lg">
            Popular Destinations
          </h1>
        </div>
        <div className="flex overflow-x-auto scrollbar-hidden p-1 gap-5">
          {dest.length > 0 &&
            dest.map((dest, i) => (
              <div
                key={i}
                className=" font-medium flex flex-col items-center gap-1 flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 text-sky-950 "
              >
                <div className="w-fit">
                  <img
                    src="dubai.jpg"
                    alt={`${dest.title}`}
                    style={{
                      borderRadius: "50%",
                      width: "200px",
                      height: "200px",
                    }}
                    className=""
                  />
                </div>

                <div className="flex  justify-center text-button">
                  <h1 className="">{dest.title}</h1>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Destination;
