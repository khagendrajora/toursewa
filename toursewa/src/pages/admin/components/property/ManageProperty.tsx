/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { IProperty } from "../../../../../../backend/src/models/property";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faMagnifyingGlass,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { URL } from "../../../../config/Config";

import { PageLoader } from "../../../../utils/PageLoader";
import { ButtonLoader } from "../../../../utils/ButtonLoader";

export const ManageProperty = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<IProperty[] | null>([]);
  const navigate = useNavigate();
  const [isButton, setIsButton] = useState<string | null>(null);
  const [property, setProperty] = useState<IProperty[] | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(
          "https://tourbackend-rdtk.onrender.com/api/getproperty"
        );
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          setProperty(data);
        }
      } catch (error: any) {
        toast.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategory();
  }, []);

  const Delete = async (id: string | undefined) => {
    try {
      const confirmed = window.confirm("Delete Property");
      setIsButton(id || "");
      if (confirmed) {
        const response = await axios.delete(`${URL}/api/deleteproperty/${id}`);
        const data = response.data;
        if (data.message) {
          toast.success(data.message);
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
    if (!property) {
      setFilter(null);
      return;
    }
    const newSearch = search
      ? property?.filter(
          (b) =>
            b.propName?.toLowerCase().includes(search.toLowerCase()) ||
            b.email?.toLowerCase().includes(search.toLowerCase()) ||
            b.phone?.toString().includes(search.toLowerCase())
        )
      : property;
    setFilter(newSearch);
  }, [search, property]);

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="h-screen  flex flex-col gap-5">
        <div className="flex justify-between flex-wrap gap-y-5">
          <div>
            <h1 className="md:text-3xl sm:text-lg font-bold">Property List</h1>
            <p className="mt-2 text-xs md:text-lg">
              List of Property on Toursewa
            </p>
          </div>
          <Link
            to="/admin/property/addproperty"
            className="bg-button p-1 h-fit min-w-[85px] text-center max-w-[120px] text-xs hover:bg-[#06243C] text-white  rounded-md md:text-lg"
          >
            Add Property
          </Link>
        </div>
        <div className="flex mt-  justify-end">
          <div className="relative">
            <input
              type="text"
              value={search}
              placeholder="Search Property"
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
                      <th className="border font-normal border-slate-400 p-1">
                        ID
                      </th>
                      <th className="border font-normal border-slate-400 p-1">
                        Property Name
                      </th>
                      <th className="border font-normal  border-slate-400 p-1">
                        Category
                      </th>
                      {/* <th className="border font-normal  border-slate-400 p-1">
                        Sub Category
                      </th> */}
                      <th className="border font-normal  border-slate-400 p-1">
                        Address
                      </th>
                      <th className="border font-normal  border-slate-400 p-1">
                        Email
                      </th>
                      <th className="border font-normal  border-slate-400 p-1">
                        Website
                      </th>
                      <th className="border font-normal  border-slate-400 p-1">
                        Phone
                      </th>
                      {/* <th className="border font-normal  border-slate-400 p-1">
                        Business Registration
                      </th>
                      <th className="border font-normal  border-slate-400 p-1">Tax</th> */}
                      <th className="border font-normal border-slate-400 p-1">
                        Contact Name
                      </th>
                      <th className="border font-normal border-slate-400 p-1">
                        Contact Phone
                      </th>
                      {/* <th className="border font-normal border-slate-400  p-1">
                        Date of Establishment
                      </th> */}
                      <th className="border font-normal border-slate-400 p-1">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-serif">
                    {filter &&
                      filter.map((property) => (
                        <tr key={property?._id}>
                          <td className="border border-slate-400 text-center"></td>
                          <td className="border border-slate-400 text-center">
                            {property?.propName}
                          </td>
                          <td className="border  border-slate-400 text-center">
                            {property?.propCategory}
                          </td>
                          {/* <td className="border  border-slate-400 text-center">
                            {property?.propSubCategory}
                          </td> */}
                          <td className="border border-slate-400 text-center">
                            {property?.address.country}
                          </td>
                          <td className="border border-slate-400 text-center">
                            {property?.address.state}
                          </td>
                          {/* 
                          <td className="border border-slate-400 text-center">
                            {property?.address.district}
                          </td> */}

                          {/* <td className="border border-slate-400 text-center">
                            {property?.address.municipality}
                          </td> */}
                          {/* 
                          <td className="border border-slate-400 text-center">
                            {property?.address.street}
                          </td>
                          <td className="border border-slate-400 text-center">
                            {property?.address.subrub}
                          </td> */}

                          {/* <td className="border border-slate-400 text-center">
                            {property?.address.postcode}
                          </td> */}

                          <td className="border border-slate-400 text-center">
                            {property?.email}
                          </td>
                          <td className="border border-slate-400 text-center">
                            {property?.website}
                          </td>
                          <td className="border border-slate-400 text-center">
                            {property?.phone}
                          </td>
                          {/* <td className="border border-slate-400 text-center">
                            {property?.businessReg}
                          </td>
                          <td className="border border-slate-400 text-center">
                            {property?.tax}
                          </td> */}
                          <td className="border border-slate-400 text-center">
                            {property?.contactName}
                          </td>
                          <td className="border border-slate-400 text-center">
                            {property?.contactPhone}
                          </td>
                          <td className="border border-slate-400 text-center">
                            {property?.dateOfEstab.toString()}
                          </td>

                          <td className="flex justify-between flex-col border gap-6  text-white p-2 ">
                            <div className="flex gap-5 md:gap-7">
                              <Link
                                to={`/admin/property/propertydetail/${property._id}`}
                                className="hover:scale-110"
                                title="Full Info"
                              >
                                <FontAwesomeIcon
                                  icon={faCircleInfo}
                                  size="lg"
                                  style={{ color: "#06d01e" }}
                                />
                              </Link>

                              {/* <button
                                className={`hover:scale-110`}
                                onClick={() => update(property?.bId)}
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
                              </button> */}

                              <button
                                onClick={() =>
                                  navigate(
                                    `/admin/property/updateproperty/${property._id}`
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

                              <button onClick={() => Delete(property?._id)}>
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  size="lg"
                                  className="hover:scale-110"
                                  style={{ color: "#ff0000" }}
                                />
                                {isButton === property._id ? (
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
