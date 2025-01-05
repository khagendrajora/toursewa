import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const { setAuthUser, authUser } = useAuthContext();
  const clientId = authUser?.clientId;
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  const [sideMenu, setSideMenu] = useState(false);
  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <>
      <div className="bg-white pt-4 px-4 mb-3 md:pt-6 md:px-6 flex flex-col max-w-[1360px] xml:relative">
        <div className="flex justify-center h-[60px]">
          <button className="bg-button w-[120px] h-[40px] rounded-[40px] font-normal hover:bg-[#06243C] text-[20px] text-white">
            Help
          </button>
        </div>
        <div className="lg:hidden h-[60px] items-center text-gray-600  flex justify-between gap-5 me-3 mt-2">
          <div className="flex gap-5 items-center">
            <div>
              <FontAwesomeIcon
                icon={faBars}
                size="2xl"
                className={`cursor-pointer  relative `}
                onClick={() => setSideMenu(!sideMenu)}
              />
              {sideMenu && (
                <div className="flex absolute flex-col gap-4 w-1/3 p-4 left-0 border shadow-md border-t-0  rounded-br-lg bg-white z-10">
                  <Link
                    to="/"
                    className={`${isActive("/") ? "text-button" : ""}`}
                    onClick={() => setSideMenu(!sideMenu)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/vehiclelist"
                    className={`hover:text-button ${
                      isActive("/vehiclelist") ? "text-button" : ""
                    }`}
                    onClick={() => setSideMenu(!sideMenu)}
                  >
                    Vehicle
                  </Link>
                  <Link
                    to="/tourpage"
                    className={`hover:text-button ${
                      isActive("/tourpage") ? "text-button" : ""
                    }`}
                    onClick={() => setSideMenu(!sideMenu)}
                  >
                    Tour
                  </Link>
                  <Link
                    to="/trekpage"
                    className={`hover:text-button ${
                      isActive("/trekpage") ? "text-button" : ""
                    }`}
                    onClick={() => setSideMenu(!sideMenu)}
                  >
                    Trek
                  </Link>
                  <Link
                    to="/destinationpage"
                    className={`hover:text-button ${
                      isActive("/destinationpage") ? "text-button" : ""
                    }`}
                    onClick={() => setSideMenu(!sideMenu)}
                  >
                    Destinations
                  </Link>
                  <Link
                    to="/"
                    className="hover:text-button"
                    onClick={() => setSideMenu(!sideMenu)}
                  >
                    Routes
                  </Link>
                  <Link
                    to="/"
                    className="hover:text-button"
                    onClick={() => setSideMenu(!sideMenu)}
                  >
                    Directory
                  </Link>
                  {/* <Link
                  to="/"
                  className="hover:text-button"
                  onClick={() => setSideMenu(!sideMenu)}
                >
                  Travelers Diary
                </Link> */}
                  <Link to="/" className="hover:text-button">
                    Updates
                  </Link>
                  <Link to="/" className="hover:text-button">
                    Advisory
                  </Link>{" "}
                  <Link to="/" className="hover:text-button">
                    Blogs
                  </Link>
                </div>
              )}
            </div>
            <div className="-mt-[10px]">
              <img
                src="logo.png"
                style={{
                  width: "100px",
                  height: "30px",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/")}
              />
            </div>
          </div>
          {clientId ? (
            <div
              className="flex  justify-center w-auto items-center"
              onClick={() => {
                setMenu(!menu);
              }}
            >
              <FontAwesomeIcon
                icon={faUser}
                size="xl"
                style={{ cursor: "pointer" }}
              />
            </div>
          ) : authUser?.userId ? (
            <Link to="/admin/admindashboard">
              {" "}
              <FontAwesomeIcon
                icon={faUser}
                size="xl"
                style={{ cursor: "pointer" }}
              />
            </Link>
          ) : authUser?.businesId ? (
            <Link to={`/business/businessdashboard/${authUser?.businesId}`}>
              <FontAwesomeIcon
                icon={faUser}
                size="xl"
                style={{ cursor: "pointer" }}
              />
            </Link>
          ) : authUser?.driverId ? (
            <div
              className="flex justify-center w-auto items-center"
              onClick={() => {
                setMenu(!menu);
              }}
            >
              <FontAwesomeIcon
                icon={faUser}
                size="xl"
                style={{ cursor: "pointer" }}
              />
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-[#06243C] w-[120px] h-[40px]  flex items-center justify-center rounded-[40px] text-white hover:text-button"
            >
              Log In
            </Link>
          )}
          {menu && (
            <div
              className={`fixed bg-white  w-auto z-0  rounded-b-md mt-10 right-1   transition-all duration-300 ease-in-out transform ${
                menu ? "translate-y-0 opacity-1" : "traslate-y-4 opacity-0"
              }`}
            >
              <ul className="absolute  right-0 z-10 space-y-2 bg-white text-center">
                <li className="p-1 px-5">
                  <Link
                    to={
                      authUser?.clientId
                        ? "/clientdashboard"
                        : "/driverdashboard"
                    }
                    onClick={() => setMenu(!menu)}
                  >
                    Dashboard
                  </Link>
                </li>
                <hr />
                <li className="p-1">
                  {" "}
                  <Link
                    to={
                      authUser?.clientId ? "/clientprofile" : "/driverprofile"
                    }
                    onClick={() => setMenu(!menu)}
                  >
                    Profile
                  </Link>
                </li>
                <hr />
                <li
                  className="cursor-pointer p-1"
                  onClick={() => {
                    setAuthUser(null);
                    localStorage.removeItem("authUser");
                    setMenu(!menu);
                    navigate("/");
                  }}
                >
                  Sign Out
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center pt-4 mb-1">
          <div className="hidden lg:block">
            <img
              src="logo.png"
              style={{
                width: "150px",
                height: "50px",
                // marginTop: "-18px",
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            />
          </div>
          <div className="flex justify-between text-[#06243C] font-medium md:text-sm lg:text-md text-xs w-full  ">
            <div className="hidden lg:flex  justify-center gap-3 xl:gap-4 items-end  w-full">
              <Link
                to="/"
                className={`hover:text-button ${
                  isActive("/") ? "text-button" : ""
                }`}
              >
                Home
              </Link>
              <Link
                to="/vehiclelist"
                className={`hover:text-button ${
                  isActive("/vehiclelist") ? "text-button" : ""
                }`}
              >
                Vehicle
              </Link>
              <Link
                to="/tourpage"
                className={`${isActive("/tourpage") ? "text-button" : ""}`}
              >
                Tour
              </Link>
              <Link
                to="/trekpage"
                className={` hover:text-button ${
                  isActive("/trekpage") ? "text-button" : ""
                }`}
              >
                Trek
              </Link>
              <Link
                to="/destinationpage"
                className={`hover:text-button ${
                  isActive("/destinationpage") ? "text-button" : ""
                }`}
              >
                Destinations
              </Link>
              <Link to="/" className="hover:text-button">
                Routes
              </Link>
              <Link to="/" className="hover:text-button">
                Directory
              </Link>

              <Link to="/" className="hover:text-button">
                Updates
              </Link>

              <Link to="/" className="hover:text-button">
                Advisory
              </Link>
              <Link to="/" className="hover:text-button">
                Blogs
              </Link>
            </div>

            <div className="hidden lg:flex gap-5">
              {clientId ? (
                <div
                  className="sm:flex hidden justify-center relative w-10 items-center"
                  onClick={() => {
                    setMenu(!menu);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    size="xl"
                    style={{ cursor: "pointer" }}
                  />
                </div>
              ) : authUser?.userId ? (
                <Link
                  to="/admin/admindashboard"
                  className="sm:ml-5 hover:text-button md:ml-0"
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    size="xl"
                    style={{ cursor: "pointer" }}
                  />
                </Link>
              ) : authUser?.businesId ? (
                <Link to={`/business/businessdashboard/${authUser?.businesId}`}>
                  <FontAwesomeIcon
                    icon={faUser}
                    size="xl"
                    style={{ cursor: "pointer" }}
                  />
                </Link>
              ) : authUser?.driverId ? (
                <div
                  className="flex justify-center hover:text-button w-auto items-center"
                  onClick={() => {
                    setMenu(!menu);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    size="xl"
                    style={{ cursor: "pointer" }}
                  />
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hover:bg-button w-[120px] h-[40px] flex items-center text-[20px] justify-center bg-[#06243C]  text-white  rounded-[40px] "
                >
                  Log In
                </Link>
              )}
              <div className="">
                {menu && (
                  <div
                    className={`relative bg-white w-auto z-0  rounded-b-md top-7 right-1 md:right-1  transition-all duration-300 ease-in-out transform ${
                      menu
                        ? "translate-y-0 opacity-1"
                        : "traslate-y-4 opacity-0"
                    }`}
                    style={{ maxWidth: "1360px" }}
                  >
                    <ul className="absolute  space-y-2 right-0  text-center bg-white z-10">
                      <li className="p-1 px-5">
                        {" "}
                        <Link
                          to={
                            authUser?.clientId
                              ? "/clientdashboard"
                              : "/driverdashboard"
                          }
                          onClick={() => setMenu(!menu)}
                        >
                          Dashboard
                        </Link>
                      </li>
                      <hr />
                      <li>
                        {" "}
                        <Link
                          to={
                            authUser?.clientId
                              ? "/clientprofile"
                              : "/driverprofile"
                          }
                          onClick={() => setMenu(!menu)}
                        >
                          Profile
                        </Link>
                      </li>
                      <hr />
                      <li
                        className="cursor-pointer p-1"
                        onClick={() => {
                          setAuthUser(null);
                          localStorage.removeItem("authUser");
                          setMenu(!menu);
                          navigate("/");
                        }}
                      >
                        Sign Out
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
