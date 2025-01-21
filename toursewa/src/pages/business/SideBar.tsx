import { CarOutlined, DashboardOutlined } from "@ant-design/icons";
import {
  faBars,
  faBus,
  faCartShopping,
  faChevronDown,
  faMountain,
  faPlane,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { useEffect, useState } from "react";

export const SideBar = () => {
  const navigate = useNavigate();
  const [side, setSide] = useState<boolean>(true);
  const [menu, setMenu] = useState<boolean>(false);
  const { setAuthUser, authUser } = useAuthContext();
  const [showRev, setShowRev] = useState(false);

  useEffect(() => {
    if (!side) {
      setShowRev(false);
    }
  }, [side]);
  const location = useLocation();
  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");
  return (
    <>
      <div className="max-w-[1360px] scrollbar-hidden w-full mx-auto relative">
        <div
          className={` fixed top-0 z-50 w-full max-w-[1360px] shadow-md border-b border-gray-200 bg-white`}
        >
          <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start rtl:justify-end">
                <FontAwesomeIcon
                  icon={faBars}
                  className="inline-flex cursor-pointer items-center p-2 text-sm text-gray-500 rounded-lg  hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                  onClick={() => {
                    setSide(!side);
                    if (!side) {
                      setShowRev(false);
                    }
                  }}
                />

                <Link to="/" className="flex ms-5 md:me-24">
                  <span className="text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                    Toursewa
                  </span>
                </Link>
              </div>
              <div className="flex items-center">
                <div className="flex items-center ms-3 ">
                  <div>
                    <button className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600">
                      <img
                        className="w-8 h-8 rounded-full relative"
                        src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                        alt="user photo"
                        onClick={() => {
                          setMenu(!menu);
                        }}
                      />

                      {menu && (
                        <div className="z-50 absolute px-5 my-4 right-1 top-10 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600">
                          <div className="px-4 py-3">
                            <p className="text-sm text-gray-900 dark:text-white">
                              {authUser?.businessName}
                            </p>
                          </div>
                          <ul className="py-1">
                            <li>
                              <Link
                                to=""
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Dashboard
                              </Link>
                            </li>
                            <li>
                              <Link
                                to=""
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Settings
                              </Link>
                            </li>
                            <li
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                              onClick={() => {
                                localStorage.removeItem("authUser");
                                setAuthUser(null);
                                navigate("/login");
                              }}
                            >
                              Sign out
                            </li>
                          </ul>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10  flex">
          <aside
            className={`absolute  top-0 left-0   w-56 z-10  pt-20 transition-transform  ${
              side ? "-translate-x-full" : "translate-x-0"
            } bg-white border-r  ${
              side ? "md:w-56" : "md:w-14"
            } border-gray-200 md:translate-x-0 `}
          >
            <div className="h-full px-3 pb-4 overflow-y-auto scrollbar-hidden dark:bg-gray-800">
              <ul className="space-y-5 ">
                <li className="">
                  <Link
                    to={`/business/businessdashboard/${authUser?.businesId}`}
                    className={`flex items-center text-xl gap-5 p-2 text-gray-900 rounded-lg hover:bg-gray-100    ${
                      isActive(
                        `/business/businessdashboard/${authUser?.businesId}`
                      )
                        ? "text-red-500 "
                        : ""
                    }`}
                  >
                    <DashboardOutlined /> Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/business/vehicle`}
                    className={`flex items-center text-xl gap-5 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                      isActive(`/business/vehicle`) ? "text-red-500 " : ""
                    }`}
                  >
                    {" "}
                    <CarOutlined />
                    Vehicles
                  </Link>
                </li>
                <li>
                  <Link
                    to="/business/trek"
                    className={`flex items-center text-xl gap-5 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700   ${
                      isActive(`/business/trek`) ? "text-red-500 " : ""
                    }`}
                  >
                    {" "}
                    <FontAwesomeIcon icon={faMountain} />
                    Trek
                  </Link>
                </li>
                <li>
                  <Link
                    to="/business/tour"
                    className={`flex items-center text-xl gap-5 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                      isActive(`/business/tour`) ? "text-red-500 " : ""
                    }`}
                  >
                    <FontAwesomeIcon icon={faPlane} />
                    Tour
                  </Link>
                </li>

                <li>
                  <Link
                    to="/business/drivers"
                    className={`flex items-center text-xl gap-5 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                      isActive(`/business/drivers`) ? "text-red-500 " : ""
                    }`}
                  >
                    <FontAwesomeIcon icon={faBus} />
                    Drivers
                  </Link>
                </li>

                <li
                  className={`flex items-center text-xl gap-5 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                    isActive("/business/reservations") ||
                    isActive("/business/tourrev") ||
                    isActive("/business/trekrev")
                      ? "text-red-500"
                      : ""
                  }`}
                  onClick={() => setShowRev(!showRev)}
                >
                  <FontAwesomeIcon icon={faCartShopping} />
                  Reservations <FontAwesomeIcon icon={faChevronDown} />
                </li>
                {showRev && (
                  <div className="flex ps-14 justify-start">
                    <ul className="space-y-3 font-normal  text-center">
                      <li className="">
                        <Link
                          to="/business/reservations"
                          className={`flex text-sm text-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            isActive("/business/reservations")
                              ? "text-red-500"
                              : ""
                          }`}
                        >
                          Vehicle Reservations
                        </Link>
                      </li>
                      <li className=" ">
                        <Link
                          to="/business/tourrev"
                          className={`flex items-center  text-sm  p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            isActive("/business/tourrev") ? "text-red-500" : ""
                          }`}
                        >
                          Tour Reservations
                        </Link>
                      </li>
                      <li className="">
                        <Link
                          to="/business/trekrev"
                          className={`flex items-center text-sm  p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            isActive("/business/trekrev") ? "text-red-500" : ""
                          }`}
                        >
                          Trek Reservations
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}

                <li>
                  <Link
                    to={`/business/businessprofile/${authUser?.businesId}`}
                    className={`flex items-center p-2 text-xl gap-5 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                      isActive(
                        `/business/businessprofile/${authUser?.businesId}`
                      )
                        ? "text-red-500 "
                        : ""
                    }`}
                  >
                    <FontAwesomeIcon icon={faUser} />
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
          <div
            className={`overflow-auto  ${
              side ? "md:ml-64" : "md:ml-10"
            }  mt-14 md:p-10 p-3 mxl:w-[1360px] w-full`}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};
