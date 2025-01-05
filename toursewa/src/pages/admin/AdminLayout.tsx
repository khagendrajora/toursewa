import { Outlet } from "react-router-dom";
import { AdminSideBar } from "./AdminSideBar";
import { AdminNavBar } from "./AdminNavBar";

export const AdminLayout = () => {
  return (
    <>
      <div className="flex bg-slate-100 h-full mxl:w-[1360px]">
        <AdminSideBar />
        <div className="flex w-full overflow-x-auto flex-col  ">
          <AdminNavBar />
          <div className=" h-auto text-xs p-3  w-full sm:p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};
