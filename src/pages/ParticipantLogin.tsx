import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useAuthApi } from "../services/apiClient";
import { useAuth } from "../contexts/AuthContext";
import { getPostLoginRedirect } from "../utils/routeUtils";
import { startGoogleLogin } from "../utils/googleAuth";
import { isParticipantRole } from "../utils/userRoleUtils";
import AuthBrandHeader from "../components/auth/AuthBrandHeader";

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

const ParticipantLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authApi = useAuthApi();
  const { signin } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
        if (!isParticipantRole(result.user.role)) {
          setError(
            "This login is for participant accounts only. Researchers should use the researcher login."
          );
          return;
        }

        signin(result.user, result.token, result.refreshToken || undefined);
        const fromPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
        navigate(getPostLoginRedirect(fromPath, result.user.role), { replace: true });
      } else {
        setError(result.errors?.[0] || "Login failed. Please try again.");
      }
    } catch (error: unknown) {
      setError(getLoginErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const isFormDisabled = !formData.email || !formData.password;

  const handleGoogleLogin = () => {
    startGoogleLogin("participant");
  };

  return (
    <div className="bg-gradient-to-b from-[#FE5102] to-[#B148F3]">
      <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-[url('assets/images/signinpattern.png')]">
        <div className="min-h-screen flex justify-center items-center p-4">
          <div className="w-full md:max-w-[540px] p-8 space-y-4 bg-white rounded-lg shadow-md">
            <AuthBrandHeader
              accountType="Participant"
              title="Login"
              description="Sign in to browse surveys, complete responses, and manage your profile."
            />

            {error && <p className="text-sm text-center text-red-500">{error}</p>}

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
              Don&apos;t have an account?{" "}
              <Link to="/participant/signup" className="font-medium text-[#FE5102] hover:underline">
                Sign up
              </Link>
            </p>

            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-sm text-gray-500">Or login with</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="space-y-4">
              <button type="button" onClick={handleGoogleLogin} className="btn-social">
                <FcGoogle className="w-5 h-5 mr-2" />
                Login with Google
              </button>
            </div>

            <p className="text-sm text-center text-gray-500">
              Are you a researcher?{" "}
              <Link to="/login" className="font-medium text-[#FE5102] hover:underline">
                Researcher login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantLogin;
