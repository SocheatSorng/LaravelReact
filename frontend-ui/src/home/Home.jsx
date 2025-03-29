import React from "react";
import Banner from "./Banner";
import HomeCategory from "./HomeCategory";
// import CategoryShowCase from './CategoryShowCase';
import Register from "./Register";
// import Footer from '../components/Footer';

const Home = () => {
  return (
    <div>
      <Banner />
      <HomeCategory />
      {/* <CategoryShowCase/> */}
      <Register />
      {/* <Footer/> */}
    </div>
  );
};

export default Home;
