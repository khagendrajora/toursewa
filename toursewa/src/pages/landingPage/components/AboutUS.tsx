/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { IHotDeal } from "../../../.../../SharedTypes/HotDeals/HotDeals";

import { URL } from "../../../config/Config";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const AboutUS = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthContext();
  const [data, setData] = useState<IHotDeal[]>([]);
  const [showTerm, setShowTerm] = useState<boolean>(false);
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`${URL}/api/gethotdeals`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.error);
        } else {
          setData(data);
        }
      } catch (error: any) {
        console.error(error);
      }
    };
    fetchCategory();
  }, []);

  const bookingForm = (
    id: string | "",
    date: Date,
    name: string,
    capacity: string,
    time: string,
    sourceAddress: string,
    destAddress: string
  ) => {
    if (authUser) {
      navigate(`/reservationform/${id}`, {
        state: {
          startDate: date,
          name: name,
          capacity: capacity,
          time: time,
          sourceAddress: sourceAddress,
          destinationAddress: destAddress,
        },
      });
    } else {
      navigate(`/login`);
    }
  };
  // console.log(data);
  return (
    <>
      <div
        className="flex flex-col mt-4 overflow-y-auto bg-zinc-200 gap-3 p-2"
        id="hotdeals"
      >
        <div className="flex justify-between">
          <h1 className="w-full text-button  font-bold text-lg">Hot Deal</h1>
          <Link
            to="/hotdeals"
            className="min-w-24 text-sky-950 font-semibold cursor-pointer hover:text-button"
          >
            View More:
          </Link>
        </div>
        <div className="flex  overflow-x-auto gap-4 p-4 ">
          {data.length > 0 &&
            data.map((data, i) => (
              <div
                key={i}
                className="relative font-medium z-0 flex-shrink-0 w-11/12 space-y-2 sm:w-1/2 md:w-1/3 lg:w-1/4 text-[#06243C] bg-white border p-5 border-slate-400 rounded-3xl"
              >
                <div className="absolute bg-white text-button font-semibold -top-[10px] z-10 left-1/2 transform -translate-x-1/2 text-center border border-slate-500 w-28 rounded-3xl">
                  Vehicle
                </div>
                <div className="font-bold text-lg">
                  {data.sourceAddress} to {data.destAddress}
                </div>
                <div>{data.vehicleName}</div>
                <div>Date: {data.date.toString().split("T")[0]}</div>
                <div>Rate: NPR {data.price}</div>
                <div
                  className="font-serif underline cursor-pointer"
                  onClick={() => setShowTerm(true)}
                >
                  Terms and conditions
                </div>

                {showTerm && (
                  <div className="fixed inset-1  flex items-center  overflow-x-auto  justify-center z-50">
                    <div className="bg-white  p-4 rounded overflow-x-auto shadow-md w-1/3 min-w-[300px]">
                      <div className="flex justify-between">
                        <h2 className="text-xl font-bold mb-4">
                          Add to Hot Deals
                        </h2>
                        <FontAwesomeIcon
                          icon={faXmark}
                          className="text-gray-400 cursor-pointer"
                          onClick={() => setShowTerm(false)}
                        />
                      </div>
                      <pre>{data.termsAndCondition}</pre>
                    </div>
                  </div>
                )}

                <div>Operated by: {data.businessName}</div>
                <button
                  className="absolute font-normal bg-button hover:bg-[#06243C] text-white text-sm -bottom-[8px] z-10 left-1/2 transform -translate-x-1/2 text-center border border-slate-500 w-24 rounded-3xl"
                  onClick={
                    () =>
                      bookingForm(
                        data.vehicleId,
                        data.date,
                        data.vehicleName,
                        data.capacity,
                        data.time,
                        data.sourceAddress,
                        data.destAddress
                      )

                    // navigate(`/reservationform/${data.vehicleId}`);
                  }
                >
                  Learn More
                </button>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default AboutUS;
