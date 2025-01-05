import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { stateData } from "../../../../../validation/FormValidations";
import { URL } from "../../../../../config/Config";
import { toast, ToastContainer } from "react-toastify";

export const AddState = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      state: "",
    },
    validationSchema: stateData,
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await fetch(`${URL}/api/addstate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
        } else {
          toast.success(data.message);
          resetForm();
          setTimeout(() => {
            navigate(-1);
          }, 2000);
        }
      } catch (error: any) {
        toast.error(error);
      }
    },
  });

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <div className="flex p-1 ">
        <div className="md:p-5 w-full">
          <div className="flex flex-col  rounded-3xl">
            <div className="font-sans text-black   text-start  ">
              <h1 className="font-bold text-center md:text-xl lg:text-2xl">
                Add State
              </h1>
            </div>

            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-wrap justify-center mt-4 md:mt-14 lg:text-sm text-sm gap-y-5 gap-x-12"
            >
              <div className="flex flex-col sm:w-1/3 w-11/12 space-y-1 text-sm">
                <label>State Name</label>
                <input
                  type="text"
                  name="state"
                  placeholder="State Name"
                  className="border rounded-md p-2 text-xs md:text-lg shadow appearance-none"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.state && formik.errors.state && (
                  <div className="text-red-500">{formik.errors.state}</div>
                )}
              </div>

              <div className="flex w-full justify-center">
                <button
                  type="submit"
                  className="rounded-lg p-3 w-1/3 text-sm text-white bg-blue-800 md:text-xl"
                >
                  Register
                </button>
              </div>
            </form>
            <div className="flex justify-center">
              <div className="flex gap-1">
                <button
                  onClick={() => navigate(-1)}
                  className="text-gray-500 text-end"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
