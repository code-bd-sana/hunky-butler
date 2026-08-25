"use client";
import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { track, EVENTS, CURRENCY } from '@/lib/analytics';

import Image from "next/image";
import image from "@/public/quote/bg.png";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // The only point in the whole site where money is confirmed. Without this
  // there is no revenue in the reports at all, and the leads recorded earlier in
  // the wizard have nothing to convert against.
  //
  // Guarded against a refresh: this page is a redirect target, so reloading it
  // would otherwise report the same sale twice. GA4 also de-duplicates on
  // transaction_id, this makes it correct before it leaves the browser.
  useEffect(() => {
    const sessionId = searchParams?.get('session_id');
    const key = `hbs_purchase_${sessionId || 'unknown'}`;
    try {
      if (sessionId && window.sessionStorage.getItem(key)) return;
      if (sessionId) window.sessionStorage.setItem(key, '1');
    } catch {
      // Private mode or blocked storage. Reporting the sale matters more than
      // perfect de-duplication, so carry on.
    }
    track(EVENTS.PURCHASE, {
      currency: CURRENCY,
      transaction_id: sessionId || undefined,
    });
  }, [searchParams]);


  const handleGoToDashboard = () => {
    router.push('/dashboard');
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
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-200">

        </div>

        {/* Success Message */}
        <h1 className="text-4xl md:text-5xl text-white font-medium leading-snug mb-4 max-w-2xl">
          Payment Successful! 🎉
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl">
          Thank you for your payment. Your booking has been confirmed successfully.
        </p>

        {/* Success Details */}
        <div className="bg-[#46434362] backdrop-blur-md backdrop-saturate-15 border border-green-300/30 rounded-2xl p-6 mb-8 max-w-md">
          <div className="space-y-3 text-white text-left">
         
            
            <div className="flex justify-between">
              <span className="text-gray-300">Status:</span>
              <span className="font-medium text-green-400">Confirmed</span>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-300">
                You will receive a confirmation email shortly with all the details.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleGoToDashboard}
            className="flex items-center justify-center gap-3 bg-[#FF3388] hover:bg-[#ff1a6d] text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 hover:scale-105"
          >
           
            Go to Dashboard
          </button>
          
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
            Questions? Contact us at{' '}
            <a href="mailto:support@hunkybutler.com" className="text-[#FF3388] hover:underline">
              support@hunkybutler.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * useSearchParams opts the tree into client-side rendering, so Next requires a
 * Suspense boundary around it or the static export of this route fails. The
 * fallback is deliberately empty: this page is only ever reached by redirect
 * from the payment provider, and a flash of placeholder would read as an error
 * at the exact moment somebody has just paid.
 */
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
