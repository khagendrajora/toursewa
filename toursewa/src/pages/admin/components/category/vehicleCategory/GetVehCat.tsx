import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderPlus,
  faMagnifyingGlass,
  faPenToSquare,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import HTMLReactParser from "html-react-parser";
import { VCategory } from "../../../../../SharedTypes/Category/vehicleCategory";
import { URL } from "../../../../../config/Config";
import { ButtonLoader } from "../../../../../utils/ButtonLoader";
import { PageLoader } from "../../../../../utils/PageLoader";

const GetVehCat = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<VCategory[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<VCategory[]>();
  const [isButton, setIsButton] = useState<string | null>(null);
  const [subCategory, setSubCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`${URL}/api/getvehiclecategory`);
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          setCategory(data);
        }
      } catch (error: any) {
        toast.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategory();
  }, []);

  const Delete = async (id: string | undefined) => {
    try {
      const confirmed = window.confirm("Delete This Category");
      if (confirmed) {
        setIsButton(id || "");
        const response = await axios.delete(
          `${URL}/api/deletevehiclecategory/${id}`
        );
        const data = response.data;
        toast.success(data.message);
        setCategory(category?.filter((i) => i._id !== id));
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsButton("");
    }
  };

  const change = (id: string) => {
    setSubCategory((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    if (!category) {
      setFilter(null);
      return;
    }
    const newSearch = search
      ? category?.filter((b) =>
          b.categoryName?.toLowerCase().includes(search.toLowerCase())
        )
      : category;
    setFilter(newSearch);
  }, [search, category]);
  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="h-screen flex flex-col gap-5">
        <div className="flex justify-between flex-wrap gap-y-5">
          <div>
            <h1 className="md:text-3xl sm:text-lg font-bold">
              Vehicle Category List
            </h1>
            <p className="mt-2 text-xs md:text-lg">
              List of Vehicle Category on Toursewa
            </p>
          </div>
          <Link
            to="/admin/vehcategory/adddvehcategory"
            className="bg-button p-1 h-fit min-w-[85px] text-center max-w-[120px] text-xs hover:bg-[#06243C] text-white  rounded-md md:text-lg"
          >
            Add Category
          </Link>
        </div>
        <div className="flex mt-  justify-end">
          <div className="relative">
            <input
              type="text"
              value={search}
              placeholder="Search Category"
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-400  text-black rounded-md shadow-sm w-[130px] md:w-auto p-1 md:p-3 pl-7 md:pl-10"
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute text-gray-400 left-2 top-1/2 md:h-5 md:left-3 transform -translate-y-1/2 text-black-500 pointer-events-none"
            />
          </div>
        </div>
        {isLoading ? (
          <PageLoader />
        ) : (
          <div className=" flex justify-center items-center text-xs">
            <div className="overflow-x-auto space-y-5 ">
              {!filter || Object.keys(filter).length === 0 ? (
                <>
                  <p>Empty</p>
                </>
              ) : (
                <table className="table-auto w-11/12 border-collapse border border-gray-500 text-xs md:text-lg ">
                  <thead>
                    <tr>
                      <th className="border font-normal border-gray-500 p-3">
                        SN
                      </th>
                      <th className="border font-normal border-gray-500 p-3 min-w-[110px] md:min-w-[160px]">
                        Category Name
                      </th>
                      <th className="border font-normal border-gray-500 p-3">
                        Description
                      </th>
                      <th className="border font-normal border-gray-500 p-3 min-w-[100px] md:min-w-[150px]">
                        Sub-Category
                      </th>
                      <th className="border font-normal border-gray-500 p-3">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="font-serif">
                    {filter &&
                      filter.map((category, i) => (
                        <tr key={category._id}>
                          <td className="border border-gray-500 text-center">
                            {i + 1}
                          </td>
                          <td className="border border-gray-500 text-center">
                            {category.categoryName}
                          </td>
                          <td className="border border-gray-500 p-3 text-center">
                            {HTMLReactParser(category.desc || "")}
                          </td>
                          <td className="border relative border-gray-500 text-center">
                            <span
                              className="cursor-pointer text-blue-500"
                              onClick={() => change(category._id || "")}
                            >
                              {category.subCategory?.length}
                              {subCategory === category._id &&
                                category.subCategory && (
                                  <div className="fixed inset-0 flex items-center text-black justify-center bg-opacity-50 z-50">
                                    <div
                                      className="p-1 relative bg-white md:w-1/3 w-1/2"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <FontAwesomeIcon
                                        icon={faXmark}
                                        size="lg"
                                        className=" absolute cursor-pointer right-1 text-red-500"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setSubCategory("");
                                        }}
                                      />

                                      <h3 className="text-sm font-semibold text-center mb-4">
                                        Sub-Categories
                                      </h3>
                                      <div className="max-h-40 overflow-y-auto">
                                        {subCategory === category._id &&
                                          category.subCategory &&
                                          category.subCategory.map(
                                            (data, i) => (
                                              <ol className="text-start">
                                                <li className="p-1">
                                                  {i + 1}. {data}
                                                </li>
                                              </ol>
                                            )
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                            </span>
                          </td>
                          <td className="flex justify-between flex-col border gap-6  text-white p-2 ">
                            <div className="flex gap-4 md:gap-7">
                              <button
                                className="hover:scale-125"
                                onClick={() =>
                                  navigate(
                                    `/admin/vehcategory/updatvehcategory/${category.categoryId}`
                                  )
                                }
                                title="Edit"
                              >
                                <FontAwesomeIcon
                                  icon={faPenToSquare}
                                  size="lg"
                                  style={{ color: "#005af5" }}
                                />
                              </button>

                              <button
                                className="hover:scale-125"
                                title="Add Sub Category"
                                onClick={() =>
                                  navigate(
                                    `/admin/vehcategory/addsubcategory/${category.categoryId}`
                                  )
                                }
                              >
                                <FontAwesomeIcon
                                  icon={faFolderPlus}
                                  size="lg"
                                  style={{ color: "#0be50e" }}
                                />
                              </button>

                              <button
                                className="hover:scale-125"
                                onClick={() => Delete(category._id)}
                                title="Delete"
                              >
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  size="lg"
                                  style={{ color: "#ff0000" }}
                                  title="Delete"
                                />
                                {isButton ? <ButtonLoader /> : ""}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GetVehCat;
