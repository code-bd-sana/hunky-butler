"use client";

import { useMyProfileQuery, useUpdateMyProfileMutation } from "@/features/auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const initialApplicationData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  postcode: "",
  bankInfo: "",
  bio: "",
  isButler: "pending",
  agreeTerms: false,
};

const statusLabel = {
  active: "Active",
  pending: "Pending Approval",
  reject: "Rejected",
  suspend: "Suspended",
  none: "Not Applied",
};

const statusStyle = {
  active: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  reject: "bg-red-100 text-red-700",
  suspend: "bg-orange-100 text-orange-700",
  none: "bg-gray-100 text-gray-600",
};

const JoinForm = () => {
  const { data, status } = useSession();
  const user = data?.user;

  const {
    data: profile,
    refetch,
    isFetching: isProfileLoading,
  } = useMyProfileQuery(user?.id, {
    skip: !user?.id,
  });

  const [updateMyProfile, { isLoading }] = useUpdateMyProfileMutation();
  const [applicationData, setApplicationData] = useState(
    initialApplicationData,
  );

  useEffect(() => {
    if (!profile?.data) {
      return;
    }

    setApplicationData((prev) => ({
      ...prev,
      firstName: profile?.data?.firstName || "",
      lastName: profile?.data?.lastName || "",
      email: profile?.data?.email || user?.email || "",
      phone: profile?.data?.phone || "",
      postcode: profile?.data?.postcode || "",
      bankInfo: profile?.data?.bankInfo || "",
      bio: profile?.data?.bio || "",
      isButler: "pending",
    }));
  }, [profile?.data, user?.email]);

  const handleApplicationChange = (e) => {
    const { name, value, type, checked } = e.target;

    setApplicationData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();

    if (!applicationData.agreeTerms) {
      toast.error(
        "Please accept the Terms & Conditions to submit your application",
      );
      return;
    }

    if (!user?.email) {
      toast.error("Please login first.");
      return;
    }

    try {
      const payload = {
        ...applicationData,
        email: user.email,
        isButler: "pending",
      };

      await updateMyProfile(payload).unwrap();
      await refetch();
      toast.success("Application submitted");
    } catch (error) {
      toast.error(
        error?.data?.message || "Something went wrong please try again later!",
      );
    }
  };

  const isAuthenticated = status === "authenticated";
  const isSessionLoading = status === "loading";
  const isVerified = Boolean(profile?.data?.isVerified);
  const isButler = user?.role === "butler";
  const currentButlerStatus = profile?.data?.isButler || "none";
  const isActiveButler = currentButlerStatus === "active";

  return (
    <div
      className='relative overflow-hidden'
      style={{
        backgroundImage: "url('/Contact/contactBg.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}>
      <Toaster />
      {/* Floating Loons */}
      <img
        src='/Footer/loon.png'
        alt='Decorative balloon'
        className='hidden lg:block w-[680px] absolute top-105 -left-91'
      />
      <img
        src='/Footer/loon.png'
        alt='Decorative balloon'
        className='hidden lg:block w-[680px] absolute top-155 -right-144'
      />

      <div className='max-w-[1252px] mx-auto py-28 px-4'>
        {/* Main Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 items-start'>
          {/* LEFT IMAGE — stacked on top for md and below lg */}
          <div className='w-full h-[500px] md:h-[600px] lg:h-[732px] relative order-1 lg:order-0'>
            <Image
              src='/Join/kissingBut.jpeg'
              alt='Buff butler entertainer working at UK hen party'
              fill
              className='rounded-lg shadow-lg object-cover'
            />
          </div>

          {/* RIGHT FORM */}
          <div className='relative order-2 lg:order-0'>
            <h2 className='text-pink-600 font-semibold text-[28px] md:text-[32px] mb-6 capitalize leading-snug'>
              Butler application form
            </h2>
            {isSessionLoading && (
              <div className='bg-white rounded-3xl p-6 border border-[#efe7ea]'>
                <p className='text-[#424242]'>Checking your account...</p>
              </div>
            )}

            {!isSessionLoading && !isAuthenticated && (
              <div className='bg-white rounded-3xl p-6 border border-[#efe7ea] space-y-4'>
                <p className='text-[#424242] font-medium'>
                  To apply, please register an account, verify your email and
                  log in. The application form will then appear here.
                </p>
                <div className='flex flex-wrap gap-3'>
                  <Link
                    // Passing the role means the registration toggle arrives
                    // preset to Butler. It previously defaulted to Customer,
                    // so applicants had to notice and switch it themselves.
                    href='/register?role=butler'
                    className='px-6 py-3 bg-[#FF006A] text-white rounded-full font-medium hover:bg-[#e5005f] transition-colors'>
                    Register as Butler
                  </Link>
                  <Link
                    href='/login'
                    className='px-6 py-3 border border-[#e5eaf2] text-[#424242] rounded-full font-medium hover:bg-gray-50 transition-colors'>
                    Login
                  </Link>
                </div>
              </div>
            )}

            {!isSessionLoading &&
              isAuthenticated &&
              isProfileLoading &&
              !profile?.data && (
                <div className='bg-white rounded-3xl p-6 border border-[#efe7ea]'>
                  <p className='text-[#424242]'>Loading your profile data...</p>
                </div>
              )}

            {!isSessionLoading &&
              isAuthenticated &&
              !isProfileLoading &&
              !isVerified && (
                <div className='bg-white rounded-3xl p-6 border border-[#efe7ea] space-y-4'>
                  <p className='text-[#424242] font-medium'>
                    Your account is not verified yet. Please verify your email
                    before applying.
                  </p>
                  <Link
                    href='/verification'
                    className='inline-flex px-6 py-3 bg-[#FF006A] text-white rounded-full font-medium hover:bg-[#e5005f] transition-colors'>
                    Verify Account
                  </Link>
                </div>
              )}

            {!isSessionLoading &&
              isAuthenticated &&
              !isProfileLoading &&
              isVerified &&
              !isButler && (
                <div className='bg-white rounded-3xl p-6 border border-[#efe7ea]'>
                  <p className='text-[#424242] font-medium'>
                    Only users with Butler role can fill up this application
                    form.
                  </p>
                </div>
              )}

            {!isSessionLoading &&
              isAuthenticated &&
              !isProfileLoading &&
              isVerified &&
              isButler && (
                <div className='bg-white rounded-3xl p-6 border border-[#efe7ea] space-y-6'>
                  <div className='flex items-center justify-between flex-wrap gap-3'>
                    <h3 className='text-xl font-bold text-[#424242]'>
                      Professional Information
                    </h3>
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                        statusStyle[currentButlerStatus] || statusStyle.none
                      }`}>
                      {statusLabel[currentButlerStatus] || statusLabel.none}
                    </span>
                  </div>

                  {isActiveButler && (
                    <div className='p-4 rounded-xl bg-green-50 text-green-700 text-sm font-medium'>
                      Your Butler profile is already active. No additional
                      application is needed.
                    </div>
                  )}

                  {!isActiveButler && (
                    <form
                      onSubmit={handleApplicationSubmit}
                      className='space-y-6'>
                      <div>
                        <label className='block text-sm font-medium text-[#424242] mb-2'>
                          First Name
                        </label>
                        <input
                          type='text'
                          name='firstName'
                          value={applicationData.firstName}
                          onChange={handleApplicationChange}
                          placeholder='Enter your first name'
                          className='w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none focus:border-[#FF006A]'
                          required
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-[#424242] mb-2'>
                          Last Name
                        </label>
                        <input
                          type='text'
                          name='lastName'
                          value={applicationData.lastName}
                          onChange={handleApplicationChange}
                          placeholder='Enter your last name'
                          className='w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none focus:border-[#FF006A]'
                          required
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-[#424242] mb-2'>
                          Email
                        </label>
                        <input
                          type='email'
                          name='email'
                          value={applicationData.email}
                          readOnly
                          onChange={handleApplicationChange}
                          placeholder='Enter your email address'
                          className='w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none focus:border-[#FF006A] bg-gray-100'
                          required
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-[#424242] mb-2'>
                          Phone Number
                        </label>
                        <input
                          type='tel'
                          name='phone'
                          value={applicationData.phone}
                          onChange={handleApplicationChange}
                          placeholder='e.g., +44 7123 456789'
                          className='w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none focus:border-[#FF006A]'
                          required
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-[#424242] mb-2'>
                          Postcode
                        </label>
                        <input
                          type='text'
                          name='postcode'
                          value={applicationData.postcode}
                          onChange={handleApplicationChange}
                          placeholder='Enter your postcode'
                          className='w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none focus:border-[#FF006A]'
                          required
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-[#424242] mb-2'>
                          Bank Account Info
                        </label>
                        <input
                          type='text'
                          name='bankInfo'
                          value={applicationData.bankInfo}
                          onChange={handleApplicationChange}
                          placeholder='Account Number / IBAN'
                          className='w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none focus:border-[#FF006A]'
                          required
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-[#424242] mb-2'>
                          Short Bio
                        </label>
                        <textarea
                          name='bio'
                          value={applicationData.bio}
                          onChange={handleApplicationChange}
                          placeholder='Tell us a bit about yourself and why you want to become a Butler...'
                          className='w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none focus:border-[#FF006A] min-h-[100px]'
                          required
                        />
                      </div>

                      <div className='flex items-start gap-3 p-4 bg-gray-50 rounded-xl'>
                        <input
                          type='checkbox'
                          id='agreeTerms'
                          name='agreeTerms'
                          checked={applicationData.agreeTerms}
                          onChange={handleApplicationChange}
                          className='mt-1 w-4 h-4 text-[#FF006A] bg-gray-100 border-gray-300 rounded focus:ring-[#FF006A] focus:ring-2'
                          required
                        />
                        <label
                          htmlFor='agreeTerms'
                          className='text-sm text-[#424242] cursor-pointer'>
                          I agree to the{" "}
                          <a
                            href='/terms-and-conditon'
                            className='text-[#FF006A] hover:underline font-medium'
                            target='_blank'
                            rel='noopener noreferrer'>
                            Terms & Conditions
                          </a>
                          . I understand that my application will be reviewed
                          and I must accept the terms to proceed.
                        </label>
                      </div>

                      <button
                        type='submit'
                        className='w-full px-4 py-3 bg-[#FF006A] text-white rounded-xl hover:bg-[#e5005f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={!applicationData.agreeTerms || isLoading}>
                        {isLoading
                          ? "Loading..."
                          : currentButlerStatus === "none"
                            ? "Submit Application"
                            : "Update Details"}
                      </button>
                    </form>
                  )}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinForm;
