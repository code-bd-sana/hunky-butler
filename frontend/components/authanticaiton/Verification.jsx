"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";
import { useSendOtpMutation } from "@/features/auth";

export default function Verification() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const [sendOtp, { isLoading }] = useSendOtpMutation();

  async function handleSendOtp(e) {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email.");
      return;
    }

    try {
      const res = await sendOtp(email).unwrap();

      toast.success(res.message || "OTP Sent Successfully!");

      router.push("/otp/" + encodeURIComponent(email));
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to send OTP");
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-[#f6f4f5] p-6">
      <div className="w-full max-w-xl mt-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Two Step Verification
          </h1>
          <p className="text-gray-600 mt-2">Enabling Real-Time OTP System</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-[0_25px_40px_rgba(0,0,0,0.04)] border border-white/30">
          <form onSubmit={handleSendOtp} className="space-y-6">
            <label className="block text-sm font-semibold text-gray-800">
              Enter Your Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E.G. Yourmail123@Example.Com"
              className="w-full rounded-full border border-gray-200 px-6 py-4 placeholder:text-gray-400 focus:outline-none focus:ring-0 shadow-sm bg-white"
            />

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center rounded-full px-8 py-4 text-white font-medium text-lg
                  bg-gradient-to-r from-[#ff007a] to-[#ff3b8a] shadow-[0_18px_30px_rgba(255,59,138,0.18)] hover:opacity-95 transition-opacity duration-150 disabled:opacity-50"
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
