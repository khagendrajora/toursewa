/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { URL } from "../../../../config/Config";

export const UpdateHotDeals = () => {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  const [startingPrice, setStartingPrice] = useState("");
  const [sourceAddress, setSourceAddress] = useState("");
  const [destAddress, setDestAddress] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [travel, setTravel] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`${URL}/api/getdealsbyid/${id}`);
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          setStartingPrice(data.startingPrice);
          setSourceAddress(data.sourceAddress);
          setDestAddress(data.destAddress);
          setVehicle(data.vehicle);
          setTravel(data.travelName);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchCategory();
  }, []);

  const updateHotDeals = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = {
        sourceAddress,
        destAddress,
        startingPrice,
        vehicle,
        travelName: travel,
      };
      const res = await fetch(
        `https://tourbackend-rdtk.onrender.com/api/updateaboutus/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const responseData = await res.json();
      if (!res.ok) {
        toast.error(responseData.error);
      } else {
        toast.success(responseData.message);
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="flex bg-zinc-100 p-1">
        <div className="md:p-5 w-full">
          <div className="flex flex-col z-0  rounded-3xl">
            <div className="font-sans text-black   text-start  ">
              <h1 className="font-bold text-center md:text-xl lg:text-2xl">
                Update Hot Deals Data
              </h1>
            </div>

            <form
              onSubmit={updateHotDeals}
              className="flex  flex-wrap justify-evenly  mt-4 md:mt-14 lg:text-lg  text-sm gap-y-5 gap-x-12 "
            >
              <div className="flex flex-col w-full sm:w-1/3   gap-y-3 md:gap-y-5">
                <label>Source Address</label>
                <input
                  type="text"
                  placeholder="abcdxyz"
                  className="border rounded-md p-2 w-full text-sm md:text-2xl"
                  required
                  value={sourceAddress}
                  name="sourceAddress"
                  onChange={(e) => setSourceAddress(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-full sm:w-1/3   gap-y-3 md:gap-y-5">
                <label>Destination Address</label>
                <input
                  type="text"
                  placeholder="abc"
                  className="border rounded-md p-2 w-full text-sm md:text-2xl"
                  value={destAddress}
                  name="destAddress"
                  onChange={(e) => setDestAddress(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-full sm:w-1/3   gap-y-3 md:gap-y-5">
                <label>Starting Price</label>
                <input
                  type="text"
                  placeholder="abcdxyz"
                  className="border rounded-md p-2 w-full text-sm md:text-2xl"
                  required
                  value={startingPrice}
                  name="startingPrice"
                  onChange={(e) => setStartingPrice(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-full sm:w-1/3   gap-y-3 md:gap-y-5">
                <label>Travel Name</label>
                <input
                  type="text"
                  placeholder="abc"
                  className="border rounded-md p-2 w-full text-sm md:text-2xl"
                  value={travel}
                  name="travel"
                  onChange={(e) => setTravel(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-full sm:w-1/3   gap-y-3 md:gap-y-5">
                <label>Vehicle</label>
                <input
                  type="text"
                  placeholder="abc"
                  className="border rounded-md p-2 w-full text-sm md:text-2xl"
                  value={vehicle}
                  name="vehicle"
                  onChange={(e) => setVehicle(e.target.value)}
                />
              </div>

              <div className="flex justify-center w-full m-3 ">
                <button className=" rounded-lg p-2 w-1/2 hover:bg-blue-700 text-sm text-white bg-blue-600 md:text-xl">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
