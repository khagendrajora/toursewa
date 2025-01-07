import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { URL } from "../../../../../config/Config";
import { ButtonLoader } from "../../../../../utils/ButtonLoader";
import { IMunicipality } from "../../../../../SharedTypes/Locations/municipality";
import { IState } from "../../../../../SharedTypes/Locations/state";
import { IDistrict } from "../../../../../SharedTypes/Locations/Districts";

const UpdateLocation = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [district, setDistrict] = useState("");
  const [geo, setGeo] = useState("");
  const [locationName, setLocationName] = useState("");
  const [isButton, setISButton] = useState(false);

  const [mun, setMun] = useState<IMunicipality[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [filterDistrict, setFilterDistrict] = useState<IDistrict[]>([]);
  const [filtermunicipality, setFilterMunicipality] = useState<IMunicipality[]>(
    []
  );

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${URL}/api/getmunicipality`);
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          setMun(data);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${URL}/api/getstate`);
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          setStates(data);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${URL}/api/getdistrict`);
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          setDistricts(data);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${URL}/api/getlocationdetails/${id}`);
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          setCountry(data.country);
          setState(data.state);
          setDistrict(data.district);
          setMunicipality(data.municipality);
          setLocationName(data.locationName);
          setGeo(data.geo);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchData();
  }, []);

  const update = async (e: React.FormEvent) => {
    e.preventDefault();
    setISButton(true);
    try {
      const payload = {
        country,
        district,
        municipality,
        state,
        geo,
        locationName,
      };

      const res = await fetch(`${URL}/api/updatelocation/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setISButton(false);
    }
  };

  useEffect(() => {
    const filtered = districts.filter((item) => item.state.includes(state));
    setFilterDistrict(filtered);
  }, [district, state]);

  useEffect(() => {
    const filtered = mun.filter((item) =>
      filterDistrict.some((i) => i.district === item.district)
    );
    setFilterMunicipality(filtered);
  }, [municipality, filterDistrict]);

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="flex bg-white p-1 ">
        <div className="md:p-5 w-full">
          <div className="flex flex-col  rounded-3xl">
            <div className="font-sans text-black text-start">
              <h1 className="font-bold text-center md:text-xl lg:text-2xl">
                Update Location
              </h1>
            </div>
            <form
              onSubmit={update}
              className="flex  flex-wrap justify-evenly  mt-4 md:mt-14 lg:text-lg  text-sm gap-y-5 gap-x-12 "
            >
              <div className="flex flex-col w-11/12 gap-8">
                <div className="flex flex-col md:w-3/4 lg:w-1/2   gap-y-3 md:gap-y-5">
                  <label>Country Name</label>
                  <input
                    type="text"
                    placeholder="Country"
                    className="border-4 rounded-md p-2 w-full text-xs md:text-2xl "
                    required
                    readOnly
                    value={country}
                    name="country"
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
                <div className="flex flex-col md:w-3/4 lg:w-1/2   gap-y-3 md:gap-y-5">
                  <label>State</label>
                  <select
                    className="border-4 rounded-md p-2 w-full text-xs md:text-2xl "
                    required
                    value={state}
                    name="state"
                    onChange={(e) => setState(e.target.value)}
                  >
                    <option value="" disabled>
                      Choose State
                    </option>
                    {states &&
                      states.map((item, i) => (
                        <option value={item.state} key={i}>
                          {item.state}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex flex-col md:w-3/4 lg:w-1/2   gap-y-3 md:gap-y-5">
                  <label>District</label>
                  <select
                    className="border-4 rounded-md p-2 w-full text-xs md:text-2xl "
                    required
                    value={district}
                    name="state"
                    onChange={(e) => setState(e.target.value)}
                  >
                    <option value="" disabled>
                      Choose District
                    </option>
                    {filterDistrict &&
                      filterDistrict.map((item, i) => (
                        <option value={item.district} key={i}>
                          {item.district}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex flex-col md:w-3/4 lg:w-1/2   gap-y-3 md:gap-y-5">
                  <label>Municipality</label>
                  <select
                    className="border-4 rounded-md p-2 w-full text-xs md:text-2xl "
                    required
                    value={municipality}
                    name="municipality"
                    onChange={(e) => setMunicipality(e.target.value)}
                  >
                    <option value="" disabled>
                      Choose Municipality
                    </option>
                    {filtermunicipality &&
                      filtermunicipality.map((item, i) => (
                        <option value={item.municipality} key={i}>
                          {item.municipality}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex flex-col md:w-3/4 lg:w-1/2   gap-y-3 md:gap-y-5">
                  <label>Locaton Name</label>
                  <input
                    type="text"
                    placeholder="Location"
                    className="border-4 rounded-md p-2 w-full text-xs md:text-2xl "
                    required
                    value={locationName}
                    name="locationName"
                    onChange={(e) => setLocationName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col md:w-3/4 lg:w-1/2   gap-y-3 md:gap-y-5">
                  <label>Geo Location</label>
                  <input
                    type="text"
                    placeholder="geo"
                    className="border-4 rounded-md p-2 w-full text-xs md:text-2xl "
                    required
                    value={geo}
                    name="geo"
                    onChange={(e) => setGeo(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-center w-full">
                <button className="w-1/4 rounded-lg p-3 text-sm text-white bg-blue-800 md:text-xl">
                  Submit {isButton ? <ButtonLoader /> : ""}
                </button>
              </div>
            </form>
            <div className="flex justify-center mt-4">
              <div className="flex gap-1">
                <button
                  onClick={() => navigate(-1)}
                  className="text-gray-500 text-end"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateLocation;
