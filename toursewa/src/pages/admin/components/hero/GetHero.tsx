/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { IHero } from "./../../../../SharedTypes/Pages/LandingPage/Hero";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { IMAGE_URL, URL } from "../../../../config/Config";
import { PageLoader } from "../../../../utils/PageLoader";
import { useNavigate } from "react-router-dom";

const GetHero = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hero, setHero] = useState<IHero[]>([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`${URL}/api/gethero`);
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          setHero(data);
          setIsLoading(false);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchCategory();
  }, []);

  // const Update = async (id: string | undefined) => {
  //   try {
  //     const confirm = window.confirm("Delete and Save the Changes");
  //     if (confirm) {
  //       const res = await fetch(
  //         `https://tourbackend-rdtk.onrender.com/api/deletehero/${id}`
  //       );

  //       const data = await res.json();
  //       if (!res.ok) {
  //         toast.error(data.error);
  //       } else {
  //         toast.success(data.message);
  //         setHero((prev) => prev.filter((i) => i._id != id));
  //       }
  //     }
  //   } catch (error: any) {
  //     toast.error(error.message);
  //   }
  // };
  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="w-11/12 flex flex-col gap-5">
        <div className="flex justify-between flex-wrap gap-y-5">
          <div>
            <h1 className="md:text-3xl sm:text-lg font-bold">
              Dashboard Details
            </h1>
          </div>
        </div>
        {isLoading ? (
          <PageLoader />
        ) : hero.length > 0 ? (
          <div className=" flex justify-center w-full items-center text-xs">
            <div className="overflow-x-auto space-y-5 ">
              <table className="table-auto border-collapse w-full  border border-gray-500 text-xs md:text-lg ">
                <thead className="bg-neutral-400 text-white">
                  <tr className="">
                    <th className="border font-normal border-gray-500 p-3">
                      Heading
                    </th>
                    <th className="border font-normal border-gray-500 p-3">
                      Description
                    </th>
                    <th className="border font-normal border-gray-500 p-3">
                      Image
                    </th>

                    <th className="border font-normal border-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {hero.map((data, i) => (
                    <tr key={i} className="h-full">
                      <td className="border font-normal border-gray-500 p-3">
                        {data.heading}
                      </td>
                      <td className="border font-normal border-gray-500 p-3">
                        {data.description}
                      </td>

                      <td className="border font-normal border-gray-500 p-3 ">
                        {data.heroImage &&
                          data.heroImage.map((image, idx) => (
                            <img key={idx} src={`${IMAGE_URL}/${image}`} />
                          ))}
                      </td>
                      <td className="flex justify-between flex-col border gap-6  text-white p-3">
                        <button
                          onClick={() =>
                            navigate(`/admin/updatehero/${data._id}`)
                          }
                          className="hover:scale-110 "
                        >
                          <FontAwesomeIcon
                            icon={faPenToSquare}
                            size="lg"
                            style={{
                              color: "#4a09e1",
                              cursor: "pointer",
                            }}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p>Empty</p>
        )}
      </div>
    </>
  );
};

export default GetHero;
