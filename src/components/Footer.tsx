import React from "react";
import Logo from "../assets/icons/logo.svg";
import Twitter from "../assets/icons/twitter.svg";
import Facebook from "../assets/icons/facebook.svg";
import Instagram from "../assets/icons/insta.svg";


const Footer: React.FC = () => {
  const footerLinks = [
  {
    heading: "Home",
    links: [
      { label: "Features", href: "#features" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "Get Paid", href: "#get-paid" },
    ],
  },
  {
    heading: "Solutions",
    links: [
      { label: "Services", href: "#services" },
      { label: "Survey Design", href: "#survey-design" },
      { label: "Analytics", href: "#analytics" },
      { label: "Real Members", href: "#real-members" },
    ],
  },
  {
    heading: "About Us",
    links: [
      { label: "Our Story", href: "#our-story" },
      { label: "Mission And Values", href: "#mission-values" },
      { label: "The Team", href: "#the-team" },
    ],
  },
  {
    heading: "Pricing",
    links: [
      { label: "Price Plan", href: "#price-plan" },
    ],
  },
  {
    heading: "Contact Us",
    links: [
      { label: "Form & Social Media", href: "#contact-form" },
      { label: "FAQs", href: "#faqs" },
    ],
  },
  {
    heading: "Quick Links",
    links: [
      { label: "Login", href: "/login" },
      { label: "Sign Up", href: "/signup" },
      { label: "Become a Participant", href: "/become-participant" },
      { label: "Illustrations by Storyset", href: "https://storyset.com", external: true },
    ],
  },
];
    return (
    <footer className="bg-[#F5F5F5] dark:bg-[#0F0F0F] shadow-md z-50 py-14">
      <div className="container mx-auto px-4 py-4">
        <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-6 gap-4 text-sm text-[#292929] dark:text-[#E5E5E5]">
          {footerLinks.map((col) => (
            <div key={col.heading}>
              <h3 className="font-semibold mb-2 text-[18px]">{col.heading}</h3>
              <ul className="mt-8 sm:mt-4 space-y-3 sm:space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="hover:underline text-[16px]"
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
        <hr className="my-10 border-[#EBEBEB] dark:border-[#2D2D2D]" />
        <section className="text-sm text-[#292929] dark:text-[#E5E5E5] mt-8 text-center">
          <div className="flex items-center gap-2 justify-center mb-2">
            <Logo className="w-35.654052734375 h-27.654651641845703" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Bentinarly Poll
            </h1>
          </div>
          <p className="mb-2">
            © {new Date().getFullYear()} 2025 Bentinarly Poll. All rights reserved.
          </p>
          <p>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 hover:underline"
            >
              <Twitter className="inline w-5 h-5 text-[#292929] dark:text-[#E5E5E5]" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 hover:underline"
            >
              <Facebook className="inline w-5 h-5 text-[#292929] dark:text-[#E5E5E5]" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 hover:underline"
            >
              <Instagram className="inline w-5 h-5 text-[#292929] dark:text-[#E5E5E5]" />
            </a>
          </p>
        </section>
      </div>
    </footer>
  );
};

export default Footer;