import { useState } from "react";
import * as React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { ButtonLoader } from "../../../../../utils/ButtonLoader";

const AddVehSubCat = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const [isButton, setISButton] = useState(false);
  const [inputs, setInputs] = useState<{
    subCategory: string[];
  }>({
    subCategory: [],
  });

  const [subcategoryInput, setSubCategoryInput] = useState("");

  const add = () => {
    if (subcategoryInput) {
      setInputs((prev) => ({
        ...prev,
        subCategory: [...prev.subCategory, subcategoryInput],
      }));
    }
    setSubCategoryInput("");
  };

  const remove = (index: number) => {
    setInputs((prev) => ({
      ...prev,
      subCategory: prev.subCategory.filter((_, i) => i !== index),
    }));
  };

  const addSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setISButton(true);
    try {
      if (inputs.subCategory.length === 0) {
        return toast.error("Cannot add Empty field");
      } else {
        const res = await fetch(
          `https://tourbackend-rdtk.onrender.com/api/addvehiclesubcategory/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(inputs),
          }
        );
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          toast.success("Added");
          setInputs({
            subCategory: [],
          });
          setTimeout(() => {
            navigate(-1);
          }, 2000);
        }
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
                  Add Sub Category
                </h1>
                <p>Add a Sub Category</p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="bg-button p-1 px-2 h-fit min-w-[85px] text-center max-w-[120px] text-xs hover:bg-[#06243C] text-white  rounded-md md:text-lg"
              >
                Back to List
              </button>
            </div>

            <form
              onSubmit={addSubCategory}
              className="flex flex-wrap justify-center  mt-10 md:mt-14 text-sm gap-y-5 gap-x-12"
            >
              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>Sub Category</label>
                <div className="flex flex-row w-full gap-x-2 items-center">
                  <input
                    type="text"
                    placeholder="abc"
                    className="border border-gray-600 w-full rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    value={subcategoryInput}
                    onChange={(e) => setSubCategoryInput(e.target.value)}
                  />
                  <div>
                    {subcategoryInput ? (
                      <button
                        type="button"
                        onClick={add}
                        className="bg-button rounded-md p-1 text-lg hover:bg-orange-700 text-white"
                      >
                        Add
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                {inputs.subCategory.map((item, index) => (
                  <div key={index} className="flex items-center  gap-x-2">
                    <FontAwesomeIcon
                      icon={faXmark}
                      className="cursor-pointer text-rose-600"
                      onClick={() => remove(index)}
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-center  w-full">
                <button className=" rounded-lg p-3 w-3/4 md:w-1/3 text-sm text-white bg-button hover:bg-orange-700 ">
                  Submit {isButton ? <ButtonLoader /> : ""}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddVehSubCat;
