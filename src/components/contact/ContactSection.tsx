import React from "react";
import { BsTelephone } from "react-icons/bs";
import { MdOutlineEmail } from "react-icons/md";
import { FaInstagram, FaLinkedinIn, FaFacebookF } from "react-icons/fa";

// The interface remains the same, as it's just a type definition.
interface ContactInfo {
  icon: React.ElementType;
  title: string;
  detail: string;
}

const contactDetails: ContactInfo[] = [
  {
    icon: BsTelephone,
    title: "Phone",
    detail: "(123) 456 7890",
  },
  {
    icon: MdOutlineEmail,
    title: "Email",
    detail: "contact@thimpress.com",
  },
  {
    icon: FaInstagram, // Note: You were using BsTelephone for Instagram
    title: "Instagram",
    detail: "contact@thimpress.com", // Changed detail to be more realistic
  },
  {
    icon: FaLinkedinIn, // Note: You can replace this with a LinkedIn icon
    title: "LinkedIn",
    detail: "contact@thimpress.com",
  },
  {
    icon: FaFacebookF, // Note: You can replace this with a Facebook icon
    title: "Facebook",
    detail: "contact@thimpress.com",
  },
];

// A reusable input component for our form to keep the code DRY

interface FormInputProps {
  id: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  placeholder,
  type = "text",
  required = false,
  multiline = false,
  rows = 1,
}) => {
  const commonClasses = `
      w-full
      px-3 py-2
        bg-transparent
      placeholder-gray-500 dark:placeholder-gray-400
      border border-[#9D9D9D] 
      rounded-md
      focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:border-orange-500
      transition-colors duration-200
    `;

  return (
    <div>
      {multiline ? (
        <textarea
          placeholder={placeholder}
          id={id}
          required={required}
          rows={rows}
          className={commonClasses}></textarea>
      ) : (
        <input
          placeholder={placeholder}
          type={type}
          id={id}
          required={required}
          className={commonClasses}
        />
      )}
    </div>
  );
};

const ContactSection: React.FC = () => {
  return (
    <div className="p-4 sm:p-16 md:p-4">
      {/* Top Section: Contact Details */}
      <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 justify-center gap-x-4 gap-y-8 sm:justify-start md:grid-cols-3 lg:grid-cols-5">
        {contactDetails.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="flex-shrink-0 bg-gray-100 p-3 rounded-lg dark:bg-[#151515]">
              <item.icon className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100">{item.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section: Contact Form */}
      <div className="bg-[#FFFFFF] dark:bg-[#0B0B0B] p-8 rounded-2xl shadow-lg max-w-[1200px] mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Get In Touch</h2>

        <form noValidate autoComplete="off">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-6">
            <FormInput id="name" placeholder="Name *" required />
            <FormInput id="email" placeholder="Email *" type="email" required />
          </div>

          <div className="mb-6">
            <FormInput id="comment" placeholder="Comment *" multiline rows={5} />
          </div>

          <button
            type="submit"
            className="
              inline-block
              rounded-full
              bg-[#FE5102]
              px-8 py-3
              text-base font-medium text-white dark:text-[#0B0B0B] 
              transition-colors
              duration-200
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
            ">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactSection;
