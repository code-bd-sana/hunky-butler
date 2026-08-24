"use client";
import { useGetButlerPersonalOverviewQuery } from "@/features/booking";
import { useSession } from "next-auth/react";
import React from "react";

// The three summary tiles at the top of the butler dashboard.
//
// Two things were wrong here (M7):
//   1. The overview query was called AFTER an `if (status === 'loading') return`
//      early exit. That makes the hook conditional: the render before the session
//      resolved ran one hook, the render after ran two, which throws
//      "Rendered more hooks than during the previous render" and blanks the
//      butler dashboard. Hooks must run in the same order every render, so both
//      the session and the query hook are now called unconditionally, and the
//      query is skipped until we have an id.
//   2. The result was destructured as `loading`, but RTK Query exposes
//      `isLoading` / `isFetching`, so the loading flag was always undefined and
//      the tiles rendered `£undefined` for a beat before the data arrived. They
//      now show a skeleton while fetching and a short message on error.

const CARDS = [
  { key: "completed", label: "Total bookings completed", bg: "#A02430" },
  { key: "earnings", label: "Earnings this month", bg: "#2439A0" },
  { key: "wallet", label: "Wallet balance", bg: "#24A079" },
];

const Tile = ({ bg, label, children }) => (
  <div
    className="text-white p-6 pt-8 rounded-[24px] shadow-md space-y-4"
    style={{ backgroundColor: bg }}>
    <h2 className="text-xl capitalize font-medium">{label}</h2>
    {children}
  </div>
);

const ButlerCard = () => {
  const { data: session, status } = useSession();
  const id = session?.user?.id;

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useGetButlerPersonalOverviewQuery(id, { skip: !id });

  const busy = status === "loading" || isLoading || isFetching || !id;

  if (busy) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-8">
        {CARDS.map((c) => (
          <Tile key={c.key} bg={c.bg} label={c.label}>
            <div className="h-12 w-24 rounded-lg bg-white/25 animate-pulse" />
            <span className="text-lg opacity-90">Loading...</span>
          </Tile>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-8">
        {CARDS.map((c) => (
          <Tile key={c.key} bg={c.bg} label={c.label}>
            <p className="text-lg font-medium">Unavailable</p>
            <span className="text-lg opacity-90">Could not load your figures. Please refresh.</span>
          </Tile>
        ))}
      </div>
    );
  }

  const earnings = data?.totalEarningThisMonth ?? 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-8">
      <Tile bg="#A02430" label="Total bookings completed">
        <p className="text-5xl font-bold">{data?.totalBookingCompleted ?? 0}</p>
        <span className="text-lg opacity-90">Updated just now</span>
      </Tile>

      <Tile bg="#2439A0" label="Earnings this month">
        <p className="text-5xl font-bold">£{earnings}</p>
        <span className="text-lg opacity-90">Updated just now</span>
      </Tile>

      {/* Wallet balance is duplicated from earnings this month because the
          overview endpoint (/booking/butlerOverview/:id) does not return a
          wallet field. Showing the same number under two labels misleads the
          butler about what they can withdraw, so the real fix is a wallet
          balance field on the API. Tracked as M12; left visible here rather
          than fabricated. */}
      <Tile bg="#24A079" label="Wallet balance">
        <p className="text-5xl font-bold">£{earnings}</p>
        <span className="text-lg opacity-90">Same as earnings this month (see M12)</span>
      </Tile>
    </div>
  );
};

export default ButlerCard;
