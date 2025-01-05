/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { IAdminUser } from "./../../../../../../backend/src/models/adminUser";
import { toast, ToastContainer } from "react-toastify";
import { URL } from "../../../../config/Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faMagnifyingGlass, faTrash } from "@fortawesome/free-solid-svg-icons";
import { PageLoader } from "../../../../utils/PageLoader";
import axios from "axios";
import { ButtonLoader } from "../../../../utils/ButtonLoader";

export const Teams = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isButton, setIsButton] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<IAdminUser[] | null>([]);
  const [teams, setTeams] = useState<IAdminUser[] | []>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch(`${URL}/api/getadmin`);
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          setTeams(data);
        }
      } catch (error: any) {
        toast.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    if (!teams) {
      setFilter(null);
      return;
    }
    const newSearch = search
      ? teams?.filter(
          (b) =>
            b.adminName?.toLowerCase().includes(search.toLowerCase()) ||
            b.adminEmail?.toLowerCase().includes(search.toLowerCase()) ||
            b.adminId?.toLowerCase().includes(search.toLowerCase())
        )
      : teams;
    setFilter(newSearch);
  }, [search, teams]);

  const Delete = async (id: string | undefined) => {
    try {
      const confirmed = window.confirm("Delete Admin Account");
      if (confirmed) {
        setIsButton(id || "");
        const response = await axios.delete(`${URL}/api/deleteadmin/${id}`);
        const data = response.data;
        toast.success(data.message);
        setTeams(teams?.filter((i) => i._id !== id));
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsButton("");
    }
  };
  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="h-screen  flex flex-col gap-5">
        <div className="flex justify-between flex-wrap gap-y-5">
          <div>
            <h1 className="md:text-3xl sm:text-lg font-bold">Team List</h1>
            <p className="mt-2 text-xs md:text-lg">List of Teams on Toursewa</p>
          </div>
          <Link
            to="/admin/addadmin"
            className="bg-button p-1 h-fit min-w-[85px] text-center max-w-[120px] text-xs hover:bg-[#06243C] text-white  rounded-md md:text-lg"
          >
            Add Admin
          </Link>
        </div>
        <div className="flex mt-  justify-end">
          <div className="relative">
            <input
              type="text"
              value={search}
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-400  text-black rounded-md shadow-sm w-[130px] md:w-auto p-1 md:p-3 pl-7 md:pl-10"
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute text-gray-400 left-2 top-1/4 md:h-5 md:left-3 transform -trangray-y-1/2 text-black-500 pointer-events-none"
            />
          </div>
        </div>
        {isLoading ? (
          <PageLoader />
        ) : (
          <div className=" flex justify-center w-full items-center text-xs">
            <div className="overflow-x-auto  ">
              {!filter || Object.keys(filter).length === 0 ? (
                <>
                  <p>Empty</p>
                </>
              ) : (
                <table className="table-auto border-collapse w-full border border-gray-500 text-xs md:text-lg ">
                  <thead className="bg-neutral-400 text-white">
                    <tr>
                      <th className="border font-normal border-gray-500 p-2">
                        ID
                      </th>
                      <th className="border font-normal border-gray-500 p-3">
                        Admin Name
                      </th>
                      <th className="border font-normal  border-gray-500 p-3">
                        Email
                      </th>
                      <th className="border font-normal  border-gray-500 p-3">
                        Role
                      </th>
                      <th className="border font-normal border-gray-500 p-3">
                        Is Verified
                      </th>
                      <th className="border font-normal border-gray-500 p-3">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-serif">
                    {filter &&
                      filter.map((teams) => (
                        <tr key={teams?._id}>
                          <td className="border border-gray-500 p-2 text-center">
                            {teams?.adminId}
                          </td>
                          <td className="border border-gray-500 p-2 text-center">
                            {teams?.adminName}
                          </td>
                          <td className="border  border-gray-500 p-2 text-center">
                            {teams?.adminEmail}
                          </td>
                          <td className="border  border-gray-500 text-center">
                            {teams?.adminRole}
                          </td>
                          <td className="border border-gray-500 text-center">
                            {teams?.isVerified}
                          </td>
                          <td className="flex justify-between flex-col border gap-6  text-white p-2 ">
                            <div className="flex gap-5 md:gap-7">
                              <button onClick={() => Delete(teams?._id)}>
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  size="lg"
                                  className="hover:scale-110"
                                  style={{ color: "#ff0000" }}
                                />
                                {isButton === teams._id ? <ButtonLoader /> : ""}
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
