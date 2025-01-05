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
import { Link, useLocation, useNavigate } from "react-router-dom";

export const AdminSideBar = () => {
  const [navigationBar, setNavigationBar] = useState(true);
  const [width, setWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  useEffect(() => {
    const handleSize = () => {
      const currentSize = window.innerWidth;
      setWidth(currentSize);

      if (width < 768) {
        setNavigationBar(false);
      }
    };
    window.addEventListener("resize", handleSize);
    handleSize();
    return () => {
      window.removeEventListener("resize", handleSize);
    };
  }, []);

  const [showBusiness, setShowBusiness] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [showTrek, setShowTrek] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showVeh, setShowVeh] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const showNavigation = () => {
    setNavigationBar((prev) => !prev);
    setShowVeh(false);
    setShowTour(false);
    setShowTrek(false);
    setShowCategory(false);
    setShowBusiness(false);
    setShowLocation(false);
  };

  const showVehs = () => {
    if (navigationBar) {
      setShowVeh((prev) => !prev);
    }
  };
  const showLocations = () => {
    if (navigationBar) {
      setShowLocation((prev) => !prev);
    }
  };

  const showTreks = () => {
    if (navigationBar) {
      setShowTrek((prev) => !prev);
    }
  };
  const showTours = () => {
    if (navigationBar) {
      setShowTour((prev) => !prev);
    }
  };
  const showCategorys = () => {
    if (navigationBar) {
      setShowCategory((prev) => !prev);
    }
  };
  const showBusinesses = () => {
    if (navigationBar) {
      setShowBusiness((prev) => !prev);
    }
  };
  return (
    <>
      <div
        className={`w-1/2 text-x  h-fit z-10 bg-[#475569] transition-all duration-1000  ${
          navigationBar ? `flex md:w-1/5` : ` md:w-14  hidden md:block`
        }    `}
      >
        <ul className="w-full flex flex-col item text-white md:text-lg">
          {navigationBar ? (
            <div className="p-4 text-center md:text-xl ms-10 lg:ms-0 text-button font-bold">
              TourSewa
            </div>
          ) : (
            <div className="h-20"></div>
          )}
          <hr />

          <div className="font-semibold flex flex-col gap-y-2  mt-2 ">
            <Link
              to="/admin/admindashboard"
              className={`flex gap-x-4 items-center  cursor-pointer p-3 rounded-lg hover:text-red-500 ${
                isActive("/admin/admindashboard") ? "text-red-500" : ""
              }`}
            >
              <FontAwesomeIcon icon={faGauge} />
              {navigationBar && <li className="">Dashboard</li>}
            </Link>

            {/* Business */}
            <div
              className="flex  justify-between gap-x-4 items-center w-full  transition-all duration-700  cursor-pointer p-3 rounded-lg hover:text-red-500"
              onClick={showBusinesses}
            >
              <FontAwesomeIcon icon={faBusinessTime} />
              {navigationBar && (
                <>
                  <div
                    className={`flex justify-between w-full items-center`}
                    onClick={() => {
                      navigate("/admin/business");
                    }}
                  >
                    <li>Business</li>
                    <FontAwesomeIcon icon={faChevronDown} />
                  </div>
                </>
              )}
            </div>

            <div
              className={`bg-[#475569] transition-all ms-11  text-xs duration-1000 overflow-hidden  ${
                showBusiness ? "max-h-[500px]" : "max-h-0"
              }`}
            >
              <>
                <ul className=" mb-1  flex flex-col gap-3 w-full transition-all duration-700   ">
                  <li
                    className={`w-52 hover:text-red-500 rounded-lg p-1 ${
                      isActive("/admin/addbusiness") ? "text-red-500" : ""
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
                    className={`w-52 hover:text-red-500 rounded-lg p-1 ${
                      isActive("/admin/business") ? "text-red-500" : ""
                    }`}
                  >
                    <Link
                      to="/admin/business"
                      className={`items-center cursor-pointer w-full `}
                    >
                      {/* <FontAwesomeIcon icon={faBusinessTime} /> */}
                      Business
                    </Link>
                  </li>
                </ul>
              </>
            </div>

            {/* Vehicle */}
            <div
              className="flex  justify-between gap-x-4 items-center w-full  transition-all duration-700  cursor-pointer p-3 rounded-lg hover:text-red-500"
              onClick={showVehs}
            >
              <FontAwesomeIcon icon={faCar} />
              {navigationBar && (
                <>
                  <div
                    className={`flex justify-between w-full items-center`}
                    onClick={() => {
                      navigate("/admin/vehicle");
                    }}
                  >
                    <li>Vehicle</li>
                    <FontAwesomeIcon icon={faChevronDown} />
                  </div>
                </>
              )}
            </div>

            <div
              className={`bg-[#475569] transition-all ms-11  text-xs  duration-1000 overflow-hidden ${
                showVeh ? "max-h-[500px]" : "max-h-0"
              }`}
            >
              <>
                <ul className="  mt-1 mb-1 gap-4 flex flex-col  w-full transition-all duration-700  ">
                  <li
                    className={`w-52 hover:text-red-500 rounded-lg p-1 ${
                      isActive("/admin/addveh") ? "text-red-500" : ""
                    }`}
                  >
                    <Link
                      to="/admin/addveh"
                      className={` items-center cursor-pointer gap-x-4 w-full`}
                    >
                      Add Vehicle
                    </Link>
                  </li>

                  <li
                    className={`w-52 hover:text-red-500 rounded-lg p-1 ${
                      isActive("/admin/vehicle") ? "text-red-500" : ""
                    }`}
                  >
                    <Link
                      to="/admin/vehicle"
                      className={` items-center cursor-pointer gap-x-4 w-full`}
                    >
                      Vehicle
                    </Link>
                  </li>
                </ul>
              </>
            </div>

            {/* Tour */}
            <div
              className="flex  justify-between gap-x-4 items-center w-full  transition-all duration-700  cursor-pointer p-2 rounded-lg hover:text-red-500"
              onClick={showTours}
            >
              <FontAwesomeIcon icon={faPlane} />

              {navigationBar && (
                <>
                  <div
                    className={`flex justify-between w-full items-center`}
                    onClick={() => {
                      navigate("/admin/tour");
                    }}
                  >
                    <li>Tour</li>
                    <FontAwesomeIcon icon={faChevronDown} />
                  </div>
                </>
              )}
            </div>

            <div
              className={`bg-[#475569] transition-all  duration-1000 overflow-hidden  ${
                showTour ? "max-h-[500px]" : "max-h-0"
              }`}
            >
              <>
                <ul className="  mb-1 text-xs ms-11 flex flex-col gap-2 w-full transition-all duration-700  ">
                  <li
                    className={`w-52 hover:text-red-500 rounded-lg p-1 ${
                      isActive("/admin/addtour") ? "text-red-500" : ""
                    }`}
                  >
                    <Link
                      to="/admin/addtour"
                      className={` items-center cursor-pointer gap-x-4 w-full`}
                    >
                      Add Tour
                    </Link>
                  </li>

                  <li
                    className={`w-52 hover:text-red-500 rounded-lg p-1 ${
                      isActive("/admin/tour") ? "text-red-500" : ""
                    }`}
                  >
                    <Link
                      to="/admin/tour"
                      className={` items-center cursor-pointer gap-x-4 w-full
                       
                      `}
                    >
                      Tour
                    </Link>
                  </li>
                </ul>
              </>
            </div>

            {/* Trek */}

            <div
              className="flex  justify-between gap-x-4 items-center w-full  transition-all duration-700  cursor-pointer p-2 rounded-lg hover:text-red-500"
              onClick={showTreks}
            >
              <FontAwesomeIcon icon={faPersonHiking} />
              {navigationBar && (
                <>
                  <div
                    className={`flex justify-between w-full items-center`}
                    onClick={() => {
                      navigate("/admin/trek");
                    }}
                  >
                    <li>Trek</li>
                    <FontAwesomeIcon icon={faChevronDown} />
                  </div>
                </>
              )}
            </div>

            <div
              className={`bg-[#475569] transition-all  duration-1000 overflow-hidden ${
                showTrek ? "max-h-[500px]" : "max-h-0"
              }`}
            >
              <>
                <ul className="   mb-1 text-xs ms-11 flex flex-col gap-4 w-full transition-all duration-700  ">
                  <li
                    className={`w-52 hover:text-red-500 rounded-lg p-1 ${
                      isActive("/admin/addtrek") ? "text-red-500" : ""
                    }`}
                  >
                    <Link
                      to="/admin/addtrek"
                      className={` items-center cursor-pointer gap-x-4 w-full `}
                    >
                      Add Trek
                    </Link>
                  </li>

                  <li
                    className={`w-52 hover:text-red-500 rounded-lg p-1 ${
                      isActive("/admin/trek") ? "text-red-500" : ""
                    }`}
                  >
                    <Link
                      to="/admin/trek"
                      className={` items-center cursor-pointer gap-x-4 w-full`}
                    >
                      Trek
                    </Link>
                  </li>
                </ul>
              </>
            </div>

            {/* Category */}
            <div
              className="flex  justify-between gap-x-4 items-center w-full  transition-all duration-700  cursor-pointer p-2 rounded-lg hover:text-red-500"
              onClick={showCategorys}
            >
              <FontAwesomeIcon icon={faTableList} />
              {navigationBar && (
                <>
                  <div className={`flex justify-between w-full items-center`}>
                    <li>Category</li>
                    <FontAwesomeIcon icon={faChevronDown} />
                  </div>
                </>
              )}
            </div>

            <div
              className={`bg-[#475569] transition-all  duration-1000 overflow-hidden ${
                showCategory ? "max-h-[500px]" : "max-h-0"
              }`}
            >
              <>
                <ul className="   mb-1 text-xs ms-11 flex flex-col gap-4 w-full transition-all duration-700  ">
                  <li
                    className={`w-52 hover:text-red-500 rounded-lg p-1 ${
                      isActive("/admin/businesscategory") ? "text-red-500" : ""
                    }`}
                  >
                    <Link
                      to="/admin/businesscategory"
                      className={`items-center cursor-pointer gap-x-4 w-full`}
                    >
                      Business Category
                    </Link>
                  </li>

                  <li
                    className={`w-52 hover:text-red-500 rounded-lg p-1 ${
                      isActive("/admin/tourcategory") ? "text-red-500" : ""
                    }`}
                  >
                    <Link
                      to="/admin/tourcategory"
                      className={` items-center cursor-pointer gap-x-4 w-full`}
                    >
                      Tour Category
                    </Link>
                  </li>
                  <li
                    className={`w-52 hover:text-red-500 rounded-lg p-1 ${
                      isActive("/admin/trekcategory") ? "text-red-500" : ""
                    }`}
                  >
                    <Link
                      to="/admin/trekcategory"
                      className={` items-center cursor-pointer gap-x-4 w-full`}
                    >
                      Trek Category
                    </Link>
                  </li>

                  <li
                    className={`w-52 hover:text-red-500 rounded-lg p-1 ${
                      isActive("/admin/vehcategory") ? "text-red-500" : ""
                    }`}
                  >
                    <Link
                      to="/admin/vehcategory"
                      className={` items-center cursor-pointer gap-x-4 w-full`}
                    >
                      Vehicles Category
                    </Link>
                  </li>
                </ul>
              </>
            </div>

            {/* Locations */}
            <div
              className="flex  justify-between gap-x-4 items-center w-full  transition-all duration-700  cursor-pointer p-2 rounded-lg hover:text-red-500"
              onClick={showLocations}
            >
              <FontAwesomeIcon icon={faLocationDot} />
              {navigationBar && (
                <>
                  <div className={`flex justify-between w-full items-center`}>
                    <li>Localization</li>
                    <FontAwesomeIcon icon={faChevronDown} />
                  </div>
                </>
              )}
            </div>

            <div
              className={`bg-[#475569] transition-all ms-11  text-xs  duration-1000 overflow-hidden ${
                showLocation ? "max-h-[500px]" : "max-h-0"
              }`}
            >
              <>
                <ul className="  mt-1 mb-1 gap-4 flex flex-col  w-full transition-all duration-700  ">
                  <li
                    className={`w-52 hover:text-red-500 rounded-lg p-1 ${
                      isActive("/admin/country") ? "text-red-500" : ""
                    }`}
                  >
                    <Link
                      to="/admin/country"
                      className={` items-center cursor-pointer gap-x-4 w-full`}
                    >
                      Country
                    </Link>
                  </li>

                  <li
                    className={`w-52 hover:text-red-500 rounded-lg p-1 ${
                      isActive("/admin/state") ? "text-red-500" : ""
                    }`}
                  >
                    <Link
                      to="/admin/state"
                      className={` items-center cursor-pointer gap-x-4 w-full`}
                    >
                      State
                    </Link>
                  </li>

                  <li
                    className={`w-52 hover:text-red-500 rounded-lg p-1 ${
                      isActive("/admin/district") ? "text-red-500" : ""
                    }`}
                  >
                    <Link
                      to="/admin/district"
                      className={` items-center cursor-pointer gap-x-4 w-full`}
                    >
                      Districts
                    </Link>
                  </li>

                  <li
                    className={`w-52 hover:text-red-500 rounded-lg p-1 ${
                      isActive("/admin/municipality") ? "text-red-500" : ""
                    }`}
                  >
                    <Link
                      to="/admin/municipality"
                      className={` items-center cursor-pointer gap-x-4 w-full`}
                    >
                      Municipality
                    </Link>
                  </li>

                  <li
                    className={`w-52 hover:text-red-500 rounded-lg p-1 ${
                      isActive("/admin/locations") ? "text-red-500" : ""
                    }`}
                  >
                    <Link
                      to="/admin/locations"
                      className={` items-center cursor-pointer gap-x-4 w-full`}
                    >
                      Locations
                    </Link>
                  </li>
                </ul>
              </>
            </div>

            {/* blogs */}
            <Link
              to="/admin/blogs"
              className={`flex gap-x-4 items-center  cursor-pointer p-3 rounded-lg hover:text-red-500 ${
                isActive("/admin/blogs") ? "text-red-500" : ""
              }`}
            >
              <FontAwesomeIcon icon={faBlog} />
              {navigationBar && <li>Blogs</li>}
            </Link>

            {/* Destintions */}
            <Link
              to="/admin/destination"
              className={`flex gap-x-4 items-center  cursor-pointer p-3 rounded-lg hover:text-red-500 ${
                isActive("/admin/destination") ? "text-red-500" : ""
              }`}
            >
              <FontAwesomeIcon icon={faLocationDot} />
              {navigationBar && <li>Destination</li>}
            </Link>

            {/* Property */}
            <Link
              to="/admin/property"
              className={`flex gap-x-4 items-center  cursor-pointer p-3 rounded-lg hover:text-red-500 ${
                isActive("/admin/property") ? "text-red-500" : ""
              }`}
            >
              <FontAwesomeIcon icon={faCity} />
              {navigationBar && <li>Property</li>}
            </Link>

            <Link
              to="/admin/driver"
              className={`flex gap-x-4 items-center  cursor-pointer p-3 rounded-lg hover:text-red-500 ${
                isActive("/admin/driver") ? "text-red-500" : ""
              }`}
            >
              <FontAwesomeIcon icon={faUsers} />
              {navigationBar && <li className="">Drivers</li>}
            </Link>

            <Link
              to="/admin/hero"
              className={`flex gap-x-4 items-center  cursor-pointer p-3 rounded-lg hover:text-red-500 ${
                isActive("/admin/hero") ? "text-red-500" : ""
              }`}
            >
              <FontAwesomeIcon icon={faPhotoFilm} />
              {navigationBar && <li className="">Hero</li>}
            </Link>

            <Link
              to="/admin/teams"
              className={`flex gap-x-4 items-center  cursor-pointer p-3 rounded-lg hover:text-red-500 ${
                isActive("/admin/teams") ? "text-red-500" : ""
              }`}
            >
              <FontAwesomeIcon icon={faUsers} />
              {navigationBar && <li className="">Teams</li>}
            </Link>
          </div>
        </ul>
      </div>
      <div className={`flex p-4 absolute  `}>
        <FontAwesomeIcon
          icon={faBars}
          size="2xl"
          className={`cursor-pointer z-10 `}
          onClick={showNavigation}
        />
      </div>
    </>
  );
};
