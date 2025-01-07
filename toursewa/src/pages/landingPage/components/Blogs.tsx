/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { IBlogs } from "../../../.../../SharedTypes/Pages/LandingPage/Blogs";
import { URL } from "../../../config/Config";

const Blogs = () => {
  const [blogs, setBlogs] = useState<IBlogs[]>([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`${URL}/api/getblogs`);
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          setBlogs(data);
        }
      } catch (error: any) {
        console.error(error);
      }
    };
    fetchCategory();
  }, []);
  return (
    <>
      <div className="flex flex-col mt-4 overflow-y-auto bg-white gap-3 p-2">
        <div className="flex justify-between">
          <h1 className="w-full text-button  font-bold text-lg">Blogs</h1>
        </div>
        <div className="flex overflow-x-auto p-1 gap-5">
          {blogs.length > 0 &&
            blogs.map((blogs, i) => (
              <div
                className=" font-medium flex flex-col items-center gap-1 flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 text-sky-950 "
                key={i}
              >
                <div className="w-fit">
                  <img
                    src="dubai.jpg"
                    alt={`${blogs.title}`}
                    style={{
                      borderRadius: "50%",
                      width: "200px",
                      height: "200px",
                    }}
                    className=""
                  />
                </div>
                <div className="flex min-w-[150px] rounded-full justify-center text-button   border border-slate-700 ">
                  <h1 className="">{blogs.title}</h1>

                  {/* <p className=" text-sm  lg:text-lg  ">
                    {HTMLReactParser(blogs.desc)}
                  </p> */}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Blogs;
