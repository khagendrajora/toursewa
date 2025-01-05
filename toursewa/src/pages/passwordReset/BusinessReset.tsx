/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { URL } from "../../config/Config";

export const BusinessReset = () => {
  const [businessPwd, setbusinessPwd] = useState("");
  const params = useParams();
  const token = params.token;
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${URL}/api/resetbusinesspwd/${token}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ businessPwd }),
      });
      console.log(res);
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="flex mt-5 gap-5  md:gap-10 xl:gap-32">
        <div className="w-2/3  hidden md:block z-10  relative ">
          {/* <img src="/public/loginPic.jpg" className="max-h-screen w-full" /> */}
          <div
            className="absolute inset-0 bg-contain bg-center"
            style={{
              backgroundImage: `url('/loginPic.jpg')`,
              opacity: "70%",
              backgroundColor: "rgba(244, 134, 111 )",
              backgroundBlendMode: "overlay",
              backgroundSize: "cover",
            }}
          ></div>
          <img src="/logo.png" className="absolute top-3 left-5 w-1/3" />
          <p className="absolute w-11/12 bottom-[80px] text-center left-1/2 transform -translate-x-1/2 text-xl  font-normal text-white">
            Welcome back!
            <br />
            We are glad to see you!
          </p>
        </div>

        <div className="flex flex-col w-full gap-10 md:gap-7 mt-10 lg:gap-12 ">
          <div className="flex  items-center gap-3 flex-col">
            <h1 className="font-bold text-2xl">Enter New Password</h1>
            <p className="">Create new password of your account</p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col items-center lg:gap-y-4 gap-5"
          >
            <div className="w-3/4 max-w-96 space-y-2">
              <label>New Password</label>
              <input
                type="password"
                placeholder="*******"
                name="businessPwd"
                className="border border-slate-700 rounded-lg p-2 lg:p-3 w-full "
                required
                value={businessPwd}
                onChange={(e) => setbusinessPwd(e.target.value)}
              />
            </div>

            <div className="w-3/4 mt-10 md:mt-5 flex flex-col max-w-96 gap-4">
              <button className="bg-button  hover:bg-[#06243C]  text-white p-2 rounded-lg w-full">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
