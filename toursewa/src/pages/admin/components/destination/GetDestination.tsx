/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { IDest } from "./../../../../../../backend/src/models/Pages/LandingPage/Destination";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { IMAGE_URL, URL } from "../../../../config/Config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ButtonLoader } from "../../../../utils/ButtonLoader";
import { PageLoader } from "../../../../utils/PageLoader";

export const GetDestination = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<IDest[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<IDest[]>([]);
  const [isButton, setIsButton] = useState<string>("");

  useEffect(() => {
    const fetchDest = async () => {
      try {
        const res = await fetch(`${URL}/api/getDest`);
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          setData(data);
        }
      } catch (error: any) {
        toast.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDest();
  }, []);

  const Delete = async (id: string | undefined) => {
    try {
      const confirmed = window.confirm("Delete");
      if (confirmed) {
        setIsButton(id || "");
        const response = await axios.delete(`${URL}/api/deletedest/${id}`);
        const data = response.data;
        if (data.message) {
          toast.success(data.message);
          setData((prevData) => prevData.filter((item) => item._id != id));
        } else if (data.error) {
          toast.error(data.error);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsButton("");
    }
  };

  useEffect(() => {
    if (!data) {
      setFilter(null);
      return;
    }
    const newSearch = search
      ? data?.filter((b) =>
          b.title?.toLowerCase().includes(search.toLowerCase())
        )
      : data;
    setFilter(newSearch);
  }, [search, data]);
  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="h-screen  flex flex-col gap-5">
        <div className="flex justify-between flex-wrap gap-y-5">
          <div>
            <h1 className="md:text-3xl sm:text-lg font-bold">
              Destination List
            </h1>
            <p className="mt-2 text-xs md:text-lg">
              List of Destinations on Toursewa
            </p>
          </div>
          <Link
            to="/admin/destination/adddestinations"
            className="bg-button p-1 h-fit min-w-[85px] text-center max-w-[185px] text-xs hover:bg-[#06243C] text-white  rounded-md md:text-lg"
          >
            Add Destination
          </Link>
        </div>
        <div className="flex mt-  justify-end">
          <div className="relative">
            <input
              type="text"
              value={search}
              placeholder="Search Destination"
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-400   text-black rounded-md shadow-sm w-[137px] md:w-auto p-1 md:p-3 pl-7 md:pl-10"
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-2 text-gray-400 top-1/2 md:h-5 md:left-3 transform -translate-y-1/2 text-black-500 pointer-events-none"
            />
          </div>
        </div>
        {isLoading ? (
          <PageLoader />
        ) : (
          <div className=" flex justify-center w-full items-center text-xs">
            <div className="overflow-x-auto space-y-5 ">
              {!filter || Object.keys(filter).length === 0 ? (
                <>
                  <p>Empty</p>
                </>
              ) : (
                <table className="table-auto border-collapse w-full  border border-gray-500 text-xs md:text-lg ">
                  <thead className="bg-neutral-400 text-white">
                    <tr className="">
                      <th className="border font-normal border-gray-500 p-3">
                        SN
                      </th>
                      <th className="border font-normal border-gray-500 p-3">
                        Title
                      </th>
                      <th className="border font-normal border-gray-500 p-3">
                        Images
                      </th>

                      <th className="border font-normal border-gray-500 p-3">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {filter?.map((data, i) => (
                      <tr key={data._id}>
                        <td className="border border-gray-500 p-1">{i + 1}</td>
                        <td className="border border-gray-500 p-1">
                          {data.title}
                        </td>
                        <td className="border border-gray-500 p-1">
                          {data.destImage &&
                            data.destImage.map((image, i) => (
                              <img
                                key={i}
                                src={`${IMAGE_URL}/${image}`}
                                className="rounded-md w-full  "
                              />
                            ))}
                        </td>

                        <td className="flex justify-between flex-col border gap-6  text-white p-2 ">
                          <div className="flex gap-7 md:gap-10">
                            <button
                              className="hover:scale-110"
                              onClick={() =>
                                navigate(
                                  `/admin/updatedestination/${data.destId}`
                                )
                              }
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

                            <button onClick={() => Delete(data?._id)}>
                              <FontAwesomeIcon
                                size="lg"
                                icon={faTrash}
                                className="hover:scale-110"
                                style={{ color: "#e00606", cursor: "pointer" }}
                              />
                              {isButton === data._id ? <ButtonLoader /> : ""}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
