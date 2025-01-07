/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ITour } from "../../SharedTypes/Product/tour";
import { IMAGE_URL, URL } from "../../config/Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export const TourPage = () => {
  const navigate = useNavigate();
  const [tour, setTour] = useState<ITour[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [filtered, setFiltered] = useState<ITour[]>([]);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await fetch(`${URL}/api/gettour`);
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          setTour(data);
        }
      } catch (error: any) {
        toast.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTour();
  }, []);
  const newTour = tour.filter((t) => t.isActive);

  useEffect(() => {
    if (search) {
      const tourFilter = newTour.filter((t) => {
        return t.name.toLowerCase().includes(search.toLowerCase());
      });
      setFiltered(tourFilter);
    } else {
      setFiltered([]);
    }
  }, [search, newTour]);

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <h1 className="font-bold text-3xl mt-2  text-center">Tours</h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-44">
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              size="2xl"
              style={{ color: "#011def" }}
            />
            <p>Loading....</p>
          </div>
        ) : newTour && newTour.length > 0 ? (
          <>
            <div className="flex mt-10 flex-wrap sm:w-3/4 items-center justify-center gap-5 ">
              <div className="w-full flex  justify-center">
                <input
                  type="text"
                  placeholder="Search"
                  className="border p-2 rounded-lg sm:w-1/3"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {filtered.length > 0 ? (
                <>
                  {filtered.map((tour) => (
                    <div
                      key={tour._id}
                      className="flex flex-wrap border border-slate-600 w-11/12 justify-between gap-10 rounded-md bg-gray-100 p-5 "
                    >
                      <div className="flex flex-col gap-4">
                        <div className="text-xl md:text-2xl font-semibold text-rose-500">
                          {tour.name}
                        </div>
                        <div className=" font-serif flex gap-3 ">
                          Destination:
                          <span className="text-slate-500">
                            {tour.dest}
                          </span>{" "}
                        </div>
                        <div className=" font-serif flex gap-3">
                          Duration:
                          <span className="text-slate-500">
                            {tour.duration}
                          </span>
                        </div>

                        <div className="font-serif flex gap-3">
                          Capacity:
                          <span className="text-slate-500">
                            {tour.capacity}
                          </span>
                        </div>

                        <div className="flex gap-3">
                          Contact:
                          <span className="text-slate-500">{tour.phone}</span>
                        </div>
                      </div>
                      <div>
                        <div className="font-serif flex gap-3 ">
                          Inclusion:
                          <span className="text-slate-500">
                            {tour.inclusion &&
                              tour.inclusion.map((data) => (
                                <div className="flex flex-wrap">{data}</div>
                              ))}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div>
                          <span className="text-slate-500 flex flex-wrap">
                            Operational Dates:
                          </span>
                          {tour.operationDates &&
                            tour.operationDates.map((dates) => (
                              <div className="flex flex-wrap text-xs">
                                <span>{dates.toString()}</span>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div className="">
                        {tour.tourImages &&
                          tour.tourImages.map((image, i) => (
                            <img
                              key={i}
                              src={`${IMAGE_URL}/${image}`}
                              className="rounded-md w-full h-40 "
                            />
                          ))}
                      </div>
                      <div className="flex w-full justify-center font-san font-semibold ">
                        <button
                          className="bg-blue-800 w-1/3  p-2 px-10 rounded-xl text-white"
                          onClick={() => {
                            navigate(`/tourpage/tourdetails/${tour.tourId}`);
                          }}
                        >
                          More Details
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {newTour.map((tour) => (
                    <div
                      key={tour._id}
                      className="flex flex-wrap border border-slate-600 w-11/12 justify-between gap-10 rounded-md bg-gray-100 p-5 "
                    >
                      <div className="flex flex-col gap-4">
                        <div className="text-xl md:text-2xl font-semibold text-rose-500">
                          {tour.name}
                        </div>
                        <div className="flex gap-10 flex-wrap">
                          <div className="flex flex-wrap flex-col gap-5">
                            <div className=" font-serif flex md:gap-3 gap-7 ">
                              Destination:
                              <span className="text-slate-500">
                                {tour.dest}
                              </span>{" "}
                            </div>
                            <div className=" font-serif flex md:gap-3 gap-7">
                              Duration:
                              <span className="text-slate-500">
                                {tour.duration}
                              </span>
                            </div>

                            <div className="font-serif flex gap-3">
                              Capacity:
                              <span className="text-slate-500">
                                {tour.capacity}
                              </span>
                            </div>

                            <div className="flex gap-3">
                              Contact:
                              <span className="text-slate-500">
                                {tour.phone}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="font-serif flex gap-3 ">
                              Inclusion:
                              <span className="text-slate-500">
                                {tour.inclusion &&
                                  tour.inclusion.map((data) => (
                                    <div className="flex flex-wrap">{data}</div>
                                  ))}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div>
                              <span className="text-slate-500 flex flex-wrap">
                                Operational Dates:
                              </span>
                              {tour.operationDates &&
                                tour.operationDates.map((dates) => (
                                  <div className="flex flex-wrap text-xs">
                                    <span>{dates.toString()}</span>
                                  </div>
                                ))}
                            </div>
                          </div>

                          <div className="">
                            {tour.tourImages &&
                              tour.tourImages.map((image, i) => (
                                <img
                                  key={i}
                                  src={`${IMAGE_URL}/${image}`}
                                  className="rounded-md w-full h-40 "
                                />
                              ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full text-xs md:text-sm justify-center ">
                        <button
                          className="bg-red-500 w-1/3  p-2  rounded-xl text-white"
                          onClick={() => {
                            navigate(`/tourpage/tourdetails/${tour.tourId}`);
                          }}
                        >
                          More Details
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center">
            <img
              width="100"
              height="100"
              src="https://img.icons8.com/glyph-neue/100/sad.png"
              alt="sad"
            />
            <p>Sorry we dont have that</p>
          </div>
        )}
      </div>
    </>
  );
};
