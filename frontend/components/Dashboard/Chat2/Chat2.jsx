"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FiMenu } from "react-icons/fi";
import { IoIosSend } from "react-icons/io";
import socket from "../../../utils/socket"; // update this path to where you put socket.js
import { useGetAllUserQuery, useMyProfileQuery } from "@/features/auth"; // keep your hook
import { useSession } from "next-auth/react";
// import toast if you want notifications

const Chat = () => {
  const { data: usersRes, isLoading } = useGetAllUserQuery();
  const users = usersRes?.data || []; // adapt to your API response shape
  const data = useSession();

  const status = data?.status;

  const userId = data?.data?.user?.id;

  const { data: user } = useMyProfileQuery(userId, {
    skip: status === "loading", // ⛔ skip if userId doesn't exist
  });
  // 3️⃣ Extract your user data
  const myUser = user?.data;

  // replace this with your actual logged-in user (from Redux / context)
  // const myUser = {
  //   _id: "1",
  //   name: "Ankon",
  //   picture: "/user1.png",
  //   isOnline: true,
  // };

  const [selectedUser, setSelectedUser] = useState(null);
  // messagesMap: { [otherUserId]: [ { senderId, receiverId, content, timestamp } ] }
  const [messagesMap, setMessagesMap] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesContainerRef = useRef(null);

  // Connect socket and join user room
  useEffect(() => {
    if (!myUser?._id) return;

    // connect only once
    if (!socket.connected) socket.connect();

    socket.emit("join", { userId: myUser?._id });

    const onConnect = () => {
      console.log("socket connected", socket.id);
    };

    const onDisconnect = (reason) => {
      console.log("socket disconnected", reason);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      // leave room and cleanup
      try {
        socket.emit("leave", { userId: myUser?._id });
      } catch (e) {}
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      // remove other handlers as well
      socket.off("receiveMessage");
      socket.off("messageHistory");
      // don't call socket.disconnect() globally if other parts of app use it
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUser?._id]);

  // receive a single incoming message
  useEffect(() => {
    const handleReceive = (msg) => {
      // msg: { senderId, receiverId, content, timestamp }
      const otherId =
        msg.senderId === myUser?._id ? msg.receiverId : msg.senderId;

      setMessagesMap((prev) => {
        const prevArr = prev[otherId] ? [...prev[otherId]] : [];
        // append - keep chronological order (old -> new)
        return { ...prev, [otherId]: [...prevArr, msg] };
      });
    };

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
    };
  }, [myUser?._id]);

  // receive message history for a conversation
  useEffect(() => {
    const handleHistory = ({ withUserId, messages }) => {
      // messages expected as an array: [{ senderId, receiverId, content, timestamp }, ...]
      setMessagesMap((prev) => ({ ...prev, [withUserId]: messages || [] }));
      // scroll to bottom once messages set
      setTimeout(() => scrollToBottom(), 100);
    };

    socket.on("messageHistory", handleHistory);

    return () => {
      socket.off("messageHistory", handleHistory);
    };
  }, []);

  // helper to scroll messages to bottom
  const scrollToBottom = () => {
    const el = messagesContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  // when user clicks a chat partner
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsSidebarOpen(false);

    // request server for message history between myUser and this user
    socket.emit("getMessages", {
      senderId: myUser?._id,
      receiverId: user?._id,
    });

    // optimistically ensure there is an array
    setMessagesMap((prev) => ({ ...prev, [user._id]: prev[user._id] || [] }));
  };

  // send message
  const sendMessage = () => {
    if (!selectedUser || !inputValue.trim()) return;

    const newMsg = {
      senderId: myUser._id,
      receiverId: selectedUser._id,
      content: inputValue.trim(),
      timestamp: Date.now(),
    };

    // emit to server
    socket.emit("sendMessage", newMsg);

    // optimistically update UI
    setMessagesMap((prev) => {
      const prevArr = prev[selectedUser._id] ? [...prev[selectedUser._id]] : [];
      return { ...prev, [selectedUser._id]: [...prevArr, newMsg] };
    });

    setInputValue("");
    setTimeout(() => scrollToBottom(), 50);
  };

  if (isLoading) return <p>Loading users...</p>;

  return (
    <div className="flex gap-6 h-[800px] rounded-xl">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 w-72 h-full pt-6 md:pt-10 bg-white border-r p-4 space-y-6 transform transition-transform duration-300 md:relative md:translate-x-0 rounded-xl shadow-md ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
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
            onClick={() => handleUserClick(user)}
          >
            <div className="relative">
              <Image
                src={
                  user?.image ||
                  user?.picture ||
                  "https://i.ibb.co/x3HtTG8/images.jpg"
                }
                alt={user?.firstName || user?.name}
                width={40}
                height={40}
                className="rounded-md object-cover"
              />
              <span
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${
                  user.isOnline ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            </div>

            <div>
              <p className="font-bold text-lg">
                {user?.firstName || user?.name} {user?.lastName || ""}
              </p>
              <p className="text-xs text-gray-500">
                {/* show last message if any */}
                {messagesMap[user._id]?.slice(-1)[0]?.content ||
                  "No messages yet"}
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
                  src={
                    selectedUser.image ||
                    selectedUser.picture ||
                    "https://i.ibb.co/x3HtTG8/images.jpg"
                  }
                  alt={selectedUser.name}
                  width={40}
                  height={40}
                  className="rounded-md object-cover"
                />
                <div>
                  <h2 className="font-semibold">
                    {selectedUser.name || selectedUser.firstName}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {selectedUser.isOnline
                      ? "Active now"
                      : `Last active: ${new Date(
                          selectedUser.lastActive || Date.now()
                        ).toLocaleString()}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={messagesContainerRef}
              className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50"
            >
              {(messagesMap[selectedUser._id] || []).map((msg, i) => (
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
