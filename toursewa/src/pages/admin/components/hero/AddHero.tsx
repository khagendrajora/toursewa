/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloudUploadOutlined } from "@ant-design/icons";
import * as React from "react";
import ReactImageUploading, { ImageListType } from "react-images-uploading";
import { toast, ToastContainer } from "react-toastify";

export const AddHero = () => {
  const [heroImage, setHeroImages] = React.useState<ImageListType>([]);

  const onImageGallaryChange = async (imageList: ImageListType) => {
    setHeroImages(imageList);
  };

  const addHero = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    heroImage.forEach((image) => {
      formData.append(`heroImage`, image.file as File);
    });
    try {
      const res = await fetch(
        "https://tourbackend-rdtk.onrender.com/api/addhero",
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

        setHeroImages([]);
      }
    } catch (error: any) {
      toast.error(error);
    }
  };
  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="flex bg-zinc-100 p-1 ">
        <div className="md:p-5 w-full">
          <div className="flex flex-col  rounded-3xl">
            <div className="font-sans text-black   text-start  ">
              <h1 className="font-bold text-center md:text-xl lg:text-2xl">
                Add Images for Hero Section
              </h1>
            </div>

            <form
              onSubmit={addHero}
              className="flex  flex-wrap justify-center  mt-4 md:mt-14 lg:text-lg  text-sm gap-y-5 gap-x-12 "
            >
              <ReactImageUploading
                multiple
                value={heroImage}
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
                      className="p-2 rounded-lg mb-2 bg-blue-400"
                    >
                      Choose a photo <CloudUploadOutlined />
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

              <div className="flex justify-end lg:justify-center w-full">
                <button className=" rounded-lg p-3 text-sm text-white bg-blue-800 md:text-xl">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
