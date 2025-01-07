/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import * as React from "react";
import { useAuthContext } from "../../../context/AuthContext";
import ReactImageUploading, { ImageListType } from "react-images-uploading";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { CloudUploadOutlined } from "@ant-design/icons";
import { ButtonLoader } from "../../../utils/ButtonLoader";
import { useNavigate } from "react-router-dom";
import { VCategory } from "../../../.../../SharedTypes/Category/vehicleCategory";
import { URL } from "../../../config/Config";
import { ILocation } from "../../../.../../SharedTypes/Locations/location";
import JoditEditor from "jodit-react";

export const AddVehicle = () => {
  const editor = React.useRef(null);
  const navigate = useNavigate();
  const { authUser } = useAuthContext();
  const [isButton, setIsButton] = useState(false);
  const id = authUser?.bId;
  const [error, setError] = React.useState<boolean>(false);
  const [vehCat, setVehCat] = React.useState<VCategory[]>([]);
  const [vehImages, setVehImages] = React.useState<ImageListType>([]);
  const [filterVeh, setFilteredVeh] = React.useState<VCategory[]>([]);
  const [locations, setLocation] = React.useState<ILocation[]>([]);
  const [inputs, setInputs] = useState<{
    vehCategory: string;
    vehSubCategory: string;
    services: string[];
    amenities: string[];
    vehCondition: string;
    madeYear: string;
    description: string;
    vehNumber: string;
    capacity: number | null;
    name: string;
    operationDates: DateObject[];
    baseLocation: string;
    manufacturer: string;
    model: string;
    VIN: string;
  }>({
    vehCategory: "",
    vehSubCategory: "",
    services: [],
    amenities: [],
    vehCondition: "",
    description: "",
    madeYear: "",
    vehNumber: "",
    baseLocation: "",
    capacity: null,
    name: "",
    operationDates: [],
    manufacturer: "",
    model: "",
    VIN: "",
  });

  const [servicesInput, setServiceInput] = useState("");
  const [amenitiesInput, setAmenitiesInputs] = useState("");

  React.useEffect(() => {
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
        console.error(error);
      }
    };
    fetchLocations();
  }, []);

  React.useEffect(() => {
    const fetchVehicleCat = async () => {
      try {
        const res = await fetch(`${URL}/api/getvehiclecategory`);
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          setVehCat(data);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchVehicleCat();
  }, []);

  React.useEffect(() => {
    const fetchVehCat = async () => {
      try {
        const filtered = vehCat.filter((b) =>
          b.categoryName
            .toLowerCase()
            .includes(inputs.vehCategory.toLowerCase())
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
  }, [inputs.vehCategory, vehCat]);

  const addService = () => {
    if (servicesInput.trim()) {
      setInputs((prev) => ({
        ...prev,
        services: [...prev.services, servicesInput],
      }));
    }
    setServiceInput("");
  };

  const removeServices = (index: number) => {
    setInputs((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const addAmenities = () => {
    if (amenitiesInput.trim()) {
      setInputs((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenitiesInput],
      }));
    }
    setAmenitiesInputs("");
  };

  const removeAmenities = (index: number) => {
    setInputs((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const onImageGallaryChange = async (imageList: ImageListType) => {
    setVehImages(imageList);
  };

  React.useEffect(() => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      name: `${prevInputs.manufacturer} ${prevInputs.model} ${
        prevInputs.madeYear.split(" ")[0]
      }`,
    }));
  }, [inputs.manufacturer, inputs.model]);

  const config = React.useMemo(
    () => ({
      height: 400,
      toolbarSticky: false,
    }),
    []
  );

  const validateVehNumber = (num: string): boolean => {
    const vehicleNumberPattern = /^[a-zA-Z]+ \d{1,4} [a-zA-Z]+ \d{1,4}$/;
    return vehicleNumberPattern.test(num);
  };

  const addVeh = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateVehNumber(inputs.vehNumber)) {
      setError(true);
      return;
    }
    setIsButton(true);
    const formData = new FormData();
    formData.append("businessId", id || "");
    formData.append("businessName", authUser?.businessName || "");
    formData.append("vehCategory", inputs.vehCategory.toString());
    formData.append("vehSubCategory", inputs.vehSubCategory);

    inputs.services.forEach((value) => {
      formData.append("services", value);
    });

    inputs.amenities.forEach((value) => {
      formData.append("amenities", value);
    });

    formData.append("vehCondition", inputs.vehCondition);
    formData.append("description", inputs.description);
    formData.append("vehNumber", inputs.vehNumber);
    formData.append("madeYear", inputs.madeYear);
    formData.append("baseLocation", inputs.baseLocation);
    formData.append("VIN", inputs.VIN);
    formData.append("model", inputs.model);
    formData.append("manufacturer", inputs.manufacturer);

    formData.append(
      "capacity",
      inputs.capacity !== null ? inputs.capacity.toString() : ""
    );
    formData.append("name", inputs.name);
    inputs.operationDates.map((date) => {
      const formattedDate = date.format("YYYY/MM/DD");
      formData.append("operationDates", formattedDate);
    });

    vehImages.forEach((image) => {
      formData.append(`vehImages`, image.file as File);
    });
    try {
      const res = await fetch(
        "https://tourbackend-rdtk.onrender.com/api/addveh",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        setInputs({
          vehCategory: "",
          vehSubCategory: "",
          services: [],
          amenities: [],
          vehCondition: "",
          description: "",
          madeYear: "",
          vehNumber: "",
          baseLocation: "",
          capacity: null,
          name: "",
          operationDates: [],
          manufacturer: "",
          model: "",
          VIN: "",
        });
        setVehImages([]);
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
            <div className="flex justify-between">
              <div className="text-black flex flex-col gap-1 ">
                <h1 className="font-bold text-xl lg:text-2xl">Add Vehicle</h1>
                <p>Add a Vehicle on Toursewa</p>
              </div>

              <button
                onClick={() => navigate("/business/vehicle")}
                className="bg-button p-1 px-2 h-fit min-w-[85px] text-center max-w-[120px] text-xs hover:bg-[#06243C] text-white  rounded-md md:text-lg"
              >
                Back to List
              </button>
            </div>
            <form
              onSubmit={addVeh}
              className="flex flex-wrap justify-center  mt-10 md:mt-14 text-sm gap-y-5 gap-x-12"
            >
              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Vehicle Category</label>
                <select
                  name="vehicleCategory"
                  className="border border-gray-600 rounded-md ps-1 text-xs lg:text-lg cursor-pointer min-h-8 lg:min-h-10 shadow appearance-none"
                  required
                  value={inputs.vehCategory}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      vehCategory: e.target.value,
                    })
                  }
                >
                  <option value="" disabled className="">
                    Choose the vehicle Type
                  </option>
                  {vehCat &&
                    vehCat.map((data, i) => (
                      <option value={data.categoryName} key={i}>
                        {data.categoryName}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Vehicle Sub Category</label>
                <select
                  className="border border-gray-600 rounded-md ps-1 text-xs lg:text-lg cursor-pointer min-h-8 lg:min-h-10 shadow appearance-none"
                  value={inputs.vehSubCategory}
                  onChange={(e) =>
                    setInputs({ ...inputs, vehSubCategory: e.target.value })
                  }
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
                <label>Manufacturer</label>
                <input
                  type="text"
                  placeholder="Manufacturer"
                  className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                  value={inputs.manufacturer}
                  onChange={(e) =>
                    setInputs({ ...inputs, manufacturer: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm ">
                <label>Model</label>
                <input
                  type="text"
                  placeholder="Model"
                  className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                  value={inputs.model}
                  onChange={(e) =>
                    setInputs({ ...inputs, model: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm ">
                <label>VIN</label>
                <input
                  type="text"
                  placeholder="VIN"
                  className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                  value={inputs.VIN}
                  onChange={(e) =>
                    setInputs({ ...inputs, VIN: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Base Location</label>
                <select
                  name="Base Location"
                  className="border border-gray-600 rounded-md ps-1 text-xs lg:text-lg cursor-pointer min-h-8 lg:min-h-10 shadow appearance-none"
                  required
                  value={inputs.baseLocation}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      baseLocation: e.target.value,
                    })
                  }
                >
                  <option value="" disabled className="">
                    Choose the vehicle Type
                  </option>
                  {locations &&
                    locations.map((data, i) => (
                      <option value={data.fullLocation} key={i}>
                        {data.fullLocation}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm ">
                <label>Services</label>
                <div className="flex flex-row gap-x-2 items-center">
                  <input
                    type="text"
                    placeholder="Services"
                    className="border border-gray-600 rounded-md p-2 text-xs w-full  lg:text-lg"
                    value={servicesInput}
                    onChange={(e) => setServiceInput(e.target.value)}
                  />
                  {servicesInput.length > 0 ? (
                    <div>
                      <button
                        type="button"
                        onClick={addService}
                        className="bg-button rounded-md p-1 text-lg hover:bg-orange-700 text-white"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {inputs.services.map((item, index) => (
                  <div key={index} className="flex items-center gap-x-2">
                    <FontAwesomeIcon
                      icon={faXmark}
                      className="cursor-pointer text-rose-600"
                      onClick={() => removeServices(index)}
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col  sm:w-1/3  w-11/12 space-y-1">
                <label>Amenities</label>
                <div className="flex flex-row gap-x-2 items-center">
                  <input
                    type="text"
                    placeholder="Amenities"
                    className="border border-gray-600 rounded-md p-2 text-xs w-full  lg:text-lg"
                    value={amenitiesInput}
                    onChange={(e) => setAmenitiesInputs(e.target.value)}
                  />
                  {amenitiesInput.length >> 0 ? (
                    <div>
                      <button
                        type="button"
                        onClick={addAmenities}
                        className="bg-button rounded-md p-1 text-lg hover:bg-orange-700 text-white"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {inputs.amenities.map((item, index) => (
                  <div key={index} className="flex items-center gap-x-2">
                    <FontAwesomeIcon
                      icon={faXmark}
                      className="cursor-pointer text-rose-600"
                      onClick={() => removeAmenities(index)}
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Vehicle Condition</label>
                <select
                  name="vehCondition"
                  className="border border-gray-600 rounded-md ps-1 text-xs lg:text-lg cursor-pointer min-h-8 lg:min-h-10 shadow appearance-none"
                  required
                  value={inputs.vehCondition}
                  onChange={(e) =>
                    setInputs({ ...inputs, vehCondition: e.target.value })
                  }
                >
                  <option value="" disabled className="w-10">
                    Choose the condition
                  </option>
                  <option value="Good">Good</option>
                  <option value="Bad">Bad</option>
                </select>
              </div>

              {/* <div className="flex flex-col  sm:w-1/3  w-11/12 space-y-1">
                <label>Quantity</label>
                <input
                  type="number"
                  min={0}
                  placeholder=""
                  className="border rounded-md p-2  text-sm md:text-2xl"
                  value={inputs.quantity !== null ? inputs.quantity : ""}
                  onChange={(e) =>
                    setInputs({ ...inputs, quantity: Number(e.target.value) })
                  }
                />
              </div> */}

              <div className="flex flex-col  sm:w-1/3  w-11/12 space-y-1">
                <label>Made Year</label>
                <input
                  type="month"
                  max={`${new Date().getFullYear()}-12`}
                  className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                  value={inputs.madeYear}
                  onChange={(e) => {
                    setInputs({ ...inputs, madeYear: e.target.value });
                  }}
                />
              </div>

              <div className="flex flex-col  sm:w-1/3  w-11/12 space-y-1">
                <label>Capacity</label>
                <input
                  type="number"
                  min={0}
                  placeholder="Capacity"
                  className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                  value={inputs.capacity !== null ? inputs.capacity : ""}
                  onChange={(e) =>
                    setInputs({ ...inputs, capacity: Number(e.target.value) })
                  }
                />
              </div>

              {/* <div className="flex flex-col  sm:w-1/3  w-11/12 space-y-1">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                  required
                  value={inputs.name}
                  onChange={(e) =>
                    setInputs({ ...inputs, name: e.target.value })
                  }
                />
              </div> */}

              <div className="flex flex-col sm:w-1/3  w-11/12 space-y-1">
                <label>Vehicle Number</label>
                <input
                  type="text"
                  placeholder="Ba 02 pa 000"
                  className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                  value={inputs.vehNumber}
                  onChange={(e) =>
                    setInputs({ ...inputs, vehNumber: e.target.value })
                  }
                />
                {error && (
                  <span className="text-xs text-red-500">
                    Invalid Vehicle Number Format
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:w-1/3  w-11/12 space-y-1">
                <label>Operational Dates</label>
                <DatePicker
                  style={{
                    backgroundColor: "",
                    height: "40px",
                    borderRadius: "6px",
                    width: "auto",
                    padding: "4px 4px 4px 4px",
                  }}
                  dateSeparator="   &   "
                  minDate={Date.now()}
                  multiple
                  value={inputs.operationDates}
                  onChange={(newDates: DateObject[]) =>
                    setInputs((prev) => ({
                      ...prev,
                      operationDates: newDates,
                    }))
                  }
                />
                <div className="flex gap-2 flex-wrap">
                  {inputs.operationDates.map((date) => (
                    <h1>{date.toString()},</h1>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:w-1/3  w-11/12 space-y-1">
                <ReactImageUploading
                  multiple
                  value={vehImages}
                  onChange={onImageGallaryChange}
                  maxNumber={1000}
                  dataURLKey="data_url"
                >
                  {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageRemove,
                    isDragging,
                    dragProps,
                  }: {
                    imageList: ImageListType;
                    onImageUpload: () => void;
                    onImageRemoveAll: () => void;
                    onImageRemove: (index: number) => void;
                    isDragging: boolean;
                    dragProps: React.HTMLAttributes<HTMLDivElement>;
                  }) => (
                    <div {...dragProps} className="upload__image-wrapper">
                      <button
                        style={isDragging ? { color: "red" } : undefined}
                        onClick={(e) => {
                          e.preventDefault();
                          onImageUpload();
                        }}
                        className="p-2 w-full rounded-lg mb-2 border"
                      >
                        Choose a photo <CloudUploadOutlined />
                      </button>
                      &nbsp;
                      {vehImages.length > 0 ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            onImageRemoveAll();
                          }}
                          className="p-2 rounded-lg border"
                        >
                          Remove All
                        </button>
                      ) : (
                        ""
                      )}
                      <div className="flex flex-row flex-wrap gap-7 mt-5">
                        {imageList.map((image, index) => (
                          <div
                            key={index}
                            className="image-item flex flex-row w-fit"
                          >
                            <div>
                              <img src={image.data_url} alt="" width="100" />
                              <div className="image-item__btn-wrapper flex gap-x-3">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    onImageRemove(index);
                                  }}
                                  className="bg-red-600 mt-1 text-xs p-1 rounded-md"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </ReactImageUploading>
              </div>

              <div className="flex flex-col  w-11/12 space-y-1">
                <label>Description</label>
                <JoditEditor
                  ref={editor}
                  value={inputs.description}
                  config={config}
                  onChange={(content) => {
                    setInputs({ ...inputs, description: content });
                  }}
                />
                {/* <div>{HTMLReactParser(inputs.itinerary)}</div> */}
              </div>

              <div className="flex justify-center  w-full">
                <button className=" rounded-lg p-3 w-3/4 md:w-1/3 text-sm text-white bg-button hover:bg-orange-700 md:text-xl">
                  Add Vehicle {isButton ? <ButtonLoader /> : ""}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
