"use client";

import { trackContactClick } from "@/lib/analytics";

/**
 * A phone or email link that records the click.
 *
 * Exists as its own client component because the banners that carry the phone
 * CTA are server components, and a server component cannot pass an onClick.
 * Marking those whole files "use client" would drop the server rendering the
 * location pages depend on for their metadata and copy, so only the link itself
 * crosses the boundary.
 *
 * A call is a conversion for this business and is completely invisible today,
 * which is why it is worth a component rather than being skipped.
 */
export default function TrackedContactLink({
  href,
  method = "phone",
  placement,
  className,
  children,
  ...rest
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => trackContactClick(method, placement)}
      {...rest}>
      {children}
    </a>
  );
}
