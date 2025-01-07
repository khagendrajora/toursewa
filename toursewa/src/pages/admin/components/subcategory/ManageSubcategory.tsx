/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ISubCategory } from "./../../../../SharedTypes/subCategory";

export const ManageSubcategory = () => {
  const navigate = useNavigate();
  const [subCategory, setSubcategory] = useState<ISubCategory[]>();

  useEffect(() => {
    const fetchSubCategory = async () => {
      try {
        const res = await fetch(
          "https://tourbackend-rdtk.onrender.com/api/getsubcategory"
        );
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          setSubcategory(data);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchSubCategory();
  }, []);

  const Delete = async (id: string | undefined) => {
    try {
      const confirmed = window.confirm("Delete This sub-Category");
      if (confirmed) {
        const response = await axios.delete(
          `https://tourbackend-rdtk.onrender.com/api/deletesubcategory/${id}`
        );
        const data = response.data;
        toast.success(data.message);
        setSubcategory(subCategory?.filter((i) => i._id !== id));
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const Update = async (id: string | undefined) => {
    navigate(`/updatesubcategory/${id}`);
  };

  return (
    <>
      <div className=" flex justify-center items-centerh-screen w-full">
        <div className="w-4/5 m-10  items-center ">
          <Link
            to="/addsubcategory"
            className="bg-blue-400 p-2 m-3 rounded-md font-semibold"
          >
            Add Sub Categoty
          </Link>
          <table className="border-collapse  border-slate-400 w-full text-sm mt-6">
            <thead>
              <tr>
                <th className="border border-slate-400 p-3">SN</th>
                <th className="border border-slate-400 p-3">Sub-Categoey</th>
                <th className="border border-slate-400 p-3">Description</th>
                <th className="border border-slate-400 p-3"> Category Name</th>
                <th className="border border-slate-400 p-3">Action</th>
              </tr>
            </thead>

            <tbody className="font-serif">
              {subCategory &&
                subCategory.map((subCategory, i) => (
                  <tr key={subCategory._id}>
                    <td className="border border-slate-400 text-center">
                      {i + 1}
                    </td>
                    <td className="border border-slate-400 text-center">
                      {subCategory.subCategoryName}
                    </td>
                    <td className="border border-slate-400 text-center">
                      {subCategory.desc}
                    </td>
                    <td className="border border-slate-400 text-center">
                      {subCategory.categoryName}
                    </td>
                    <td className="border border-slate-400 flex justify-evenly p-5 w-full">
                      <button
                        className="rounded-lg text-white hover:bg-blue-900 bg-blue-600 p-2 mr-3"
                        onClick={() => Update(subCategory._id)}
                      >
                        Update
                      </button>
                      <button
                        className=" rounded-lg hover:bg-red-800 text-white bg-red-600 p-2"
                        onClick={() => Delete(subCategory._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
