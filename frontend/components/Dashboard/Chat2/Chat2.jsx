"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { IoIosSend } from "react-icons/io";

const Chat = () => {
  // Dummy logged-in user
  const myUser = {
    _id: "1",
    name: "Ankon",
    picture: "/user1.png",
    isOnline: true,
  };

  // Dummy users
  const users = [
    {
      _id: "2",
      name: "Rakib Butler",
      picture:
        "https://i.ibb.co/ymrkzKgj/d53813b0-27d6-476e-8d15-2bb2db7ff980.jpg",
      isOnline: true,
      lastActive: Date.now(),
    },
    {
      _id: "3",
      name: "Shamir",
      picture:
        "https://i.ibb.co/ZpjQH2Z1/1746391483158.jpg",
      isOnline: false,
      lastActive: Date.now() - 60000,
    },
  ];

  // States
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Send message
  const sendMessage = () => {
    if (!selectedUser || !inputValue.trim()) return;

    const newMsg = {
      senderId: myUser._id,
      receiverId: selectedUser._id,
      content: inputValue,
      timestamp: Date.now(),
    };

    setMessages((prev) => {
      const userMsgs = prev[selectedUser._id] || [];
      return { ...prev, [selectedUser._id]: [...userMsgs, newMsg] };
    });

    setInputValue("");
  };

  return (
    <div className="flex gap-6 h-[800px] bg-gray-50 p-0 md:p-4 rounded-xl">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 w-72 h-full pt-6 md:pt-10 bg-white border-r p-4 space-y-6 transform transition-transform duration-300
        md:relative md:translate-x-0 rounded-xl shadow-md
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex gap-4 items-center mb-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hover:bg-gray-100 md:hidden text-xl"
          >
            <FiMenu />
          </button>
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>

        {users.map((user) => (
          <div
            key={user._id}
            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition ${
              selectedUser?._id === user._id ? "bg-gray-100" : ""
            }`}
            onClick={() => {
              setSelectedUser(user);
              setIsSidebarOpen(false);
            }}
          >
            <div className="relative">
              <Image
                src={user?.picture}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-md object-cover"
              />
              <span
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${
                  user.isOnline ? "bg-green-500" : "bg-gray-400"
                }`}
              ></span>
            </div>
            <div>
              <p className="font-bold text-lg">{user.name}</p>
              <p className="text-xs text-gray-500">
                {messages[user._id]?.slice(-1)[0]?.content || "No messages yet"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col rounded-xl bg-white shadow-md overflow-hidden">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="border-b p-4 flex items-center gap-4 bg-white">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hover:bg-gray-100 px-4 py-2 text-2xl"
              >
                <FiMenu />
              </button>
              <div className="flex items-center gap-2">
                <Image
                  src={selectedUser.picture}
                  alt={selectedUser.name}
                  width={40}
                  height={40}
                  className="rounded-md object-cover"
                />
                <div>
                  <h2 className="font-semibold">{selectedUser.name}</h2>
                  <p className="text-xs text-gray-500">
                    {selectedUser.isOnline
                      ? "Active now"
                      : `Last active: ${new Date(
                          selectedUser.lastActive
                        ).toLocaleTimeString()}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
              {(messages[selectedUser._id] || []).map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.senderId === myUser._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-xl max-w-xs ${
                      msg.senderId === myUser._id
                        ? "bg-[#FF006A] text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t flex items-center space-x-2 bg-white">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
              />
              <button
                onClick={sendMessage}
                className="p-3 bg-pink-500 text-white rounded-full hover:bg-pink-600"
              >
                <IoIosSend />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
            <h2 className="text-xl font-semibold mb-2">Start a Conversation</h2>
            <p>Select a user from the sidebar to begin chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
