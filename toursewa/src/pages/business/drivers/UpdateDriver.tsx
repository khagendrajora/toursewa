import { useState } from "react";
import * as React from "react";
import { toast, ToastContainer } from "react-toastify";
import { ButtonLoader } from "../../../utils/ButtonLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { IMG_URL } from "../../../../../backend/src/config/Config";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { IVeh } from "../../../../../backend/src/models/Product/vehicle";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const UpdateDriver = () => {
  const params = useParams();
  const id = params.id;
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  const [isButton, setIsButton] = useState(false);
  const [driverId, setDriverId] = useState("");
  const [vehicle, setVehicle] = useState<IVeh[] | []>([]);
  const [vehicleId, setVehicleId] = useState("");
  const [driverName, setDriverName] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [driverAge, setDriverAge] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [driverEmail, setDriverEmail] = useState("");
  const [driverImage, setDriverImage] = React.useState<File | string>("");

  React.useEffect(() => {
    const fetchDriver = async () => {
      try {
        const res = await fetch(
          `https://tourbackend-rdtk.onrender.com/api/getdrivers/${id}`
        );
        const data = await res.json();
        if (!res.ok) {
          console.log(data.error);
        } else {
          setVehicleId(data.vehicleName);
          setDriverName(data.driverName);
          setDriverAge(data.driverAge);
          setDriverPhone(data.driverPhone);
          setDriverEmail(data.driverEmail);
          setDriverImage(data.driverImage);
          setVehicleName(data.vehicleName);
          setDriverId(data._id);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchDriver();
  }, [id]);

  React.useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(
          `https://tourbackend-rdtk.onrender.com/api/getvehicle/${authUser?.bId}`
        );
        const data = await res.json();
        if (!res.ok) {
          console.log(data.error);
        } else {
          setVehicle(data);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchVehicle();
  }, []);

  const update = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsButton(true);
    try {
      const formData = new FormData();
      formData.append("vehicleId", vehicleId);
      formData.append("driverName", driverName);
      formData.append("driverAge", driverAge.toString());
      formData.append("driverEmail", driverEmail || "");
      formData.append("driverPhone", driverPhone);
      if (driverImage) {
        formData.append("driverImage", driverImage);
      }
      const res = await fetch(
        `https://tourbackend-rdtk.onrender.com/api/updatedriver/${driverId}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsButton(false);
    }
  };

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="flex">
        <div className="w-full">
          <div className="flex flex-col">
            <div className="flex justify-between">
              <div className="text-black flex flex-col gap-1 ">
                <h1 className="font-bold text-center md:text-xl lg:text-2xl">
                  Update Driver Data
                </h1>{" "}
                <p>Update Data</p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="rounded-lg p-3 text-sm text-white bg-button hover:bg-orange-700 md:text-xl"
              >
                Back to List
              </button>
            </div>
            <form
              onSubmit={update}
              className="flex flex-wrap justify-center  mt-10 md:mt-14 text-sm gap-y-5 gap-x-12"
            >
              <div className="space-y-1 flex flex-wrap justify-center gap-y-5 gap-x-12 text-sm w-full">
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Vehicle Name</label>
                  <select
                    className="border border-gray-600 rounded-md ps-1 text-xs lg:text-lg cursor-pointer min-h-8 lg:min-h-10 shadow appearance-none"
                    value={vehicleName}
                    onChange={(e) => setVehicleId(e.target.value)}
                  >
                    <option value="" disabled>
                      Choose Vehicle
                    </option>
                    {vehicle &&
                      vehicle.map((veh) => (
                        <option value={veh.vehId}>{veh.name}</option>
                      ))}
                  </select>
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Driver`s Name</label>
                  <input
                    type="text"
                    placeholder="Driver Name"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Email</label>
                  <input
                    type="text"
                    placeholder="example@gmail.com"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={driverEmail}
                    onChange={(e) => setDriverEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Age</label>
                  <input
                    type="number"
                    placeholder="Age"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    value={driverAge}
                    onChange={(e) => setDriverAge(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Phone</label>
                  <input
                    type="number"
                    placeholder="Phone"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    value={driverPhone}
                    required
                    onChange={(e) => setDriverPhone(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Image</label>
                  <input
                    type="file"
                    name="profileIcon"
                    className="cursor-pointer"
                    onChange={(e) => setDriverImage(e.target.value)}
                  />

                  {driverImage && (
                    <div className="flex justify-start">
                      <FontAwesomeIcon
                        icon={faXmark}
                        className="cursor-pointer"
                      />
                      {typeof driverImage === "string" ? (
                        <img
                          src={`${IMG_URL}/${driverImage}`}
                          className="w-10"
                        />
                      ) : (
                        <img
                          src={URL.createObjectURL(driverImage)}
                          alt="profileIcon"
                          className="w-20"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center  w-full">
                <button className=" rounded-lg p-3 w-3/4 md:w-1/3 text-sm text-white bg-button hover:bg-orange-700 md:text-xl">
                  Update Info {isButton ? <ButtonLoader /> : ""}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
