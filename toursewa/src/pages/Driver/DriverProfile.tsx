/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { IDriver } from "../../SharedTypes/Drivers/Driver";
import { useAuthContext } from "../../context/AuthContext";
import { IMAGE_URL, URL } from "../../config/Config";
import { toast, ToastContainer } from "react-toastify";

import { PageLoader } from "../../utils/PageLoader";
import { Link } from "react-router-dom";

export const DriverProfile = () => {
  const [driverData, setDriverData] = useState<IDriver>();
  const { authUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const driverId = authUser?.driver_id;

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const res = await fetch(`${URL}/api/getdrivers/${authUser?.driver_id}`);
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          setDriverData(data);
        }
      } catch (error: any) {
        toast.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDriverData();
  }, []);

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="w-full bg-gray-100 h-full">
          <h1 className="p-5">Profile Information</h1>

          <div className="w-11/12 flex mb-4 justify-end">
            <Link
              to={`/updatedriverprofile/${driverId}`}
              className="bg-blue-500 p-2 text-white rounded-md"
            >
              Edit Profile
            </Link>
          </div>

          <div className="flex justify-center mb-10">
            <div className="w-11/12 flex flex-col gap-y-10">
              <div className="bg-white shadow rounded-lg p-4 flex items-center">
                <div>
                  <img
                    src={`${IMAGE_URL}/${driverData?.driverImage}`}
                    alt="Driver"
                    style={{
                      borderRadius: "50%",
                      width: "120px",
                      height: "120px",
                      marginRight: "40px",
                    }}
                  />
                </div>
                <div className="flex text-xs flex-col text-gray-600 gap-2">
                  <h1 className="text-xl">{driverData?.driverName}</h1>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-4 items-center">
                <h1 className="font-bold">Personal Information</h1>

                <table className="mt-5 font-light text-left w-full md:w-1/3">
                  <tbody>
                    <tr className="h-10">
                      <th className="font-semibold">Driver Id:</th>
                      <td>{driverData?.driverId}</td>
                    </tr>
                    <tr className="h-10">
                      <th className="font-semibold">Vehicle Id:</th>
                      <td>{driverData?.vehicleId}</td>
                    </tr>
                    <tr className="h-10">
                      <th className="font-semibold">Business Id:</th>
                      <td>{driverData?.businessId}</td>
                    </tr>
                    <tr className="h-10">
                      <th className="font-semibold">Contact Name:</th>
                      <td>{driverData?.driverName}</td>
                    </tr>
                    <tr className="h-10">
                      <th className="font-semibold">Phone Number:</th>
                      <td>{driverData?.driverPhone}</td>
                    </tr>
                    <tr className="h-10">
                      <th className="font-semibold">Email:</th>
                      <td>{driverData?.driverEmail}</td>
                    </tr>
                    <tr className="h-10">
                      <th className="font-semibold">Age:</th>
                      <td>{driverData?.driverAge}</td>
                    </tr>
                    <tr className="h-10">
                      <th className="font-semibold">Status:</th>
                      <td>{driverData?.status}</td>
                    </tr>
                    <tr className="h-10">
                      <th className="font-semibold">Verified:</th>
                      <td>{driverData?.isVerified}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
