import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { IMAGE_URL, URL } from "../../config/Config";
import { useAuthContext } from "../../context/AuthContext";
import { IBusiness } from "../../SharedTypes/business";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthContext();
  const businessId = authUser?.businesId;
  const [businessData, setBusinessData] = useState<IBusiness>();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`${URL}/api/businessprofile/${businessId}`);
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          setBusinessData(data);
        }
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchCategory();
  }, [businessId]);

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="w-full bg-gray-100 h-full mxl:w-[1360px]">
        <h1 className="p-5 text-button text-2xl font-medium">
          Profile Information
        </h1>

        <div className="w-11/12 flex mb-4 justify-end">
          <button
            className="bg-button hover:bg-[#06243C] p-2 text-white rounded-md"
            onClick={() => {
              navigate(`/business/updatebusinessprofile/${businessId}`);
            }}
          >
            Edit Profile
          </button>
        </div>

        <div className="flex justify-center mb-10">
          <div className="w-11/12  flex flex-col gap-y-10">
            <div className="bg-white shadow rounded-lg p-4 gap-3 md:gap-10 flex items-center">
              <div className="">
                <img
                  src={`${IMAGE_URL}/${businessData?.profileIcon}`}
                  style={{
                    borderRadius: "50%",
                    width: "120px",
                    height: "120px",
                  }}
                />
              </div>
              <div className="flex text-xs flex-col text-gray-600 gap-2">
                <h1 className="sm:text-xl">{businessData?.businessName}</h1>
                <h1>{businessData?.businessCategory}</h1>
                <h1>{businessData?.businessSubCategory}</h1>
                <h1>{businessData?.businessAddress.street}</h1>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-4 items-center">
              <h1 className="font-bold">Personal Information</h1>

              <table className="mt-5 font-light text-left w-full md:w-1/3 ">
                <tr className="h-10">
                  <th className="font-semibold">Contact Name:</th>
                  <td>{businessData?.contactName}</td>
                </tr>
                <tr className="h-10">
                  <th className="font-semibold">Phone Number:</th>
                  <td>{businessData?.primaryPhone}</td>
                </tr>
                <tr className="h-10">
                  <th className="font-semibold">Email:</th>
                  <td>{businessData?.primaryEmail}</td>
                </tr>
                <tr className="h-10">
                  <th className="font-semibold">Address:</th>
                  <td>{businessData?.businessAddress?.street}</td>
                </tr>
              </table>
            </div>
            <div className="bg-white shadow rounded-lg p-4 items-center">
              <h1 className="font-bold">Business Information</h1>

              <table className="mt-5 font-light text-left w-full md:w-1/3 ">
                <tr className="h-10">
                  <th className="font-semibold">Business Name:</th>
                  <td>{businessData?.businessName}</td>
                </tr>
                <tr className="h-10">
                  <th className="font-semibold">Business Category:</th>
                  <td>{businessData?.businessCategory}</td>
                </tr>
                <tr className="h-10">
                  <th className="font-semibold">SubCategory:</th>
                  <td>{businessData?.businessSubCategory}</td>
                </tr>
                <tr className="h-10">
                  <th className="font-semibold">Phone:</th>
                  <td>{businessData?.primaryPhone}</td>
                </tr>

                <tr className="h-10">
                  <th className="font-semibold">Email:</th>
                  <td>{businessData?.primaryEmail}</td>
                </tr>
              </table>
            </div>
            <div className="bg-white shadow rounded-lg p-4 items-center">
              <h1 className="font-bold">Address Information</h1>

              <table className="mt-5 font-light text-left w-full md:w-1/3 ">
                <tr className="h-10">
                  <th className="font-semibold">Address:</th>
                  <td>{businessData?.businessAddress?.street}</td>
                </tr>
                <tr className="h-10">
                  <th className="font-semibold">Country:</th>
                  <td>{businessData?.businessAddress?.country}</td>
                </tr>
                <tr className="h-10">
                  <th className="font-semibold">State:</th>
                  <td>{businessData?.businessAddress?.state}</td>
                </tr>
                <tr className="h-10">
                  <th className="font-semibold">City:</th>
                  <td>{businessData?.businessAddress?.city}</td>
                </tr>
              </table>
            </div>
            <div className="bg-white shadow rounded-lg p-4 items-center">
              <h1 className="font-bold">Registration Information</h1>

              <table className="mt-5 font-light text-left w-full md:w-1/3 ">
                <tr className="h-10">
                  <th className="font-semibold">Authority:</th>
                  <td>{businessData?.businessRegistration?.authority}</td>
                </tr>
                <tr className="h-10">
                  <th className="font-semibold">Registration Number:</th>
                  <td>
                    {businessData?.businessRegistration?.registrationNumber}
                  </td>
                </tr>
                <tr className="h-10">
                  <th className="font-semibold">Registration On:</th>
                  <td>
                    {businessData?.businessRegistration?.registrationOn
                      ? businessData?.businessRegistration?.registrationOn
                          .toString()
                          .split("T")[0]
                      : ""}
                  </td>
                </tr>
                <tr className="h-10">
                  <th className="font-semibold">Expires On:</th>
                  <td>
                    {businessData?.businessRegistration?.expiresOn
                      ? businessData?.businessRegistration?.expiresOn
                          .toString()
                          .split("T")[0]
                      : ""}
                  </td>
                </tr>
              </table>
            </div>
            <div className="bg-white shadow rounded-lg p-4 items-center">
              <h1 className="font-bold">Social Media Information</h1>

              <table className="mt-5 font-light text-left w-full md:w-1/3 ">
                <tr className="h-10">
                  <th className="font-semibold">
                    {businessData?.socialMedia?.platform}:
                  </th>
                  <td>{businessData?.socialMedia?.url}</td>
                </tr>
              </table>
            </div>
            <div className="bg-white shadow rounded-lg p-4  items-center">
              <div className="flex gap-5 ">
                <h1 className="font-bold">Images</h1>
                {businessData?.imageGallery?.map((image) => (
                  <img
                    src={`${IMAGE_URL}/${image}`}
                    alt="image"
                    style={{
                      width: "100px",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
