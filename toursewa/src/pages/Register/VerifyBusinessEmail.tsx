/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { URL } from "../../config/Config";

export const VerifyBusinessEmail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.token;

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await fetch(`${URL}/api/verifybusinessemail/${id}`, {
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
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    verifyEmail();
  });

  return (
    <>
      <ToastContainer theme="colored" position="top-center" />
    </>
  );
};
