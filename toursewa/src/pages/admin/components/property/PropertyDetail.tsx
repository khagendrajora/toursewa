/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { IProperty } from "../../../../../../backend/src/models/property";

export const PropertyDetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const [property, setProperty] = useState<IProperty>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://tourbackend-rdtk.onrender.com/api/propertydetails/${id}`
        );
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error);
        } else {
          setProperty(data);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchData();
  }, [id]);

  const UpdateProperty = async (id: any) => {
    navigate(`/admin/property/updateproperty/${id}`);
  };
  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="flex justify-center  items-center w-full">
        <div className="p-10 w-3/4">
          {property && (
            <>
              <table className="table-auto  border-collapse border border-slate-600 w-full text-center">
                <tbody>
                  <tr className="border border-slate-600">
                    <th>Property Name</th>
                    <td className="border border-slate-600">
                      {property.propName}
                    </td>
                  </tr>
                  <tr className="border border-slate-600">
                    <th>Property Category</th>
                    <td className="border border-slate-600">
                      {property.propCategory}
                    </td>
                  </tr>
                  <tr className="border border-slate-600">
                    <th>Sub Category</th>
                    <td className="border border-slate-600">
                      {property.propSubCategory}
                    </td>
                  </tr>

                  <tr className="border border-slate-600">
                    <th colSpan={2}>Property Address</th>
                  </tr>
                  <tr className="border border-slate-600">
                    <th className="">Country</th>
                    <td className="border border-slate-600">
                      {property.address.country}
                    </td>
                  </tr>
                  <tr className="border border-slate-600">
                    <th> State</th>
                    <td className="border border-slate-600">
                      {property.address.state}
                    </td>
                  </tr>
                  <tr className="border border-slate-600">
                    <th> District</th>
                    <td className="border border-slate-600">
                      {property.address.district}
                    </td>
                  </tr>
                  <tr className="border border-slate-600">
                    <th> Municipality</th>
                    <td className="border border-slate-600">
                      {property.address.municipality}
                    </td>
                  </tr>

                  <tr className="border border-slate-600">
                    <th>Street</th>

                    <td className="border border-slate-600">
                      {property.address.street}
                    </td>
                  </tr>
                  <tr className="border border-slate-600">
                    <th>Subrub</th>
                    <td className="border border-slate-600">
                      {property.address.subrub}
                    </td>
                  </tr>
                  <tr className="border border-slate-600">
                    <th>Post Code</th>
                    <td className="border border-slate-600">
                      {property.address.postcode}
                    </td>
                  </tr>
                  <tr className="border border-slate-600">
                    <th>Contact Name</th>
                    <td className="border border-slate-600">
                      {property.contactName}
                    </td>
                  </tr>

                  <tr className="border border-slate-600">
                    <th>Business Registration</th>
                    <td className="border border-slate-600">
                      {property.businessReg}
                    </td>
                  </tr>

                  <tr className="border border-slate-600">
                    <th>Tax</th>
                    <td className="border border-slate-600">{property.tax}</td>
                  </tr>

                  <tr className="border border-slate-600">
                    <th>Date Of Establishment</th>
                    <td className="border border-slate-600">
                      {property.dateOfEstab.toString()}
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                className="p-3 rounded-md bg-blue-300"
                onClick={() => UpdateProperty(property._id)}
              >
                Update Profile
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};
