/* eslint-disable @typescript-eslint/no-explicit-any */
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import {  useState } from "react";
import { URL } from "../../config/Config";


export const AddAdmin = () => {
  const [inputs, setInputs] = useState({
    adminName: "",
    adminEmail: "",
    adminPwd: "",
    cPwd: "",
  });


  const addAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${URL}/api/addadmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
      } else {
        toast.success("Admin Addeed Successfully");
        setInputs({
          adminName: "",
          adminEmail: "",
          adminPwd: "",
          cPwd: "",
        });
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <>
      <div className="flex bg-white p-1 ">
        <div className="md:p-5 w-full">
          <div className="flex flex-col  rounded-3xl">
            <div className="font-sans text-black text-start">
              <h1 className="font-bold text-center md:text-xl lg:text-2xl">
                Add New Admin User
              </h1>
            </div>
            <form
              onSubmit={addAdmin}
              className="flex  flex-wrap justify-center  mt-4 md:mt-14 lg:text-sm  text-sm gap-y-5 gap-x-12 "
            >
              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm ">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="xyz"
                  className="border-4 rounded-md p-2 w-full text-sm md:text-2xl "
                  value={inputs.adminName}
                  onChange={(e) =>
                    setInputs({ ...inputs, adminName: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm ">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="abc@gmail.com"
                  className="border-4 rounded-md p-2 w-full text-sm md:text-2xl"
                  required
                  value={inputs.adminEmail}
                  onChange={(e) =>
                    setInputs({ ...inputs, adminEmail: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm ">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="*******"
                  className="border-4 rounded-md p-2 w-full text-sm md:text-2xl"
                  value={inputs.adminPwd}
                  onChange={(e) =>
                    setInputs({ ...inputs, adminPwd: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm ">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="*******"
                  className="border-4 rounded-md p-2 w-full text-sm md:text-2xl"
                  value={inputs.cPwd}
                  onChange={(e) =>
                    setInputs({ ...inputs, cPwd: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-center w-full">
                <button className="w-1/3 rounded-lg p-3 text-sm text-white bg-blue-600 md:text-xl">
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
