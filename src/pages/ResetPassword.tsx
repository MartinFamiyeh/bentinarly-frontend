// src/pages/ResetPassword.tsx
import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { IoArrowBack } from "react-icons/io5";

const ResetPassword = () => {
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    setError("");
    console.log("Setting new password...");
    // On success, navigate to the final success screen
    navigate("/reset-success");
  };

  const isFormDisabled = !formData.password || !formData.confirmPassword;

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
              <h1 className="text-[24px] font-bold text-[#313131] mb-2">Set a password</h1>
              <p className="text-sm text-[#696969]">
                Your new password must be different from previous passwords.
              </p>
            </div>

            {error && <p className="text-sm text-center text-red-500">{error}</p>}

            <form className="space-y-4" onSubmit={handleSubmit}>
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

              <div className="pt-2">
                <button type="submit" disabled={isFormDisabled} className="btn btn-primary">
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
