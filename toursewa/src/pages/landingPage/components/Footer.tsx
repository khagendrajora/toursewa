import {
  faFacebook,
  faInstagram,
  faWhatsapp,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
  return (
    <>
      <div className="bg-zinc-100 w-full  mt-10 ">
        <div className="md:px-16 flex justify-center text-xs  text-slate-500 flex-col">
          <div className="flex gap- justify-center p-1 gap-y- flex-wrap lg:flex-nowrap">
            <div className="flex flex-col font-semibold gap-y-2 w-1/4 min-w-[150px]  sm:min-w-[200px]  shadow p-4">
              <div className="w-fit flex flex-col pb-1 ">
                <h1 className=" w-full  pb-0 font-bold text-xl">
                  Join With Us
                </h1>
                <div className="bg-button h-[2px] animate-scaleX"></div>
              </div>
              <h1>Become Partner</h1>
              <h1>Become Creator</h1>
              <h1>Join our Team</h1>
              <h1>Sign up now</h1>
            </div>
            <div className="flex flex-col font-semibold gap-y-2 w-1/4 shadow min-w-[150px]  sm:min-w-[200px] p-4 ">
              <div className="w-fit flex flex-col pb-1">
                <h1 className=" w-full  pb-0 font-bold text-xl">Company</h1>
                <div className="bg-button h-[2px] animate-scaleX"></div>
              </div>
              <h1>About Us</h1>
              <h1>Privacy Policy</h1>
              <h1>Refund Policy</h1>
              <h1>Terms of Services</h1>
            </div>
            <div className="flex flex-col font-semibold gap-y-2 shadow w-1/4 min-w-[175px]  sm:min-w-[200px] p-4 ">
              <div className="w-fit flex flex-col  pb-1">
                <h1 className=" w-full  pb-0 font-bold text-xl">
                  Stay Connected
                </h1>
                <div className="bg-button h-[2px] animate-scaleX"></div>
              </div>
              <h1>TourSewa Pvt.Ltd</h1>
              <h1>Kathmandu 1 Newroad</h1>
              <h1>support@toursewa.com</h1>
              <h1>+977xxxxx</h1>
            </div>

            <div className="flex flex-col justify-center gap-3 items-center w-1/4 shadow min-w-[150px] p-4 sm:min-w-[200px]  ">
              <img src="/logo.png" className=" w-2/3" />

              <div className="flex justify-center w-full">
                <img src="google.png" className="w-1/3 cursor-pointer" />
                <img src="apple.png" className="w-1/3 cursor-pointer" />
              </div>

              <div className="flex gap-5">
                <FontAwesomeIcon
                  icon={faFacebook}
                  size="lg"
                  className="hover:scale-125 cursor-pointer bg-white p-1 rounded-full"
                  style={{ color: "#138be7" }}
                />
                <FontAwesomeIcon
                  icon={faXTwitter}
                  size="lg"
                  className="hover:scale-125 cursor-pointer bg-white p-1 rounded-full"
                  style={{ color: "" }}
                />

                <FontAwesomeIcon
                  icon={faWhatsapp}
                  size="lg"
                  className="hover:scale-125 cursor-pointer bg-white p-1 rounded-full"
                  style={{ color: "#2afa00" }}
                />
                <FontAwesomeIcon
                  icon={faYoutube}
                  size="lg"
                  className="hover:scale-125 cursor-pointer bg-white p-1 rounded-full"
                  style={{ color: "#d10a0a" }}
                />
                <FontAwesomeIcon
                  icon={faInstagram}
                  size="lg"
                  className="hover:scale-125 cursor-pointer bg-white p-1 rounded-full"
                  style={{ color: "#d10a0a" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center text-xs">
        Copyright &#64; 2024. Tour Sewa Pvt Ltd. All rights reserved{" "}
      </div>
    </>
  );
};

export default Footer;
