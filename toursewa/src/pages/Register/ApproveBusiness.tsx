/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { URL } from "../../config/Config";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

export const ApproveBusiness = () => {
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    const businessApprove = async () => {
      try {
        const res = await fetch(`${URL}/api/businessapprove/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          toast.success(data.message);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    businessApprove();
  });
  return (
    <>
      <ToastContainer theme="colored" position="top-center" />
    </>
  );
};
