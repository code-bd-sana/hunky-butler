"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

import Image from "next/image";
import image from "@/public/quote/bg.png";

export default function PaymentCancelPage() {
  const router = useRouter();

  const handleTryAgain = () => {
    router.back(); // Go back to previous page to try again
  };

  const handleGoToHome = () => {
    router.push('/');
  };

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 13%, rgba(0,0,0,1) 95%), url(${image.src})`,
      }}
      className="relative min-h-screen w-full overflow-hidden bg-cover bg-center"
    >
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Cancel Icon */}
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-200">
 
        </div>

        {/* Cancel Message */}
        <h1 className="text-4xl md:text-5xl text-white font-medium leading-snug mb-4 max-w-2xl">
          Payment Cancelled
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl">
          Something went wrong with the payment process. Your payment was not completed.
        </p>

        {/* Error Details */}
        <div className="bg-[#46434362] backdrop-blur-md backdrop-saturate-15 border border-red-300/30 rounded-2xl p-6 mb-8 max-w-md">
          <p className="text-white text-sm">
            Don't worry, no money was deducted from your account. 
            You can try the payment again or contact support if the problem continues.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
        
          
          <button
            onClick={handleGoToHome}
            className="flex items-center justify-center gap-3 border-2 border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 hover:scale-105"
          >
          
            Back to Home
          </button>
        </div>

        {/* Support Info */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-gray-300 text-sm">
            Need help? Contact us at{' '}
            <a href="mailto:support@hunkybutler.com" className="text-[#FF3388] hover:underline">
              support@hunkybutler.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}