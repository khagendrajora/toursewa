/* eslint-disable @typescript-eslint/no-explicit-any */
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import * as React from "react";
import { toast, ToastContainer } from "react-toastify";
import { IMG_URL } from "../../../../../../backend/src/config/Config";
import JoditEditor from "jodit-react";
import HTMLReactParser from "html-react-parser";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import { ButtonLoader } from "../../../../utils/ButtonLoader";
import { useParams } from "react-router-dom";
import axios from "axios";
import { TourCategory } from "../../../../../../backend/src/models/Category/tourCategory";

export const UpdateTour = () => {
  const [category, setCategory] = useState<TourCategory[]>([]);
  const [isButton, setIsButton] = useState(false);
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  const editor = React.useRef(null);
  const [tourId, setTourId] = useState(id);
  const [prodCategory, setProdCategory] = useState("");
  const [prodsubCategory, setprodsubCategory] = useState("");
  const [inclusion, setInclusion] = useState<string[]>([]);
  const [dest, setDest] = useState("");
  const [duration, setDuration] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [capacity, setCapacity] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [operationDates, setOperationDates] = React.useState<string[]>([]);
  const [tourImages, setTourImages] = React.useState<File[]>([]);
  const [error, setError] = useState<boolean>(false);

  const [filtercategory, setFilterCategory] = useState<TourCategory[]>([]);

  const config = React.useMemo(
    () => ({
      height: 400,
      toolbarSticky: false,
    }),
    []
  );

  React.useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(
          `https://tourbackend-rdtk.onrender.com/api/gettourcategory`
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

  React.useEffect(() => {
    const fetch = async () => {
      try {
        await axios
          .get(`https://tourbackend-rdtk.onrender.com/api/gettourdetails/${id}`)
          .then(async (res) => {
            setProdCategory(res.data.prodCategory);
            setprodsubCategory(res.data.prodsubCategory);
            setInclusion(res.data.inclusion);
            setDest(res.data.dest);
            setDuration(res.data.duration);
            setItinerary(res.data.itinerary);
            setCapacity(res.data.capacity);
            setName(res.data.name);
            setPhone(res.data.phone);
            setOperationDates(res.data.operationDates);
            setTourImages(res.data.tourImages);
          })
          .catch((error) => {
            toast.error(error);
          });
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetch();
  }, [id]);

  const [inclusionInput, setInclusionInput] = useState("");

  const addInclusion = () => {
    if (inclusionInput.trim()) {
      setInclusion((prev) => [...prev, inclusionInput]);
    }
    setInclusionInput("");
  };

  const removeInclusion = (index: number) => {
    setInclusion(inclusion.filter((_, i) => i !== index));
  };

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
    if (files && name === "tourImages") {
      const newFiles = Array.from(files);
      setTourImages((prevImg) => [...prevImg, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setTourImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  React.useEffect(() => {
    const fetchCat = async () => {
      try {
        const filtered = category.filter((b) =>
          b.categoryName.toLowerCase().includes(prodCategory.toLowerCase())
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
  }, [prodCategory, category]);

  const validatePhone = (num: string | number) => {
    const newNum = num.toString();
    if (newNum.startsWith("9") && newNum.length === 10) {
      return true;
    } else if (newNum.startsWith("0") && newNum.length === 9) {
      return true;
    }
    return false;
  };

  const updateTour = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePhone(phone)) {
      setError(true);
      return;
    }

    try {
      setIsButton(true);
      const formData = new FormData();

      formData.append("prodCategory", prodCategory);
      formData.append("prodsubCategory", prodsubCategory);
      inclusion.forEach((item) => formData.append("inclusion[]", item));
      formData.append("dest", dest);
      formData.append("duration", duration);
      formData.append("itinerary", itinerary);
      formData.append("capacity", capacity);
      formData.append("name", name);
      formData.append("phone", phone.toString());
      operationDates.forEach((dates) => {
        formData.append("operationDates[]", dates);
      });
      tourImages.forEach((image) => {
        if (typeof image === "string") {
          formData.append("existingTourImages[]", image);
        } else if (image instanceof File) {
          formData.append("tourImages", image);
        }
      });
      const res = await fetch(
        `https://tourbackend-rdtk.onrender.com/api/updatetour/${id}`,
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
                  Update Tour Data
                </h1>{" "}
                <p>Update Tour Data</p>
              </div>
              <button
                onClick={() => navigate("/admin/tour")}
                className="bg-button p-1 px-2 h-fit min-w-[85px] text-center max-w-[120px] text-xs hover:bg-[#06243C] text-white  rounded-md md:text-lg"
              >
                Back to List
              </button>
            </div>
            <form
              onSubmit={updateTour}
              className="flex flex-wrap justify-center  mt-10 md:mt-14 text-sm gap-y-5 gap-x-12"
            >
              <div className="space-y-1 flex flex-wrap justify-center gap-y-5 gap-x-12 text-sm w-full">
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Tour Id</label>
                  <input
                    type="text"
                    placeholder="xyz"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    readOnly
                    value={tourId}
                    name="tourId"
                    onChange={(e) => setTourId(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Product Category</label>
                  <select
                    name="prodCategory"
                    className="border border-gray-600 rounded-md ps-1 text-xs lg:text-lg cursor-pointer min-h-8 lg:min-h-10 shadow appearance-none"
                    value={prodCategory}
                    onChange={(e) => {
                      setProdCategory(e.target.value);
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
                  <label>Sub Category</label>
                  <select
                    name="prodSubCategory"
                    className="border border-gray-600 rounded-md ps-1 text-xs lg:text-lg cursor-pointer min-h-8 lg:min-h-10 shadow appearance-none"
                    value={prodsubCategory}
                    onChange={(e) => {
                      setprodsubCategory(e.target.value);
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
                      placeholder="xyz"
                      className="border border-gray-600 rounded-md p-1 text-xs w-full  lg:text-lg"
                      value={inclusionInput}
                      name="inclusion"
                      onChange={(e) => setInclusionInput(e.target.value)}
                    />
                    <div>
                      <button
                        type="button"
                        onClick={addInclusion}
                        className="bg-button rounded-md p-1 text-lg hover:bg-orange-700 text-white"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {inclusion &&
                      inclusion.map((item, index) => (
                        <div key={index} className="flex gap-1 items-center">
                          <FontAwesomeIcon
                            icon={faXmark}
                            className="text-red-600 cursor-pointer"
                            onClick={() => removeInclusion(index)}
                          />
                          <span>{item}</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Destination</label>
                  <input
                    type="text"
                    placeholder="abcdxyz"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={dest}
                    name="dest"
                    onChange={(e) => setDest(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Duration (Days)</label>
                  <input
                    type="number"
                    placeholder="abc"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    value={duration}
                    name="duration"
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Capacity</label>
                  <input
                    type="number"
                    placeholder="xyz"
                    className="border rounded-md p-2 w-full text-sm md:text-2xl "
                    required
                    value={capacity}
                    name="capacity"
                    onChange={(e) => setCapacity(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="abcdxyz"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={name}
                    name="name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Operational Dates</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    multiple
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    onChange={handleDateChange}
                  />
                  <div className="flex gap-4 text-xs flex-wrap">
                    {operationDates &&
                      operationDates.map((date, i) => (
                        <div key={i} className="space-x-1">
                          <FontAwesomeIcon
                            icon={faXmark}
                            className="text-red-500 cursor-pointer"
                            onClick={() => removeDate(i)}
                          />
                          <span>{date}</span>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Phone</label>
                  <input
                    type="number"
                    placeholder="abc"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    value={phone}
                    name="phone"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  {error && (
                    <span className="text-xs text-red-500">Invalid Number</span>
                  )}
                </div>
                <div className="flex flex-col w-11/12   gap-y-3 md:gap-y-5">
                  <label>Itineary</label>
                  <JoditEditor
                    ref={editor}
                    value={itinerary}
                    config={config}
                    onChange={(e) => setItinerary(e)}
                  />
                  <div>{HTMLReactParser(itinerary)}</div>
                </div>
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <h1>Tour Images</h1>
                <input
                  type="file"
                  name="tour_images"
                  multiple
                  className="p-2 border border-gray-600 rounded-lg mb-2 items-center"
                  onChange={handleFileChange}
                />
                {tourImages &&
                  tourImages.map((image, i) => (
                    <div key={i}>
                      <FontAwesomeIcon
                        icon={faXmark}
                        onClick={() => removeImage(i)}
                      />
                      {typeof image === "string" ? (
                        <img
                          src={`${IMG_URL}/${image}`}
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
                  Update{isButton ? <ButtonLoader /> : ""}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
