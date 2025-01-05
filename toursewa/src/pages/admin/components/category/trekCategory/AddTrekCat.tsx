import { useState } from "react";
import * as React from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { URL } from "../../../../../config/Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { ButtonLoader } from "../../../../../utils/ButtonLoader";
import { useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";
import HTMLReactParser from "html-react-parser";

const AddTrekCat = () => {
  const [isButton, setISButton] = useState(false);
  const navigate = useNavigate();
  const editor = React.useRef(null);
  const [isSubCategory, setIsSubCategory] = useState(false);
  const [inputs, setInputs] = useState<{
    categoryName: string;
    desc: string;
    subCategory: string[];
  }>({
    categoryName: "",
    desc: "",
    subCategory: [],
  });

  const [subcategoryInput, setusbCategoryInput] = useState("");

  const addSubCategory = () => {
    if (subcategoryInput.trim()) {
      setInputs((prev) => ({
        ...prev,
        subCategory: [...prev.subCategory, subcategoryInput],
      }));
    }
    setusbCategoryInput("");
  };

  const remove = (index: number) => {
    setInputs((prev) => ({
      ...prev,
      subCategory: prev.subCategory.filter((_, i) => i !== index),
    }));
  };

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setISButton(true);
    try {
      const res = await fetch(`${URL}/api/addtrekcategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
      } else {
        toast.success("Category Added");
        setInputs({
          categoryName: "",
          desc: "",
          subCategory: [],
        });
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                <h1 className="font-bold text-xl lg:text-2xl">Add Category</h1>
                <p>Add a Trek Category on Toursewa</p>
              </div>
              <button
                onClick={() => navigate("/admin/trekcategory")}
                className="bg-button p-1 px-2 h-fit min-w-[85px] text-center max-w-[120px] text-xs hover:bg-[#06243C] text-white  rounded-md md:text-lg"
              >
                Back to List
              </button>
            </div>
            <form
              onSubmit={addCategory}
              className="flex flex-wrap justify-center mt-10 md:mt-14 text-sm gap-y-5"
            >
              <div className="space-y-1 flex flex-wrap justify-center gap-y-5 gap-x-12 text-sm w-full">
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Category Name</label>
                  <input
                    type="text"
                    placeholder="Category"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={inputs.categoryName}
                    onChange={(e) =>
                      setInputs({ ...inputs, categoryName: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col w-11/12 space-y-1">
                  <label>Description</label>
                  <JoditEditor
                    ref={editor}
                    value={inputs.desc}
                    onChange={(content) => {
                      setInputs({ ...inputs, desc: content });
                    }}
                  />
                  <div>{HTMLReactParser(inputs.desc)}</div>
                </div>
                {!isSubCategory && (
                  <button
                    className="text-red-500 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();

                      setIsSubCategory(true);
                    }}
                  >
                    Add Sub Category Field
                  </button>
                )}
                {isSubCategory && (
                  <div className="flex flex-col  w-11/12 lg:w-3/4 space-y-1">
                    <div className="flex w-full justify-end">
                      <FontAwesomeIcon
                        icon={faXmark}
                        className="  cursor-pointer text-rose-600"
                        size="xl"
                        onClick={(e) => {
                          e.preventDefault();
                          setusbCategoryInput("");
                          setIsSubCategory(false);
                        }}
                      />
                    </div>
                    <label>Sub Category</label>
                    <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                      <input
                        type="text"
                        placeholder="Sub Category"
                        className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                        value={subcategoryInput}
                        onChange={(e) => setusbCategoryInput(e.target.value)}
                      />
                      <div>
                        {subcategoryInput ? (
                          <button
                            type="button"
                            onClick={addSubCategory}
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
                )}
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

export default AddTrekCat;
