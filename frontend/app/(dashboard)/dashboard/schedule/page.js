"use client";
import React, { useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { createPortal } from "react-dom";
import {
  CircleDot,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { GiPartyPopper } from "react-icons/gi";
import DashNav from "@/components/Dashboard/DashNav/DashNav";
import { useSession } from "next-auth/react";
import { useGetBookingButlerQuery } from "@/features/booking";
import Image from "next/image";

export default function Page() {
  const calendarRef = useRef(null);
  const data = useSession();
  const { data: scheduleBooking } = useGetBookingButlerQuery({
    id: data?.data?.user?.id,
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const fmt = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      }),
    []
  );
  const centerLabel = fmt.format(currentDate).replace(",", "");

  const goto = (fn) => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    api[fn]();
    setCurrentDate(api.getDate());
  };

  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const hideTimeout = useRef();

  const getAvatar = (url) => {
    if (!url || url === null || url === undefined || url.trim() === "") {
      return "/icons/avatar.jpg";
    }
    return url;
  };

  const events = scheduleBooking?.data?.map((booking) => ({
    id: booking._id,
    title: booking.serviceName,
    start: new Date(booking.dateOfEvent).toISOString(),
    end: new Date(
      new Date(booking.dateOfEvent).getTime() +
        booking.durationHours * 3600 * 1000 +
        booking.durationMinutes * 60000
    ).toISOString(),
    backgroundColor: "#ec4899",
    extendedProps: {
      customer: booking.firstName + " " + booking.lastName,
      email: booking.email,
      status: booking.status,
      price: "£" + booking.price,
      location: booking.location,
      butler: booking.butler,
      avatar: booking.image,
    },
  }));

  const renderSlotLabel = (info) => {
    const h = info.date.getHours();
    const m = info.date.getMinutes();
    if (m !== 0) return null;

    const hh = String(h).padStart(2, "0");
    let Icon = Moon;
    if (h >= 4 && h <= 6) Icon = Sunrise;
    else if (h >= 7 && h <= 16) Icon = Sun;
    else if (h >= 17 && h <= 19) Icon = Sunset;

    return (
      <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 w-10 sm:w-14 mx-auto py-1 sm:py-2 text-gray-800">
        <span className="text-[10px] sm:text-xs font-medium leading-none">
          {hh}:00
        </span>
        <Icon size={14} className="text-gray-800 sm:w-4 sm:h-4" />
      </div>
    );
  };

  const renderEventContent = (info) => (
    <div
      onMouseEnter={(e) => {
        clearTimeout(hideTimeout.current);
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltipPosition({
          top: rect.top + window.scrollY - -150,
          left: rect.left + rect.width / 1.5,
        });
        setHoveredEvent(info.event);
      }}
      onMouseLeave={() => {
        hideTimeout.current = setTimeout(() => setHoveredEvent(null), 150);
      }}
      style={{ border: "none" }}
      className="bg-[#FF006A] text-white px-1.5 sm:px-2 py-[1px] sm:py-[2px] text-[10px] sm:text-[14px] md:text-[16px] w-full h-full flex items-center gap-1 sm:gap-2 truncate rounded cursor-pointer"
    >
      {/* Time */}
      <Image
        src="/icons/whiteClock.png"
        alt="status icon"
        width={18}
        height={18}
        className="object-contain"
      />
      <span>
        {info.event.start.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}{" "}
        -{" "}
        {info.event.end.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </span>

      {/* Dot separator */}
      <span className="mx-1 text-white opacity-80">•</span>

      {/* Avatar + Name */}
      <img
        src={getAvatar(info.event.extendedProps.avatar)}
        alt="avatar"
        className="w-5 h-5 rounded-full object-cover"
      />
      <span className="truncate capitalize">
        {info.event.extendedProps.customer}
      </span>

      {/* Dot separator */}
      <span className="mx-1 text-white opacity-80">•</span>

      {/* Service */}
      <GiPartyPopper size={12} className="sm:w-5 sm:h-5" />
      <span className="truncate capitalize">{info.event.title}</span>

      {/* Dot separator */}
      <span className="mx-1 text-white opacity-80">•</span>

      {/* Status */}
      <CircleDot size={10} className="text-white sm:w-5 sm:h-5" />
      <span className="capitalize">{info.event.extendedProps.status}</span>
    </div>
  );

  return (
    <div className="overflow-x-hidden">
      <DashNav />
      <div className="relative p-2 sm:p-3 md:p-4">
        {/* Date Bar */}
        <div className="mb-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <button
            onClick={() => goto("today")}
            className="h-8 sm:h-9 px-2 sm:px-3 rounded-xl bg-white text-gray-800 text-xs sm:text-sm font-medium border border-gray-200 hover:bg-gray-50 active:scale-[0.99] transition"
          >
            Today
          </button>
          <div className="flex items-stretch w-full sm:w-auto">
            <button
              onClick={() => goto("prev")}
              className="h-8 sm:h-9 w-8 sm:w-9 inline-flex items-center justify-center rounded-l-xl bg-white border border-gray-200 hover:bg-gray-50 active:scale-[0.98] transition"
              aria-label="Previous day"
            >
              <ChevronLeft size={16} className="text-gray-700 sm:w-5 sm:h-5" />
            </button>
            <div
              className="h-8 sm:h-9 min-w-[100px] sm:min-w-[140px] px-2 sm:px-4 inline-flex items-center justify-center bg-white border-y border-gray-200 shadow-sm text-xs sm:text-sm font-medium text-gray-800 select-none"
              style={{ letterSpacing: "0.1px" }}
            >
              {centerLabel}
            </div>
            <button
              onClick={() => goto("next")}
              className="h-8 sm:h-9 w-8 sm:w-9 inline-flex items-center justify-center rounded-r-xl bg-white border border-gray-200 shadow-sm hover:bg-gray-50 active:scale-[0.98] transition"
              aria-label="Next day"
            >
              <ChevronRight size={16} className="text-gray-700 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div
          className="rounded-2xl overflow-hidden [&_.fc-timegrid-slot-label]:border-0 [&_.fc-timegrid-slot-label-frame]:border-0 [&_.fc-timegrid-col_.fc-timegrid-slot]:border-t [&_.fc-timegrid-col_.fc-timegrid-slot]:border-dashed [&_.fc-timegrid-col_.fc-timegrid-slot]:border-[#E5E7EB] [&_.fc-timegrid-col_.fc-timegrid-slot-lane]:border-t-2 [&_.fc-timegrid-col_.fc-timegrid-slot-lane]:border-solid [&_.fc-timegrid-col_.fc-timegrid-slot-lane]:border-[#111827]"
          style={{
            ["--fc-page-bg-color"]: "#FFFFFF",
            ["--fc-neutral-bg-color"]: "transparent",
            ["--fc-today-bg-color"]: "transparent",
            ["--fc-border-color"]: "#EDE9F2",
          }}
        >
          <FullCalendar
            ref={calendarRef}
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridDay"
            headerToolbar={false}
            allDaySlot={false}
            dayHeaders={false}
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            slotDuration="00:15:00"
            slotLabelInterval={{ hours: 1 }}
            slotLabelClassNames={() => "!p-0"}
            slotLabelContent={renderSlotLabel}
            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            events={events}
            eventContent={renderEventContent}
            height="auto"
            contentHeight="auto"
            datesSet={(arg) => setCurrentDate(arg.start)}
          />
        </div>

        {/* Tooltip (unchanged, just responsive width) */}
        {hoveredEvent &&
          createPortal(
            <div
              onMouseEnter={() => clearTimeout(hideTimeout.current)}
              onMouseLeave={() =>
                (hideTimeout.current = setTimeout(
                  () => setHoveredEvent(null),
                  150
                ))
              }
              className="absolute z-[150] bg-[#F6F4F5] rounded-lg shadow-xl border border-gray-200 w-[65vw] sm:w-[22rem] md:w-80 max-w-[320px] text-xs sm:text-sm transition-opacity duration-200 ease-in-out opacity-100"
              style={{
                top: tooltipPosition.top,
                left: tooltipPosition.left,
                transform: "translateX(-50%)",
              }}
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white" />
              <div className="flex justify-between rounded-t-lg bg-white py-2 px-3 sm:px-4 overflow-hidden items-center mb-2">
                <div className="flex items-center gap-2 text-gray-600 text-[11px] sm:text-xs">
                  <Image
                    src="/icons/blackClock.png"
                    alt="status icon"
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                  <span>
                    {hoveredEvent.start.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}{" "}
                    -{" "}
                    {hoveredEvent.end.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </span>
                </div>
                <span className="text-gray-700 font-medium text-[11px] sm:text-xs capitalize">
                  {hoveredEvent.extendedProps.status}
                </span>
              </div>

              <div className="p-3 sm:p-4 overflow-hidden">
                {hoveredEvent.extendedProps.customer && (
                  <div className="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-8">
                    <img
                      src={getAvatar(hoveredEvent.extendedProps.avatar)}
                      alt="avatar"
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 capitalize text-sm sm:text-base">
                        {hoveredEvent.extendedProps.customer}
                      </p>
                      {hoveredEvent.extendedProps.email && (
                        <p className="text-gray-500 text-[10px] sm:text-xs truncate">
                          {hoveredEvent.extendedProps.email}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex mt-6 sm:mt-10 justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 mb-1 capitalize text-sm sm:text-base">
                      {hoveredEvent.title}
                    </p>
                    {hoveredEvent.extendedProps.location && (
                      <p className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1 capitalize">
                        <Image
                          src={hoveredEvent.extendedProps?.butler?.image}
                          alt="status icon"
                          width={16}
                          height={16}
                          className="object-contain"
                        />
                        {hoveredEvent.extendedProps?.butler.firstName +
                          " " +
                          hoveredEvent.extendedProps?.butler.lastName}
                      </p>
                    )}
                  </div>
                  {hoveredEvent.extendedProps.price && (
                    <p className="text-pink-600 font-bold text-right text-sm sm:text-base">
                      {hoveredEvent.extendedProps.price}
                    </p>
                  )}
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>
    </div>
  );
}
