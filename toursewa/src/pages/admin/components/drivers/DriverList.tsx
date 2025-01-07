import { useEffect, useState } from "react";
import { IDriver } from "../../../../SharedTypes/Drivers/Driver";
import { toast, ToastContainer } from "react-toastify";
import { URL } from "../../../../config/Config";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faTrash } from "@fortawesome/free-solid-svg-icons";
import { PageLoader } from "../../../../utils/PageLoader";
import { ButtonLoader } from "../../../../utils/ButtonLoader";

export const DriverList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isButton, setIsButton] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<IDriver[] | []>([]);
  const [driver, setDriver] = useState<IDriver[] | []>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch(`${URL}/api/getdrivers`);
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          setDriver(data);
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
    if (!driver) {
      setFilter([]);
      return;
    }
    const newSearch = search
      ? driver?.filter(
          (b) =>
            b.driverName?.toLowerCase().includes(search.toLowerCase()) ||
            b.driverEmail?.toLowerCase().includes(search.toLowerCase()) ||
            b.driverPhone?.includes(search) ||
            b.driverId?.toLowerCase().includes(search.toLowerCase())
        )
      : driver || [];
    setFilter(newSearch);
  }, [search, driver]);

  const Delete = async (id: string | undefined) => {
    try {
      const confirmed = window.confirm("Delete This Category");
      if (confirmed) {
        setIsButton(id || "");
        const response = await axios.delete(`${URL}/api/deletedriver/${id}`);
        const data = response.data;
        toast.success(data.message);
        setDriver(driver?.filter((i) => i._id !== id));
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
            <h1 className="md:text-3xl sm:text-lg font-bold">Driver List</h1>
            <p className="mt-2 text-xs md:text-lg">
              List of Drivers on Toursewa
            </p>
          </div>
          <Link
            to=""
            className="bg-button p-1 h-fit min-w-[85px] text-center max-w-[120px] text-xs hover:bg-[#06243C] text-white  rounded-md md:text-lg"
          >
            Add Driver
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
              {!Array.isArray(filter) || filter.length === 0 ? (
                <>
                  <p>Empty</p>
                </>
              ) : (
                <table className="table-auto border-collapse w-full border border-gray-500 text-xs md:text-lg ">
                  <thead className="bg-neutral-400 text-white">
                    <tr>
                      <th className="border font-normal border-gray-500 p-2">
                        SN
                      </th>
                      <th className="border font-normal border-gray-500 p-2">
                        ID
                      </th>
                      <th className="border font-normal border-gray-500 p-3">
                        Name
                      </th>
                      <th className="border font-normal  border-gray-500 p-3">
                        Email
                      </th>
                      <th className="border font-normal  border-gray-500 p-3">
                        Phone
                      </th>
                      <th className="border font-normal border-gray-500 p-3">
                        Vehicle Name
                      </th>
                      <th className="border font-normal border-gray-500 p-3">
                        Business Id
                      </th>
                      <th className="border font-normal border-gray-500 p-3">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-serif">
                    {filter?.map((teams, i) => (
                      <tr key={teams?._id}>
                        <td className="border border-gray-500 p-2 text-center">
                          {i + 1}
                        </td>
                        <td className="border border-gray-500 p-2 text-center">
                          {teams?.driverId}
                        </td>
                        <td className="border border-gray-500 p-2 text-center">
                          {teams?.driverName}
                        </td>
                        <td className="border  border-gray-500 p-2 text-center">
                          {teams?.driverEmail}
                        </td>
                        <td className="border  border-gray-500 text-center">
                          {teams?.driverPhone}
                        </td>
                        <td className="border border-gray-500 text-center">
                          {teams?.vehicleName}
                        </td>
                        <td className="border border-gray-500 text-center">
                          {teams?.businessId}
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
