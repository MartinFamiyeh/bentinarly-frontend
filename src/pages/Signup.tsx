// src/pages/Signup.tsx
import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useAuthApi } from "../services/apiClient";
import { useAuth } from "../contexts/AuthContext";
import AuthBrandHeader from "../components/auth/AuthBrandHeader";

const Signup = () => {
  const navigate = useNavigate();
  const authApi = useAuthApi();
  const { signin } = useAuth();
  // 1. Consolidated state into a single object for easier management.
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 2. Separate, simple handlers for different input types.
  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
  };

  // 3. More robust check to ensure all required fields are filled.
  const isFormDisabled =
    !formData.firstName ||
    !formData.lastName ||
    !formData.email ||
    !formData.password ||
    !formData.confirmPassword ||
    !formData.agreedToTerms;

  // 4. Renamed handler and added crucial password matching logic.
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      const result = await authApi.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      if (result.success && result.user && result.token) {
        signin(result.user, result.token, result.refreshToken || undefined);
        navigate("/verification", { state: { email: formData.email } });
      } else {
        setError(result.errors?.[0] || "Registration failed. Please try again.");
      }
    } catch (error: any) {
      setError(error.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#FE5102] to-[#B148F3]">
      <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-[url('assets/images/signinpattern.png')]">
        <div className="min-h-screen flex justify-center items-center p-4">
          <div className="w-full md:max-w-[540px] p-8 space-y-4 bg-white rounded-lg shadow-md">
            <AuthBrandHeader
              accountType="Researcher"
              title="Sign Up"
              description="Create an account to build surveys and manage research projects."
            />

            {error && <p className="text-sm text-center text-red-500">{error}</p>}

            {/* 5. Form now uses our clean CSS classes and separate handlers. */}
            <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Eric"
                    autoComplete="given-name"
                    required
                    value={formData.firstName}
                    onChange={handleValueChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Joel"
                    autoComplete="family-name"
                    required
                    value={formData.lastName}
                    onChange={handleValueChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="abc@email.com"
                  autoComplete="email"
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleValueChange}
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[50%] text-gray-500">
                  {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                </button>
              </div>

              <div className="relative form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="8+ characters"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleValueChange}
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[50%] text-gray-500">
                  {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="agreedToTerms"
                  id="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 rounded text-[#FE5102] focus:ring-[#FE5102]"
                />
                <label htmlFor="agreedToTerms" className="text-xs font-medium">
                  I agree to all the{" "}
                  <Link to="/terms" className="text-[#FE5102] hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-[#FE5102] hover:underline">
                    Privacy Policies
                  </Link>
                </label>
              </div>

              <div>
                <button type="submit" disabled={isFormDisabled || isLoading} className="btn btn-primary">
                  {isLoading ? "Signing up..." : "Sign Up"}
                </button>
              </div>
            </form>

            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-[#FE5102] hover:underline">
                Sign In
              </Link>
            </p>

            <p className="text-sm text-center text-gray-500">
              Want to take surveys instead?{" "}
              <Link to="/participant/signup" className="font-medium text-[#FE5102] hover:underline">
                Participant sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
