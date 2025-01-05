import { useState } from "react";
import * as React from "react";
import ReactImageUploading, { ImageListType } from "react-images-uploading";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { toast, ToastContainer } from "react-toastify";
import { CloudUploadOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";

import { TourCategory } from "../../../../../backend/src/models/Category/tourCategory";
import { useAuthContext } from "../../../context/AuthContext";
import { ButtonLoader } from "../../../utils/ButtonLoader";
import { URL } from "../../../config/Config";
import { IDest } from "../../../../../backend/src/models/Pages/LandingPage/Destination";

const AddTour = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthContext();
  const id = authUser?.bId;
  const editor = React.useRef(null);
  const [data, setData] = useState<IDest[]>([]);
  const [tourImages, setTourImages] = React.useState<ImageListType>([]);
  const [isButton, setIsButton] = useState(false);
  const [category, setCategory] = useState<TourCategory[]>([]);
  const [filtercategory, setFilterCategory] = useState<TourCategory[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [inputs, setInputs] = useState<{
    prodCategory: string;
    prodsubCategory: string;
    inclusion: string[];
    dest: string;
    duration: string;
    itinerary: string;
    capacity: string;
    name: string;
    phone: string;
    operationDates: DateObject[];
  }>({
    prodCategory: "",
    prodsubCategory: "",
    inclusion: [],
    dest: "",
    duration: "",
    itinerary: "",
    capacity: "",
    name: "",
    phone: "",
    operationDates: [],
  });

  React.useEffect(() => {
    const fetchDest = async () => {
      try {
        const res = await fetch(`${URL}/api/getDest`);
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          setData(data);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchDest();
  }, []);

  React.useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`${URL}/api/gettourcategory`);
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

  React.useEffect(() => {
    const fetchCat = async () => {
      try {
        const filtered = category.filter((b) =>
          b.categoryName
            .toLowerCase()
            .includes(inputs.prodCategory.toLowerCase())
        );
        if (filtered?.length === 0) {
          console.error("Error in vehicle category Name");
        } else {
          setFilterCategory(filtered);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCat();
  }, [inputs.prodCategory, category]);

  const [inclusionInput, setInclusionInput] = useState("");

  const addInclusion = () => {
    if (inclusionInput.trim()) {
      setInputs((prev) => ({
        ...prev,
        inclusion: [...prev.inclusion, inclusionInput],
      }));
    }
    setInclusionInput("");
  };

  const removeInclusion = (index: number) => {
    setInputs((prev) => ({
      ...prev,
      inclusion: prev.inclusion.filter((_, i) => i !== index),
    }));
  };

  const config = React.useMemo(
    () => ({
      height: 400,
      toolbarSticky: false,
    }),
    []
  );

  const onImageGallaryChange = async (imageList: ImageListType) => {
    setTourImages(imageList);
  };

  const validatePhone = (num: string) => {
    if (num.startsWith("9") && num.length === 10) {
      return true;
    } else if (num.startsWith("0") && num.length === 9) {
      return true;
    }
    return false;
  };

  const addTour = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePhone(inputs.phone)) {
      setError(true);
      return;
    }
    try {
      setIsButton(true);
      const formData = new FormData();
      formData.append("businessId", id || "");
      formData.append("businessName", authUser?.businessName || "");
      formData.append("prodCategory", inputs.prodCategory);
      formData.append("prodsubCategory", inputs.prodsubCategory);
      inputs.inclusion.forEach((value) => {
        formData.append("inclusion", value);
      });
      formData.append("dest", inputs.dest);
      formData.append("duration", inputs.duration.toString());
      formData.append("itinerary", inputs.itinerary);
      formData.append("capacity", inputs.capacity);
      formData.append("name", inputs.name);
      formData.append("phone", inputs.phone);
      inputs.operationDates.map((date) => {
        formData.append("operationDates", date.toString());
      });

      tourImages.forEach((image) => {
        formData.append(`tourImages`, image.file as File);
      });

      const res = await fetch(`${URL}/api/addtour`, {
        method: "POST",

        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        setInputs({
          prodCategory: "",
          prodsubCategory: "",
          inclusion: [],
          dest: "",
          duration: "",
          itinerary: "",
          capacity: "",
          name: "",
          phone: "",
          operationDates: [],
        });
        setTourImages([]);
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
                <h1 className="font-bold text-xl lg:text-2xl">Add Tour</h1>
                <p>Add a Tour on Toursewa</p>
              </div>
              <button
                onClick={() => navigate("/business/tour")}
                className="bg-button p-1 px-2 h-fit min-w-[85px] text-center max-w-[120px] text-xs hover:bg-[#06243C] text-white  rounded-md md:text-lg"
              >
                Back to List
              </button>
            </div>
            <form
              onSubmit={addTour}
              className="flex flex-wrap justify-center mt-10 md:mt-14 text-sm gap-y-5"
            >
              <div className="space-y-1 flex flex-wrap justify-center gap-y-5 gap-x-12 text-sm w-full">
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Product Category</label>
                  <select
                    name="prodCategory"
                    className="border border-gray-600 rounded-md ps-1 text-xs lg:text-lg cursor-pointer min-h-8 lg:min-h-10 shadow appearance-none"
                    value={inputs.prodCategory}
                    onChange={(e) => {
                      setInputs({ ...inputs, prodCategory: e.target.value });
                    }}
                  >
                    <option value="" disabled>
                      Choose Category
                    </option>
                    {category &&
                      category.map((cat, i) => (
                        <option key={i} value={cat.categoryName}>
                          {cat.categoryName}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Product Sub Category</label>
                  <select
                    name="prodCategory"
                    className="border border-gray-600 rounded-md ps-1 text-xs lg:text-lg cursor-pointer min-h-8 lg:min-h-10 shadow appearance-none"
                    value={inputs.prodsubCategory}
                    onChange={(e) => {
                      setInputs({ ...inputs, prodsubCategory: e.target.value });
                    }}
                  >
                    <option value="" disabled>
                      Choose Sub Category
                    </option>
                    {filtercategory &&
                      filtercategory.map(
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

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1">
                  <label>Inclusion</label>
                  <div className="flex flex-row gap-x-2 items-center">
                    <input
                      type="text"
                      placeholder="Inclusion"
                      className="border border-gray-600 rounded-md p-1 text-xs w-full  lg:text-lg"
                      value={inclusionInput}
                      onChange={(e) => setInclusionInput(e.target.value)}
                    />
                    {inclusionInput.length > 0 ? (
                      <div>
                        <button
                          type="button"
                          onClick={addInclusion}
                          className="bg-button rounded-md p-1 text-lg hover:bg-orange-700 text-white"
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {inputs.inclusion.map((item, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <FontAwesomeIcon
                          icon={faXmark}
                          onClick={() => removeInclusion(index)}
                        />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Destination</label>
                  <select
                    className="border border-gray-600 rounded-md ps-1 text-xs lg:text-lg cursor-pointer min-h-8 lg:min-h-10 shadow appearance-none"
                    value={inputs.dest}
                    onChange={(e) =>
                      setInputs({ ...inputs, dest: e.target.value })
                    }
                  >
                    <option value="" disabled>
                      Choose Destination
                    </option>
                    {data &&
                      data.map((d, i) => (
                        <option key={i} value={d.title}>
                          {d.title}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Duration (Days)</label>
                  <input
                    type="number"
                    placeholder="Duration"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={inputs.duration}
                    onChange={(e) =>
                      setInputs({ ...inputs, duration: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Capacity</label>
                  <input
                    type="number"
                    placeholder=""
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    value={inputs.capacity}
                    onChange={(e) =>
                      setInputs({ ...inputs, capacity: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
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
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Phone</label>
                  <input
                    type="number"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    placeholder="Phone Number"
                    value={inputs.phone}
                    onChange={(e) => {
                      setError(false);
                      setInputs({ ...inputs, phone: e.target.value });
                    }}
                  />
                  {error && (
                    <span className="text-xs text-red-500">Invalid Number</span>
                  )}
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm ">
                  <label>Operational Dates</label>
                  <DatePicker
                    style={{
                      backgroundColor: "",
                      height: "40px",
                      borderRadius: "6px",
                      width: "auto",
                      padding: "4px",
                    }}
                    dateSeparator=" &  "
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
                  <div className="flex flex-wrap gap-5">
                    {inputs.operationDates &&
                      inputs.operationDates.map((dates) => (
                        <span>{dates.toString()}</span>
                      ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col  w-11/12 space-y-1 text-sm">
                <label>Itinerary</label>
                <JoditEditor
                  ref={editor}
                  value={inputs.itinerary}
                  config={config}
                  onChange={(content) => {
                    setInputs({ ...inputs, itinerary: content });
                  }}
                />
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <ReactImageUploading
                  multiple
                  value={tourImages}
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
                        className="p-2 rounded-lg mb-2 border border-gray-600"
                      >
                        Choose Photo <CloudUploadOutlined />
                      </button>
                      &nbsp;
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          onImageRemoveAll();
                        }}
                        className="p-2 rounded-lg bg-red-500"
                      >
                        Remove
                      </button>
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
                                  className=""
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
              <div className="flex justify-center  w-full">
                <button className=" rounded-lg p-3 w-3/4 md:w-1/3 text-sm text-white bg-button hover:bg-orange-700 md:text-xl">
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

export default AddTour;
