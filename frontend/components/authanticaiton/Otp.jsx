'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import VerificationSuccessMessage from './VerificationSuccessMessage';

import toast, { Toaster } from 'react-hot-toast';
import { useVerifyOtpMutation, useSendOtpMutation } from '@/features/auth'; // ✅ add useSendOtpMutation

export default function Otp() {
  const params = useParams();
  const email = decodeURIComponent(params?.email || ''); // ✅ Decode email if encoded

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [sendOtp, { isLoading: isResending }] = useSendOtpMutation(); // ✅ hook for resend

  // ⏱️ Countdown timer for resend
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // 🔢 Handle OTP input
  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  // ✅ Submit OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      toast.error('Please enter the full 6-digit OTP');
      return;
    }

    try {
      const res = await verifyOtp({ email, otp: otpValue }).unwrap();
      toast.success(res.message || 'Verification successful!');
      setIsVerified(true);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || 'Verification failed!');
    }
  };

  // 🔁 Resend OTP
  const handleResend = async () => {
    try {
      const res = await sendOtp(email).unwrap();
      toast.success(res.message || 'OTP resent successfully!');
      setTimeLeft(30);
      setCanResend(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || 'Failed to resend OTP');
    }
  };

  // ✅ If verified, show success component
  if (isVerified) {
    return <VerificationSuccessMessage />;
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-[#f6f4f5] p-6">
      <Toaster />
      <div className="w-full max-w-3xl mt-12 text-center">
        <p className="text-gray-800 text-lg mb-6">
          We’ve Sent A One-Time Password (OTP) To Your Email
          <span className="text-pink-600 font-semibold"> {email} </span>
          Please Enter It Below To Continue.
        </p>

        <div className="bg-white rounded-2xl p-8 shadow-[0_25px_40px_rgba(0,0,0,0.04)] border border-white/30 inline-block">
          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block text-sm font-semibold text-gray-800">Enter 6 Digit OTP</label>

            <div className="flex justify-center gap-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  className="w-14 h-14 text-center text-2xl font-bold rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center rounded-full px-8 py-4 text-white font-medium text-lg
                bg-gradient-to-r from-[#ff007a] to-[#ff3b8a] shadow-[0_18px_30px_rgba(255,59,138,0.18)] hover:opacity-95 transition-opacity duration-150 disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify This Email'}
            </button>

            {!canResend ? (
              <p className="text-sm text-gray-600">
                Didn’t get the code? Resend available in
                <span className="text-pink-600 font-semibold">
                  {' '}
                  00:{timeLeft.toString().padStart(2, '0')}{' '}
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-sm font-semibold text-pink-600 hover:underline disabled:opacity-50"
              >
                {isResending ? 'Resending...' : 'Resend OTP'}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
