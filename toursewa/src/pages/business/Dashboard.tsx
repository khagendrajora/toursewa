import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  return (
    <>
      <div className="p-4 flex flex-wrap scrollbar-hidden justify-evenly gap-10  ">
        <div className="bg-[#7dd3fc] w-11/12 sm:w-60 md:w-80 text-center text-white font-bold   rounded-md">
          <div className="flex flex-col justify-center p-5 ">
            <h2>Tour</h2>
          </div>
          <div className="mb-auto w-full bg-black/10">
            <Link to="/business/tour">
              More Info &nbsp;
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        </div>
        <div className="bg-[#f43f5e] w-11/12 sm:w-60 md:w-80 text-center text-white font-bold    rounded-md">
          <div className="flex flex-col justify-center p-5 ">
            <h2>Vehicles</h2>
          </div>
          <div className="mb-auto w-full bg-black/10 cursor-pointer">
            <Link to="/business/vehicle">
              More Info
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        </div>
        <div className="bg-[#3b82f6] w-11/12 sm:w-60 md:w-80 text-center text-white font-bold   rounded-md">
          <div className="flex flex-col justify-center p-5 ">
            <h2>Trek</h2>
          </div>
          <div className="mb-auto w-full bg-black/10 cursor-pointer">
            <Link to="/business/trek">
              More Info
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
