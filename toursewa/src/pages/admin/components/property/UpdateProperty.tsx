/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";

export const UpdateProperty = () => {
  const params = useParams();
  const id = params._id;
  const [propertyId, setPropertyId] = useState("");
  const [propName, setPropName] = useState("");
  const [propCategory, setPropCategory] = useState("");
  const [propSubCategory, setPropSubCategory] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [street, setStreet] = useState("");
  const [subrub, setSubrub] = useState("");
  const [postcode, setPostcode] = useState("");

  const [email, setEmail] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [businessReg, setBusinessReg] = useState("");
  const [tax, setTax] = useState("");
  const [dateOfEstab, setDateOfEstab] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios
          .get(
            `https://tourbackend-rdtk.onrender.com/api/propertydetails/${id}`
          )
          .then(async (res) => {
            setPropertyId(res.data._id);
            setPropName(res.data.propName);
            setPropCategory(res.data.propCategory);
            setPropSubCategory(res.data.propSubCategory);
            setCountry(res.data.address.country);
            setState(res.data.address.state);
            setEmail(res.data.email);
            setDistrict(res.data.address.district);
            setMunicipality(res.data.address.municipality);
            setStreet(res.data.address.street);

            setSubrub(res.data.address.subrub);
            setPhone(res.data.phone);

            setWebsite(res.data.website);
            setContactName(res.data.contactName);
            setContactPhone(res.data.contactPhone);
            setPostcode(res.data.address.postcode);
            setBusinessReg(res.data.businessReg);

            setTax(res.data.tax);

            setDateOfEstab(res.data.dateOfEstab.split("T")[0]);
          })
          .catch((error) => {
            toast.error(error);
          });
      } catch (error: any) {
        toast.error(error);
      }
    };
    fetchData();
  }, [id]);

  const update = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("propName", propName);
      formData.append("propCategory", propCategory);
      formData.append("propSubCategory", propSubCategory);

      formData.append("address[country]", country);
      formData.append("address[state]", state);
      formData.append("address[district]", district);
      formData.append("address[municipality]", municipality);
      formData.append("address[street]", street);
      formData.append("address[subrub]", subrub);
      formData.append("address[postcode]", postcode);

      formData.append("contactName", contactName);
      formData.append("contactPhone", contactPhone);
      formData.append("phone", phone);
      formData.append("email", email);

      formData.append("website", website);

      formData.append("businessReg", businessReg);
      formData.append("tax", tax);
      formData.append("dateOfEstab", dateOfEstab);

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.put(
        `https://tourbackend-rdtk.onrender.com/api/updateproperty/${id}`,
        formData,
        config
      );
      console.log(res);
      if (res.status == 200) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.error);
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="flex bg-zinc-200 p-1 ">
        <div className="md:p-5 w-full">
          <div className="flex flex-col z-0  rounded-3xl">
            <div className="font-sans text-black   text-start  ">
              <h1 className="font-bold text-center md:text-xl lg:text-2xl"></h1>
              Update Property
            </div>

            <form
              onSubmit={update}
              className="flex flex-col items-center p-3 mt-5 text-sm space-y-7 md:space-y-16 md:text-3xl"
            >
              <div className="flex flex-col w-4/5 space-y-2 md:space-y-5">
                <label>Property Id</label>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full text-sm md:text-2xl "
                  required
                  readOnly
                  value={propertyId}
                  name="propertyId"
                  onChange={(e) => setPropertyId(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-4/5 space-y-2">
                <label>Property Name</label>
                <input
                  type="text"
                  placeholder="abcdxyz"
                  className="border rounded-md p-2 w-full text-sm md:text-2xl"
                  required
                  value={propName}
                  name="propName"
                  onChange={(e) => setPropName(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-4/5 space-y-2">
                <label>Property Category</label>
                <input
                  type="text"
                  placeholder="abc"
                  className="border rounded-md p-2 w-full text-sm md:text-2xl"
                  value={propCategory}
                  name="propCategory"
                  onChange={(e) => setPropCategory(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-4/5 space-y-2 md:space-y-5">
                <label> Sub Category</label>
                <input
                  type="text"
                  placeholder="xyz"
                  className="border rounded-md p-2 w-full text-sm md:text-2xl "
                  required
                  value={propSubCategory}
                  name="propSubCategory"
                  onChange={(e) => setPropSubCategory(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-4/5 space-y-2 md:space-y-5">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="xyz"
                  className="border rounded-md p-2 w-full text-sm md:text-2xl "
                  required
                  value={email}
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-4/5 space-y-2 md:space-y-5">
                <label>Website</label>
                <input
                  type="text"
                  placeholder="xyz"
                  className="border rounded-md p-2 w-full text-sm md:text-2xl "
                  required
                  value={website}
                  name="website"
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <h1>Address</h1>

              <div className="flex flex-col w-4/5 space-y-2">
                <label>Country</label>
                <input
                  type="text"
                  placeholder="abcdxyz"
                  className="border rounded-md p-2 w-full text-sm md:text-2xl"
                  required
                  value={country}
                  name="address[country]"
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-4/5 space-y-2">
                <label>Municipality</label>
                <input
                  type="text"
                  placeholder="abc"
                  className="border rounded-md p-2 w-full text-sm md:text-2xl"
                  value={municipality}
                  name="address[municipality]"
                  onChange={(e) => setMunicipality(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-4/5 space-y-2">
                <label>Street</label>
                <input
                  type="text"
                  placeholder="abc"
                  className="border rounded-md p-2 w-full text-sm md:text-2xl"
                  value={street}
                  name="address[street]"
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-4/5 space-y-2 md:space-y-5">
                <label>State</label>
                <input
                  type="text"
                  placeholder="xyz"
                  className="border rounded-md p-2 w-full text-sm md:text-2xl "
                  required
                  value={state}
                  name="address[state]"
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-4/5 space-y-2 md:space-y-5">
                <label>Subrub</label>
                <input
                  type="text"
                  placeholder="xyz"
                  className="border rounded-md p-2 w-full text-sm md:text-2xl "
                  required
                  value={subrub}
                  name="address[subrub]"
                  onChange={(e) => setSubrub(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-4/5 space-y-2 md:space-y-5">
                <label>Post Code</label>
                <input
                  type="text"
                  placeholder="xyz"
                  className="border rounded-md p-2 w-full text-sm md:text-2xl "
                  required
                  value={postcode}
                  name="address[postcode]"
                  onChange={(e) => setPostcode(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-4/5 space-y-2">
                <label>Business Registration</label>
                <input
                  type="text"
                  placeholder="abcdxyz"
                  className="border rounded-md p-2 w-full text-sm md:text-2xl"
                  required
                  value={businessReg}
                  name="businessReg"
                  onChange={(e) => setBusinessReg(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-4/5 space-y-2">
                <label>Tax</label>
                <input
                  type="text"
                  placeholder="abc"
                  className="border rounded-md p-2 w-full text-sm md:text-2xl"
                  value={tax}
                  name="tax"
                  onChange={(e) => setTax(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-4/5 space-y-2">
                <label>Contact Name</label>
                <input
                  type="text"
                  placeholder="abc"
                  className="border rounded-md p-2 w-full text-sm md:text-2xl"
                  value={contactName}
                  name="contactName"
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-4/5 space-y-2">
                <label>Contact Phone</label>
                <input
                  type="number"
                  placeholder="abc"
                  className="border rounded-md p-2 w-full text-sm md:text-2xl"
                  value={contactPhone}
                  name="contactPhone"
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-4/5 space-y-2">
                <label>Phone</label>
                <input
                  type="number"
                  placeholder="abc"
                  className="border rounded-md p-2 w-full text-sm md:text-2xl"
                  value={phone}
                  name="phone"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-4/5 space-y-2">
                <label>Date Of Establishment</label>
                <input
                  type="date"
                  placeholder="abc"
                  max={new Date().toISOString().split("T")[0]}
                  className="border rounded-md p-2 w-full text-sm md:text-2xl"
                  value={dateOfEstab}
                  name="dateOfEstab"
                  onChange={(e) => setDateOfEstab(e.target.value)}
                />
              </div>

              <div className="flex justify-center w-full">
                <button className="w-4/6 rounded-lg p-3 text-sm text-white bg-blue-800 ">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
