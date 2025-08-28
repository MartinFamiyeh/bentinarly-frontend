// src/pages/ForgotPassword.tsx
import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setError("");
    console.log("Password reset requested for:", email);
    // On success, navigate to the verification page, passing the email in the state
    navigate("/verification", { state: { email } });
  };

  return (
    <div className="bg-gradient-to-b from-[#FE5102] to-[#B148F3]">
      <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-[url('assets/images/signinpattern.png')]">
        <div className="min-h-screen flex justify-center items-center p-4">
          <div className="w-full md:max-w-[540px] p-8 space-y-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center space-x-2">
              <img src="/logo.svg" alt="Logo" className="w-6 h-6" />
              <h1 className="text-[25px] font-semibold text-[#292929]">Bentinarly Poll</h1>
            </div>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
              <IoArrowBack />
              Back to login
            </Link>

            <div>
              <h1 className="text-[24px] font-bold text-[#313131] mb-2">Forgot your password?</h1>
              <p className="text-sm text-[#696969]">
                Enter your email and we'll send you a code to reset your password.
              </p>
            </div>

            {error && <p className="text-sm text-center text-red-500">{error}</p>}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="abc@gmail.com"
                  required
                  value={email}
                  onChange={handleValueChange}
                  className="form-input"
                />
              </div>
              <div>
                <button type="submit" disabled={!email} className="btn btn-primary">
                  Next
                </button>
              </div>
            </form>

            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-[#FE5102] hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
