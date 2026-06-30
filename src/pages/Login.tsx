// src/pages/Login.tsx
import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useAuthApi } from "../services/apiClient";
import { useAuth } from "../contexts/AuthContext";

type ApiErrorResponse = {
  response?: {
    data?: {
      detail?: string;
    };
  };
};

const getLoginErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const apiError = error as ApiErrorResponse;
    if (apiError.response?.data?.detail) {
      return apiError.response.data.detail;
    }
  }

  return "Login failed. Please check your credentials.";
};

const Login = () => {
  // 1. Consolidated state into a single object.
  const navigate = useNavigate();
  const authApi = useAuthApi();
  const { signin } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 2. A single, reusable handler for all standard inputs.
  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 3. Form submission logic.
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await authApi.login({
        email: formData.email,
        password: formData.password,
      });

      if (result.success && result.user && result.token) {
        signin(result.user, result.token, result.refreshToken || undefined);
        navigate("/projects/dashboard");
      } else {
        setError(result.errors?.[0] || "Login failed. Please try again.");
      }
    } catch (error: unknown) {
      setError(getLoginErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5136";
    const callbackUrl = `${window.location.origin}/auth/google/callback`;
    const googleLoginUrl = new URL("/api/auth/google-login", apiBaseUrl);
    googleLoginUrl.searchParams.set("returnUrl", callbackUrl);

    window.location.href = googleLoginUrl.toString();
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
            <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="abc@email.com"
                  autoComplete="username"
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
                  autoComplete="current-password"
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
                <button type="submit" disabled={isFormDisabled || isLoading} className="btn btn-primary">
                  {isLoading ? "Logging in..." : "Login"}
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
              <button onClick={handleGoogleLogin} className="btn-social">
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
