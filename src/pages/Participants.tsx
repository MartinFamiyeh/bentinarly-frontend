import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useAuthApi } from "../services/apiClient";
import { useSnackbar } from "../contexts/SnackbarContext";
import * as ApiTypes from "../types/api";
import AuthBrandHeader from "../components/auth/AuthBrandHeader";

const Participants = () => {
  const navigate = useNavigate();
  const authApi = useAuthApi();
  const { showSnackbar } = useSnackbar();
  // 1. Consolidated state into a single object for better organization
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // 2. A single handler for all input changes
 const handleValueChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
   setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
 };

 // A specific handler just for checkboxes
 const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
   setFormData((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
 };
  // 3. More comprehensive check for form completion
  const isFormDisabled =
    !formData.firstName ||
    !formData.lastName ||
    !formData.email ||
    !formData.password ||
    !formData.confirmPassword ||
    !formData.agreedToTerms;

  const [isLoading, setIsLoading] = useState(false);

  // 4. Renamed handler and added password matching logic
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setIsLoading(true);
    
    try {
      const registerData: ApiTypes.RegisterParticipantCommand = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        gender: formData.gender || undefined,
        dateOfBirth: formData.dob || undefined,
        mobileNumber: formData.email, // Using email as mobile for now
      };

      const result = await authApi.registerParticipant(registerData);
      if (result.success) {
        showSnackbar("Registration successful! Please verify your email.", "success");
        navigate("/verification", { state: { email: formData.email } });
      } else {
        setError(result.errors?.join(", ") || "Registration failed.");
        showSnackbar(result.errors?.join(", ") || "Registration failed.", "error");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "An unexpected error occurred.");
      showSnackbar(err.response?.data?.detail || "Registration failed.", "error");
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
              accountType="Participant"
              title="Sign Up"
              description="Create an account to take surveys and track your responses."
            />

            {error && <p className="text-sm text-center text-red-500">{error}</p>}

            {/* Form now uses our clean CSS classes */}
            <form className="space-y-4" onSubmit={handleSubmit}>
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
                    required
                    value={formData.lastName}
                    onChange={handleValueChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="gender" className="form-label">
                    Gender
                  </label>
                  <select
                    name="gender"
                    id="gender"
                    required
                    value={formData.gender}
                    onChange={handleValueChange}
                    className="form-input">
                    <option value="" disabled>
                      Select option
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="dob" className="form-label">
                    Date of Birth
                  </label>
                  <input
                    id="dob"
                    name="dob"
                    type="date"
                    required
                    value={formData.dob}
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
                <button 
                  type="submit" 
                  disabled={isFormDisabled || isLoading} 
                  className="btn btn-primary">
                  {isLoading ? "Signing Up..." : "Sign Up"}
                </button>
              </div>
            </form>

            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/participant/login" className="font-medium text-[#FE5102] hover:underline">
                Sign In
              </Link>
            </p>

            <p className="text-sm text-center text-gray-500">
              Are you a researcher?{" "}
              <Link to="/register" className="font-medium text-[#FE5102] hover:underline">
                Researcher sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Participants;
