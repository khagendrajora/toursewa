/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ButtonLoader } from "../../utils/ButtonLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { IMG_URL } from "../../../../backend/src/config/Config";
import { BCategory } from "../../../../backend/src/models/Category/businessCategory";

export const UpdateBusinessProfile = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const [businessSubCategory, setBusinessSubCategory] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [website, setWebsite] = useState("");
  const [contactName, setContactName] = useState("");
  const [primaryPhone, setPrimaryPhone] = useState("");
  const [authority, setAuthority] = useState("");
  const [registrationOn, setRegistrationOn] = useState(Date);
  const [expiresOn, setExpiresOn] = useState("");
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<boolean>(false);
  const [profileIcon, setProfileIcon] = React.useState<File | string>("");
  const [imageGallery, setImageGallery] = React.useState<File[]>([]);
  const [isButton, setIsButton] = useState(false);
  const [category, setCategory] = useState<BCategory[] | []>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios
          .get(
            `https://tourbackend-rdtk.onrender.com/api/businessprofile/${id}`
          )
          .then(async (res) => {
            setBusinessSubCategory(res.data.businessSubCategory);
            setPlatform(res.data.socialMedia?.platform || "");
            setUrl(res.data.socialMedia?.url || "");
            setExpiresOn(res.data.businessRegistration?.expiresOn || "");
            setRegistrationOn(
              res.data.businessRegistration?.registrationOn || ""
            );
            setAuthority(res.data.businessRegistration?.authority || "");
            setPrimaryPhone(res.data.primaryPhone);
            setContactName(res.data.contactName);
            setWebsite(res.data.website);
            setCity(res.data.businessAddress?.city || "");
            setStreet(res.data.businessAddress?.street || "");
            setProfileIcon(res.data.profileIcon);
            setImageGallery(res.data.imageGallery);
          })
          .catch((error) => {
            toast.error(error);
          });
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, files } = e.target;

    if (files && name === "profileIcon") {
      setProfileIcon(files[0]);
    } else if (files && name === "imageGallery") {
      const newFiles = Array.from(files);
      setImageGallery((prevImg) => [...prevImg, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImageGallery((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const removeProfile = () => {
    setProfileIcon("");
  };

  const validatePhone = (num: string) => {
    if (num.startsWith("9") && num.length === 10) {
      return true;
    } else if (num.startsWith("0") && num.length === 9) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(
          `https://tourbackend-rdtk.onrender.com/api/getbusinesscategory`
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

  const update = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!validatePhone(primaryPhone)) {
        setError(true);
        return;
      }
      setIsButton(true);
      const formData = new FormData();
      formData.append("businessSubCategory", businessSubCategory);
      formData.append("businessAddress[street]", street);
      formData.append("businessAddress[city]", city);
      formData.append("businessRegistration[authority]", authority);
      formData.append("businessRegistration[registrationOn]", registrationOn);
      formData.append("businessRegistration[expiresOn]", expiresOn);
      formData.append("socialMedia[platform]", platform);
      formData.append("socialMedia[url]", url);
      formData.append("website", website);
      formData.append("contactName", contactName);
      formData.append("primaryPhone", primaryPhone);
      formData.append("profileIcon", profileIcon as File);

      imageGallery.forEach((image) => {
        if (typeof image === "string") {
          formData.append("existingImageGallery[]", image);
        } else if (image instanceof File) {
          formData.append("imageGallery", image);
        }
      });

      const res = await fetch(
        `https://tourbackend-rdtk.onrender.com/api/updatebusinessprofile/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
      } else {
        toast.success("successfully Updated");
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
                <h1 className="font-bold text-xl lg:text-2xl">
                  Update Business Profile
                </h1>
                <p>Update Business Information </p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="rounded-lg p-2 text-sm text-white h-fit bg-button hover:bg-orange-700"
              >
                Back
              </button>
            </div>
            <form
              onSubmit={update}
              className="flex flex-wrap flex-col justify-center mt-10 md:mt-14 text-sm gap-y-5 "
            >
              <div className="flex flex-wrap justify-center sm:justify-between w-11/12 gap-5 text-sm ">
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Sub Category</label>
                  <select
                    className="border border-gray-600 rounded-md ps-1 text-xs lg:text-lg cursor-pointer min-h-8 lg:min-h-10 shadow appearance-none"
                    value={businessSubCategory}
                    name="businessSubCategory"
                    onChange={(e) => setBusinessSubCategory(e.target.value)}
                  >
                    <option value="" disabled>
                      Choose Sub Category
                    </option>
                    {category &&
                      category.map((c) =>
                        c.subCategory?.map((s, i) => (
                          <option key={i} value={s}>
                            {s}
                          </option>
                        ))
                      )}
                  </select>
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Contact Name</label>
                  <input
                    type="text"
                    placeholder="Contact Name"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    value={contactName}
                    name="contactName"
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Phone</label>
                  <input
                    type="text"
                    placeholder="Phone"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    value={primaryPhone}
                    required
                    name="primaryPhone"
                    onChange={(e) => {
                      setError(false);
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setPrimaryPhone(e.target.value);
                      }
                    }}
                  />
                  {error && (
                    <span className="text-xs text-red-500">Invalid Number</span>
                  )}
                </div>
              </div>
              <h1 className="text-center  font-semibold ">Business Address</h1>
              <div className="flex flex-wrap justify-center sm:justify-between  w-11/12 gap-5 text-sm ">
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>City</label>
                  <input
                    type="text"
                    placeholder="City"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    value={city}
                    name="businessAddress[city]"
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Street</label>
                  <input
                    type="text"
                    placeholder="Street"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    value={street}
                    required
                    name="businessAddress[street]"
                    onChange={(e) => setStreet(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Website</label>
                  <input
                    type="text"
                    placeholder="website"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    value={website}
                    name="website"
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
              </div>
              <h1 className="text-center  font-semibold ">
                Business Registration
              </h1>
              <div className="flex flex-wrap justify-center sm:justify-between w-11/12 gap-5 text-sm ">
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Authority</label>
                  <input
                    type="text"
                    placeholder="Authority"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    value={authority}
                    name="businessRegistration[authority]"
                    onChange={(e) => setAuthority(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Registration On</label>
                  <input
                    type="date"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    value={registrationOn.split("T")[0]}
                    max={new Date().toISOString().split("T")[0]}
                    name="businessRegistration[registrationOn]"
                    onChange={(e) => setRegistrationOn(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Expire On</label>
                  <input
                    type="date"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={expiresOn.split("T")[0]}
                    name="businessRegistration[expiresOn]"
                    onChange={(e) => setExpiresOn(e.target.value)}
                  />
                </div>
              </div>
              <h1 className="text-center font-bold">Social Media</h1>
              <div className="flex flex-wrap w-11/12 sm:justify-between lg: justify-center gap-5 text-sm ">
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Platform</label>
                  <input
                    type="text"
                    placeholder="Platform"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    value={platform}
                    name="socialMedia[platform]"
                    onChange={(e) => setPlatform(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>URL</label>
                  <input
                    type="text"
                    placeholder="URL"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    value={url}
                    name="socialMedia[url]"
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Profile Icon</label>
                  <input
                    type="file"
                    name="profileIcon"
                    className="cursor-pointer"
                    onChange={handleFileChange}
                  />

                  {profileIcon && (
                    <div className="flex justify-start">
                      <FontAwesomeIcon
                        icon={faXmark}
                        className="cursor-pointer"
                        onClick={removeProfile}
                      />
                      {typeof profileIcon === "string" ? (
                        <img
                          src={`${IMG_URL}/${profileIcon}`}
                          className="w-10"
                        />
                      ) : (
                        <img
                          src={URL.createObjectURL(profileIcon)}
                          alt="profileIcon"
                          className="w-20"
                        />
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <h1>Image Gallery</h1>
                  <input
                    type="file"
                    name="imageGallery"
                    multiple
                    onChange={handleFileChange}
                  />
                  <div className="flex  flex-wrap gap-3">
                    {imageGallery &&
                      imageGallery.map((image, i) => (
                        <div key={i}>
                          <FontAwesomeIcon
                            icon={faXmark}
                            className="cursor-pointer"
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
                </div>
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
