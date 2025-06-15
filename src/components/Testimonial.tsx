import React from "react";
import pot1 from "../assets/images/pot1.png";
import pot2 from "../assets/images/pot2.png";
import pot3 from "../assets/images/pot3.png";
import pot4 from "../assets/images/pot4.png";

// Dummy data for testimonials and avatars
const testimonials = [
  {
    rating: 4,
    text: "Lorem ipsum dolor sit amet, consectetur adip iscing elit,.",
    name: "Maxin Will",
    role: "Product Manager",
    initials: "MW",
  },
  {
    rating: 4,
    text: "Lorem ipsum dolor sit amet, consectetur adip iscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.",
    name: "Maxin Will",
    role: "Product Manager",
    initials: "MW",
  },
  {
    rating: 3,
    text: "Lorem ipsum dolor sit amet, consectetur adip iscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.",
    name: "Maxin Will",
    role: "Product Manager",
    initials: "MW",
  },
];

const avatars = [pot1, pot2, pot3, pot4];

const Testimonials: React.FC = () => {
  return (
    <section className="flex flex-col md:flex-row items-center  md:items-start justify-center md:justify-between w-full bg-[#FE51020D] dark:bg-[#151515] px-8 py-6">
      {/* Left Side */}
      <div className="flex-1">
        <div className="flex items-center mb-4">
          {avatars.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`avatar-${idx}`}
              className={`w-12 h-12 rounded-full border-4 border-white -ml-3 first:ml-0`}
              style={{ zIndex: avatars.length - idx }}
            />
          ))}
          {/* <span className="ml-3 w-12 h-12 flex items-center justify-center bg-white text-[#140B07] font-bold text-sm border-2 border-[#FF6A00] rounded-full">
            15K
          </span> */}
        </div>
        <h2
          className="font-bold text-[#292929] dark:text-[#E5E5E5] mb-4"
          style={{
            width: 250,
            height: 48,
            fontSize: "2rem",
            lineHeight: "48px",
          }}
        >
          Testimonials
        </h2>
        <p
          className="text-xl text-[#292929] dark:text-[#E5E5E5] mb-4"
          style={{ width: 610, height: 60 }}
        >
          Discover how our platform is transforming the way professionals gather
          insights and make informed decision.
        </p>
      </div>
      {/* Right Side */}
      <div className="flex-1 flex flex-col gap-8 mt-6 md:mt-0">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="bg-[#FFFFFF] dark:bg-[#0B0B0B] rounded-2xl shadow p-6 w-full max-w-md ml-auto "
          >
            {/* Stars */}
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-6 h-6 ${
                    i < t.rating ? "text-[#FE5102]" : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
                </svg>
              ))}
            </div>
            {/* Text */}
            <p className="text-[#2F2A2A] dark:text-[#9D9D9D] mb-4">{t.text}</p>
            {/* User */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2F2A2A] dark:[#9D9D9D] flex items-center justify-center text-white font-bold text-lg">
                {t.initials}
              </div>
              <div>
                <div className="font-bold text-lg text-[#292929] dark:text-[#9D9D9D]">
                  {t.name}
                </div>
                <div className="text-[#302A2A99] dark:text-[#A5A5A599]">
                  {t.role}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;