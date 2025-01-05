import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ButtonLoader } from "../../../../utils/ButtonLoader";

const Property = () => {
  const [isButton, setIsButton] = useState(false);
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    propName: "",
    propCategory: "",
    propSubCategory: "",
    email: "",
    website: "",
    phone: "",
    businessReg: "",
    tax: "",
    contactName: "",
    contactPhone: "",
    dateOfEstab: "",
    address: {
      country: "",
      state: "",
      district: "",
      municipality: "",
      street: "",
      subrub: "",
      postcode: "",
    },
  });

  const addProperty = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsButton(true);
      const res = await fetch(
        "https://tourbackend-rdtk.onrender.com/api/addproperty",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inputs),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        setInputs({
          propName: "",
          propCategory: "",
          propSubCategory: "",
          email: "",
          website: "",
          phone: "",
          businessReg: "",
          tax: "",
          contactName: "",
          contactPhone: "",
          dateOfEstab: "",
          address: {
            country: "",
            state: "",
            district: "",
            municipality: "",
            street: "",
            subrub: "",
            postcode: "",
          },
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsButton(false);
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
                <h1 className="font-bold text-xl lg:text-2xl">Add Tour</h1>
                <p>Add a Tour on Toursewa</p>
              </div>
              <button
                onClick={() => navigate("/admin/property")}
                className="bg-button p-1 px-2 h-fit min-w-[85px] text-center max-w-[120px] text-xs hover:bg-[#06243C] text-white  rounded-md md:text-lg"
              >
                Back to List
              </button>
            </div>
            <form
              onSubmit={addProperty}
              className="flex flex-wrap justify-center mt-10 md:mt-14 text-sm gap-y-5"
            >
              <div className="space-y-1 flex flex-wrap justify-center gap-y-5 gap-x-12 text-sm w-full">
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Property Name</label>
                  <input
                    type="text"
                    placeholder="Property Name"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={inputs.propName}
                    onChange={(e) => {
                      setInputs({ ...inputs, propName: e.target.value });
                    }}
                  />
                </div>
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Property Category</label>
                  <input
                    type="text"
                    placeholder="Category"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={inputs.propCategory}
                    onChange={(e) =>
                      setInputs({ ...inputs, propCategory: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Sub Category</label>
                  <input
                    type="text"
                    placeholder="Sub Category"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    value={inputs.propSubCategory}
                    onChange={(e) =>
                      setInputs({ ...inputs, propSubCategory: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={inputs.email}
                    onChange={(e) =>
                      setInputs({ ...inputs, email: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Website</label>
                  <input
                    type="text"
                    placeholder="Website"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={inputs.website}
                    onChange={(e) =>
                      setInputs({ ...inputs, website: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Phone</label>
                  <input
                    type="number"
                    placeholder="Phone Number"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    value={inputs.phone}
                    onChange={(e) =>
                      setInputs({ ...inputs, phone: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Business Registration</label>
                  <input
                    type="text"
                    placeholder="Business Registration"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    value={inputs.businessReg}
                    onChange={(e) =>
                      setInputs({ ...inputs, businessReg: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Tax</label>
                  <input
                    type="text"
                    placeholder="Tax"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={inputs.tax}
                    onChange={(e) =>
                      setInputs({ ...inputs, tax: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Date of Establishment</label>
                  <input
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    value={inputs.dateOfEstab}
                    onChange={(e) =>
                      setInputs({ ...inputs, dateOfEstab: e.target.value })
                    }
                  />
                </div>
              </div>
              <h1 className="text-center font-semibold ">Address</h1>
              <div className="space-y-1 flex flex-wrap justify-center gap-y-5 gap-x-12 text-sm w-full">
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                  <label>Country</label>
                  <input
                    type="text"
                    placeholder="Country"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={inputs.address.country}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        address: { ...inputs.address, country: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm ">
                  <label>State</label>
                  <input
                    type="text"
                    placeholder="State"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={inputs.address.state}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        address: { ...inputs.address, state: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm ">
                  <label>District</label>
                  <input
                    type="text"
                    placeholder="District"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={inputs.address.district}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        address: {
                          ...inputs.address,
                          district: e.target.value,
                        },
                      })
                    }
                  />
                </div>{" "}
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm ">
                  <label>Municipality</label>
                  <input
                    type="text"
                    placeholder="Municipality"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={inputs.address.municipality}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        address: {
                          ...inputs.address,
                          municipality: e.target.value,
                        },
                      })
                    }
                  />
                </div>{" "}
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm ">
                  <label>Street</label>
                  <input
                    type="text"
                    placeholder="Street"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={inputs.address.street}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        address: { ...inputs.address, street: e.target.value },
                      })
                    }
                  />
                </div>{" "}
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm ">
                  <label>SubRub</label>
                  <input
                    type="text"
                    placeholder="subRub"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={inputs.address.subrub}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        address: { ...inputs.address, subrub: e.target.value },
                      })
                    }
                  />
                </div>{" "}
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm ">
                  <label>Post Code</label>
                  <input
                    type="text"
                    placeholder="post code"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={inputs.address.postcode}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        address: {
                          ...inputs.address,
                          postcode: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm ">
                  <label>Contact Name</label>
                  <input
                    type="text"
                    placeholder="Contact Name"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    required
                    value={inputs.contactName}
                    onChange={(e) =>
                      setInputs({ ...inputs, contactName: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm ">
                  <label>Contact Phone</label>
                  <input
                    type="number"
                    placeholder="Contact Number"
                    className="border border-gray-600 rounded-md p-2 text-xs lg:text-lg shadow appearance-none"
                    value={inputs.contactPhone}
                    onChange={(e) =>
                      setInputs({ ...inputs, contactPhone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-center  w-full">
                <button className=" rounded-lg p-3 w-3/4 md:w-1/3 text-sm text-white bg-button hover:bg-orange-700 ">
                  Add Property{isButton ? <ButtonLoader /> : ""}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Property;
