import {
  CarOutlined,
  CloseOutlined,
  DashboardOutlined,
  SettingFilled,
} from "@ant-design/icons";
import {
  faBars,
  faBus,
  faCartShopping,
  faChevronDown,
  faMountain,
  faPlane,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

export const SideBar = () => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState<boolean>(true);
  const { setAuthUser, authUser } = useAuthContext();
  const windowSize = useRef(window.innerWidth);
  const [showRev, setShowRev] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (windowSize.current < 540) {
      setMenu(false);
    }
  }, []);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");
  return (
    <>
      <FontAwesomeIcon
        icon={faBars}
        onClick={() => {
          setMenu(true);
        }}
        size="2x"
        className={`${!menu ? `block` : `hidden`} p-4  absolute cursor-pointer`}
      />
      <div
        className={` shadow relative h-fit flex-col  items-start  ${
          menu ? `flex` : `hidden`
        }`}
      >
        <ul className=" text-xs sm:text-xl text-center pt-8  min-h-screen mb-5">
          <li
            className="absolute flex justify-end right-1 top-3"
            onClick={() => {
              setMenu(false);
            }}
          >
            <CloseOutlined />
          </li>

          <li className="font-semibold text-2xl text-button">
            Toursewa
            <hr />
          </li>
          <div className="flex flex-col text-gray-800 text-center  sm:mt-7 mt-4 sm:gap-y-8 gap-5">
            <Link
              to={`/business/businessdashboard/${authUser?.businesId}`}
              className={`flex gap-x-3 px-10 hover:text-button cursor-pointer ${
                isActive(`/business/businessdashboard/${authUser?.businesId}`)
                  ? "text-button "
                  : ""
              }`}
            >
              <DashboardOutlined />
              Dashboard
            </Link>

            <Link
              to={`/business/vehicle`}
              className={`flex gap-x-3 px-10 hover:text-button cursor-pointer ${
                isActive(`/business/vehicle`) ? "text-button " : ""
              }`}
            >
              <CarOutlined />
              Vehicles
            </Link>
            <Link
              to="/business/trek"
              className={`flex gap-x-3 px-10 cursor-pointer hover:text-button items-center ${
                isActive(`/business/trek`) ? "text-button " : ""
              }`}
            >
              <FontAwesomeIcon icon={faMountain} />
              Trek
            </Link>
            <Link
              to="/business/tour"
              className={`flex gap-x-3 px-10 cursor-pointer hover:text-button items-center ${
                isActive(`/business/tour`) ? "text-button " : ""
              }`}
            >
              <FontAwesomeIcon icon={faPlane} />
              Tour
            </Link>

            <div
              className="flex gap-x-3 px-10 flex-col  items-center   transition-all duration-700  cursor-pointer   hover:text-red-500"
              onClick={() => setShowRev(!showRev)}
            >
              <div className={`flex gap-5  w-full items-center`}>
                <li className="flex gap-3 items-center">
                  {" "}
                  <FontAwesomeIcon icon={faCartShopping} />
                  Reservation
                </li>
                <FontAwesomeIcon icon={faChevronDown} />
              </div>
            </div>
            {showRev && (
              <div
                className={` transition-all  text-xs duration-1000 overflow-hidden  ${
                  showRev ? "max-h-[500px]" : "h-0"
                }`}
              >
                <>
                  <ul className=" mb-1 text-[10px] md:text-[13px] font-semibold flex flex-col gap-3 mx-auto items-start w-2/3 transition-all duration-700   ">
                    <li
                      className={` hover:text-red-500 rounded-lg p-1 ${
                        isActive("/business/reservations") ? "text-red-500" : ""
                      }`}
                    >
                      <Link
                        to="/business/reservations"
                        className={`hover:text-button items-start cursor-pointer w-full`}
                      >
                        Vehicle Reservations
                      </Link>
                    </li>

                    <li
                      className={`hover:text-button  rounded-lg p-1 ${
                        isActive("/business/tourrev") ? "text-red-500" : ""
                      }`}
                    >
                      <Link
                        to="/business/tourrev"
                        className={`items-start text-start cursor-pointer w-full `}
                      >
                        {/* <FontAwesomeIcon icon={faBusinessTime} /> */}
                        Tour Reservations
                      </Link>
                    </li>

                    <li
                      className={` hover:text-button rounded-lg p-1 ${
                        isActive("/business/trekrev") ? "text-red-500" : ""
                      }`}
                    >
                      <Link
                        to="/business/trekrev"
                        className={`items-center cursor-pointer w-full `}
                      >
                        {/* <FontAwesomeIcon icon={faBusinessTime} /> */}
                        Trek Reservations
                      </Link>
                    </li>
                  </ul>
                </>
              </div>
            )}

            <Link
              to="/business/drivers"
              className={`flex gap-x-3 hover:text-button px-10 cursor-pointer items-center ${
                isActive(`/business/drivers`) ? "text-button " : ""
              }`}
            >
              <FontAwesomeIcon icon={faBus} />
              Drivers
            </Link>
            <Link
              to={`/business/businessprofile/${authUser?.businesId}`}
              className={`flex gap-x-3 hover:text-button px-10 cursor-pointer items-center ${
                isActive(`/business/businessprofile/${authUser?.businesId}`)
                  ? "text-button "
                  : ""
              }`}
            >
              <FontAwesomeIcon icon={faUser} />
              Profile
            </Link>
            <li className="flex gap-x-3 px-10  hover:text-button cursor-pointer">
              {" "}
              <SettingFilled />
              Setting
            </li>
            <li
              className="flex items-center hover:text-button gap-x-3 px-10 cursor-pointer"
              onClick={() => {
                localStorage.removeItem("authUser");
                setAuthUser(null);
                navigate("/login");
              }}
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              Logout
            </li>
          </div>
        </ul>
      </div>
    </>
  );
};
