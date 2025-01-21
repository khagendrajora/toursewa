/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { IMAGE_URL } from "../../../../config/Config";
import { ButtonLoader } from "../../../../utils/ButtonLoader";
import { useNavigate, useParams } from "react-router-dom";
import JoditEditor from "jodit-react";
import HTMLReactParser from "html-react-parser";

export const UpdateBlogs = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const editor = React.useRef(null);
  const [isbutton, setIsButton] = useState(false);
  const [blogId, setBlogId] = useState(id);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [existingblogsImage, setExistingBlogsImage] = useState<string[]>([]);
  const [newImages, setNewimage] = React.useState<File[]>([]);

  const config = React.useMemo(
    () => ({
      height: 400,
      toolbarSticky: false,
    }),
    []
  );
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(
          `https://tourbackend-rdtk.onrender.com/api/getblogbyid/${id}`
        );
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          setBlogId(data.blogId);
          setTitle(data.title);
          setDesc(data.desc);
          setExistingBlogsImage(data.blogsImage);
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
      setExistingBlogsImage((prev) => prev.filter((_, i) => i !== index));
    } else {
      setNewimage((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsButton(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("desc", desc);

      existingblogsImage.forEach((image) =>
        formData.append("existingblogsImage[]", image)
      );

      newImages.forEach((image) => formData.append("blogsImage", image));
      const res = await fetch(
        `https://tourbackend-rdtk.onrender.com/api/updateblogs/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      console.log(res);
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
      <ToastContainer theme="colored" position="top-center" />
      <div className="flex">
        <div className="w-full">
          <div className="flex flex-col">
            <div className="flex justify-between">
              <div className="text-black flex flex-col gap-1 ">
                <h1 className="font-bold text-xl lg:text-2xl">Update Blog</h1>
                <p>Update a Blog on Toursewa</p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="bg-button p-1 px-2 h-fit min-w-[85px] text-center max-w-[120px] text-xs hover:bg-[#06243C] text-white  rounded-md md:text-lg"
              >
                Back to List
              </button>
            </div>

            <form
              onSubmit={updateBlog}
              className="flex flex-wrap justify-center mt-10 md:mt-14 text-sm gap-y-5"
            >
              <div className="space-y-1 flex flex-wrap justify-center gap-y-5 gap-x-12 text-sm w-full">
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Blog Id</label>
                  <input
                    type="text"
                    placeholder="xyz"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    readOnly
                    value={blogId}
                    name="blogId"
                    onChange={(e) => setBlogId(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Title</label>
                  <input
                    type="text"
                    placeholder="abcdxyz"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={title}
                    name="title"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="flex flex-col w-11/12  space-y-1">
                  <label>Description</label>
                  <JoditEditor
                    ref={editor}
                    value={desc}
                    config={config}
                    onChange={(content) => {
                      setDesc(content);
                    }}
                  />
                  <div>{HTMLReactParser(desc)}</div>
                </div>

                <div className="flex flex-col  sm:w-1/3  w-11/12 space-y-1">
                  <h1>Blog Images</h1>
                  <input
                    type="file"
                    name="blogsImages"
                    multiple
                    className="border border-gray-600 cursor-pointer"
                    onChange={handleFileChange}
                  />
                  {existingblogsImage &&
                    existingblogsImage.map((image, i) => (
                      <div key={i}>
                        <FontAwesomeIcon
                          icon={faXmark}
                          onClick={() => removeImage(i, true)}
                        />
                        <img
                          src={`${IMAGE_URL}/${image}`}
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
                <button className=" rounded-lg p-3 w-3/4 md:w-1/3 text-sm text-white bg-button hover:bg-orange-600 ">
                  Update {isbutton ? <ButtonLoader /> : ""}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
