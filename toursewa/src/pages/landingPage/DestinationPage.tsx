import { useEffect, useState } from "react";
import { IDest } from "../../../../backend/src/models/Pages/LandingPage/Destination";

export const DestinationPage = () => {
  const [dest, setDest] = useState<IDest[]>([]);
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(
          `https://tourbackend-rdtk.onrender.com/api/getDest`
        );
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
      <div className="flex flex-col mt-4  bg-zinc-200 gap-3 p-2">
        <div className="flex">
          <h1 className="w-full text-button text-center font-bold text-lg">
            Popular Destinations
          </h1>
        </div>
        <div className="flex flex-wrap justify-between ">
          {dest.length > 0 &&
            dest.map((data) => (
              <>
                <div
                  key={data._id}
                  className=" p-1 rounded-lg flex flex-col h-fit border gap-1 w-11/12 max-w-[400px]"
                >
                  <div className=" ">
                    <img src="dubai.jpg" />
                  </div>
                  <div className="flex flex-col flex-wrap gap-y-1 p-2 text-xl ">
                    <div className=" font-serif ">{data.title}</div>
                  </div>
                  <hr />
                </div>
              </>
            ))}
        </div>
      </div>
    </>
  );
};
