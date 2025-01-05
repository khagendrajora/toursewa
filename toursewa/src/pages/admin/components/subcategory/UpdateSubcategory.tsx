// /* eslint-disable @typescript-eslint/no-explicit-any */
// import axios from "axios";
// import { useEffect, useState } from "react";
// import * as React from "react";
// import { useParams } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import { toast } from "react-toastify";

// export const UpdateSubcategory = () => {
//   const params = useParams();
//   const id = params.id;

//   const [categoryName, setcategoryName] = useState("");
//   const [description, setDescription] = useState("");
//   const [subCategoryName, setsubCategoryName] = useState("");

//   useEffect(() => {
//     try {
//       axios
//         .get(
//           `https://tourbackend-rdtk.onrender.com/api/subcategorydetails/${id}`
//         )
//         .then((res) => {
//           setcategoryName(res.data.categoryName);
//           setDescription(res.data.description);
//           setsubCategoryName(res.data.subCategoryName);
//         });
//     } catch (error: any) {
//       toast.error(error);
//     }
//   }, [id]);

//   const [category, setCategory] = useState<ICategory[]>();

//   useEffect(() => {
//     const fetchCategory = async () => {
//       try {
//         const res = await fetch(
//           "https://tourbackend-rdtk.onrender.com/api/getcategory"
//         );
//         const data = await res.json();
//         if (!res.ok) {
//           toast.error(data.error);
//         } else {
//           setCategory(data);
//         }
//       } catch (error: any) {
//         toast.error(error);
//       }
//     };
//     fetchCategory();
//   }, []);

//   const UpdateSubCategory = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append("subCategoryName", subCategoryName);
//       formData.append("categoryName", categoryName);
//       formData.append("description", description);

//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       };
//       const response = await axios.put(
//         `https://tourbackend-rdtk.onrender.com/api/updatesubcategory/${id}`,
//         formData,
//         config
//       );

//       console.log(response);
//       if (response.status == 200) {
//         toast.success(response.data.message);
//       }
//     } catch (error: any) {
//       toast.error(error.response.data.error || "Failed to update subcategory");
//     }
//   };
//   return (
//     <>
//       <ToastContainer theme="colored" position="top-right" />
//       <div className="flex justify-center  bg-zinc-200 bg-[url('/images.jpeg')] bg-cover bg-center">
//         <div className="md:p-10 w-11/12">
//           <div className="flex flex-col z-0 justify-center p-1 rounded-3xl">
//             <div className="font-sans text-black p-6  text-start  ">
//               <h1 className="font-bold text-center text-3xl">
//                 Update Sub Category
//               </h1>
//             </div>
//             <form
//               onSubmit={UpdateSubCategory}
//               className="flex  flex-wrap justify-evenly  p-4 mt-5 md:text-lg  text-sm gap-y-12 gap-x-12 "
//             >
//               <div className="flex flex-col w-11/12 space-y-1">
//                 <label>Sub Category</label>
//                 <input
//                   type="text"
//                   placeholder="abc"
//                   className="border rounded-md p-2 w-full text-sm md:text-2xl"
//                   value={subCategoryName}
//                   name="subCategoryName"
//                   onChange={(e) => setsubCategoryName(e.target.value)}
//                 />
//               </div>
//               <div className="flex flex-col w-11/12 space-y-1">
//                 <label>Category Name</label>
//                 <select
//                   className="border rounded-md p-2 w-1/2 text-sm md:text-2xl "
//                   required
//                   value={categoryName}
//                   name="categoryName"
//                   onChange={(e) => setcategoryName(e.target.value)}
//                 >
//                   <option value="" disabled>
//                     Choose Category
//                   </option>
//                   {category &&
//                     category.map((category, i) => (
//                       <option key={i} value={category.categoryName}>
//                         {category.categoryName}
//                       </option>
//                     ))}
//                 </select>
//               </div>

//               <div className="flex flex-col w-11/12 space-y-1">
//                 <label>Description</label>
//                 <input
//                   type="text"
//                   placeholder="abcdxyz"
//                   className="border rounded-md p-2 w-full text-sm md:text-2xl"
//                   value={description}
//                   name="description"
//                   onChange={(e) => setDescription(e.target.value)}
//                 />
//               </div>

//               <div className="flex justify-center w-full">
//                 <button className="w-4/6 rounded-lg p-3 text-sm text-white bg-button md:text-xl">
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
