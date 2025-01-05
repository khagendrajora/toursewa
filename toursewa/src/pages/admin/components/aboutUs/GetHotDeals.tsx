// /* eslint-disable @typescript-eslint/no-explicit-any */
// import {
//   faPenToSquare,
//   faSpinner,
//   faTrash,
// } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// // import { IAboutUs } from "./../../../../../../backend/src/models/Pages/LandingPage/AboutUs";
// import { useEffect, useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import { URL } from "../../../../config/Config";
// import axios from "axios";

// import { Link, useNavigate } from "react-router-dom";
// import { IHotDeal } from "../../../../../../backend/src/models/HotDeals/HotDeals";

// export const GetHotDeals = () => {
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(true);
//   const [data, setData] = useState<IHotDeal[]>([]);

//   useEffect(() => {
//     const fetchCategory = async () => {
//       try {
//         const res = await fetch(`${URL}/api/getaboutus`);
//         const data = await res.json();
//         if (!res.ok) {
//           toast.error(data.error);
//         } else {
//           setData(data);
//           setIsLoading(false);
//         }
//       } catch (error: any) {
//         toast.error(error);
//       }
//     };
//     fetchCategory();
//   }, []);

//   const Delete = async (id: string | undefined) => {
//     try {
//       const confirmed = window.confirm("Delete");
//       if (confirmed) {
//         const response = await axios.delete(`${URL}/api/deleteaboutus/${id}`);
//         const data = response.data;
//         if (data.message) {
//           toast.success(data.message);
//           setData((prevData) => prevData.filter((item) => item._id != id));
//         } else if (data.error) {
//           toast.error(data.error);
//         }
//       }
//     } catch (error: any) {
//       toast.error(error.message);
//     }
//   };

//   return (
//     <>
//       <ToastContainer theme="colored" position="top-right" />
//       <div className="flex justify-center w-full mt-1">
//         <div className="space-y-5 overflow-x-auto md:m-5 w-full p-3 ">
//           <Link
//             to="/admin/addhotdeals"
//             className="bg-blue-400 p-2 rounded-md font-semibold"
//           >
//             Add +
//           </Link>
//           {isLoading ? (
//             <div className="flex justify-center items-center h-44">
//               <FontAwesomeIcon
//                 icon={faSpinner}
//                 spin
//                 size="2xl"
//                 style={{ color: "#011def" }}
//               />
//               <p>Loading....</p>
//             </div>
//           ) : data.length > 0 ? (
//             <>
//               <table className="table-auto w-full border-collapse border border-slate-400 text-xs md:text-sm ">
//                 <thead className="bg-gray-50 ">
//                   <tr className="">
//                     <th className="border border-slate-300 p-1">SN</th>
//                     <th className="border border-slate-300">Source Address</th>
//                     <th className="border border-slate-300">
//                       Destination address
//                     </th>
//                     <th className="border border-slate-300 ">Starting Price</th>
//                     <th className="border border-slate-300">Travel Name</th>
//                     <th className="border border-slate-300">Vehicle</th>
//                     <th className="border border-slate-300">Action</th>
//                   </tr>
//                 </thead>
//                 {data?.map((data, i) => (
//                   <tbody className="text-start">
//                     <tr key={i}>
//                       <td className="border border-slate-300 ps-5">{i}</td>
//                       <td className="border border-slate-300 ps-5">
//                         {data.sourceAddress}
//                       </td>
//                       <td className="border border-slate-300 ps-5">
//                         {data.destAddress}
//                       </td>
//                       <td className="border border-slate-300 ps-5">
//                         {data.startingPrice}
//                       </td>
//                       <td className="border border-slate-300 ps-5">
//                         {data.travelName}
//                       </td>
//                       <td className="border border-slate-300 ps-5">
//                         {data.vehicle}
//                       </td>
//                       <td className="border flex justify-between  border-slate-300 p-5">
//                         <button
//                           onClick={() =>
//                             navigate(`/admin/updatehotdeals/${data._id}`)
//                           }
//                           className="hover:scale-125"
//                         >
//                           <FontAwesomeIcon
//                             icon={faPenToSquare}
//                             size="2x"
//                             style={{
//                               color: "#4a09e1",
//                               cursor: "pointer",
//                             }}
//                           />
//                         </button>
//                         <button
//                           onClick={() => Delete(data?._id)}
//                           className="hover:scale-125"
//                         >
//                           <FontAwesomeIcon
//                             size="2x"
//                             icon={faTrash}
//                             style={{ color: "#e00606", cursor: "pointer" }}
//                           />
//                         </button>
//                       </td>
//                     </tr>
//                   </tbody>
//                 ))}
//               </table>
//             </>
//           ) : (
//             <>{data.length === 0 && <p>Empty</p>} </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };
