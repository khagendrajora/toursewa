/* eslint-disable @typescript-eslint/no-explicit-any */
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import * as React from "react";
import { toast, ToastContainer } from "react-toastify";
import { IMAGE_URL } from "../../../../config/Config";
import { ButtonLoader } from "../../../../utils/ButtonLoader";
import { useNavigate, useParams } from "react-router-dom";
import { VCategory } from "../../../../SharedTypes/Category/vehicleCategory";
import { ILocation } from "../../../../SharedTypes/Locations/location";

export const UpdateVeh = () => {
  const [locations, setLocation] = React.useState<ILocation[]>([]);
  const [category, setCategory] = useState<VCategory[]>([]);
  const [filterVeh, setFilteredVeh] = React.useState<VCategory[]>([]);
  const navigate = useNavigate();
  const [isButton, setIsButton] = useState(false);
  const params = useParams();
  const [error, setError] = React.useState<boolean>(false);
  const id = params.id;
  const [vehId, setVehId] = useState("");
  const [vehCategory, setVehCategory] = useState("");
  const [vehSubCategory, setVehSubCategory] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [vehCondition, setVehCondition] = useState("");
  const [madeYear, setMadeYear] = useState("");
  const [vehNumber, setVehNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [name, setName] = useState("");
  const [baseLocation, setBaseLocation] = useState("");
  const [operationDates, setOperationDates] = React.useState<string[]>([]);
  const [vehImages, setVehImages] = React.useState<File[]>([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(
          `https://tourbackend-rdtk.onrender.com/api/getvehiclecategory`
        );
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          setCategory(data);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch(
          `https://tourbackend-rdtk.onrender.com/api/getlocation`
        );
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          setLocation(data);
        }
      } catch (error: any) {
        console.error(error);
      }
    };
    fetchLocation();
  }, []);

  React.useEffect(() => {
    const fetchVehCat = async () => {
      try {
        const filtered = category.filter((b) =>
          b.categoryName.toLowerCase().includes(vehCategory.toLowerCase())
        );
        if (filtered?.length === 0) {
          console.error("Error in vehicle category Name");
        } else {
          setFilteredVeh(filtered);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchVehCat();
  }, [vehCategory, category]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios
          .get(`https://tourbackend-rdtk.onrender.com/api/getvehdetails/${id}`)
          .then(async (res) => {
            setVehId(id || "");
            setVehCategory(res.data.vehCategory);
            setVehSubCategory(res.data.vehSubCategory);
            setServices(res.data.services);
            setAmenities(res.data.amenities);
            setVehCondition(res.data.vehCondition);
            setBaseLocation(res.data.baseLocation);
            setMadeYear(res.data.madeYear);
            setCapacity(res.data.capacity);
            setName(res.data.name);
            setVehNumber(res.data.vehNumber);
            setOperationDates(res.data.operationDates);
            setVehImages(res.data.vehImages);
          })
          .catch((error) => {
            toast.error(error);
          });
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchData();
  }, [id]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { value } = e.target;

    if (value) {
      setOperationDates((prevDates) => [...prevDates, value]);
    }
  };

  const removeDate = (index: number) => {
    setOperationDates((prevDates) => prevDates.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, files } = e.target;

    if (files && name === "vehImages") {
      const newFiles = Array.from(files);
      setVehImages((prevImg) => [...prevImg, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setVehImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const [servicesInput, setServiceInput] = useState("");
  const [amenitiesInput, setAmenitiesInputs] = useState("");

  const addService = () => {
    if (servicesInput.trim()) {
      setServices((prevData) => [...prevData, servicesInput]);
    }
  };

  const removeService = (index: number) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  const addAmenities = () => {
    if (amenitiesInput.trim()) {
      setAmenities((prevData) => [...prevData, amenitiesInput]);
    }
  };

  const removeAmenities = (index: number) => {
    setAmenities((prev) => prev.filter((_, i) => i !== index));
  };

  const validateVehNumber = (num: string): boolean => {
    const vehicleNumberPattern = /^[a-zA-Z]+ \d{1,4} [a-zA-Z]+ \d{1,4}$/;
    return vehicleNumberPattern.test(num);
  };
  const updateVeh = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateVehNumber(vehNumber)) {
      setError(true);
      return;
    }
    setIsButton(true);
    try {
      const formData = new FormData();
      formData.append("vehCategory", vehCategory);
      formData.append("vehSubCategory", vehSubCategory);
      formData.append("baseLocation", baseLocation);
      services.forEach((value) => {
        formData.append("services", value);
      });
      amenities.forEach((value) => {
        formData.append("amenities", value);
      });
      formData.append("vehCondition", vehCondition);
      formData.append("madeYear", madeYear);
      formData.append("capacity", capacity);
      formData.append("name", name);

      formData.append("vehNumber", vehNumber);
      operationDates.forEach((dates) => {
        formData.append("operationDates[]", dates);
      });

      vehImages.forEach((image) => {
        if (typeof image === "string") {
          formData.append("existingVehImages[]", image);
        } else if (image instanceof File) {
          formData.append("vehImages", image);
        }
      });
      // console.log(formData);
      const res = await fetch(
        `https://tourbackend-rdtk.onrender.com/api/updateveh/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

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
      setIsButton(false);
    }
  };

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="flex">
        <div className="w-full">
          <div className="flex flex-col">
            <div className="flex justify-between flex-wrap gap-y-5">
              <div className="text-black flex flex-col gap-1 ">
                <h1 className="font-bold text-center md:text-xl lg:text-2xl">
                  Update Vehicle Data
                </h1>{" "}
                <p>Update Vehicle Data</p>
              </div>

              <button
                onClick={() => navigate("/admin/vehicle")}
                className="bg-button p-1 px-2 h-fit min-w-[85px] text-center max-w-[120px] text-xs hover:bg-[#06243C] text-white  rounded-md md:text-lg"
              >
                Back to List
              </button>
            </div>

            <form
              onSubmit={updateVeh}
              className="flex flex-wrap justify-center  mt-10 md:mt-14 text-sm gap-y-5 gap-x-12"
            >
              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Vehicle Id</label>
                <input
                  type="text"
                  placeholder=""
                  className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                  required
                  readOnly
                  value={vehId}
                  name="vehId"
                  onChange={(e) => setVehId(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Product Category</label>
                <select
                  className="border border-gray-600 rounded-md ps-1 text-xs lg:text-lg cursor-pointer min-h-8 lg:min-h-10 shadow appearance-none"
                  required
                  value={vehCategory}
                  name="vehCategory"
                  onChange={(e) => setVehCategory(e.target.value)}
                >
                  <option value="" disabled>
                    Choose Categry
                  </option>
                  {category &&
                    category.map((data, i) => (
                      <option value={data.categoryName} key={i}>
                        {data.categoryName}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Sub Category</label>
                <select
                  className="border border-gray-600 rounded-md ps-1 text-xs lg:text-lg cursor-pointer min-h-8 lg:min-h-10 shadow appearance-none"
                  value={vehSubCategory}
                  name="vehSubCategory"
                  onChange={(e) => setVehSubCategory(e.target.value)}
                >
                  <option value="" disabled>
                    Choose Sub Category
                  </option>
                  {filterVeh &&
                    filterVeh.map(
                      (data, s) =>
                        data.subCategory &&
                        data.subCategory.map((sub) => (
                          <option key={s} value={sub}>
                            {sub}
                          </option>
                        ))
                    )}
                </select>
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm ">
                <label>Base Location</label>
                <select
                  name="Base Location"
                  className="border border-gray-600 rounded-md ps-1 text-xs lg:text-lg cursor-pointer min-h-8 lg:min-h-10 shadow appearance-none"
                  required
                  value={baseLocation}
                  onChange={(e) => setBaseLocation(e.target.value)}
                >
                  <option value="" disabled className="">
                    Base Location
                  </option>
                  {locations &&
                    locations.map((data, i) => (
                      <option value={data.fullLocation} key={i}>
                        {data.fullLocation}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Services</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Services"
                    className="border border-gray-600 rounded-md p-2 w-full text-xs md:text-lg "
                    name="services"
                    value={servicesInput}
                    onChange={(e) => setServiceInput(e.target.value)}
                  />
                  <div>
                    <button
                      type="button"
                      onClick={addService}
                      className="bg-button rounded-md p-1 text-lg hover:bg-orange-700 text-white"
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div className="flex ">
                  {services &&
                    services.map((services, i) => (
                      <div key={i}>
                        <FontAwesomeIcon
                          icon={faXmark}
                          color="red"
                          className="cursor-pointer"
                          onClick={() => removeService(i)}
                        />
                        <span className="me-5">{services}</span>
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex flex-col  sm:w-1/3  w-11/12 space-y-1">
                <label>Amenities</label>
                <div className="flex flex-row gap-x-2 items-center">
                  <input
                    type="text"
                    placeholder="Amenities"
                    className="border border-gray-600 rounded-md p-2 text-xs w-full  lg:text-lg"
                    name="amenities"
                    value={amenitiesInput}
                    onChange={(e) => setAmenitiesInputs(e.target.value)}
                  />

                  <div>
                    <button
                      type="button"
                      onClick={addAmenities}
                      className="bg-button rounded-md p-1 text-lg hover:bg-orange-700 text-white"
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div className="flex ">
                  {amenities &&
                    amenities.map((amenities, i) => (
                      <div key={i} className="">
                        <FontAwesomeIcon
                          icon={faXmark}
                          className="cursor-pointer"
                          color="red"
                          onClick={() => removeAmenities(i)}
                        />
                        <span className="me-5">{amenities}</span>
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Vehicle Condition</label>
                <select
                  className="border border-gray-600 rounded-md ps-1 text-xs lg:text-lg cursor-pointer min-h-8 lg:min-h-10 shadow appearance-none"
                  value={vehCondition}
                  name="vehCondition"
                  onChange={(e) => setVehCondition(e.target.value)}
                >
                  <option value="" disabled className="w-10">
                    Choose the condition
                  </option>
                  <option value="Good">Good</option>
                  <option value="Bad">Bad</option>
                </select>
              </div>
              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Made Year</label>
                <input
                  type="date"
                  // placeholder="abc"
                  className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                  value={madeYear.split("T")[0]}
                  name="madeYear"
                  onChange={(e) => setMadeYear(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Capacity</label>
                <input
                  type="number"
                  placeholder="Capacity"
                  className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                  required
                  value={capacity}
                  name="capacity"
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Vehicle Number</label>
                <input
                  type="text"
                  placeholder="Ba 02 pa 000"
                  className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                  value={vehNumber}
                  name="vehNumber"
                  onChange={(e) => setVehNumber(e.target.value)}
                />
                {error && (
                  <span className="text-xs text-red-500">
                    Invalid Vehicle Number Format
                  </span>
                )}
              </div>
              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Operational Dates</label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  onChange={handleDateChange}
                  className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                  multiple
                />
                <div className="flex flex-wrap gap-4">
                  {operationDates &&
                    operationDates.map((date, i) => (
                      <div key={i} className="space-x-1">
                        <FontAwesomeIcon
                          icon={faXmark}
                          className="cursor-pointer text-red-500"
                          onClick={() => removeDate(i)}
                        />
                        <span>{date.split("T")[0]}</span>
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <h1>Vehicle Images</h1>
                <input
                  type="file"
                  name="vehImages"
                  multiple
                  className="p-2 border border-gray-600 rounded-lg mb-2 items-center"
                  onChange={handleFileChange}
                />

                {vehImages &&
                  vehImages.map((image, i) => (
                    <div key={i}>
                      <FontAwesomeIcon
                        icon={faXmark}
                        onClick={() => removeImage(i)}
                      />
                      {typeof image === "string" ? (
                        <img
                          src={`${IMAGE_URL}/${image}`}
                          alt="gallery"
                          className="w-16"
                        />
                      ) : (
                        <img
                          src={URL.createObjectURL(image)}
                          alt="gallery"
                          className="w-16"
                        />
                      )}
                    </div>
                  ))}
              </div>
              <div className="flex justify-center  w-full">
                <button className=" rounded-lg p-3 w-3/4 md:w-1/3 text-sm text-white bg-button hover:bg-orange-700 ">
                  Update {isButton ? <ButtonLoader /> : ""}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
