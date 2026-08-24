"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * next/image with a guaranteed fallback.
 *
 * Butler avatars and service banners are stored on the free i.ibb.co host and
 * several have vanished, so the dashboard renders broken images: the optimizer
 * fetches the dead URL, gets a 404, and there is nothing to show. The existing
 * fallbacks did not help because one of them pointed at
 * /images/default-avatar.png, which did not exist either.
 *
 * This swaps to a local asset the moment the real image fails to load, and the
 * local asset is committed, so the fallback can never itself 404. Drop-in for
 * next/image: pass the same props, plus an optional `fallbackSrc`.
 */
export default function SafeImage({
  src,
  alt = "",
  fallbackSrc = "/images/default-avatar.png",
  ...props
}) {
  const [current, setCurrent] = useState(src || fallbackSrc);

  return (
    <Image
      {...props}
      src={current}
      alt={alt}
      onError={() => {
        if (current !== fallbackSrc) setCurrent(fallbackSrc);
      }}
    />
  );
}
