/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

export const AddHotDeals = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState<{
    startingPrice: string;
    sourceAddress: string;
    destAddress: string;
    vehicle: string;
    travelName: string;
  }>({
    startingPrice: "",
    sourceAddress: "",
    destAddress: "",
    vehicle: "",
    travelName: "",
  });

  const addHotDeals = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://tourbackend-rdtk.onrender.com/api/addaboutus",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inputs),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
      } else {
        toast.success(data.message);

        setInputs({
          startingPrice: "",
          sourceAddress: "",
          destAddress: "",
          vehicle: "",
          travelName: "",
        });
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
      <div className="flex bg-zinc-100 p-1 ">
        <div className="md:p-5 w-full">
          <div className="flex flex-col  rounded-3xl">
            <div className="font-sans text-black   text-start  ">
              <h1 className="font-bold text-center md:text-xl lg:text-2xl">
                Add Hot Deals
              </h1>
            </div>

            <form
              onSubmit={addHotDeals}
              className="flex  flex-wrap justify-center  mt-4 md:mt-14 lg:text-lg  text-sm gap-y-5 gap-x-12 "
            >
              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1">
                <label>Source Address</label>
                <input
                  type="text"
                  placeholder="abc"
                  className="border rounded-md p-2  text-sm md:text-2xl"
                  value={inputs.sourceAddress}
                  required
                  onChange={(e) =>
                    setInputs({ ...inputs, sourceAddress: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col  sm:w-1/3  w-11/12 space-y-1">
                <label>Destination Address</label>
                <input
                  type="text"
                  placeholder="abcdxyz"
                  className="border rounded-md p-2 text-sm md:text-2xl"
                  required
                  value={inputs.destAddress}
                  onChange={(e) =>
                    setInputs({ ...inputs, destAddress: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1">
                <label>Starting Price</label>
                <input
                  type="text"
                  placeholder="abc"
                  className="border rounded-md p-2  text-sm md:text-2xl"
                  value={inputs.startingPrice}
                  required
                  onChange={(e) =>
                    setInputs({ ...inputs, startingPrice: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col  sm:w-1/3  w-11/12 space-y-1">
                <label>Vehicle</label>

                <input
                  type="text"
                  placeholder="abcdxyz"
                  className="border rounded-md p-2 text-sm md:text-2xl"
                  required
                  value={inputs.vehicle}
                  onChange={(e) =>
                    setInputs({ ...inputs, vehicle: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col  sm:w-1/3  w-11/12 space-y-1">
                <label>Travel Name</label>
                <input
                  type="text"
                  placeholder="abcdxyz"
                  className="border rounded-md p-2 text-sm md:text-2xl"
                  required
                  value={inputs.travelName}
                  onChange={(e) =>
                    setInputs({ ...inputs, travelName: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-center w-full">
                <button className=" rounded-lg p-3 w-1/3 text-sm text-white bg-blue-800 md:text-xl">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
