import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IBusiness } from "../../../../../../backend/src/models/business";
import { IMAGE_URL, URL } from "../../../../config/Config";
import { PageLoader } from "../../../../utils/PageLoader";

const BusinessProfile = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.businesId;
  const [isLoading, setIsLoading] = useState(true);
  const [businessData, setBusinessData] = useState<IBusiness | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      axios
        .get(`${URL}/api/businessprofile/${id}`)
        .then((res) => {
          setBusinessData(res.data);
        })
        .catch((error) => {
          toast.error(error.message);
        });
      setIsLoading(false);
    };
    fetchBusiness();
  }, [id]);

  return (
    <>
      {isLoading ? (
        <PageLoader />
      ) : (
        <>
          <h1 className="text-xl font-bold">Profile Information</h1>

          <div className="w-11/12 flex mb-4 justify-end">
            <button
              className="rounded-lg p-3 text-xs text-white bg-button hover:bg-orange-700 md:text-lg"
              onClick={() => {
                navigate(`/admin/business/updatebusiness/${businessData?._id}`);
              }}
            >
              Edit Profile
            </button>
          </div>
          <>
            <div className="flex justify-center mb-10">
              <div className="w-11/12 flex flex-col  gap-y-10">
                <div className="bg-white shadow rounded-lg p-4 flex items-center">
                  <div className="">
                    <img
                      src={`${IMAGE_URL}/${businessData?.profileIcon}`}
                      style={{
                        borderRadius: "50%",
                        width: "120px",
                        height: "120px",
                        marginRight: "40px",
                      }}
                    />
                  </div>
                  <div className="flex text-xs flex-col text-gray-600 gap-2">
                    <h1 className="text-xl">{businessData?.businessName}</h1>
                    <h1>{businessData?.businessCategory}</h1>
                    <h1>{businessData?.businessSubCategory}</h1>
                    <h1>{businessData?.businessAddress?.street}</h1>
                  </div>
                </div>
                <div className="bg-white shadow rounded-lg p-4 items-center">
                  <h1 className="font-bold text-button">
                    Personal Information
                  </h1>

                  <table className="mt-5 font-light text-left w-full md:w-1/2  ">
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
                  <h1 className="font-bold text-button">
                    Business Information
                  </h1>

                  <table className="mt-5 font-light text-left w-full md:w-1/2 ">
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
                  <h1 className="font-bold text-button">Address Information</h1>

                  <table className="mt-5 font-light text-left w-full md:w-1/2 ">
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
                  <h1 className="font-bold text-button">
                    Registration Information
                  </h1>

                  <table className="mt-5 font-light text-left w-full md:w-1/4 ">
                    <tr className="h-10">
                      <th className="font-semibold">Authority:</th>
                      <td>{businessData?.businessRegistration?.authority}</td>
                    </tr>
                    <tr className="h-10">
                      <th className="font-semibold min-w-[150px]">
                        Registration Number:
                      </th>
                      <td>
                        {businessData?.businessRegistration?.registrationNumber}
                      </td>
                    </tr>
                    <tr className="h-10">
                      <th className="font-semibold">Registration On:</th>
                      <td>
                        {businessData?.businessRegistration
                          ?.registrationOn instanceof Date
                          ? businessData?.businessRegistration?.registrationOn.toLocaleDateString()
                          : businessData?.businessRegistration?.registrationOn}
                      </td>
                    </tr>
                    <tr className="h-10">
                      <th className="font-semibold">Expires On:</th>
                      <td>
                        {businessData?.businessRegistration
                          ?.expiresOn instanceof Date
                          ? businessData?.businessRegistration?.expiresOn
                              .toLocaleDateString()
                              .split("T")[0]
                          : businessData?.businessRegistration?.expiresOn}
                      </td>
                    </tr>
                  </table>
                </div>
                <div className="bg-white shadow rounded-lg p-4 items-center">
                  <h1 className="font-bold text-button">
                    Social Media Information
                  </h1>

                  <table className="mt-5 font-light text-left w-full md:w-1/2 ">
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
                    <h1 className="font-bold text-button">Images</h1>
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
          </>
        </>
      )}
    </>
  );
};

export default BusinessProfile;
