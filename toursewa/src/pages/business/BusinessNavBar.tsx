import { Link } from "react-router-dom";

export const BusinessNavBar = () => {
  return (
    <>
      <div
        className={`p-1 flex justify-center  transition-all shadow-sm duration-700 `}
      >
        <div className="flex w-full ">
          <div className="flex  w-full ms-10 md:ms-10 items-center  justify-between ">
            <Link to="/" className="p-3">
              Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
