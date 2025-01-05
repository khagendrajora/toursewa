/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { IVeh } from "../../../../backend/src/models/Product/vehicle";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IMAGE_URL, URL } from "../../config/Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "../../context/AuthContext";

export const VehiclePage = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [veh, setVeh] = useState<IVeh[]>([]);
  const [categoryFilter, setCategoryFIlter] = useState<string>("");
  const [capacityFilter, setCapacityFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<IVeh[]>([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`${URL}/api/getveh`);
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          setVeh(data);
        }
      } catch (error: any) {
        toast.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategory();
  }, []);

  const activeVeh = veh.filter((v) => v.isActive);

  useEffect(() => {
    applyFilter();
  }, [categoryFilter, capacityFilter, activeVeh]);

  const applyFilter = () => {
    let filteredVeh = activeVeh;
    if (categoryFilter) {
      filteredVeh = filteredVeh.filter((v) =>
        v.vehCategory
          .toLocaleLowerCase()
          .includes(categoryFilter.toLocaleLowerCase())
      );
    }

    if (capacityFilter) {
      if (capacityFilter.includes("-")) {
        const [min, max] = capacityFilter.split("-").map(Number);
        filteredVeh = filteredVeh.filter(
          (v) => parseInt(v.capacity) >= min && parseInt(v.capacity) <= max
        );
      } else {
        filteredVeh = filteredVeh.filter(
          (v) => parseInt(v.capacity) === parseInt(capacityFilter)
        );
      }
    }

    if (search) {
      filteredVeh = filteredVeh.filter((v) =>
        v.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      );
    }
    setFilter(filteredVeh);
  };

  const handleCat = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryFIlter(e.target.value);
  };
  const handleCap = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCapacityFilter(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyFilter();
  };

  const available = async (id: any) => {
    navigate(`/vehiclelist/vehicledetails/${id}`);
  };
  const bookingForm = async (id: string, name: string, capacity: string) => {
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
      <h1 className="font-bold text-3xl  p-5 text-center">Vehicles</h1>
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
      ) : (
        <div className="flex flex-wrap">
          <div className="flex  flex-wrap rounded-md flex-col gap-y-2 sm:gap-y-5   bg-gray-100  p-4 text-xs md:text-xl md:w-1/5 xl:w-1/6 font-semibold">
            <form
              onSubmit={handleSubmit}
              className="flex  items-center justify-center  text-xs gap-y-2 w-auto flex-wrap "
            >
              <div className="flex flex-wrap gap-y-1 items-center gap-x-1 ">
                <div className="">
                  <input
                    type="text"
                    placeholder="search"
                    className="w-full p-2 border-2"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button className="bg-button px-3 h-7 text-xs hover:bg-red-800  text-white rounded-md">
                  Search
                </button>
              </div>
            </form>

            <div className="flex flex-col gap-y-3">
              <h1 className="text-xl">Type</h1>
              <div className="flex md:flex-col gap-y-7 text-sm gap-x-11">
                <div className="flex gap-x-3">
                  <input
                    type="radio"
                    name="type"
                    value="2 wheeler"
                    id="2-wheeler"
                    className="w-5"
                    onChange={handleCat}
                    checked={categoryFilter === "2 wheeler"}
                  />
                  <label htmlFor="2-wheeler">2-wheeler </label>
                </div>
                <div className="flex gap-x-3">
                  <input
                    type="radio"
                    name="type"
                    id="4-wheeler"
                    value="4 wheeler"
                    className="w-5"
                    onChange={handleCat}
                    checked={categoryFilter === "4 wheeler"}
                  />
                  <label htmlFor="4-wheeler"> 4-wheeler</label>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-3">
              <h1 className="text-xl">Capacity</h1>
              <div className="flex md:flex-col flex-wrap gap-y-3 text-sm gap-x-11">
                <div className="flex gap-x-3">
                  <input
                    type="radio"
                    name="capacity"
                    id="2 seater"
                    value="2"
                    className="w-5"
                    onChange={handleCap}
                    checked={capacityFilter === "2"}
                  />
                  <label htmlFor="2 seater"> 2-seater </label>
                </div>
                <div className="flex gap-x-3">
                  <input
                    type="radio"
                    name="capacity"
                    id="3 seater"
                    value="4"
                    className="w-5"
                    onChange={handleCap}
                    checked={capacityFilter === "4"}
                  />
                  <label htmlFor="3 seater"> 4-seater</label>
                </div>
                <div className="flex gap-x-3">
                  <input
                    type="radio"
                    name="capacity"
                    id="5-8 seater"
                    value="5-8"
                    className="w-5"
                    onChange={handleCap}
                    checked={capacityFilter === "5-8"}
                  />
                  <label htmlFor="5-8 seater">5-8 seater</label>
                </div>
                <div className="flex gap-x-3">
                  <input
                    type="radio"
                    name="capacity"
                    id="9-15 seater"
                    value="9-15"
                    className="w-5"
                    onChange={handleCap}
                    checked={capacityFilter === "9-15"}
                  />
                  <label htmlFor="9-15 seater">9-15 seater</label>
                </div>

                <div className="flex gap-x-3">
                  <input
                    type="radio"
                    name="capacity"
                    id="16-20 seater"
                    value="16-20"
                    className="w-5"
                    onChange={handleCap}
                    checked={capacityFilter === "16-20"}
                  />
                  <label htmlFor="16-20 seater"> 16-20 seater</label>
                </div>

                <div className="flex gap-x-3">
                  <input
                    type="radio"
                    name="capacity"
                    id="21-30 seater"
                    value="21-30"
                    className="w-5"
                    onChange={handleCap}
                    checked={capacityFilter === "21-30"}
                  />
                  <label htmlFor="21-30 seater"> 21-30 seater</label>
                </div>
                <div className="flex gap-x-3">
                  <input
                    type="radio"
                    name="capacity"
                    id="31-40 seater"
                    value="31-40"
                    className="w-5"
                    onChange={handleCap}
                    checked={capacityFilter === "31-40"}
                  />
                  <label htmlFor="31-40 seater"> 31-40 seater</label>
                </div>
              </div>
            </div>
            <button
              className="bg-button font-sans w-fit p-1 rounded-lg text-sm"
              onClick={() => {
                setFilter(activeVeh);
                setSearch("");
                setCapacityFilter("");
                setCategoryFIlter("");
              }}
            >
              Reset Filter
            </button>
          </div>
          <div className="flex flex-wrap w-full justify-center md:w-4/5 xl:w-4/5  gap-5 ">
            {filter.length > 0 ? (
              <>
                {filter.map((veh) => (
                  <>
                    <div
                      key={veh._id}
                      className=" p-1 rounded-lg flex flex-col h-fit border gap-1 w-11/12 max-w-[400px]"
                    >
                      <div className=" ">
                        {veh.vehImages &&
                          veh.vehImages.map((image, i) => (
                            <img
                              key={i}
                              src={`${IMAGE_URL}/${image}`}
                              className="rounded-md w-full h-40 "
                            />
                          ))}
                      </div>
                      <div className="flex flex-col flex-wrap gap-y-1 p-2 text-xl ">
                        <div className=" font-serif ">{veh.name}</div>
                        <div className="text-sm flex gap-5">
                          {" "}
                          {veh.vehSubCategory}
                          <div className="cursor-pointer" title="capacity">
                            <FontAwesomeIcon
                              icon={faUserGroup}
                              style={{ color: "#000000" }}
                            />
                            &nbsp;{veh.capacity}
                          </div>
                          <div className="cursor-pointer" title="Made Year">
                            &nbsp;{veh.madeYear.toString().split("-")[0]}
                          </div>
                        </div>
                      </div>
                      <hr />
                      <div className="flex p-1 text-xs justify-around">
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
                      </div>
                    </div>
                  </>
                ))}
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
        </div>
      )}
    </>
  );
};
