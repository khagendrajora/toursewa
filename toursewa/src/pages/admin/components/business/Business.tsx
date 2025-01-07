/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { IBusiness } from "../../../../SharedTypes/business";
import { URL } from "../../../../config/Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleInfo,
  faCircleXmark,
  faMagnifyingGlass,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { PageLoader } from "../../../../utils/PageLoader";
import { ButtonLoader } from "../../../../utils/ButtonLoader";

export const Business = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<IBusiness[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [business, setBusiness] = useState<IBusiness[] | null>([]);
  const [isButton, setIsButton] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await fetch(`${URL}/api/getbusiness`);
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          setBusiness(data);
        }
      } catch (error: any) {
        toast.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBusiness();
  }, []);

  const update = async (id: string | undefined) => {
    try {
      const response = await axios.put(`${URL}/api/businessapprove/${id}`);
      const data = response.data;

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        setBusiness(
          (prevBusiness) =>
            prevBusiness?.map((business) =>
              business.bId === id
                ? { ...business, isActive: !business.isActive }
                : business
            ) || []
        );
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const Delete = async (id: string | undefined) => {
    try {
      const confirmed = window.confirm("Delete Business");
      if (confirmed) {
        setIsButton(id || "");
        const response = await axios.delete(`${URL}/api/deletebusiness/${id}`);
        const data = response.data;
        if (data.message) {
          toast.success(data.message);
          setBusiness(
            (prev) => prev?.filter((business) => business?._id != id) || []
          );
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
    if (!business) {
      setFilter(null);
      return;
    }
    const newSearch = search
      ? business?.filter(
          (b) =>
            b.businessName?.toLowerCase().includes(search.toLowerCase()) ||
            b.primaryEmail?.toLowerCase().includes(search.toLowerCase()) ||
            b.bId?.toLowerCase().includes(search.toLowerCase())
        )
      : business;
    setFilter(newSearch);
  }, [search, business]);

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="h-screen flex flex-col gap-5">
        <div className="flex justify-between flex-wrap gap-y-5">
          <div>
            <h1 className="md:text-3xl sm:text-lg font-bold">Business List</h1>
            <p className="mt-2 text-xs md:text-lg">
              List of Business on Toursewa
            </p>
          </div>
          <Link
            to="/admin/addbusiness"
            className="bg-button p-1 h-fit min-w-[85px] text-center max-w-[120px] text-xs hover:bg-[#06243C] text-white  rounded-md md:text-lg"
          >
            Add Business
          </Link>
        </div>
        <div className="flex mt-  justify-end">
          <div className="relative">
            <input
              type="text"
              value={search}
              placeholder="Search Business"
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-400  text-black rounded-md shadow-sm w-[130px] md:w-auto p-1 md:p-3 pl-7 md:pl-10"
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-2 text-gray-400 top-1/4 md:h-5 md:left-3 transform -trangray-y-1/2 text-black-500 pointer-events-none"
            />
          </div>
        </div>
        {isLoading ? (
          <PageLoader />
        ) : (
          <div className=" flex justify-center  items-center text-xs">
            <div className="overflow-x-auto  ">
              {!filter || Object.keys(filter).length === 0 ? (
                <>
                  <p>Empty</p>
                </>
              ) : (
                <table className="table-auto border-collapse  border border-gray-500 text-xs md:text-lg ">
                  <thead className="bg-neutral-400 text-white">
                    <tr>
                      <th className="border font-normal border-gray-500  ">
                        SN
                      </th>
                      <th className="border font-normal border-gray-500 ">
                        ID
                      </th>
                      <th className="border font-normal min-w-[160px] border-gray-500 p-1">
                        Business Name
                      </th>
                      <th className="border font-normal  border-gray-500 p-2">
                        Category
                      </th>
                      <th className="border font-normal border-gray-500  p-2">
                        Primary Email
                      </th>
                      <th className="border font-normal  border-gray-500 p-2">
                        Is Active
                      </th>
                      <th className="border font-normal border-gray-500 p-2">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="">
                    {filter.map((business, i) => (
                      <tr key={business?._id} className="">
                        <td className="border font-normal border-gray-500 text-center p-2">
                          {i + 1}
                        </td>
                        <td className="border font-normal border-gray-500 text-center p-2">
                          {business?.bId}
                        </td>
                        <td className="border border-gray-500 text-center p-2">
                          {business?.businessName}
                        </td>
                        <td className="border  border-gray-500 text-center p-2">
                          {business?.businessCategory}
                        </td>

                        <td className=" border border-gray-500 text-center p-2">
                          {business?.primaryEmail}
                        </td>

                        <td className="border border-gray-500 min-w-[98px] text-center p-2">
                          {business?.isActive ? "Yes" : "No"}
                        </td>
                        <td className="flex justify-between flex-col border gap-6 border-b-0 text-white p-2 ">
                          <div className="flex gap-5 md:gap-7">
                            <Link
                              to={`/admin/business/businessprofile/${business._id}`}
                              className="hover:scale-110"
                              title="Full Info"
                            >
                              <FontAwesomeIcon
                                icon={faCircleInfo}
                                size="lg"
                                style={{ color: "#06d01e" }}
                              />
                            </Link>

                            <button
                              className={`hover:scale-110`}
                              onClick={() => update(business?.bId)}
                              title={`${
                                business?.isActive ? "Deactivate" : "Activate"
                              }`}
                            >
                              {business.isActive ? (
                                <FontAwesomeIcon
                                  icon={faCircleXmark}
                                  size="lg"
                                  style={{ color: "#e60505" }}
                                />
                              ) : (
                                <FontAwesomeIcon
                                  icon={faCircleCheck}
                                  size="lg"
                                  style={{ color: "#36fa00" }}
                                />
                              )}
                            </button>

                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/business/updatebusiness/${business._id}`
                                )
                              }
                              className="hover:scale-110"
                              title="Edit"
                            >
                              <FontAwesomeIcon
                                icon={faPenToSquare}
                                size="lg"
                                style={{ color: "#005af5" }}
                              />
                            </button>

                            <button
                              onClick={() => Delete(business?._id)}
                              className="hover:scale-110"
                              title="Delete"
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                size="lg"
                                style={{ color: "#ff0000" }}
                              />
                              {isButton === business._id ? (
                                <ButtonLoader />
                              ) : (
                                ""
                              )}
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
