import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import * as React from "react";
import { toast, ToastContainer } from "react-toastify";
import JoditEditor from "jodit-react";
import HTMLReactParser from "html-react-parser";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import { TrekCategory } from "../../../.../../SharedTypes/Category/trekCategory";
import { IMAGE_URL } from "../.././../config/Config";
import { ButtonLoader } from "../../../utils/ButtonLoader";
import { IDest } from "../../../.../../SharedTypes/Pages/LandingPage/Destination";
import { useAuthContext } from "../../../context/AuthContext";

const UpdateBusinessTrek = () => {
  const params = useParams();
  const id = params.id;
  const [isButton, setIsButton] = useState(false);
  // const [trekId, setTrekId] = useState(id);
  const [prodCategory, setProdCategory] = useState("");
  const [prodsubCategory, setprodsubCategory] = useState("");
  const [inclusion, setInclusion] = useState<string[]>([]);
  const [days, setDays] = useState("");
  const [dest, setDest] = useState("");
  const [number, setNumber] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [capacity, setCapacity] = useState("");
  const { authUser } = useAuthContext();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [operationDates, setOperationDates] = React.useState<string[]>([]);
  const [trekImages, setTrekImages] = React.useState<File[]>([]);
  const [inclusionInput, setInclusionInput] = useState("");
  const navigate = useNavigate();
  const editor = React.useRef(null);
  const [error, setError] = useState<boolean>(false);
  const [category, setCategory] = useState<TrekCategory[]>([]);
  const [filtercategory, setFilterCategory] = useState<TrekCategory[]>([]);
  const [data, setData] = useState<IDest[]>([]);

  React.useEffect(() => {
    const fetchDest = async () => {
      try {
        const res = await fetch(
          `https://tourbackend-rdtk.onrender.com/api/getDest`
        );
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
        const res = await fetch(
          `https://tourbackend-rdtk.onrender.com/api/gettrekcategory`
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
          .get(`https://tourbackend-rdtk.onrender.com/api/gettrekdetails/${id}`)
          .then(async (res) => {
            setProdCategory(res.data.prodCategory);
            setprodsubCategory(res.data.prodsubCategory);
            setInclusion(res.data.inclusion);
            setDest(res.data.dest);
            setDays(res.data.days);
            setItinerary(res.data.itinerary);
            setCapacity(res.data.capacity);
            setName(res.data.name);
            setPrice(res.data.price);
            setNumber(res.data.numbers);
            setOperationDates(res.data.operationDates);
            setTrekImages(res.data.trekImages);
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

  const addInclusion = () => {
    if (inclusionInput.trim()) {
      setInclusion([...inclusion, inclusionInput.trim()]);
      setInclusionInput("");
    }
  };
  const config = React.useMemo(
    () => ({
      height: 400,
      toolbarSticky: false,
    }),
    []
  );

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

    if (files && name === "trekImages") {
      const newFiles = Array.from(files);
      setTrekImages((prevImg) => [...prevImg, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setTrekImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  React.useEffect(() => {
    const fetchVehCat = async () => {
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
    fetchVehCat();
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

  const updateTrek = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone(number)) {
      setError(true);
      return;
    }
    try {
      setIsButton(true);
      const formData = new FormData();

      formData.append("prodCategory", prodCategory);
      formData.append("prodsubCategory", prodsubCategory);
      inclusion.forEach((item) => formData.append("inclusion[]", item));
      formData.append("numbers", number.toString());
      formData.append("dest", dest);
      formData.append("days", days.toString());
      formData.append("price", price.toString());
      formData.append("itinerary", itinerary);
      formData.append("capacity", capacity);
      formData.append("updatedBy", authUser?.loginedId || "");
      formData.append("name", name);

      operationDates.forEach((dates) => {
        formData.append("operationDates[]", dates);
      });

      trekImages.forEach((image) => {
        if (typeof image === "string") {
          formData.append("existingTrekImages[]", image);
        } else if (image instanceof File) {
          formData.append("trekImages", image);
        }
      });

      const res = await fetch(
        `https://tourbackend-rdtk.onrender.com/api/updatetrek/${id}`,
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
            <div className="flex justify-between">
              <div className="text-black flex flex-col gap-1 ">
                <h1 className="font-bold text-center md:text-xl lg:text-2xl">
                  Update Trek Data
                </h1>{" "}
                <p>Update Trek Data</p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="bg-button p-1 px-2 h-fit min-w-[85px] text-center max-w-[120px] text-xs hover:bg-[#06243C] text-white  rounded-md md:text-lg"
              >
                Back to List
              </button>
            </div>
            <form
              onSubmit={updateTrek}
              className="flex flex-wrap justify-center  mt-10 md:mt-14 text-sm gap-y-5 gap-x-12"
            >
              <div className="space-y-1 flex flex-wrap justify-center gap-y-5 gap-x-12 text-sm w-full">
                {/* <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Trek Id</label>
                  <input
                    type="text"
                    placeholder="ID"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    readOnly
                    value={trekId}
                    name="trekId"
                    onChange={(e) => setTrekId(e.target.value)}
                  />
                </div> */}

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Product Category</label>
                  <select
                    name="prodCategory"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
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
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
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
                      placeholder="Inclusion"
                      className="border border-gray-600 rounded-md p-1 text-xs w-full  lg:text-lg"
                      value={inclusionInput}
                      name="inclusion"
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
                  <div className="flex flex-wrap gap-2 text-xs">
                    {inclusion.map((item, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <span>{item}</span>
                        <FontAwesomeIcon
                          icon={faXmark}
                          className="text-red-500 cursor-pointer"
                          onClick={() => removeInclusion(index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Name"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={name}
                    name="name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Destination</label>
                  <select
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={dest}
                    name="dest"
                    onChange={(e) => setDest(e.target.value)}
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
                  <label>Days</label>
                  <input
                    type="number"
                    placeholder="Duration"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    value={days}
                    name="days"
                    onChange={(e) => setDays(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Number</label>
                  <input
                    type="number"
                    placeholder="Number"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    value={number}
                    name="number"
                    onChange={(e) => setNumber(e.target.value)}
                  />
                  {error && (
                    <span className="text-xs text-red-500">Invalid Number</span>
                  )}
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Capacity</label>
                  <input
                    type="number"
                    placeholder="Number"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={capacity}
                    name="capacity"
                    onChange={(e) => setCapacity(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={price}
                    name="price"
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Operational Dates</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    onChange={handleDateChange}
                    className="rounded-md border border-gray-600 p-2"
                  />
                  <div className="flex flex-wrap gap-4">
                    {operationDates &&
                      operationDates.map((date, i) => (
                        <div
                          key={i}
                          className="flex items-center text-xs gap-1"
                        >
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
              </div>
              <div className="flex flex-col w-11/12 space-y-1 text-sm">
                <label>Itineary</label>

                <JoditEditor
                  ref={editor}
                  value={itinerary}
                  config={config}
                  onChange={(e) => setItinerary(e)}
                />
                <div>{HTMLReactParser(itinerary)}</div>
              </div>

              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <h1>Treck Images</h1>
                <input
                  type="file"
                  name="trek_images"
                  multiple
                  className="cursor-pointer border border-gray-600"
                  onChange={handleFileChange}
                />
                {trekImages &&
                  trekImages.map((image, i) => (
                    <div key={i}>
                      <FontAwesomeIcon
                        icon={faXmark}
                        className="text-red-500 cursor-pointer"
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
                <button className=" rounded-lg p-3 w-3/4 md:w-1/3 text-sm text-white bg-button hover:bg-orange-700 md:text-xl">
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

export default UpdateBusinessTrek;
