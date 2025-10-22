// src/pages/Login.tsx
import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Login = () => {
  // 1. Consolidated state into a single object.
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // 2. A single, reusable handler for all standard inputs.
  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 3. Form submission logic.
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    console.log("Logging in with:", formData);
    // Add your API call and navigation logic here
    navigate("/projects/dashboard");
  };

  const handleSocialLogin = (provider: "google" | "facebook") => {
    console.log(`Logging in with ${provider}`);
  };

  const isFormDisabled = !formData.email || !formData.password;

  return (
    <div className="bg-gradient-to-b from-[#FE5102] to-[#B148F3]">
      <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-[url('assets/images/signinpattern.png')]">
        <div className="min-h-screen flex justify-center items-center p-4">
          <div className="w-full md:max-w-[540px] p-8 space-y-4 bg-white rounded-lg shadow-md">
            {/* Header */}
            <div className="flex items-center space-x-2">
              <img src="/logo.svg" alt="Logo" className="w-6 h-6" />
              <h1 className="text-[25px] font-semibold text-[#292929]">Bentinarly Poll</h1>
            </div>
            <div>
              <h1 className="text-[24px] font-bold text-[#313131] mb-2">Login</h1>
              <p className="text-sm text-[#696969]">Welcome back! Please enter your details.</p>
            </div>

            {error && <p className="text-sm text-center text-red-500">{error}</p>}

            {/* 4. Form now uses our clean CSS classes and single handler. */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="abc@email.com"
                  required
                  value={formData.email}
                  onChange={handleValueChange}
                  className="form-input"
                />
              </div>

              <div className="relative form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="8+ characters"
                  required
                  value={formData.password}
                  onChange={handleValueChange}
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-gray-500">
                  {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                </button>
              </div>

              <div className="text-right">
                <Link
                  to="/forgotpassword"
                  className="text-xs font-medium text-[#FE5102] hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <div>
                <button type="submit" disabled={isFormDisabled} className="btn btn-primary">
                  Login
                </button>
              </div>
            </form>

            <p className="text-sm text-center text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-[#FE5102] hover:underline">
                Sign up
              </Link>
            </p>

            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-sm text-gray-500">Or login with</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="space-y-4">
              <button onClick={() => handleSocialLogin("facebook")} className="btn-social">
                <FaFacebook className="w-5 h-5 mr-2 text-blue-600" />
                Login with Facebook
              </button>
              <button onClick={() => handleSocialLogin("google")} className="btn-social">
                <FcGoogle className="w-5 h-5 mr-2" />
                Login with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
