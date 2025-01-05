import AboutUS from "./components/AboutUS";
import Blogs from "./components/Blogs";
import Destination from "./components/Destination";

import Hero from "./components/Hero";

import Packages from "./components/Packages";
// import { Trek } from "./components/Trek";

const LandingPage = () => {
  return (
    <>
      <div className="w-full bg-white max-w-[1360px] ">
        <Hero />
        <AboutUS />
        <Packages />
        <Destination />
        {/* <Trek /> */}
        <Blogs />
      </div>
    </>
  );
};

export default LandingPage;
