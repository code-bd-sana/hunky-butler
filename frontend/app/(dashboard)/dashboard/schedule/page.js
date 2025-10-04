"use client";
import React, { useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  MapPin,
  User,
  CalendarClock,
  CircleDot,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DashNav from "@/components/Dashboard/DashNav/DashNav";

export default function Page() {
  const calendarRef = useRef(null);

  // ---- Date bar state (kept in sync with FullCalendar) ----
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

  // ---- Tooltip state ----
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  // ---- Data ----
  const events = [
    {
      id: "1",
      title: "Cocktail Masterclass",
      start: "2025-09-22T09:00:00",
      end: "2025-09-22T09:45:00",
      backgroundColor: "#ec4899",
      extendedProps: {
        customer: "Darlene Robertson",
        email: "Abc123@example.com",
        status: "Booked",
        price: "£290.00",
        location: "James H.",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      },
    },
    {
      id: "2",
      title: "Life Drawing",
      start: "2025-09-22T09:45:00",
      end: "2025-09-22T10:30:00",
      backgroundColor: "#ec4899",
      extendedProps: {
        customer: "Damon Russell",
        status: "Booked",
        location: "London",
      },
    },
  ];

  // ---- Left slot label (hour + icon) ----
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
      <div className="flex flex-col items-center justify-center gap-2 w-14 mx-auto py-2 text-gray-800">
        <span className="text-xs font-medium leading-none">{hh}:00</span>
        <Icon size={16} className="text-gray-800" />
      </div>
    );
  };

  // ---- Event chip (hover -> tooltip) ----
  const renderEventContent = (info) => (
    <div
      onMouseEnter={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltipPosition({
          top: rect.top + window.scrollY - 10,
          left: rect.left + rect.width / 2,
        });
        setHoveredEvent(info.event);
      }}
      onMouseLeave={() => setHoveredEvent(null)}
      style={{ border: "none" }}
      className="bg-[#FF006A] text-white px-2 py-[2px] text-[16px]
                 w-full h-full flex items-center gap-2 truncate rounded cursor-pointer"
    >
      <CalendarClock size={12} />
      <span>
        {info.event.start.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
        -
        {info.event.end.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </span>
      <User size={12} />
      <span className="truncate">{info.event.extendedProps.customer}</span>
      <MapPin size={12} />
      <span className="truncate">{info.event.title}</span>
      <CircleDot size={10} className="text-white" />
      <span>{info.event.extendedProps.status}</span>
    </div>
  );

  return (
 <div>

        <DashNav/>
     <div className="relative p-4">


      {/*  Date Bar */}
      <div className="mb-3 flex items-center gap-3">
        {/* Today pill */}
        <button
          onClick={() => goto("today")}
          className="h-9 px-3 rounded-xl bg-white text-gray-800 text-sm font-medium
                     border border-gray-200 hover:bg-gray-50 active:scale-[0.99] transition"
        >
          Today
        </button>

        {/* Segmented control: prev | date | next */}
        <div className="flex items-stretch">
          {/* Prev */}
          <button
            onClick={() => goto("prev")}
            className="h-9 w-9 inline-flex items-center justify-center
                       rounded-l-xl bg-white border border-gray-200
                       hover:bg-gray-50 active:scale-[0.98] transition"
            aria-label="Previous day"
          >
            <ChevronLeft size={18} className="text-gray-700" />
          </button>

          {/* Date chip (with vertical separators like Figma) */}
          <div
            className="h-9 min-w-[140px] px-4 inline-flex items-center justify-center
                       bg-white border-y border-gray-200 shadow-sm text-sm font-medium text-gray-800
                       select-none"
            style={{ letterSpacing: "0.1px" }}
          >
            {centerLabel}
          </div>

          {/* Next */}
          <button
            onClick={() => goto("next")}
            className="h-9 w-9 inline-flex items-center justify-center
                       rounded-r-xl bg-white border border-gray-200 shadow-sm
                       hover:bg-gray-50 active:scale-[0.98] transition"
            aria-label="Next day"
          >
            <ChevronRight size={18} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div
         className="
          rounded-2xl overflow-hidden

          /* LEFT LABEL COLUMN (no border lines at all) */
          [&_.fc-timegrid-slot-label]:border-0
          [&_.fc-timegrid-slot-label-frame]:border-0

          /* GRID (event area only) */
          [&_.fc-timegrid-col_.fc-timegrid-slot]:border-t
          [&_.fc-timegrid-col_.fc-timegrid-slot]:border-dashed
          [&_.fc-timegrid-col_.fc-timegrid-slot]:border-[#E5E7EB]

          [&_.fc-timegrid-col_.fc-timegrid-slot-lane]:border-t-2
          [&_.fc-timegrid-col_.fc-timegrid-slot-lane]:border-solid
          [&_.fc-timegrid-col_.fc-timegrid-slot-lane]:border-[#111827]
        "
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
          // keep date bar synced when FC changes view/date internally
          datesSet={(arg) => setCurrentDate(arg.start)}
        />
      </div>

      {/* Tooltip  */}
      {hoveredEvent && (
        <div
          className="absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 w-80 p-4 text-sm"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            transform: "translateX(-50%)",
          }}
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white" />
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 text-gray-600 text-xs">
              <CircleDot size={10} className="text-pink-600" />
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
            <span className="text-gray-700 font-medium text-xs">
              {hoveredEvent.extendedProps.status}
            </span>
          </div>

          {hoveredEvent.extendedProps.customer && (
            <div className="flex items-center gap-3 mb-3">
              {hoveredEvent.extendedProps.avatar && (
                <img
                  src={hoveredEvent.extendedProps.avatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full shadow"
                />
              )}
              <div>
                <p className="font-semibold text-gray-900">
                  {hoveredEvent.extendedProps.customer}
                </p>
                {hoveredEvent.extendedProps.email && (
                  <p className="text-gray-500 text-xs">
                    {hoveredEvent.extendedProps.email}
                  </p>
                )}
              </div>
            </div>
          )}

          <p className="font-medium text-gray-900 mb-1">{hoveredEvent.title}</p>

          {hoveredEvent.extendedProps.location && (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin size={12} /> {hoveredEvent.extendedProps.location}
            </p>
          )}

          {hoveredEvent.extendedProps.price && (
            <p className="text-pink-600 font-bold mt-3 text-right text-base">
              {hoveredEvent.extendedProps.price}
            </p>
          )}
        </div>
      )}
    </div>
 </div>
  );
}
