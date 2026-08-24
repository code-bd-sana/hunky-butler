import Link from "next/link";
import { REVIEW_PROFILE_LIST } from "@/lib/reviewProfiles";

/**
 * Links out to the public review profiles.
 *
 * Two jobs:
 *
 *  1. Alongside the inline reviews, it gives visitors a way to read all of them
 *     rather than the five Google returns, and a way to leave one.
 *  2. On its own, it stands in for the reviews section when that section has
 *     nothing to show. That is the current state site-wide, because the Google
 *     API key is referrer restricted and cannot make the server-side Places
 *     call. Showing real proof with a link beats showing nothing.
 *
 * `standalone` switches between the compact inline row and the full block with
 * its own heading.
 */
export default function ReviewLinks({ standalone = false }) {
  const links = (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
      {REVIEW_PROFILE_LIST.map((p) => (
        <Link
          key={p.key}
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={p.label}
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 border-[#FF006A] bg-white px-6 py-3 text-sm font-semibold text-[#FF006A] transition-colors hover:bg-[#FF006A] hover:text-white"
        >
          <span aria-hidden="true">&#9733;</span>
          <span>
            {p.rating} on {p.name}
          </span>
          <span className="font-normal opacity-70">({p.count} reviews)</span>
        </Link>
      ))}
    </div>
  );

  if (!standalone) {
    return <div className="mt-10">{links}</div>;
  }

  return (
    <section className="bg-[#ECDFE4] px-6 py-16 lg:px-0">
      <div className="container mx-auto max-w-7xl md:px-8 lg:px-0">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#141414] md:text-4xl">
            Trusted by Party Planners Across the UK
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#5a5a5a]">
            We are rated 4.9 on Trustpilot and 5.0 on Google. Read what our
            customers say about their night.
          </p>
        </div>
        <div className="mt-8">{links}</div>
      </div>
    </section>
  );
}
