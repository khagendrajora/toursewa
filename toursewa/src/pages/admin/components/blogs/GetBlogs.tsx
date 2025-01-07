/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { IBlogs } from "../../../../SharedTypes/Pages/LandingPage/Blogs";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { IMAGE_URL, URL } from "../../../../config/Config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { PageLoader } from "../../../../utils/PageLoader";
import { ButtonLoader } from "../../../../utils/ButtonLoader";
import HTMLReactParser from "html-react-parser";

export const GetBlogs = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<IBlogs[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<IBlogs[]>([]);
  const [isButton, setIsButton] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`${URL}/api/getblogs`);
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          setData(data);
          setIsLoading(false);
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
      const confirm = window.confirm("Delete Blog");
      if (confirm) {
        setIsButton(id || "");
        const response = await axios.delete(`${URL}/api/deleteblog/${id}`);
        const data = response.data;
        if (data.message) {
          toast.success(data.message);
          setData((prevData) => prevData.filter((b) => b._id != id));
        } else if (data.error) {
          toast.error(data.error);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsButton("");
    }
  };

  useEffect(() => {
    if (!data) {
      setFilter(null);
      return;
    }
    const newSearch = search
      ? data?.filter((b) =>
          b.title?.toLowerCase().includes(search.toLowerCase())
        )
      : data;
    setFilter(newSearch);
  }, [search, data]);

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="h-screen flex flex-col gap-5">
        <div className="flex justify-between flex-wrap gap-y-5">
          <div>
            <h1 className="md:text-3xl sm:text-lg font-bold">Blogs List</h1>
            <p className="mt-2 text-xs md:text-lg">List of Blogs on Toursewa</p>
          </div>
          <Link
            to="/admin/blogs/addblogs"
            className="bg-button p-1 h-fit min-w-[85px] text-center max-w-[120px] text-xs hover:bg-[#06243C] text-white  rounded-md md:text-lg"
          >
            Add Blogs
          </Link>
        </div>
        <div className="flex mt-  justify-end">
          <div className="relative">
            <input
              type="text"
              value={search}
              placeholder="Search Blogs"
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-400 text-gray-400  rounded-md shadow-sm w-[130px] md:w-auto p-1 md:p-3 pl-7 md:pl-10"
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-2 top-1/2 md:h-5 md:left-3 transform -translate-y-1/2 text-black-500 pointer-events-none"
            />
          </div>
        </div>
        {isLoading ? (
          <PageLoader />
        ) : (
          <div className=" flex justify-center w-full items-center text-xs">
            <div className="overflow-x-auto space-y-5 ">
              {!filter || Object.keys(filter).length === 0 ? (
                <>
                  <p>Empty</p>
                </>
              ) : (
                <table className="table-auto border-collapse w-full  border border-gray-500 text-xs md:text-lg ">
                  <thead className="bg-neutral-400 text-white">
                    <tr className="">
                      <th className="border font-normal border-gray-500 p-3">
                        SN
                      </th>
                      <th className="border font-normal border-gray-500 p-3">
                        Title
                      </th>
                      <th className="border font-normal border-gray-500 p-3">
                        Description
                      </th>
                      <th className="border font-normal border-gray-500 p-3">
                        Images
                      </th>

                      <th className="border font-normal border-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {filter?.map((data, i) => (
                      <tr key={data._id} className="h-full">
                        <td className="border font-normal border-gray-500 p-3">
                          {i + 1}
                        </td>
                        <td className="border font-normal border-gray-500 p-3">
                          {data.title}
                        </td>
                        <td className="border font-normal border-gray-500 p-3 text-wrap w-1/2">
                          {HTMLReactParser(data.desc)}
                        </td>
                        <td className="border font-normal border-gray-500 p-3 ">
                          {data.blogsImage &&
                            data.blogsImage.map((image, i) => (
                              <img
                                key={i}
                                src={`${IMAGE_URL}/${image}`}
                                className="rounded-md w-full h-20 "
                              />
                            ))}
                        </td>

                        <td className="flex justify-between flex-col border gap-6  text-white p-3 ">
                          <div className="flex gap-7 md:gap-10">
                            <button
                              onClick={() =>
                                navigate(`/admin/updateblogs/${data.blogId}`)
                              }
                              className="hover:scale-110 "
                            >
                              <FontAwesomeIcon
                                icon={faPenToSquare}
                                size="lg"
                                style={{
                                  color: "#4a09e1",
                                  cursor: "pointer",
                                }}
                              />
                            </button>

                            <button
                              onClick={() => Delete(data._id)}
                              className="hover:scale-110"
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                size="lg"
                                style={{
                                  color: "#e40707",
                                  cursor: "pointer",
                                }}
                              />{" "}
                              {isButton === data._id ? <ButtonLoader /> : ""}
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
