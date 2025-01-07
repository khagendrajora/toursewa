/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { toast, ToastContainer } from "react-toastify";
import { CloudUploadOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { ButtonLoader } from "../../../../utils/ButtonLoader";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { useNavigate } from "react-router-dom";
import { IBusiness } from "../../../../SharedTypes/business";
import { URL } from "../../../../config/Config";
import { VCategory } from "../../../../SharedTypes/Category/vehicleCategory";
import { ILocation } from "../../../../SharedTypes/Locations/location";
import JoditEditor from "jodit-react";

export const Vehicle = () => {
  const navigate = useNavigate();
  const editor = React.useRef(null);
  const [isButton, setIsButton] = React.useState(false);
  const [vehImages, setVehImages] = React.useState<ImageListType>([]);
  const [vehCat, setVehCat] = React.useState<VCategory[]>([]);
  const [error, setError] = React.useState<boolean>(false);
  const [filterVeh, setFilteredVeh] = React.useState<VCategory[]>([]);
  const [location, setLocation] = React.useState<ILocation[]>([]);
  const [inputs, setInputs] = React.useState<{
    vehCategory: string;
    businessName: string;
    vehSubCategory: string;
    services: string[];
    amenities: string[];
    vehCondition: string;
    baseLocation: string;
    madeYear: string;
    description: string;
    vehNumber: string;
    businessId: string;
    capacity: number | null;
    name: string;
    operationDates: DateObject[];
    manufacturer: string;
    model: string;
    VIN: string;
  }>({
    vehCategory: "",
    businessName: "",
    vehSubCategory: "",
    services: [],
    amenities: [],
    description: "",
    vehCondition: "",
    madeYear: "",
    baseLocation: "",
    vehNumber: "",
    capacity: null,
    name: "",
    operationDates: [],
    manufacturer: "",
    model: "",
    VIN: "",
    businessId: "",
  });
  const [business, setBusiness] = React.useState<IBusiness[]>([]);

  const config = React.useMemo(
    () => ({
      height: 400,
      toolbarSticky: false,
    }),
    []
  );

  React.useEffect(() => {
    const fetchLocation = async () => {
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
    fetchLocation();
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
        console.error(error);
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

  React.useEffect(() => {
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
      }
    };
    fetchBusiness();
  }, []);

  React.useEffect(() => {
    const fetchBusinessId = async () => {
      try {
        const filtered = business.filter((b) =>
          b.businessName
            .toLowerCase()
            .includes(inputs.businessName.toLowerCase())
        );
        if (filtered?.length === 0) {
          console.error("Error in Business Name");
        } else {
          setInputs((prevInputs) => ({
            ...prevInputs,
            businessId: filtered[0].bId,
          }));
          console.log(inputs.businessId);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchBusinessId();
  }, [inputs.businessName, business]);

  const [servicesInput, setServiceInput] = React.useState("");
  const [amenitiesInput, setAmenitiesInputs] = React.useState("");

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
        prevInputs.madeYear.toString().split("-")[0]
      }`,
    }));
  }, [inputs.manufacturer, inputs.model]);

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
    formData.append("businessId", inputs.businessId);
    formData.append("businessName", inputs.businessName);
    formData.append("vehCategory", inputs.vehCategory.toString());
    formData.append("vehSubCategory", inputs.vehSubCategory);

    inputs.services.forEach((value) => {
      formData.append("services", value);
    });

    inputs.amenities.forEach((value) => {
      formData.append("amenities", value);
    });

    formData.append("vehCondition", inputs.vehCondition);
    formData.append("vehNumber", inputs.vehNumber.toLowerCase());
    formData.append("description", inputs.description);
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
          businessName: "",
          vehSubCategory: "",
          services: [],
          baseLocation: "",
          amenities: [],
          vehCondition: "",
          madeYear: "",
          vehNumber: "",
          capacity: null,
          name: "",
          description: "",
          operationDates: [],
          manufacturer: "",
          model: "",
          VIN: "",
          businessId: "",
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
            <div className="flex justify-between flex-wrap gap-y-5">
              <div className="text-black flex flex-col gap-1 ">
                <h1 className="font-bold text-xl lg:text-2xl">Add Vehicle</h1>
                <p>Add a Vehicle on Toursewa</p>
              </div>

              <button
                onClick={() => navigate("/admin/vehicle")}
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
                <label>Business Name</label>
                <select
                  className="border border-gray-600 rounded-md ps-1 text-xs lg:text-lg cursor-pointer min-h-8 lg:min-h-10 shadow appearance-none"
                  value={inputs.businessName}
                  onChange={(e) =>
                    setInputs({ ...inputs, businessName: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Choose Business
                  </option>
                  {business &&
                    business.map((data, i) => (
                      <option key={i} value={data.businessName}>
                        {data.businessName}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm ">
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

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm ">
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

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm ">
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
                  {location &&
                    location.map((data, i) => (
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
                  <div key={index} className="flex items-center  gap-x-2">
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
                  {amenitiesInput.length > 0 ? (
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

              <div className="flex flex-col  sm:w-1/3  w-11/12 space-y-1 text-sm ">
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

              <div className="flex flex-col  sm:w-1/3  w-11/12 space-y-1">
                <label>Made Year</label>
                <input
                  type="month"
                  max={new Date().toISOString().slice(0, 5)}
                  className="border rounded-md p-2 border-gray-600  text-xm lg:text-lg"
                  value={inputs.madeYear}
                  onChange={(e) =>
                    setInputs({ ...inputs, madeYear: e.target.value })
                  }
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
                    padding: "4px",
                  }}
                  dateSeparator="  &  "
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
                <div className="flex flex-wrap gap-2">
                  {inputs.operationDates.map((date) => (
                    <h1>{date.toString()}</h1>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:w-1/3  w-11/12 space-y-1">
                <ImageUploading
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
                        className="p-2 border border-gray-600 rounded-lg mb-2 items-center"
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
                </ImageUploading>
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
              </div>

              <div className="flex justify-center  w-full">
                <button className=" rounded-lg p-3 w-3/4 md:w-1/3 text-sm text-white bg-button hover:bg-orange-700 ">
                  Register {isButton ? <ButtonLoader /> : ""}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
