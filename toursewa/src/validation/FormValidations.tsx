import * as yup from "yup";

export const businessSignup = yup.object({
  businessName: yup.string().required("Business name is required"),
  businessCategory: yup.string().required("Please select a category"),
  businessRegistration: yup.object({
    registrationNumber: yup
      .string()
      .required("Registration Number is required"),
  }),
  primaryEmail: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),
  primaryPhone: yup
    .string()
    .required("Phone number is required")
    .test("phone-length", "Phone Number is invalid", (value) => {
      if (!value) return false;
      if (value.startsWith("+977")) {
        const parts = value.split("");
        if (parts.length < 2) return false;

        const number = parts.slice(1).join("");
        return number.length === 13;
      }
      if (value.startsWith("9")) return value.length === 13;
      if (value.startsWith("0")) return value.length === 9;
      return false;
    }),
  businessAddress: yup.object({
    country: yup.string().required("Country is required"),
    state: yup.string().required("State is required"),
  }),
  businessPwd: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export const driverData = yup.object({
  vehicleId: yup.string().required("Add Vehicle"),
  // businessId: yup.string().required("Add business Id"),
  driverName: yup.string().required("Driver`s Name is required"),
  driverEmail: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),
  driverPhone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Must be a valid 10-digit number")
    .required("Phone number is required"),
  driverAge: yup
    .string()
    .matches(/^[0-9]/, "Age must be a number")
    .required("Age is required"),
  driverPwd: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export const clientSignup = yup.object({
  userName: yup.string().required("Name is required"),
  userEmail: yup.string().email("Invalid email").required("Email is required"),

  userPwd: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  cPwd: yup
    .string()
    .oneOf([yup.ref("userPwd")], "Password not matched")
    .required("Confirm Password is required"),
});

export const newPassword = yup.object({
  userPwd: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  newPwd: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export const countryData = yup.object({
  country: yup.string().required("Country Name is required"),
});
export const municipalityData = yup.object({
  country: yup.string().required("Country Name is required"),
  state: yup.string().required("State Name is required"),
  municipality: yup.string().required("Municipality Name is required"),
});
export const stateData = yup.object({
  country: yup.string().required("Country Name is required"),
  state: yup.string().required("State Name is required"),
});
export const districtData = yup.object({
  state: yup.string().required("State Name is required"),
  district: yup.string().required("State Name is required"),
});

export const tourBookForm = yup.object({
  passengerName: yup.string().required("Fill Name"),
  email: yup.string().required("Fill Email"),
  tickets: yup.string().required("How Many Peoples?"),
  date: yup.string().required("Provide Date"),
  phone: yup
    .string()
    .required("Provide Contact Number")
    .test("phone-length", "Phone Number is invalid", (value) => {
      if (!value) return false;
      if (value.startsWith("9") && value.length === 10) {
        return true;
      } else if (value.length === 8) {
        return true;
      }
    }),
});

export const locationData = yup.object({
  country: yup.string().required("Country is Required"),
  state: yup.string().required("State is Required"),
  municipality: yup.string().required("municipality is Required"),
  locationName: yup.string().required("location is Required"),
  geo: yup.string().required("Required"),
});

export const hotDeals = yup.object({
  sourceAddress: yup.string().required("Define Starting Address"),
  destAddress: yup.string().required("Define Destination Address"),
  price: yup.string().required("Give Price"),
  date: yup.string().required("Provide Price"),
  time: yup.string().required("Provide Time"),
});
