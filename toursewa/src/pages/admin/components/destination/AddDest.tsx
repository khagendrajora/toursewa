/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloudUploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ImageUploading, { ImageListType } from "react-images-uploading";

export const AddDest = () => {
  const navigate = useNavigate();
  const [destImage, setDestImages] = React.useState<ImageListType>([]);
  const [inputs, setInputs] = useState<{
    title: string;
  }>({
    title: "",
  });

  const onImageGallaryChange = async (imageList: ImageListType) => {
    setDestImages(imageList);
  };

  const addDest = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", inputs.title);

    destImage.forEach((image) => {
      formData.append(`destImage`, image.file as File);
    });
    try {
      const res = await fetch(
        "https://tourbackend-rdtk.onrender.com/api/addDest",
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
          title: "",
        });
        setDestImages([]);
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      }
    } catch (error: any) {
      toast.error(error);
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
                  Add Destination
                </h1>
                <p>Add a Destination on Toursewa</p>
              </div>
              <button
                onClick={() => navigate("/admin/destination")}
                className="bg-button p-1 px-2 h-fit min-w-[85px] text-center max-w-[120px] text-xs hover:bg-[#06243C] text-white  rounded-md md:text-lg"
              >
                Back to List
              </button>
            </div>

            <form
              onSubmit={addDest}
              className="flex flex-wrap justify-center mt-10 md:mt-14 text-sm gap-y-5"
            >
              <div className="space-y-1 flex flex-wrap justify-center gap-y-5 gap-x-12 text-sm w-full">
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Destination Title</label>
                  <input
                    type="text"
                    placeholder="Destination Place"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    value={inputs.title}
                    required
                    onChange={(e) =>
                      setInputs({ ...inputs, title: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col  sm:w-1/2  w-11/12 space-y-1">
                  <ImageUploading
                    multiple
                    value={destImage}
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
                          className="p-2 rounded-lg mb-2 border"
                        >
                          Choose Photo <CloudUploadOutlined />
                        </button>
                        &nbsp;
                        {destImage.length > 0 ? (
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
                  </ImageUploading>
                </div>
              </div>
              <div className="flex justify-center  w-full">
                <button className=" rounded-lg p-3 w-3/4 md:w-1/3 text-sm text-white bg-button hover:bg-orange-700 ">
                  Add Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
