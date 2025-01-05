import { Outlet } from "react-router-dom";
import { SideBar } from "../SideBar";
import { BusinessNavBar } from "../BusinessNavBar";

export const BusinessLayout = () => {
  return (
    <>
      <div className="flex h-full mxl:max-w-[1360px]">
        <SideBar />
        <div className="flex flex-col w-full ">
          <BusinessNavBar />
          <div className="h-auto text-xs p-2 sm:p-4 ">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};
