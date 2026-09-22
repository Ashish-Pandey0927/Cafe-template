import React from "react";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import RestaurantMenu from "./components/RestaurantMenu";

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <RestaurantMenu />
    </>
  );
};
