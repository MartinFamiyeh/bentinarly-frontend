import React from "react";
import Faqs from "../components/contact/Faqs";
import Hero from "../components/contact/Hero";

const Contact: React.FC = () => {
  return (
    <div className="dark:bg-[#0B0B0B]">
      <Hero />
      <Faqs />
    </div>
  );
};

export default Contact;
