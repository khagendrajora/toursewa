/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { IMG_URL } from "../../../../../../backend/src/config/Config";
import { useNavigate, useParams } from "react-router-dom";
import { ButtonLoader } from "../../../../utils/ButtonLoader";

export const UpdateDestination = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const [destId, setDestId] = useState(id);
  const [title, setTitle] = useState("");
  const [isButton, setISButton] = useState(false);
  const [existingDestImage, setExisting] = useState<string[]>([]);
  const [newImages, setNewimage] = React.useState<File[]>([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(
          `https://tourbackend-rdtk.onrender.com/api/getdestbyid/${id}`
        );
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          setDestId(data.destId);
          setTitle(data.title);
          setExisting(data.destImage);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchCategory();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { files } = e.target;

    if (files) {
      const newFiles = Array.from(files);
      setNewimage((prevImg) => [...prevImg, ...newFiles]);
    }
  };

  const removeImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExisting((prev) => prev.filter((_, i) => i !== index));
    } else {
      setNewimage((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateDest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setISButton(true);
      const formData = new FormData();
      formData.append("title", title);

      existingDestImage.forEach((image) =>
        formData.append("existingdestImage[]", image)
      );

      newImages.forEach((image) => formData.append("destImage", image));
      const res = await fetch(
        `https://tourbackend-rdtk.onrender.com/api/updateDest/${id}`,
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
      setISButton(false);
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
                <h1 className="font-bold text-xl lg:text-2xl">
                  Update Destination
                </h1>
                <p>Update a Destination on Toursewa</p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="bg-button p-1 px-2 h-fit min-w-[85px] text-center max-w-[120px] text-xs hover:bg-[#06243C] text-white  rounded-md md:text-lg"
              >
                Back to List
              </button>
            </div>

            <form
              onSubmit={updateDest}
              className="flex flex-wrap justify-center mt-10 md:mt-14 text-sm gap-y-5"
            >
              <div className="space-y-1 flex flex-wrap justify-center gap-y-5 gap-x-12 text-sm w-full">
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Destination Id</label>
                  <input
                    type="text"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    readOnly
                    value={destId}
                    name="id"
                    onChange={(e) => setDestId(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Title</label>
                  <input
                    type="text"
                    placeholder="Destiation Place"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={title}
                    name="title"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="flex flex-col  sm:w-1/4  w-11/12 space-y-1">
                  <h1>Destination Images</h1>
                  <input
                    type="file"
                    name="blogsImages"
                    multiple
                    className="cursor-pointer border border-gray-600"
                    onChange={handleFileChange}
                  />
                  {existingDestImage &&
                    existingDestImage.map((image, i) => (
                      <div key={i}>
                        <FontAwesomeIcon
                          icon={faXmark}
                          onClick={() => removeImage(i, true)}
                        />
                        <img
                          src={`${IMG_URL}/${image}`}
                          alt="gallery"
                          className="w-16"
                        />
                      </div>
                    ))}

                  {newImages &&
                    newImages.map((image, i) => (
                      <div key={i}>
                        <FontAwesomeIcon
                          icon={faXmark}
                          className="cursor-pointer"
                          onClick={() => removeImage(i, false)}
                        />

                        <img
                          src={URL.createObjectURL(image)}
                          alt="gallery"
                          className="w-16"
                        />
                      </div>
                    ))}
                </div>
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
