'use client'
import React, { useState } from "react";
import messageIcon from '@/public/Dashboard/message.png'
import Image from "next/image";
import { useCreateNotificationMutation } from "@/features/notificationApi";
import toast, { Toaster } from "react-hot-toast";

export default function NotificationManagement() {
  const [notificationData, setNotificationData] = useState({
    title: "",
    message: "",
    recipients: {
      allUsers: false,
      butler: false,
      customer: false
    }
  });


const [createNotification, {isLoading, error}] = useCreateNotificationMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotificationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggle = (recipientType) => {
    setNotificationData(prev => ({
      ...prev,
      recipients: {
        ...prev.recipients,
        [recipientType]: !prev.recipients[recipientType]
      }
    }));
  };

  const handler = async(e) => {
    try {
      e.preventDefault();
      
      // Console e data gulo dekha
    
      await createNotification(notificationData).unwrap();
      toast.success("Notification sent Successfully.")
      
      // Ekhane tumi API call korte paro
      // Example:
      // const response = await fetch('/api/send-notification', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(notificationData),
      // });
      
      // if (response.ok) {
      //   console.log('Notification sent successfully!');
      //   // Reset form
      //   setNotificationData({
      //     title: "",
      //     message: "",
      //     recipients: {
      //       allUsers: false,
      //       butler: false,
      //       customer: false
      //     }
      //   });
      // }
      
    } catch (error) {
      console.log("Error sending notification:", error);
    }
  };

  return (
    <div className="mx-auto p-4">
      <Toaster/>
      <form onSubmit={handler}>
        {/* Notification Content Section */}
        <section className="bg-white p-6 rounded-3xl shadow-sm">
          <div className="w-full">
            <label
              htmlFor="title"
              className="font-medium text-[#424242]"
            >
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
            <label
              htmlFor="message"
              className="font-medium text-[#424242]"
            >
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

        {/* Recipient Selection Section */}
        <section className="bg-white mt-6 p-6 rounded-3xl shadow-sm">
          <h4 className="font-medium text-[#424242]">
            Choose who will get this SMS
          </h4>
          
          {/* All Users Toggle */}
          <div className="mt-4 flex items-center justify-between">
            <h4 className="text-[#141414]">All Users</h4>
            <div
              className={`${
                notificationData.recipients.allUsers ? "bg-[#FF006A]" : "bg-[#f0f0f0]"
              } w-[57px] h-[30px] p-[0.150rem] cursor-pointer border transition-colors duration-500 border-[#e5eaf2] rounded-full relative`}
              onClick={() => handleToggle("allUsers")}
            >
              <div
                className={`${
                  notificationData.recipients.allUsers ? "translate-x-[28px] bg-white" : "translate-x-[2px]"
                } w-[23px] h-[23px] transition-all duration-500 rounded-full bg-white`}
                style={{boxShadow: "1px 2px 5px 2px rgb(0,0,0,0.1)"}}
              ></div>
            </div>
          </div>

          {/* Butler Toggle */}
          <div className="mt-4 flex items-center justify-between">
            <h4 className="text-[#141414]">Butler</h4>
            <div
              className={`${
                notificationData.recipients.butler ? "bg-[#FF006A]" : "bg-[#f0f0f0]"
              } w-[57px] h-[30px] p-[0.150rem] cursor-pointer border transition-colors duration-500 border-[#e5eaf2] rounded-full relative`}
              onClick={() => handleToggle("butler")}
            >
              <div
                className={`${
                  notificationData.recipients.butler ? "translate-x-[28px] bg-white" : "translate-x-[2px]"
                } w-[23px] h-[23px] transition-all duration-500 rounded-full bg-white`}
                style={{boxShadow: "1px 2px 5px 2px rgb(0,0,0,0.1)"}}
              ></div>
            </div>
          </div>

          {/* Customer Toggle */}
          <div className="mt-4 flex items-center justify-between">
            <h4 className="text-[#141414]">Customer</h4>
            <div
              className={`${
                notificationData.recipients.customer ? "bg-[#FF006A]" : "bg-[#f0f0f0]"
              } w-[57px] h-[30px] p-[0.150rem] cursor-pointer border transition-colors duration-500 border-[#e5eaf2] rounded-full relative`}
              onClick={() => handleToggle("customer")}
            >
              <div
                className={`${
                  notificationData.recipients.customer ? "translate-x-[28px] bg-white" : "translate-x-[2px]"
                } w-[23px] h-[23px] transition-all duration-500 rounded-full bg-white`}
                style={{boxShadow: "1px 2px 5px 2px rgb(0,0,0,0.1)"}}
              ></div>
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="mt-6 flex">
          <button
            type="submit"
            className="bg-[#FF006A] text-white px-6 py-3 rounded-full font-medium cursor-pointer transition-colors duration-300"
          >
           <div className="flex items-center gap-2">
            <Image src={messageIcon} alt="icon"/>
             <span>

              {
                isLoading ? "Loading..." : "Send Notification"
              }
             </span>
           </div>
          </button>
        </div>
      </form>
    </div>
  );
}