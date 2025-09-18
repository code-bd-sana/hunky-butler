"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("customer");

  const roleImage = {
    customer: { src: "/imageGalary/pic8.jpeg", alt: "Customer preview" },
    butler: { src: "/images/services/buttlers.jpeg", alt: "Butler preview" },
  };
  const img = roleImage[role] ?? {
    src: "/login-shot.jpg",
    alt: "Event preview",
  };

  return (
    <main className="min-h-screen w-full bg-[#f6f7fb] flex items-center justify-center p-6 sm:p-8 md:p-10">
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

          {/* Role-based image — desktop perfect; mobile gets a safe min-height */}
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
              {/* Headings: keep lg values exact; scale down on small only */}
              <h1 className="text-center text-[22px] sm:text-[26px] lg:text-[28px] font-semibold text-[#FF006A]">
                Hunky Butler Service
              </h1>
              <p className="mt-1 sm:mt-2 capitalize text-center text-[15px] sm:text-[16px] lg:text-[18px] text-[#141414]">
                Light up your event with our butlers
              </p>

              {/* Segmented toggle */}
              <div className="mt-4 sm:mt-5  flex items-center justify-center">
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

              {/* Form (unchanged visually on lg, scaled spacing on small) */}
              <form className="mt-5 sm:mt-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] text-[#292929]">Email</label>
                  <input
                    type="email"
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
                  <div className="text-right">
                    <a
                      href="#"
                      className="text-[14px] sm:text-[16px] font-medium underline text-[#FF006A]"
                    >
                      Forgot Password?
                    </a>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-1 w-full rounded-[100px] bg-[#FF006A] py-2.5 text-[16px] sm:text-[18px] tracking-[1px] font-semibold text-white hover:brightness-105 active:brightness-95"
                >
                  Log In
                </button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#EFE7EA]" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-[14px] sm:text-[16px] text-[#292929]">
                      Or
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    className="w-full rounded-[8px] border border-[#EFE7EA] bg-white px-3.5 py-2.5 text-[15px] sm:text-[16px] font-medium text-gray-700 hover:bg-gray-50 inline-flex items-center justify-center gap-2"
                  >
                    <Image
                      src="/images/google.png"
                      alt=""
                      width={24}
                      height={24}
                      className="h-[24px] w-[24px] shrink-0"
                    />
                    Continue With Google
                  </button>

                  <button
                    type="button"
                    className="w-full rounded-[8px] border border-[#EFE7EA] bg-white px-3.5 py-2.5 text-[15px] sm:text-[16px] font-medium text-gray-700 hover:bg-gray-50 inline-flex items-center justify-center gap-2"
                  >
                    <Image
                      src="/images/apple.png"
                      alt=""
                      width={24}
                      height={24}
                      className="h-[24px] w-[24px] shrink-0"
                    />
                    Continue With Apple
                  </button>
                </div>

                <div className="flex gap-1.5 sm:gap-2 justify-center items-center">
                  <p className="pt-1 text-center text-[14px] sm:text-[16px] text-[#292929]">
                    Don’t Have An Account?
                  </p>
                  <Link
                    href="register"
                    className="font-semibold text-[14px] sm:text-[16px] text-[#FF006A]"
                  >
                    Sign Up
                  </Link>
                </div>

                {/* role tracked for backend; no visual changes */}
                <input type="hidden" name="role" value={role} />
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
