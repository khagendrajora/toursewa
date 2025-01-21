import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBlog,
  faBusinessTime,
  faCar,
  faChevronDown,
  faCity,
  faGauge,
  faLocationDot,
  faPersonHiking,
  faPhotoFilm,
  faPlane,
  faTableList,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

export const AdminSideBar = () => {
  const { setAuthUser, authUser } = useAuthContext();
  const [menu, setMenu] = useState<boolean>(false);
  const [side, setSide] = useState<boolean>(true);
  const navigate = useNavigate();
  const [showBusiness, setShowBusiness] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [showTrek, setShowTrek] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showVeh, setShowVeh] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  useEffect(() => {
    if (!side) {
      setShowBusiness(false);
      setShowCategory(false);
      setShowBusiness(false);
      setShowTrek(false);
      setShowTour(false);
      setShowVeh(false);
      setShowLocation(false);
    }
  }, [side]);

  return (
    <>
      <div className="max-w-[1360px] w-full borde-r mx-auto relative">
        <div
          className={`fixed top-0 z-50 w-full max-w-[1360px] shadow-md border-b border-gray-200 bg-white  `}
        >
          <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start rtl:justify-end">
                <FontAwesomeIcon
                  icon={faBars}
                  size="2xl"
                  className="inline-flex cursor-pointer items-center p-3 text-sm text-gray-500 rounded-lg  hover:bg-gray-100  "
                  onClick={() => {
                    setSide(!side);
                    if (!side) {
                      setShowBusiness(false);
                      setShowCategory(false);
                      setShowBusiness(false);
                      setShowTrek(false);
                      setShowTour(false);
                      setShowVeh(false);
                      setShowLocation(false);
                    }
                  }}
                />
                <Link to="/" className="flex ms-5 md:me-24">
                  <span className="text-xl font-semibold sm:text-2xl whitespace-nowrap text-red-500">
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
                              {authUser?.adminName}
                            </p>
                          </div>
                          <ul className="py-1">
                            <li className="block disabled px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white">
                              Settings
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
            className={`absolute  top-0 left-0  w-60 z-10 bg-[#637794]  pt-20 transition-transform  ${
              side ? "-translate-x-full" : "translate-x-0"
            }  border-r  ${
              side ? "md:w-60" : "md:w-14"
            } border-gray-200 md:translate-x-0 `}
          >
            <div className="h-full px-3 pb-4 overflow-y-auto text-[#1b1e23] scrollbar-hidden ">
              <ul className="space-y-2 text-lg font-medium ">
                <li className="">
                  <Link
                    to="/admin/admindashboard"
                    className={`flex gap-x-4 items-center   cursor-pointer p-3 rounded-lg hover:text-red-800 ${
                      isActive("/admin/admindashboard") ? "text-red-800" : ""
                    }`}
                  >
                    <FontAwesomeIcon icon={faGauge} className="" />
                    Dashboard
                  </Link>
                </li>

                <li
                  className={`flex gap-x-4 items-center justify-between  cursor-pointer p-3 rounded-lg hover:text-red-800 ${
                    isActive("/admin/addbusiness") ||
                    isActive("/admin/business")
                      ? "text-red-800"
                      : ""
                  }`}
                  onClick={() => {
                    setShowBusiness(!showBusiness), navigate("/admin/business");
                  }}
                >
                  <div className="flex items-center gap-x-4">
                    <FontAwesomeIcon icon={faBusinessTime} />
                    Business
                  </div>
                  <FontAwesomeIcon icon={faChevronDown} className="" />
                </li>
                {showBusiness && (
                  <>
                    <div className="flex w-1/2 mx-auto ">
                      <ul className="space-y-3 font-normal  text-start">
                        <li
                          className={`w-52 hover:text-red-800 rounded-lg p-1 ${
                            isActive("/admin/addbusiness") ? "text-red-800" : ""
                          }`}
                        >
                          <Link
                            to="/admin/addbusiness"
                            className={` items-center cursor-pointer w-full`}
                          >
                            Add Business
                          </Link>
                        </li>
                        <li
                          className={`w-52 hover:text-red-800 rounded-lg p-1 ${
                            isActive("/admin/business") ? "text-red-800" : ""
                          }`}
                        >
                          <Link
                            to="/admin/business"
                            className={`items-center cursor-pointer w-full `}
                          >
                            Business
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </>
                )}

                <li
                  className={`flex  justify-between gap-x-4 items-center w-full  transition-all duration-700  cursor-pointer p-3 rounded-lg hover:text-red-800 ${
                    isActive("/admin/vehicle") || isActive("/admin/addveh")
                      ? "text-red-800"
                      : ""
                  }`}
                  onClick={() => {
                    setShowVeh(!showVeh), navigate("/admin/vehicle");
                  }}
                >
                  <div className="flex items-center gap-x-4">
                    <FontAwesomeIcon icon={faCar} />
                    Vehicle{" "}
                  </div>
                  <FontAwesomeIcon icon={faChevronDown} />
                </li>

                {showVeh && (
                  <>
                    <div className="flex w-1/2 mx-auto ">
                      <ul className="space-y-3 font-normal  text-start">
                        <li
                          className={`w-52 hover:text-red-800 rounded-lg p-1 ${
                            isActive("/admin/addveh") ? "text-red-800" : ""
                          }`}
                        >
                          <Link
                            to="/admin/addveh"
                            className={` items-center cursor-pointer w-full`}
                          >
                            Add Vehicle
                          </Link>
                        </li>
                        <li
                          className={`w-52 hover:text-red-800 rounded-lg p-1 ${
                            isActive("/admin/vehicle") ? "text-red-800" : ""
                          }`}
                        >
                          <Link
                            to="/admin/vehicle"
                            className={`items-center cursor-pointer w-full `}
                          >
                            Vehicle
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </>
                )}

                <li
                  className="flex  justify-between gap-x-4 items-center w-full  transition-all duration-700  cursor-pointer p-3 rounded-lg hover:text-red-800"
                  onClick={() => {
                    setShowTour(!showTour), navigate("/admin/tour");
                  }}
                >
                  <div className="flex items-center gap-x-4">
                    <FontAwesomeIcon icon={faPlane} />
                    Tour{" "}
                  </div>
                  <FontAwesomeIcon icon={faChevronDown} />
                </li>

                {showTour && (
                  <>
                    <div className="flex w-1/2 mx-auto ">
                      <ul className="space-y-3 font-normal  text-start">
                        <li
                          className={`w-52 hover:text-red-800 rounded-lg p-1 ${
                            isActive("/admin/addtour") ? "text-red-800" : ""
                          }`}
                        >
                          <Link
                            to="/admin/addtour"
                            className={` items-center cursor-pointer w-full`}
                          >
                            Add Tour
                          </Link>
                        </li>
                        <li
                          className={`w-52 hover:text-red-800 rounded-lg p-1 ${
                            isActive("/admin/tour") ? "text-red-800" : ""
                          }`}
                        >
                          <Link
                            to="/admin/tour"
                            className={`items-center cursor-pointer w-full `}
                          >
                            Tour
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </>
                )}

                <li
                  className={`flex  justify-between gap-x-4 items-center w-full  transition-all duration-700  cursor-pointer p-3 rounded-lg hover:text-red-800 ${
                    isActive("/admin/addtrek") || isActive("/admin/trek")
                      ? "text-red-800"
                      : ""
                  }`}
                  onClick={() => {
                    setShowTrek(!showTrek), navigate("/admin/trek");
                  }}
                >
                  <div className="flex items-center gap-x-4">
                    <FontAwesomeIcon icon={faPersonHiking} />
                    Trek
                  </div>
                  <FontAwesomeIcon icon={faChevronDown} />
                </li>

                {showTrek && (
                  <>
                    <div className="flex w-1/2 mx-auto ">
                      <ul className="space-y-3 font-normal  text-start">
                        <li
                          className={`w-52 hover:text-red-800 rounded-lg p-1 ${
                            isActive("/admin/addtrek") ? "text-red-800" : ""
                          }`}
                        >
                          <Link
                            to="/admin/addtrek"
                            className={` items-center cursor-pointer w-full`}
                          >
                            Add Trek
                          </Link>
                        </li>
                        <li
                          className={`w-52 hover:text-red-800 rounded-lg p-1 ${
                            isActive("/admin/trek") ? "text-red-800" : ""
                          }`}
                        >
                          <Link
                            to="/admin/trek"
                            className={`items-center cursor-pointer w-full `}
                          >
                            Trek
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </>
                )}

                <li
                  className={`flex  justify-between gap-x-4 items-center w-full  transition-all duration-700  cursor-pointer p-3 rounded-lg hover:text-red-800 ${
                    isActive("/admin/businesscategory") ||
                    isActive("/admin/tourcategory") ||
                    isActive("/admin/trekcategory") ||
                    isActive("/admin/vehcategory")
                      ? "text-red-800"
                      : ""
                  }`}
                  onClick={() => setShowCategory(!showCategory)}
                >
                  <div className="flex items-center gap-x-4">
                    <FontAwesomeIcon icon={faTableList} />
                    Category
                  </div>
                  <FontAwesomeIcon icon={faChevronDown} />
                </li>

                {showCategory && (
                  <>
                    <div className="flex w-1/2 mx-auto ">
                      <ul className="space-y-3 font-normal  text-start">
                        <li
                          className={`w-52 hover:text-red-800 rounded-lg p-1 ${
                            isActive("/admin/businesscategory")
                              ? "text-red-800"
                              : ""
                          }`}
                        >
                          <Link
                            to="/admin/businesscategory"
                            className={` items-center cursor-pointer w-full`}
                          >
                            Business Category
                          </Link>
                        </li>
                        <li
                          className={`w-52 hover:text-red-800 rounded-lg p-1 ${
                            isActive("/admin/tourcategory")
                              ? "text-red-800"
                              : ""
                          }`}
                        >
                          <Link
                            to="/admin/tourcategory"
                            className={`items-center cursor-pointer w-full `}
                          >
                            Tour Category
                          </Link>
                        </li>
                        <li
                          className={`w-52 hover:text-red-800 rounded-lg p-1 ${
                            isActive("/admin/trekcategory")
                              ? "text-red-800"
                              : ""
                          }`}
                        >
                          <Link
                            to="/admin/trekcategory"
                            className={`items-center cursor-pointer w-full `}
                          >
                            Trek Category
                          </Link>
                        </li>
                        <li
                          className={`w-52 hover:text-red-800 rounded-lg p-1 ${
                            isActive("/admin/vehcategory") ? "text-red-800" : ""
                          }`}
                        >
                          <Link
                            to="/admin/vehcategory"
                            className={`items-center cursor-pointer w-full `}
                          >
                            Vehicles Category
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </>
                )}

                <li
                  className={`flex  justify-between gap-x-4 items-center w-full  transition-all duration-700  cursor-pointer p-3 rounded-lg hover:text-red-800 ${
                    isActive("/admin/location") ||
                    isActive("/admin/country") ||
                    isActive("/admin/state") ||
                    isActive("/admin/district") ||
                    isActive("/admin/municipality")
                      ? "text-red-800"
                      : ""
                  }`}
                  onClick={() => setShowLocation(!showLocation)}
                >
                  <div className="flex items-center gap-x-4">
                    <FontAwesomeIcon icon={faLocationDot} />
                    Localization
                  </div>
                  <FontAwesomeIcon icon={faChevronDown} />
                </li>

                {showLocation && (
                  <>
                    <div className="flex w-1/2 mx-auto ">
                      <ul className="space-y-3 font-normal  text-start">
                        <li
                          className={`w-52 hover:text-red-800 rounded-lg p-1 ${
                            isActive("/admin/country") ? "text-red-800" : ""
                          }`}
                        >
                          <Link
                            to="/admin/country"
                            className={` items-center cursor-pointer w-full`}
                          >
                            Country
                          </Link>
                        </li>
                        <li
                          className={`w-52 hover:text-red-800 rounded-lg p-1 ${
                            isActive("/admin/state") ? "text-red-800" : ""
                          }`}
                        >
                          <Link
                            to="/admin/state"
                            className={`items-center cursor-pointer w-full `}
                          >
                            State
                          </Link>
                        </li>
                        <li
                          className={`w-52 hover:text-red-800 rounded-lg p-1 ${
                            isActive("/admin/district") ? "text-red-800" : ""
                          }`}
                        >
                          <Link
                            to="/admin/district"
                            className={`items-center cursor-pointer w-full `}
                          >
                            Districts
                          </Link>
                        </li>
                        <li
                          className={`w-52 hover:text-red-800 rounded-lg p-1 ${
                            isActive("/admin/municipality")
                              ? "text-red-800"
                              : ""
                          }`}
                        >
                          <Link
                            to="/admin/municipality"
                            className={`items-center cursor-pointer w-full `}
                          >
                            Municipality
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </>
                )}

                <li>
                  <Link
                    to="/admin/blogs"
                    className={`flex gap-x-4 items-center  cursor-pointer p-3 rounded-lg hover:text-red-800 ${
                      isActive("/admin/blogs") ? "text-red-800" : ""
                    }`}
                  >
                    <FontAwesomeIcon icon={faBlog} />
                    Blogs
                  </Link>
                </li>

                <li>
                  <Link
                    to="/admin/destination"
                    className={`flex gap-x-4 items-center  cursor-pointer p-3 rounded-lg hover:text-red-800 ${
                      isActive("/admin/destination") ? "text-red-800" : ""
                    }`}
                  >
                    <FontAwesomeIcon icon={faLocationDot} />
                    Destination
                  </Link>
                </li>

                <li>
                  <Link
                    to="/admin/property"
                    className={`flex gap-x-4 items-center  cursor-pointer p-3 rounded-lg hover:text-red-800 ${
                      isActive("/admin/property") ? "text-red-800" : ""
                    }`}
                  >
                    <FontAwesomeIcon icon={faCity} />
                    Property
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/driver"
                    className={`flex gap-x-4 items-center  cursor-pointer p-3 rounded-lg hover:text-red-800 ${
                      isActive("/admin/driver") ? "text-red-800" : ""
                    }`}
                  >
                    <FontAwesomeIcon icon={faUsers} />
                    Drivers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/hero"
                    className={`flex gap-x-4 items-center  cursor-pointer p-3 rounded-lg hover:text-red-800 ${
                      isActive("/admin/hero") ? "text-red-800" : ""
                    }`}
                  >
                    <FontAwesomeIcon icon={faPhotoFilm} />
                    Hero
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/teams"
                    className={`flex gap-x-4 items-center  cursor-pointer p-3 rounded-lg hover:text-red-800 ${
                      isActive("/admin/teams") ? "text-red-800" : ""
                    }`}
                  >
                    <FontAwesomeIcon icon={faUsers} />
                    Teams
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
