import AboutUS from "./components/AboutUS";
import Blogs from "./components/Blogs";
import Destination from "./components/Destination";

import Hero from "./components/Hero";

import Packages from "./components/Packages";

const LandingPage = () => {
  return (
    <>
      <div className="w-full bg-white max-w-[1360px] ">
        <Hero />
        <AboutUS />
        <Packages />
        <Destination />

        <Blogs />
      </div>
    </>
  );
};

export default LandingPage;
