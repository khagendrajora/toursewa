import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { IMG_URL } from "../../../../../../backend/src/config/Config";
import { ButtonLoader } from "../../../../utils/ButtonLoader";

export const UpdateHero = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const [isbutton, setIsButton] = useState(false);

  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [existingheroImage, setExistingHeroImage] = useState<string[]>([]);
  const [newImages, setNewimage] = React.useState<File[]>([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(
          `https://tourbackend-rdtk.onrender.com/api/getherobyid/${id}`
        );
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          setHeading(data.heading);
          setDescription(data.description);
          setExistingHeroImage(data.heroImage);
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
      setExistingHeroImage((prev) => prev.filter((_, i) => i !== index));
    } else {
      setNewimage((prev) => prev.filter((_, i) => i !== index));
    }
  };
  const updateHero = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsButton(true);
      const formData = new FormData();
      formData.append("heading", heading);
      formData.append("description", description);

      existingheroImage.forEach((image) =>
        formData.append("existingheroImage[]", image)
      );

      newImages.forEach((image) => formData.append("heroImage", image));
      const res = await fetch(
        `https://tourbackend-rdtk.onrender.com/api/updatehero/${id}`,
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
                <h1 className="font-bold text-xl lg:text-2xl">
                  Update Hero Contents
                </h1>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="rounded-lg p-2 text-sm text-white bg-button "
              >
                Back to List
              </button>
            </div>

            <form
              onSubmit={updateHero}
              className="flex flex-wrap justify-center mt-10 md:mt-14 text-sm gap-y-5"
            >
              <div className="space-y-1 flex flex-wrap justify-center gap-y-5 gap-x-12 text-sm w-full">
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Heading</label>
                  <input
                    type="text"
                    placeholder="abcdxyz"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={heading}
                    name="heading"
                    onChange={(e) => setHeading(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Description</label>
                  <textarea
                    // type="text"
                    placeholder="Description"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={description}
                    name="description"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="flex flex-col  sm:w-1/3  w-11/12 space-y-1">
                  <h1>Image</h1>
                  <input
                    type="file"
                    name="heroImage"
                    multiple
                    className="border border-gray-600 cursor-pointer"
                    onChange={handleFileChange}
                  />
                  {existingheroImage &&
                    existingheroImage.map((image, i) => (
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
