// src/pages/ResetSuccess.tsx
import { Link } from "react-router-dom";

// Make sure you have an illustration at this path or update it accordingly
import SuccessIllustration from "../assets/images/success-illustration.png";

const ResetSuccess = () => {
  return (
    <div className="bg-gradient-to-b from-[#FE5102] to-[#B148F3]">
      <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-[url('assets/images/signinpattern.png')]">
        <div className="min-h-screen flex justify-center items-center p-4">
          <div className="w-full md:max-w-[540px] p-8 text-center bg-white rounded-lg shadow-md">
            <img src={SuccessIllustration} alt="Success" className="w-64 h-auto mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-[#313131] mb-2">Password Reset Successful</h1>
            <p className="text-sm text-[#696969] mb-8">
              You're all set to access your account. You can now log in with your new password.
            </p>
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetSuccess;
