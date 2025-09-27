import Link from "next/link";
import React from "react";

export default function VerificationSuccessMessage() {
  return (
    <div className="min-h-screen bg-[#f9f8fa] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-8 w-[350px] text-center">
        {/* Checkmark Circle */}
        <div className="flex justify-center mb-5">
          <div className="bg-pink-100 h-14 w-14 rounded-full flex items-center justify-center">
            <span className="text-pink-600 text-2xl font-bold">✓</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-black mb-2">Done!</h2>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 mb-6">
          Email Added Successfully. This Helps Keep Your Account Secure.
        </p>

        {/* Button */}
        <Link href={"/login"}>
          <button className="bg-pink-600 cursor-pointer hover:bg-pink-700 text-white text-sm font-medium py-3 w-full rounded-full transition duration-200">
            Ok
          </button>
        </Link>
      </div>
    </div>
  );
}
