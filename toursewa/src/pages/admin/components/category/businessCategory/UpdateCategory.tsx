/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import * as React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import JoditEditor from "jodit-react";
import HTMLReactParser from "html-react-parser";
import { URL } from "../../../../../config/Config";
import { ButtonLoader } from "../../../../../utils/ButtonLoader";

const UpdateCategory = () => {
  const params = useParams();
  const editor = React.useRef(null);
  const id = params.id;
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState("");
  const [desc, setDesc] = useState("");
  const [subCategory, setSubCategory] = useState<string[]>([]);
  const [isButton, setISButton] = useState(false);
  const [subcategoryInput, setSubCategoryInput] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${URL}/api/businesscategorydetail/${id}`);
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          setCategoryName(data.categoryName);
          setDesc(data.desc);
          setSubCategory(data.subCategory);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchData();
  }, []);

  const add = () => {
    if (subcategoryInput.trim()) {
      setSubCategory((prevData) => [...prevData, subcategoryInput]);
    }
    setSubCategoryInput("");
  };

  const remove = (index: number) => {
    setSubCategory((prev) => prev.filter((_, i) => i !== index));
  };

  const update = async (e: React.FormEvent) => {
    e.preventDefault();
    setISButton(true);
    try {
      const payload = {
        categoryName,
        desc,
        subCategory,
      };

      const res = await fetch(`${URL}/api/updatebusinesscategory/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
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
                <h1 className="font-bold text-center md:text-xl lg:text-2xl">
                  Update Category Data
                </h1>{" "}
                <p>Update Category Data</p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="bg-button p-1 px-2 h-fit min-w-[85px] text-center max-w-[120px] text-xs hover:bg-[#06243C] text-white  rounded-md md:text-lg"
              >
                Back to List
              </button>
            </div>
            <form
              onSubmit={update}
              className="flex flex-wrap justify-center  mt-10 md:mt-14 text-sm gap-y-5 gap-x-12"
            >
              <div className="space-y-1 flex flex-wrap justify-center gap-y-5 gap-x-12 text-sm w-full">
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Category Name</label>
                  <input
                    type="text"
                    placeholder="xyz"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={categoryName}
                    name="categoryName"
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:w-1/3  w-11/12 space-y-1 text-sm">
                  <label>Sub Category</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="abc"
                      className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                      value={subcategoryInput}
                      name="subCategory"
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
                  <div className="flex flex-wrap ">
                    {subCategory &&
                      subCategory.map((subCategory, i) => (
                        <div key={i}>
                          <FontAwesomeIcon
                            icon={faXmark}
                            color="red"
                            className="cursor-pointer"
                            onClick={() => remove(i)}
                          />
                          <span className="me-5">{subCategory}</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="flex flex-col w-11/12  space-y-1">
                  <label>Description</label>
                  <JoditEditor
                    ref={editor}
                    value={desc}
                    onChange={(content) => {
                      setDesc(content);
                    }}
                  />
                  <div>{HTMLReactParser(desc)}</div>
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

export default UpdateCategory;
