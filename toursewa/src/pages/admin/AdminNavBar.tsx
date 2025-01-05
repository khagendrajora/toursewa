import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { useState } from "react";

export const AdminNavBar = () => {
  const { setAuthUser } = useAuthContext();
  const [showUserMenu, setShowUSerMenu] = useState<boolean>(false);
  return (
    <>
      <div
        className={`p-1 flex justify-center  border transition-all duration-700 max-w-[1360px] xml:relative`}
      >
        <div className="flex w-full ">
          <div className="flex  w-full ms-10 md:ms-5 items-center justify-between ">
            <Link to="/" className="p-3">
              Home
            </Link>

            <div className="p-3">
              <ul className=" flex flex-col   items-center">
                <FontAwesomeIcon
                  size="2xl"
                  icon={faUser}
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setShowUSerMenu(!showUserMenu);
                  }}
                />
                <li className="hidden md:block">TourSewa</li>
              </ul>
              {showUserMenu && (
                <div className="relative text-xs min-w-[40px]  z-10 shadow-lg border rounded-sm">
                  <ul className="absolute bg-white  min-w-[80px] right-1   z-0">
                    <li
                      className="p-2  cursor-pointer text-center hover:text-button"
                      onClick={() => {
                        localStorage.removeItem("authUser");
                        setAuthUser(null);
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
    </>
  );
};
