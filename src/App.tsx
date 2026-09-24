import React from "react";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import RestaurantMenu from "./components/RestaurantMenu";
import About from "./components/About";
import GalleryLightbox from "./components/GalleryLightbox";
import ReservationSection from "./components/ReservationSection";

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <RestaurantMenu />
      <About />
      <GalleryLightbox />
      <ReservationSection />
    </>
  );
};
