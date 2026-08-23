"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readConsent, writeConsent, updateGoogleConsent } from "@/lib/consent";

/**
 * Cookie consent banner.
 *
 * Deliberately first-party and small rather than a third-party consent
 * platform. The site sets one category of non-essential cookie (analytics), so
 * a vendor would add weight and another external dependency for no benefit. If
 * advertising pixels are added later and the choice needs to be more granular,
 * this is the place to extend, or the point at which a CMP starts to earn
 * its place.
 *
 * Accept and reject are given equal visual weight, which UK guidance expects.
 * A banner where rejecting is harder than accepting is not valid consent.
 *
 * Renders nothing when analytics is not configured, so there is no cookie
 * notice on an environment that sets no cookies.
 */
export default function CookieBanner() {
  const configured = Boolean(process.env.NEXT_PUBLIC_GTM_ID);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!configured) return;
    // Only ask if no valid choice is stored. Runs after mount so the server
    // and client markup match.
    if (readConsent() === null) setVisible(true);
  }, [configured]);

  if (!configured || !visible) return null;

  const choose = (state) => {
    writeConsent(state);
    updateGoogleConsent(state);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie choices"
      className="fixed bottom-0 left-0 right-0 z-[200] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto max-w-4xl rounded-2xl border border-[#e5eaf2] bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm leading-relaxed text-[#424242]">
            <p className="mb-1 font-semibold text-[#141414]">
              We use cookies to understand how the site is used
            </p>
            <p>
              These help us see which pages lead to bookings so we can improve
              them. Nothing is set unless you agree. Read our{" "}
              <Link
                href="/privacy-policy"
                className="font-medium text-[#FF006A] underline underline-offset-2"
              >
                privacy policy
              </Link>
              .
            </p>
          </div>

          <div className="flex shrink-0 gap-3">
            {/* Equal prominence: rejecting must be no harder than accepting. */}
            <button
              type="button"
              onClick={() => choose("denied")}
              className="rounded-full border-2 border-[#e5eaf2] px-6 py-2.5 text-sm font-semibold text-[#424242] transition-colors hover:bg-gray-50"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => choose("granted")}
              className="rounded-full border-2 border-[#FF006A] bg-[#FF006A] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e5005f]"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
