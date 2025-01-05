import { useEffect, useState } from "react";
import { IDest } from "../../../../backend/src/models/Pages/LandingPage/Destination";
// import { IMAGE_URL } from "../../config/Config";

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
          {/* <h1 className="min-w-24 text-sky-950 font-semibold cursor-pointer">
            View More:
          </h1> */}
        </div>
        <div className="flex flex-wrap justify-between ">
          {dest.length > 0 &&
            dest.map((data) => (
              <>
                {/* {filter.map((veh) => (
                               <> */}
                <div
                  key={data._id}
                  className=" p-1 rounded-lg flex flex-col h-fit border gap-1 w-11/12 max-w-[400px]"
                >
                  <div className=" ">
                    {/* {data.destImage &&
                      data.destImage.map((image, i) => (
                        <img
                          key={i}
                          src={`${IMAGE_URL}/${image}`}
                          className="rounded-md w-full h-40 "
                        />
                      ))} */}
                    <img src="dubai.jpg" />
                  </div>
                  <div className="flex flex-col flex-wrap gap-y-1 p-2 text-xl ">
                    <div className=" font-serif ">{data.title}</div>
                    {/* <div className="text-sm flex gap-5"> */}{" "}
                    {/* {veh.vehSubCategory} */}
                    {/* <div className="cursor-pointer" title="capacity">
                        <FontAwesomeIcon
                          icon={faUserGroup}
                          style={{ color: "#000000" }}
                        />
                        &nbsp;{veh.capacity}
                      </div> */}
                    {/* <div className="cursor-pointer" title="Made Year">
                        &nbsp;{veh.madeYear.toString().split("-")[0]}
                      </div> */}
                    {/* </div> */}
                  </div>
                  <hr />
                  {/* <div className="flex p-1 text-xs justify-around">
                    <button
                      className="bg-button  p-2 rounded-lg text-white"
                      onClick={() => available(veh.vehId)}
                    >
                      More Info
                    </button>
                    <button
                      className="bg-button  p-2 rounded-lg text-white"
                      onClick={() =>
                        bookingForm(veh.vehId, veh.name, veh.capacity)
                      }
                    >
                      Book Now
                    </button>
                  </div> */}
                </div>
              </>
              //      ))}
              //    </>
            ))}
        </div>
      </div>
    </>
  );
};
