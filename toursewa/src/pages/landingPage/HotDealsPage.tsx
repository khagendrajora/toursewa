import { useEffect, useState } from "react";
import { IHotDeal } from "../../../../backend/src/models/HotDeals/HotDeals";
import { URL } from "../../config/Config";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

export const HotDealsPage = () => {
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  const [data, setData] = useState<IHotDeal[]>([]);

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
    capacity: string
  ) => {
    if (authUser) {
      navigate(`/reservationform/${id}`, {
        state: { startDate: date, name: name, capacity: capacity },
      });
    } else {
      navigate(`/login`);
    }
  };
  console.log(data);

  return (
    <>
      <div className="flex flex-col mt-4  bg-zinc-200 gap-3 p-2">
        <div className="flex">
          <h1 className="w-full text-button text-center font-bold text-lg">
            Hot Deal
          </h1>
          {/* <h1 className="min-w-24 text-sky-950 font-semibold cursor-pointer">
            View More:
          </h1> */}
        </div>
        <div className="flex flex-wrap justify-center gap-8 p-4 ">
          {data.length > 0 &&
            data.map((data, i) => (
              <div
                key={i}
                className="relative font-medium z-0 flex-shrink-0 w-11/12 space-y-2 sm:w-1/2 md:w-1/3 lg:w-1/4 text-sky-950 bg-white border p-5 border-slate-400 rounded-3xl"
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
                <div className="font-serif underline cursor-pointer">
                  Terms and conditions
                </div>
                <div>Operated by: {data.businessName}</div>
                <button
                  className="absolute font-normal bg-button text-white text-sm -bottom-[8px] z-10 left-1/2 transform -translate-x-1/2 text-center border border-slate-500 w-24 rounded-3xl"
                  onClick={
                    () =>
                      bookingForm(
                        data.vehicleId,
                        data.date,
                        data.vehicleName,
                        data.capacity
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
