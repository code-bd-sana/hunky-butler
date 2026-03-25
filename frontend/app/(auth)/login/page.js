"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  useForgotPasswordMutation,
  useLoginMutation,
  useSendOtpMutation,
} from "@/features/auth";
import toast, { Toaster } from "react-hot-toast";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("customer");
  const [showForgotPassword, setForgotPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const roleImage = {
    customer: { src: "/ImageGalary/pic8.jpeg", alt: "Customer preview" },
    butler: { src: "/images/services/buttlers.jpeg", alt: "Butler preview" },
  };
  const img = roleImage[role] ?? {
    src: "/login-shot.jpg",
    alt: "Event preview",
  };

  const [login, { isLoading, isSuccess, error }] = useLoginMutation();
  const [sendOtp, { isLoading: otploading }] = useSendOtpMutation();
  const [forgotPassword, { isLoading: forgetLoading }] =
    useForgotPasswordMutation();

  const loginHandler = async (e) => {
    try {
      e.preventDefault();
      const email = e.target.email.value;
      const password = e.target.password.value;

    

      const result = await login({ email, password, role }).unwrap();
  
      const user = result.data;

      toast.success("Login Success");

      const res = await signIn("credentials", {
        redirect: false,
        email: user.email,
        role: user.role,
        _id: user._id,
      });



      if (res.status === 200) {
        if (user.role === 'admin') {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/dashboard";
        }
      }

     
    } catch (error) {
      console.log(error.status);

      if (error.status === 405) {
        toast.error(error.data?.message);
        setTimeout(() => {
          window.location.href = "/verification";
        }, [2000]);
        return;
      }

      toast.error(error.data?.message);
    }
  };

  // Forgot Password Functions
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const emailValue = formData.get("forgotEmail");

    if (!emailValue || !emailValue.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      // Send OTP to email
      await sendOtp(emailValue).unwrap();

      toast.success("OTP sent successfully to " + emailValue);
      setEmail(emailValue);

      // Generate a random 6-digit OTP (in real app, this would come from backend)
      const generatedOtp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      setOtp(generatedOtp);

      // Move directly to password reset step
      setStep(2);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send OTP");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newPass = formData.get("newPassword");
    const confirmPass = formData.get("confirmPassword");
    const enteredOtp = formData.get("otp");

    if (!newPass || !confirmPass || !enteredOtp) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (newPass !== confirmPass) {
      toast.error("Passwords do not match.");
      return;
    }

    if (newPass.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (enteredOtp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      // Call forgot password API with email, otp, and newPassword
      const result = await forgotPassword({
        email: email,
        otp: enteredOtp,
        newPassword: newPass,
      }).unwrap();

      // Log the details to console as requested
   

      toast.success(result.message || "Password reset successfully!");

      // Close modal after 2 seconds
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || "Failed to reset password");
    }
  };

  const closeModal = () => {
    setForgotPassword(false);
    setStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <main className="min-h-screen w-full bg-[#f6f7fb] flex items-center justify-center p-6 sm:p-8 md:p-10">
      <Toaster />

      {/* Container: desktop width preserved; responsive padding/gaps */}
      <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* LEFT: Photo panel */}
        <section className="relative rounded-2xl overflow-hidden bg-white h-[460px] md:h-[816px]">
          {/* Back button */}
          <Link href="/">
            <button
              className="absolute left-3 top-3 sm:left-4 sm:top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 sm:px-3.5 sm:py-2 text-[12px] sm:text-[13px] font-medium text-gray-700 shadow-sm backdrop-blur hover:bg-white"
              type="button"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="-ml-0.5"
              >
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back To Landing Page
            </button>
          </Link>

          {/* Role-based image */}
          <Image
            key={role}
            src={img.src}
            alt={img.alt}
            width={960}
            height={720}
            priority
            className="h-full w-full object-cover object-center"
          />
        </section>

        {/* RIGHT: Auth card */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-[50px]">
          <section className="rounded-2xl bg-white max-w-[562px] mx-auto border border-[#EFE7EA] p-5 sm:p-6 md:p-8">
            <div className="mx-auto w-full max-w-[430px]">
              {/* Headings */}
              <h1 className="text-center text-[22px] sm:text-[26px] lg:text-[28px] font-semibold text-[#FF006A]">
                Hunky Butler Service
              </h1>
              <p className="mt-1 sm:mt-2 capitalize text-center text-[15px] sm:text-[16px] lg:text-[18px] text-[#141414]">
                Turn Your occasion into an unforgettable event
              </p>

              {/* Segmented toggle */}
              <div className="mt-4 sm:mt-5 flex items-center justify-center">
                <div
                  className="inline-flex justify-center w-full max-w-[316px] h-10 sm:h-[48px] rounded-full bg-[#F6F4F5] py-[6px] px-[8px]"
                  role="tablist"
                  aria-label="Authentication role"
                >
                  <button
                    role="tab"
                    aria-selected={role === "customer"}
                    onClick={() => setRole("customer")}
                    className={`px-4 py-1.5 text-[14px] sm:text-[16px] font-medium w-1/2 rounded-full focus:outline-none ${
                      role === "customer"
                        ? "bg-[#FF006A] text-white"
                        : "text-black"
                    }`}
                    type="button"
                  >
                    Customer
                  </button>
                  <button
                    role="tab"
                    aria-selected={role === "butler"}
                    onClick={() => setRole("butler")}
                    className={`px-4 py-1.5 text-[14px] sm:text-[16px] font-medium w-1/2 rounded-full focus:outline-none ${
                      role === "butler"
                        ? "bg-[#FF006A] text-white"
                        : "text-black"
                    }`}
                    type="button"
                  >
                    Butler
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={loginHandler} className="mt-5 sm:mt-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] text-[#292929]">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Your Email"
                    className="w-full h-11 sm:h-[48px] rounded-[8px] border border-[#EFE7EA] bg-white px-3.5 py-2.5 text-[13px] text-[#333333] outline-none placeholder:text-[#333333] focus:border-[#FF006A] focus:ring-2 focus:ring-[#FF006A]/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] text-[#292929]">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Your Password"
                      name="password"
                      className="w-full h-11 sm:h-[48px] rounded-[8px] border border-[#EFE7EA] bg-white px-3.5 py-2.5 pr-10 text-[13px] text-[#333333] outline-none placeholder:text-[#333333] focus:border-[#FF006A] focus:ring-2 focus:ring-[#FF006A]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-6.5 0-10-8-10-8a18.45 18.45 0 014.58-5.94M9.88 9.88A3 3 0 0112 9c1.66 0 3 1.34 3 3 0 .45-.1.87-.28 1.25M1 1l22 22" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div
                    onClick={() => setForgotPassword(true)}
                    className="text-right cursor-pointer"
                  >
                    <span className="text-[14px] sm:text-[16px] font-medium underline text-[#FF006A]">
                      Forgot Password?
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-1 w-full rounded-[100px] bg-[#FF006A] py-2.5 text-[16px] sm:text-[18px] tracking-[1px] font-semibold text-white hover:brightness-105 active:brightness-95"
                >
                  {isLoading ? "loading..." : "Log In"}
                </button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#EFE7EA]" />
                  </div>
                  {/* <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-[14px] sm:text-[16px] text-[#292929]">
                      Or
                    </span>
                  </div> */}
                </div>

                <div className="space-y-2">
                  {/* <button
                    type="button"
                    onClick={() => signIn("google", { callbackUrl: "/" })}
                    className="w-full rounded-[8px] border border-[#EFE7EA] bg-white px-3.5 py-2.5 text-[15px] sm:text-[16px] font-medium text-gray-700 hover:bg-gray-50 inline-flex items-center justify-center gap-2"
                  >
                    <Image
                      src="/images/google.png"
                      alt="Google"
                      width={24}
                      height={24}
                      className="h-[24px] w-[24px] shrink-0"
                    />
                    Continue With Google
                  </button> */}

                  {/* <button
                    type="button"
                    onClick={() => signIn("apple", { callbackUrl: "/" })}
                    className="w-full rounded-[8px] border border-[#EFE7EA] bg-white px-3.5 py-2.5 text-[15px] sm:text-[16px] font-medium text-gray-700 hover:bg-gray-50 inline-flex items-center justify-center gap-2"
                  >
                    <Image
                      src="/images/apple.png"
                      alt="Apple"
                      width={24}
                      height={24}
                      className="h-[24px] w-[24px] shrink-0"
                    />
                    Continue With Apple
                  </button> */}
                </div>

                <div className="flex gap-1.5 sm:gap-2 justify-center items-center">
                  <p className="pt-1 text-center text-[14px] sm:text-[16px] text-[#292929]">
                  { ` Don't Have An Account?`}
                  </p>
                  <Link
                    href="register"
                    className="font-semibold text-[14px] sm:text-[16px] text-[#FF006A]"
                  >
                    Sign Up
                  </Link>
                </div>

                <input type="hidden" name="role" value={role} />
              </form>
            </div>
          </section>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {step === 1 && "Forgot Password"}
                {step === 2 && "Reset Password"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Step 1: Email Input */}
              {step === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter your email address
                    </label>
                    <input
                      type="email"
                      name="forgotEmail"
                      placeholder="your@email.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF006A]"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-[#FF006A] text-white rounded-lg hover:bg-[#e5005c]"
                    >
                      {otploading ? "Loading..." : "Send OTP"}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: New Password with OTP */}
              {step === 2 && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter OTP sent to {email}
                    </label>
                    <input
                      type="text"
                      name="otp"
                      placeholder="Enter 6-digit OTP"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF006A] text-center text-lg tracking-widest"
                      maxLength={6}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        placeholder="Enter new password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF006A]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {/* {showNewPassword ? '🙈' : '👁️'} */}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm new password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF006A]"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={forgetLoading}
                      className="flex-1 px-4 py-2 bg-[#FF006A] text-white rounded-lg hover:bg-[#e5005c] disabled:opacity-50"
                    >
                      {forgetLoading ? "Resetting..." : "Reset Password"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Progress Steps */}
            <div className="px-6 pb-6">
              <div className="flex items-center justify-center space-x-2">
                {[1, 2].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step >= stepNumber
                          ? "bg-[#FF006A] text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {stepNumber}
                    </div>
                    {stepNumber < 2 && (
                      <div
                        className={`w-12 h-1 mx-2 ${
                          step > stepNumber ? "bg-[#FF006A]" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
