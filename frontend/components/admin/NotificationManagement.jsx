'use client'
import React, { useState } from "react";
import messageIcon from '@/public/Dashboard/message.png'
import Image from "next/image";
import {
  useCreateNotificationMutation,
  useAudienceCountQuery,
} from "@/features/notificationApi";
import toast, { Toaster } from "react-hot-toast";

// Admin broadcast form.
//
// This wrote to every user on file from a single button with no confirmation and
// no idea how many people it reached (M6). It now states the recipient count up
// front, requires an explicit confirmation, and reports the real number sent.
//
// The heading also said "Choose who will get this SMS". No SMS is sent on this
// path: the endpoint writes an in-app notification only, so the label was
// telling the admin they were texting customers when they were not.

const AUDIENCES = [
  { key: "allUsers", label: "All users", countKey: "allUsers" },
  { key: "butler", label: "Butlers", countKey: "butler" },
  { key: "customer", label: "Customers", countKey: "customer" },
];

const Toggle = ({ on, onClick, label }) => (
  <div className="mt-4 flex items-center justify-between">
    <h4 className="text-[#141414]">{label}</h4>
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      className={`${
        on ? "bg-[#FF006A]" : "bg-[#f0f0f0]"
      } w-[57px] h-[30px] p-[0.150rem] cursor-pointer border transition-colors duration-500 border-[#e5eaf2] rounded-full relative`}>
      <div
        className={`${
          on ? "translate-x-[28px] bg-white" : "translate-x-[2px]"
        } w-[23px] h-[23px] transition-all duration-500 rounded-full bg-white`}
        style={{ boxShadow: "1px 2px 5px 2px rgb(0,0,0,0.1)" }}></div>
    </button>
  </div>
);

const EMPTY = {
  title: "",
  message: "",
  recipients: { allUsers: false, butler: false, customer: false },
};

export default function NotificationManagement() {
  const [notificationData, setNotificationData] = useState(EMPTY);
  const [confirming, setConfirming] = useState(false);

  const [createNotification, { isLoading }] = useCreateNotificationMutation();
  const { data: counts } = useAudienceCountQuery();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotificationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (recipientType) => {
    setNotificationData((prev) => ({
      ...prev,
      recipients: {
        ...prev.recipients,
        [recipientType]: !prev.recipients[recipientType],
      },
    }));
  };

  const { allUsers, butler, customer } = notificationData.recipients;
  const anyAudience = allUsers || butler || customer;
  const hasContent =
    notificationData.title.trim() !== "" || notificationData.message.trim() !== "";
  const canSend = anyAudience && hasContent && !isLoading;

  // "All users" already includes both roles, so adding the role counts on top
  // would overstate the reach.
  const estimatedRecipients = !counts
    ? null
    : allUsers
    ? counts.allUsers
    : (butler ? counts.butler : 0) + (customer ? counts.customer : 0);

  const audienceSummary = allUsers
    ? "every user on file"
    : [butler && "butlers", customer && "customers"].filter(Boolean).join(" and ");

  const send = async () => {
    try {
      const res = await createNotification(notificationData).unwrap();
      const n = res?.recipientCount;
      toast.success(
        typeof n === "number"
          ? `Notification sent to ${n} recipient${n === 1 ? "" : "s"}.`
          : "Notification sent."
      );
      setNotificationData(EMPTY);
    } catch (error) {
      toast.error(
        error?.data?.message || "Could not send the notification. Please try again."
      );
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="mx-auto p-4">
      <Toaster />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (canSend) setConfirming(true);
        }}>
        <section className="bg-white p-6 rounded-3xl shadow-sm">
          <div className="w-full">
            <label htmlFor="title" className="font-medium text-[#424242]">
              Notification Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={notificationData.title}
              onChange={handleInputChange}
              placeholder="Add Title"
              className="border-[#e5eaf2] border rounded-md outline-none px-4 w-full mt-1 py-3 transition-colors duration-300"
            />
          </div>

          <div className="w-full mt-6">
            <label htmlFor="message" className="font-medium text-[#424242]">
              Notification Message
            </label>
            <textarea
              name="message"
              id="message"
              value={notificationData.message}
              onChange={handleInputChange}
              placeholder="Start writing here"
              className="border-[#e5eaf2] border rounded-md outline-none px-4 w-full mt-1 py-3 min-h-[150px] transition-colors duration-300"
            />
          </div>
        </section>

        <section className="bg-white mt-6 p-6 rounded-3xl shadow-sm">
          <h4 className="font-medium text-[#424242]">
            Choose who will get this in-app notification
          </h4>

          {AUDIENCES.map((a) => (
            <Toggle
              key={a.key}
              label={
                counts
                  ? `${a.label} (${counts[a.countKey]})`
                  : a.label
              }
              on={notificationData.recipients[a.key]}
              onClick={() => handleToggle(a.key)}
            />
          ))}

          {anyAudience && estimatedRecipients !== null && (
            <p className="mt-5 text-sm text-[#424242]">
              This will reach{" "}
              <strong>
                {estimatedRecipients} recipient
                {estimatedRecipients === 1 ? "" : "s"}
              </strong>{" "}
              ({audienceSummary}).
            </p>
          )}
        </section>

        <div className="mt-6 flex">
          <button
            type="submit"
            disabled={!canSend}
            className="bg-[#FF006A] text-white px-6 py-3 rounded-full font-medium cursor-pointer transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            <div className="flex items-center gap-2">
              <Image src={messageIcon} alt="" />
              <span>{isLoading ? "Sending..." : "Send Notification"}</span>
            </div>
          </button>
        </div>

        {!anyAudience && (
          <p className="mt-3 text-sm text-gray-500">
            Select at least one audience to send.
          </p>
        )}
      </form>

      {confirming && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="broadcast-confirm-title">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 id="broadcast-confirm-title" className="text-lg font-semibold">
              Send this notification?
            </h3>
            <p className="text-sm text-[#424242]">
              It will be sent to{" "}
              <strong>
                {estimatedRecipients === null
                  ? "the selected audience"
                  : `${estimatedRecipients} recipient${
                      estimatedRecipients === 1 ? "" : "s"
                    }`}
              </strong>{" "}
              ({audienceSummary}). This cannot be undone.
            </p>
            <p className="text-sm bg-[#F2EDEF] rounded-lg p-3 break-words">
              {[notificationData.title.trim(), notificationData.message.trim()]
                .filter(Boolean)
                .join(" ")}
            </p>
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="px-5 py-2 rounded-full border border-[#e5eaf2] cursor-pointer">
                Cancel
              </button>
              <button
                type="button"
                onClick={send}
                disabled={isLoading}
                className="px-5 py-2 rounded-full bg-[#FF006A] text-white font-medium cursor-pointer disabled:opacity-50">
                {isLoading ? "Sending..." : "Yes, send it"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
