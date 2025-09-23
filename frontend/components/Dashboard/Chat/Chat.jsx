"use client";
import Image from "next/image";
import { useState } from "react";
import { FaPlay, FaPause, FaPaperPlane } from "react-icons/fa";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const users = [
    { name: "Marvin McKinney", msg: "Hi, Thank You For Your Message..." },
    { name: "Devon Lane", msg: "No Problem, I've Prescribed 25mg..." },
    { name: "Wade Warren", msg: "Hi Hanna, Thank You For Your Rea..." },
  ];
  return (
    <div className="flex gap-6 h-[800px]">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 w-72 h-full pt-20 md:pt-10 bg-white border-r p-4 space-y-6 rounded-xl transform transition-transform duration-300
          md:relative md:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {users.map((user, i) => (
          <div key={i} className="flex items-center space-x-3 cursor-pointer">
            <Image
              src="/Dashboard/customer.png" // public folder er image
              alt=""
              width={40}
              height={40}
              className="rounded-xl object-cover"
            />
            <div>
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-gray-500 truncate w-2/3">{user.msg}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col rounded-xl">
        {/* Chat Header */}
        <div className="border-b bg-white p-4 flex items-center justify-between rounded-xl">
          <div className="flex items-center gap-2">
            <Image
              src="/Dashboard/chat/profile.png" // public folder er image
              alt=""
              width={40}
              height={40}
              className="rounded-md object-cover"
            />
            <div>
              <h2 className="font-semibold">Mirtelo Salon</h2>
              <p className="text-xs text-gray-500">Active 32 Min Ago</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            ☰
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-white rounded-xl md:px-24">
          {/* Voice Message */}
          <div className="flex items-center space-x-2">
            {/* <div className="w-40 h-10 bg-gray-200 rounded-full flex items-center justify-between px-2">
              <span className="text-xs">|||||||||</span>

              <FaPlay className="text-pink-500" />
            </div> */}
            <div className="space-y-2">
              <div className="w-80 h-10 relative">
                <Image
                  src="/Dashboard/chat/voice.png"
                  alt="voice"
                  className="object-cover"
                  fill
                />
              </div>
              <span className="text-xs text-gray-400">2:02 AM</span>
            </div>
          </div>

          {/* Text Message */}
          <div className="max-w-md ml-auto bg-[#FF006A] text-white p-3 rounded-xl">
            Went To Sunset Ridge. The View Was Amazing!
          </div>
          <p className="text-xs text-gray-400 text-right">2:08 • Seen</p>

          {/* Incoming Text */}
          <div className="max-w-lg bg-gray-100 text-gray-800 p-2 rounded-xl">
            Wow, I've Been Meaning To Check That Out. Maybe You Can Be My Guide
            Someday
          </div>
          <span className="text-xs text-gray-400">2:12 AM</span>

          <div className="max-w-md ml-auto bg-[#FF006A] text-white p-3 rounded-xl">
            Went To Sunset Ridge. The View Was Amazing!
          </div>
          <p className="text-xs text-gray-400 text-right">2:08 • Seen</p>

          {/* Outgoing Audio */}
          <div className="flex items-center space-x-2">
            <div className="space-y-2">
              <div className="w-80 h-10 relative">
                <Image
                  src="/Dashboard/chat/voice.png"
                  alt="voice"
                  className="object-cover"
                  fill
                />
              </div>
              <span className="text-xs text-gray-400">2:02 AM</span>
            </div>
          </div>

          {/*voice3*/}
          <div className="max-w-md ml-auto  text-white p-3 rounded-xl">
            <div className="w-full h-10 relative">
              <Image
                src="/Dashboard/chat/voice3.png"
                alt="voice"
                className="object-cover  rounded-xl"
                fill
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 text-right">2:08 • Seen</p>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t flex items-center space-x-2 bg-white rounded-xl">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hi This Is a Message !"
            className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
          />
          <button className="p-3 bg-pink-500 text-white rounded-full hover:bg-pink-600">
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
