/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IHero } from "../../../.../../SharedTypes/Pages/LandingPage/Hero";
import { URL } from "../../../config/Config";
import { useNavigate } from "react-router-dom";
import { ITour } from "../../../.../../SharedTypes/Product/tour";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IVeh } from "../../../.../../SharedTypes/Product/vehicle";
import { ILocation } from "../../../.../../SharedTypes/Locations/location";
import { useAuthContext } from "../../../context/AuthContext";
import { IRDates } from "../../../.../../SharedTypes/Reservations/ReservedDated";

const Hero = () => {
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  const [revDates, setRevDates] = useState<IRDates[]>([]);
  const [activeButton, setActiveButton] = useState("vehicle");
  const [filterSearch, SetFilterSearch] = useState<
    { name: string; id: string; duration: string; capacity: string }[]
  >([]);
  const [vehicle, setVehicle] = useState<IVeh[]>([]);
  const [hero, setHero] = useState<IHero[]>([]);
  const [tour, setTour] = useState<ITour[]>([]);
  const [search, setSearch] = useState<IVeh[] | []>([]);
  const [location, setLocation] = useState<ILocation[]>([]);
  const [tSearch, setTSearch] = useState<ITour[]>([]);

  const hotDeals = () => {
    const hotDeals = document.getElementById("hotdeals");
    if (hotDeals) {
      window.scrollTo({
        top: hotDeals.offsetTop,
        behavior: "smooth",
      });
    }
  };

  //  const [hero, setHero] = useState<IHero[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rep = await fetch(
          `https://tourbackend-rdtk.onrender.com/api/getalldates`
        );
        const datas = await rep.json();
        if (!rep.ok) {
          toast.error(datas.error);
        } else {
          setRevDates(datas);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchData();
  }, []);

  const [tourSearch, setTourSearch] = useState<{
    destination: string;
    duration: string;
    people: string;
  }>({
    destination: "",
    duration: "",
    people: "",
  });

  const [vehicleSearch, setVehicleSearch] = useState<{
    pickUp: string;
    dropOff: string;
    vehicleType: string;
    baseLocation: string;
    dropLocation: string;
  }>({
    pickUp: "",
    dropOff: "",
    vehicleType: "",
    baseLocation: "",
    dropLocation: "",
  });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch(`${URL}/api/getlocation`);
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          setLocation(data);
        }
      } catch (error: any) {
        console.error(error);
      }
    };
    fetchLocation();
  }, []);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await fetch(`${URL}/api/gettour`);
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          setTour(data);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchTour();
  }, []);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`${URL}/api/getveh`);
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          setVehicle(data);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchVehicle();
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`${URL}/api/gethero`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.error);
        } else {
          setHero(data);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchCategory();
  }, []);

  const searchTour = () => {
    const { destination, duration, people } = tourSearch;
    const isEmpty = !destination && !duration && !people;
    if (isEmpty) {
      return;
    }
    const filtered = tour.filter((t) => {
      const matchesDestination = destination
        ? t.dest.toLowerCase().includes(tourSearch.destination.toLowerCase())
        : true;

      const matchesDuration = duration
        ? parseInt(t.duration) === parseInt(tourSearch.duration)
        : true;

      const matchesPeople = people
        ? parseInt(t.capacity) === parseInt(people)
        : true;

      return matchesDestination && matchesDuration && matchesPeople;
    });

    if (filtered.length === 0) {
      SetFilterSearch([]);
    } else {
      SetFilterSearch(
        filtered.map((t) => ({
          name: t.name,
          id: t.tourId,
          duration: t.duration,
          capacity: t.capacity,
        }))
      );
    }
  };

  const remove = (id: string) => {
    SetFilterSearch((prev) => prev.filter((f) => f.id != id));
  };

  const searchVehicle = () => {
    const { pickUp, dropOff, vehicleType, baseLocation } = vehicleSearch;
    const isEmpty = !pickUp && !dropOff && !vehicleType && !baseLocation;
    if (isEmpty) {
      return;
    }
    if (pickUp > dropOff) {
      return;
    }
    const pickupDate = new Date(pickUp);
    const dropoff = new Date(dropOff);

    const filtered = vehicle.filter((v) => {
      const matchesvehicleType = v.vehSubCategory
        .toLowerCase()
        .includes(vehicleType.toLowerCase());

      const matchBaseLocation = v.baseLocation
        .toLowerCase()
        .includes(baseLocation.toLowerCase());

      const dates = !v.operationDates?.some((date) => {
        const operationalDate = new Date(date);
        return operationalDate >= pickupDate && operationalDate <= dropoff;
      });
      return matchesvehicleType && dates && matchBaseLocation;
    });

    const revDatesFilter = filtered.filter((v) => {
      const matchingRevDates = revDates.filter((f) => f.vehicleId === v.vehId);

      return !matchingRevDates.some((f) =>
        f.bookingDate?.some((date) => {
          const bookingDate = new Date(date);
          return bookingDate >= pickupDate && bookingDate <= dropoff;
        })
      );
    });

    if (revDatesFilter.length > 0) {
      SetFilterSearch(
        revDatesFilter.map((v) => ({
          name: v.name,
          id: v.vehId,
          duration: pickUp,
          capacity: dropOff,
        }))
      );
    } else {
      SetFilterSearch([]);
      return;
    }
  };

  useEffect(() => {
    if (vehicleSearch.vehicleType) {
      const searchveh = vehicle.filter((v) =>
        v.vehSubCategory
          .toLowerCase()
          .includes(vehicleSearch.vehicleType.toLowerCase())
      );
      setSearch(searchveh);
    } else {
      setSearch([]);
    }
  }, [vehicle, vehicleSearch.vehicleType]);

  useEffect(() => {
    if (tourSearch.destination) {
      const searchtour = tour.filter((v) =>
        v.dest.toLowerCase().includes(tourSearch.destination.toLowerCase())
      );
      setTSearch(searchtour);
    } else {
      setTSearch([]);
    }
  }, [tour, tourSearch.destination]);

  return (
    <>
      <div className="flex flex-col justify-center w-full">
        {hero.length > 0
          ? hero.map((h, i) => (
              <div
                key={i}
                className="flex flex-wrap items-center gap-y-4 justify-center"
              >
                <div className="flex flex-col gap-4  justify-center items-center sm:w-1/2">
                  <h1 className="font-semibold text-[17px] md:text-[22px] lg:text-[28px]  text-[#07213C]">
                    {h.heading}
                  </h1>
                  <p className="text-center text-button mx-auto  px-3 font-medium text-[10px] md:text-[14px] lg:text-[16px]">
                    {h.description}
                  </p>
                  <button
                    className="rounded-2xl w-[200px] p-1 text-sm md:text-lg bg-[#06243C] text-white hover:text-button "
                    onClick={hotDeals}
                  >
                    Find Best Deal Now
                  </button>
                </div>
                <div className="sm:w-1/2">
                  {hero.length > 0 && <img src="hero.jpeg" className="" />}
                </div>
              </div>
            ))
          : ""}
        <div className=" w-full pt-3 flex-wrap md:bottom-40 bottom-4 items-center bg-[#00000029]  text-xs flex flex-col ">
          <div className="flex justify-centern text-white gap-5 ">
            <button
              className={` ${
                activeButton === "vehicle"
                  ? "bg-button hover:bg-[#06243C]"
                  : "bg-[#06243C] hover:bg-button hover:text-white"
              }  w-[90px] h-[30px] hover:bg-[#06243C]   rounded-xl`}
              onClick={() => setActiveButton("vehicle")}
            >
              Vehicle
            </button>
            <button
              className={`${
                activeButton === "tour"
                  ? "bg-button hover:bg-[#06243C]"
                  : "bg-[#06243C] hover:bg-button hover:text-white"
              } w-[90px] h-[30px] hover:bg-[#06243C]  rounded-xl`}
              onClick={() => setActiveButton("tour")}
            >
              Tour
            </button>
          </div>
          {activeButton === "vehicle" ? (
            <>
              <div className="flex flex-wrap items-center justify-center   sm:justify-between w-full md:w-11/12 p-2 text-xs gap-3 ">
                <div className="flex flex-col min-w-[100px] gap-1 max-w-[120px]">
                  <label className="">Pick Up From:</label>
                  <select
                    value={vehicleSearch.baseLocation}
                    className=" bg-white border border-black px-1 rounded-md md:p-1 cursor-pointer"
                    onChange={(e) =>
                      setVehicleSearch({
                        ...vehicleSearch,
                        baseLocation: e.target.value,
                      })
                    }
                  >
                    {" "}
                    <option value="" disabled className="">
                      Pick Up From
                    </option>
                    {location &&
                      location.map((data, i) => (
                        <option
                          className="text-black"
                          value={data.fullLocation}
                          key={i}
                        >
                          {data.fullLocation}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex flex-col min-w-[100px] gap-1 max-w-[120px]">
                  <label className="">Pick Up Time:</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    placeholder=""
                    className=" bg-white border border-black px-1 rounded-md md:p-1 cursor-pointer placeholder-transparent"
                    value={vehicleSearch.pickUp}
                    onChange={(e) =>
                      setVehicleSearch({
                        ...vehicleSearch,
                        pickUp: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col min-w-[100px] gap-1 max-w-[120px]">
                  <label className="">Drop Off Time:</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className=" bg-white border border-black px-1 rounded-md md:p-1 cursor-pointer"
                    value={vehicleSearch.dropOff}
                    onChange={(e) =>
                      setVehicleSearch({
                        ...vehicleSearch,
                        dropOff: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col min-w-[100px] gap-1 max-w-[120px]">
                  <label className="">Drop Off Location:</label>
                  <select
                    value={vehicleSearch.dropLocation}
                    className=" bg-white border border-black px-1 rounded-md md:p-1 cursor-pointer"
                    onChange={(e) =>
                      setVehicleSearch({
                        ...vehicleSearch,
                        dropLocation: e.target.value,
                      })
                    }
                  >
                    {" "}
                    <option value="" disabled className="">
                      Drop Location
                    </option>
                    {location &&
                      location.map((data, i) => (
                        <option
                          className="text-black"
                          value={data.fullLocation}
                          key={i}
                        >
                          {data.fullLocation}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex flex-col min-w-[100px] relative gap-1 max-w-[120px]">
                  <label className="">Vehicle Type:</label>

                  <input
                    type="text"
                    placeholder="Vehicle"
                    className=" bg-white border  border-black px-1 rounded-md md:p-1 "
                    value={vehicleSearch.vehicleType}
                    onChange={(e) =>
                      setVehicleSearch({
                        ...vehicleSearch,
                        vehicleType: e.target.value,
                      })
                    }
                  />
                  <div className=" absolute bottom-5 md:bottom-7 bg-white  rounded-md min-w-[120px]  max-w-[120px]  text-black">
                    {search.length > 0 &&
                      search.map((s, index) => (
                        <ol key={index} className="list-none ">
                          <li
                            className="text-lg px-2 hover:bg-gray-300 cursor-pointer"
                            onClick={() => {
                              setVehicleSearch((prev) => ({
                                ...prev,
                                vehicleType: s.vehSubCategory,
                              })),
                                setSearch([]);
                            }}
                          >
                            {s.vehSubCategory}
                          </li>
                        </ol>
                      ))}
                  </div>
                </div>

                <div
                  className="bg-button hover:bg-[#06243C]  p-1 min-w-[120px]  max-w-[120px] mt-3  cursor-pointer text-center text-white rounded-xl"
                  onClick={() => {
                    SetFilterSearch([]);
                    searchVehicle();
                  }}
                >
                  <button className="">Search</button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-wrap items-center justify-evenly  sm:justify-between w-full md:w-11/12 p-2 text-xs gap-3 ">
              <div className="flex flex-col min-w-[100px] relative gap-1 max-w-[120px]">
                <label className="">Destination:</label>
                <input
                  type="text"
                  placeholder="Destination"
                  className=" bg-white border  border-black px-1 rounded-md md:p-1"
                  value={tourSearch.destination}
                  onChange={(e) =>
                    setTourSearch({
                      ...tourSearch,
                      destination: e.target.value,
                    })
                  }
                />
                <div className="absolute bottom-5 md:bottom-7 bg-white rounded-md min-w-[120px]  max-w-[120px] text-black">
                  {tSearch.length > 0 &&
                    tSearch.map((s, index) => (
                      <ol key={index} className="list-none ">
                        <li
                          className="text-lg px-2 hover:bg-gray-300 cursor-pointer"
                          onClick={() => {
                            setTourSearch((prev) => ({
                              ...prev,
                              destination: s.dest,
                            })),
                              setTSearch([]);
                          }}
                        >
                          {s.dest}
                        </li>
                      </ol>
                    ))}
                </div>
              </div>
              <div className="flex flex-col  min-w-[100px] gap-1 max-w-[120px]">
                <label className="">Duration (Days):</label>
                <input
                  type="number"
                  placeholder="Duration"
                  className=" bg-white border border-black px-1 rounded-md md:p-1"
                  value={tourSearch.duration}
                  onChange={(e) =>
                    setTourSearch({ ...tourSearch, duration: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col min-w-[100px] gap-1 max-w-[120px]">
                <label className="">No. of people:</label>
                <input
                  type="text"
                  placeholder="No. of People"
                  className=" bg-white border border-black px-1 rounded-md md:p-1"
                  value={tourSearch.people}
                  onChange={(e) =>
                    setTourSearch({ ...tourSearch, people: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col min-w-[100px] gap-1 max-w-[120px]">
                <label className="">Pick Up From:</label>
                <input
                  type="text"
                  placeholder="From"
                  className=" bg-white border border-black px-1 rounded-md md:p-1"
                />
              </div>
              <div
                className="bg-button p-1 min-w-[120px] hover:bg-[#06243C]  max-w-[120px] mt-3 text-center text-white rounded-xl"
                onClick={() => {
                  SetFilterSearch([]);
                  searchTour();
                }}
              >
                <button>Search</button>
              </div>
            </div>
          )}

          {filterSearch &&
            filterSearch.map((title, index) => (
              <>
                <div key={index} className="flex bg-white w-11/12  p-2">
                  <span className="w-full"> {title.name}</span>
                  <span className="w-full"> {title.duration}</span>
                  <span className="w-full"> {title.capacity}</span>

                  <div className="flex justify-end gap-5 w-full">
                    <button
                      className="p-1 bg-button hover:bg-[#06243C] text-xs text-white rounded-md"
                      onClick={() => {
                        const endPoint =
                          activeButton === "vehicle"
                            ? "reservationform"
                            : "tourpage/tourdetails";
                        if (authUser) {
                          navigate(`/${endPoint}/${title.id}`, {
                            state: {
                              startDate: vehicleSearch.pickUp,
                              ednDate: vehicleSearch.dropOff,
                              baseLocation: vehicleSearch.baseLocation,
                              dropLocation: vehicleSearch.dropLocation,
                              name: title.name,
                              capacity: title.capacity,
                            },
                          });
                        } else {
                          navigate("/login");
                        }
                      }}
                    >
                      Book
                    </button>
                    <button
                      className="p-1 bg-button hover:bg-[#06243C] text-xs text-white rounded-md"
                      onClick={() => {
                        const endPoint =
                          activeButton === "vehicle"
                            ? "vehiclelist/vehicledetails"
                            : "tourpage/tourdetails";

                        navigate(`/${endPoint}/${title.id}`);
                      }}
                    >
                      View
                    </button>
                  </div>
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="text-red-500 ms-4 hover:text-[#06243C] cursor-pointer"
                    onClick={() => remove(title.id)}
                  />
                </div>
              </>
            ))}
        </div>
      </div>
    </>
  );
};

export default Hero;
