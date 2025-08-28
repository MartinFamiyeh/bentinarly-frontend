// src/pages/Verification.tsx
import React, {
  useState,
  useRef,
  useEffect,
  type FormEvent,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const Verify = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // Get email from previous page

  // If user lands here without an email, redirect them
  useEffect(() => {
    if (!email) {
      navigate("/forgotpassword");
    }
  }, [email, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    // Only allow numbers
    if (/[^0-9]/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if current one is filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move to previous input on backspace if current one is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const verificationCode = otp.join("");
    if (verificationCode.length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    setError("");
    console.log("Verifying code:", verificationCode, "for email:", email);
    // On successful verification, navigate to reset password page
    navigate("/resetpassword");
  };

  return (
    <div className="bg-gradient-to-b from-[#FE5102] to-[#B148F3]">
      <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-[url('assets/images/signinpattern.png')]">
        <div className="min-h-screen flex justify-center items-center p-4">
          <div className="w-full md:max-w-[540px] p-8 space-y-6 bg-white rounded-lg shadow-md">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
              <IoArrowBack /> Back to login
            </Link>

            <div>
              <h1 className="text-[24px] font-bold text-[#313131] mb-2">Verification</h1>
              <p className="text-sm text-[#696969]">
                We've sent a code to your email{" "}
                <span className="font-semibold text-gray-800">{email}</span>. Please enter it below
                to continue.
              </p>
            </div>

            {error && <p className="text-sm text-center text-red-500">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="flex justify-center gap-3 my-8">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="form-otp-input"
                  />
                ))}
              </div>
              <p className="text-center text-sm text-gray-500">
                Didn't receive a code?{" "}
                <button type="button" className="font-medium text-[#FE5102] hover:underline">
                  Resend
                </button>
              </p>
              <div className="mt-6">
                <button type="submit" className="btn btn-primary">
                  Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
