import { faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ButtonLoader } from "../../../../../utils/ButtonLoader";
import { URL } from "../../../../../config/Config";
import axios from "axios";
import { IDistrict } from "../../../../../SharedTypes/Locations/Districts";

export const DistrictList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isButton, setIsButton] = useState<string | null>(null);
  const [location, setLocation] = useState<IDistrict[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${URL}/api/getdistrict`);
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          setLocation(data);
        }
      } catch (error: any) {
        toast.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const Delete = async (id: string | undefined) => {
    try {
      const confirmed = window.confirm("Delete Location");
      if (confirmed) {
        setIsButton(id || "");
        const response = await axios.delete(`${URL}/api/deletedistrict/${id}`);
        const data = response.data;
        toast.success(data.message);
        setLocation(location?.filter((i) => i._id !== id));
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
      <h1 className="text-3xl font-semibold">Districts</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-44">
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            size="2xl"
            style={{ color: "#011def" }}
          />
          <p>Loading....</p>
        </div>
      ) : (
        <div className=" flex justify-center items-center text-xs">
          <div className="overflow-x-auto space-y-5 md:m-5 w-full p-3 ">
            <Link
              to="/admin/district/adddistrict"
              className="bg-blue-400 p-2 rounded-md font-semibold"
            >
              Add District
            </Link>
            <table className="table-auto w-11/12 border-collapse border border-slate-400 text-xs md:text-lg ">
              <thead>
                <tr>
                  <th className="border border-slate-400 p-3">SN</th>

                  <th className="border border-slate-400 p-3">State</th>
                  <th className="border border-slate-400 p-3">District</th>

                  <th className="border border-slate-400 p-3">Action</th>
                </tr>
              </thead>

              <tbody className="font-serif">
                {location &&
                  location.map((location, i) => (
                    <tr key={location._id}>
                      <td className="border border-slate-400 text-center">
                        {i + 1}
                      </td>

                      <td className="border border-slate-400 p-3 text-center">
                        {location.state.toUpperCase()}
                      </td>
                      <td className="border relative border-slate-400 text-center">
                        {location.district.toUpperCase()}
                      </td>

                      <td className="border border-slate-400 flex justify-evenly p-5 w-full">
                        <button
                          className=" rounded-lg  p-2"
                          onClick={() => Delete(location._id)}
                          title="Delete"
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            size="xl"
                            style={{ color: "#ff0000" }}
                            title="Delete"
                          />
                          {isButton === location._id ? <ButtonLoader /> : ""}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};
