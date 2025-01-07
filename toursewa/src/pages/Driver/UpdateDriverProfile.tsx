/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IDriver } from "../../SharedTypes/Drivers/Driver";
import { toast, ToastContainer } from "react-toastify";
import { URL } from "../../config/Config";
import { PageLoader } from "../../utils/PageLoader";

export const UpdateDriverProfile = () => {
  const params = useParams();
  const id = params.id;
  const [driverData, SetDriverData] = useState<IDriver | null>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${URL}/api/getdrivers/${id}`);
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          SetDriverData(data);
        }
      } catch (error: any) {
        toast.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  });

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      {isLoading ? <PageLoader /> : <h1>{driverData?.driverName}</h1>}
    </>
  );
};
