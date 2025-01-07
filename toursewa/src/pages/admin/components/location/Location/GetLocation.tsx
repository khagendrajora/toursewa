import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faSpinner,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { ILocation } from "../../../../../SharedTypes/Locations/location";
import { URL } from "../../../../../config/Config";
import { ButtonLoader } from "../../../../../utils/ButtonLoader";

const GetLocation = () => {
  const [location, setLocation] = useState<ILocation[]>([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isButton, setIsButton] = useState<string | null>(null);
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${URL}/api/getlocation`);
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
        const response = await axios.delete(`${URL}/api/deletelocation/${id}`);
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
      <h1 className="text-3xl font-semibold">Locations</h1>
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
              to="/admin/locations/addlocation"
              className="bg-blue-400 p-2 rounded-md font-semibold"
            >
              Add Location
            </Link>
            <table className="table-auto w-11/12 border-collapse border border-slate-400 text-xs md:text-lg ">
              <thead>
                <tr>
                  <th className="border border-slate-400 p-3">SN</th>
                  {/* <th className="border border-slate-400 p-3">Country</th> */}
                  <th className="border border-slate-400 p-3">State</th>
                  <th className="border border-slate-400 p-3">Municipality</th>
                  <th className="border border-slate-400 p-3">Location</th>
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
                      {/* <td className="border border-slate-400 text-center">
                        {location.country}
                      </td> */}
                      <td className="border border-slate-400 p-3 text-center">
                        {location.state}
                      </td>
                      <td className="border relative border-slate-400 text-center">
                        {location.municipality}
                      </td>
                      <td className="border relative border-slate-400 text-center">
                        {location.locationName}
                      </td>

                      <td className="border border-slate-400 flex justify-evenly p-5 w-full">
                        <button
                          className="rounded-lg  p-2 mr-3"
                          onClick={() =>
                            navigate(
                              `/admin/locations/updatelocation/${location._id}`
                            )
                          }
                          title="Edit"
                        >
                          <FontAwesomeIcon
                            icon={faPenToSquare}
                            size="xl"
                            style={{ color: "#005af5" }}
                          />
                        </button>

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

export default GetLocation;
