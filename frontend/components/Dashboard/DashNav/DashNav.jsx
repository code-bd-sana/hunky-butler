"use client";
import { useMyProfileQuery } from "@/features/auth";
import { useMarkSeenAllMutation, useMarkSeenMutation, useMyNotificationQuery } from "@/features/notificationApi";
import { toggleSidebar } from "@/features/sidebarSlice";
import { useAdminToolTab } from "@/hooks/useAdminToolTab";
import { useActiveTab, useSetTab } from "@/hooks/useUsersTab";
import { SOCKET_URL } from "@/utils/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaUserCircle } from "react-icons/fa";
import { FiBell, FiSun } from "react-icons/fi";
import { HiMenuAlt1 } from "react-icons/hi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { RiMenuUnfold3Fill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";

const DashNav = ({ tab }) => {
  const activeTab = useActiveTab();
  const activeAdminTool = useAdminToolTab();

  const [open, setOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const dispatch = useDispatch();

  const setUserTab = useSetTab();
  const { data: sessionData, status: sessionStatus } = useSession();

  const role = sessionData?.user?.role;
  const userId = sessionData?.user?.id;
  const userEmail = sessionData?.user?.email;

  // Socket.IO state
  const [socket, setSocket] = useState(null);

  // Fetch profile and notification data only when session is available
  const { data: profile, isLoading: profileLoading, isError: profileError } = useMyProfileQuery(userId, {
    skip: !userId, // Skip query if no userId
  });

  const { data: notification, isLoading: notificationLoading, isError: notificationError, refetch: notificationRefetch } = useMyNotificationQuery(userEmail, {
    skip: !userEmail, // Skip query if no userEmail
  });
  
  const [markSeen, { isLoading }] = useMarkSeenMutation();
  const [markSeenAll, { isLoading: loadingMarkseen, error: markseenAllError }] = useMarkSeenAllMutation();
  
  // Refs for handling click outside
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Socket.IO connection setup
  useEffect(() => {
    if (!userEmail) return;

    // Create socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || SOCKET_URL , {
      transports: ['websocket', 'polling']
    });

    setSocket(newSocket);

    // Join user room
    newSocket.emit('join-user', userEmail);

    // Listen for new notifications
    newSocket.on('new-notification', (newNotification) => {

      
      // Show toast notification
      toast.success(" New notification received", {
        duration: 4000,
        position: 'top-right',
        icon: '🔔',
      });

      // Refetch notifications to update the list
      notificationRefetch();
    });

    // Listen for notification updates
    newSocket.on('notification-updated', () => {
 
      notificationRefetch();
    });

    // Handle connection errors
    newSocket.on('connect_error', (error) => {
      console.error('🔌 Socket connection error:', error);
    });

    // Cleanup on unmount
    return () => {
      newSocket.off('new-notification');
      newSocket.off('notification-updated');
      newSocket.off('connect_error');
      newSocket.disconnect();
    };
  }, [userEmail, notificationRefetch]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Safe notification handling
  const notificationsArray = React.useMemo(() => {
    if (!notification) return [];
    
    // If notification is already an array, return it
    if (Array.isArray(notification)) {
      return notification;
    }
    
    // If notification has a data property that's an array
    if (notification.data && Array.isArray(notification.data)) {
      return notification.data;
    }
    
    // If notification is a single object, wrap it in an array
    if (notification && typeof notification === 'object' && notification._id) {
      return [notification];
    }
    
    return [];
  }, [notification]);

  // Count unseen notifications safely
  const unseenCount = React.useMemo(() => {
    return notificationsArray.filter(notif => !notif.seen).length;
  }, [notificationsArray]);

  // Show loading state while session is loading
  if (sessionStatus === "loading") {
    return (
      <div className="flex justify-between items-center max-w-[90vw] bg-white mb-6 rounded-3xl py-4 px-4 md:px-8 animate-pulse border border-zinc-100 shadow-sm">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
          <div>
            <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>
            <div className="h-5 w-40 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  const tabHandaler = async (slug) => {
    try {
      setUserTab(slug);
    } catch (error) {
      console.log(error);
    }
  };

  // Get user name from profile or session
  const getUserName = () => {
    if (profile?.data?.name) return profile.data.name;
    if (sessionData?.user?.name) return sessionData.user.name;
    return "User";
  };

  // Get user image from profile or session
  const getUserImage = () => {
    if (profile?.data?.image) return profile.data.image;
    if (sessionData?.user?.image) return sessionData.user.image;
    return null;
  };

  const handleMarkSeen = async (id) => {
    try {
      const result = await markSeen(id).unwrap();
 
      
      // Emit socket event for real-time update
      if (socket) {
        socket.emit('notification-seen', { id, userEmail });
      }
      
      setNotificationOpen(false);
      notificationRefetch();
      
    } catch (error) {
      toast.error(error?.data?.message || 'Something went wrong!');
      console.log(error);
    }
  };

  const markSeenAllNotif = async (email) => {
    try {
      await markSeenAll(email).unwrap();
      
      // Emit socket event for real-time update
      if (socket) {
        socket.emit('all-notifications-seen', { userEmail: email });
      }
      
      notificationRefetch();
      toast.success('All notifications marked as read!');
      
    } catch (error) {
      toast.error(error?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <div className="flex justify-between overflow-hidden max-w-[90vw] bg-white items-center mb-6 rounded-3xl py-4 px-2 md:px-8">
      <Toaster />
      {tab ? (
        <div className="flex items-center">
          <div className="2xl:hidden">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="text-xl md:text-2xl text-[#FF006A] border-2 border-gray-300 p-2 rounded-md"
            >
              <HiMenuAlt1 />
            </button>
          </div>
          <div
            className={`flex md:flex-row items-center ${
              activeTab === "notification" || "article" ? "" : ""
            }`}
          >
            {tab.map((tab) => (
              <div
                key={tab.slug}
                onClick={() => tabHandaler(tab.slug)}
                className={`
                  ${
                    activeTab === tab.slug
                      ? "text-[#FF006A] text-sm md:text-base"
                      : "text-sm md:text-base text-left"
                  } 
                  ${tab.slug === "notification" ? "text-sm ml-2" : "ml-2"} 
                  cursor-pointer
                `}
              >
                {tab.name}

                <div
                  className={`mt-1 mx-auto md:mx-0 h-[1px] 
                    ${tab.slug === "notification" ? "" : " w-16 md:w-28"} 
                    ${tab.slug === "article" ? "" : "w-16 md:w-28"}   
                    ${activeTab === tab.slug ? "bg-[#FF006A]" : ""}`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="2xl:hidden">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="text-2xl text-[#FF006A] border-2 border-gray-300 p-2 rounded-md"
            >
              <HiMenuAlt1 />
            </button>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Good Morning</p>
            <h2 className="text-xl md:text-2xl font-semibold">
           {
            profile?.data?.firstName ?   profile.data.firstName + ' ' + profile.data.lastName : profile?.data?.role
           }
            </h2>
          </div>
        </div>
      )}
      
      <div className="flex justify-center items-center gap-2">
        {/* Notification Bell with Dropdown */}
        <div className="" ref={notificationRef}>
          <div 
            className="border-2 border-gray-300 p-2 md:p-4 rounded-full relative cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setNotificationOpen(!notificationOpen)}
          >
            {notificationLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            ) : (
              <>
                <FiBell className="text-xl" />
                {unseenCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unseenCount}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Notification Dropdown */}
          {notificationOpen && (
            <div className="absolute  right-0 md:right-16 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
              <div className="p-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                <p className="text-xs text-gray-500">
                  {notificationLoading ? (
                    "Loading..."
                  ) : (
                    `${unseenCount} unread ${unseenCount === 1 ? 'notification' : 'notifications'}`
                  )}
                </p>
              </div>
              
              {notificationLoading ? (
                <div className="py-8 text-center">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-500 text-sm">Loading notifications...</p>
                </div>
              ) : notificationsArray.length > 0 ? (
                <ul className="py-2">
                  {notificationsArray.map((notif) => (
                    <li 
                      key={notif._id} 
                      className={`px-4 py-3 border-b border-gray-100 last:border-b-0 ${
                        !notif.seen ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <p className={`text-sm ${!notif.seen ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
                          {notif.message}
                        </p>
                        {!notif.seen && (
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0"></span>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(notif.createdAt || notif._id?.timestamp || Date.now()).toLocaleDateString()}
                        </span>
                        {notif.link && (
                          <Link 
                            href={notif.link} 
                            className="text-xs text-[#FF006A] hover:text-pink-700 font-medium"
                            onClick={() => handleMarkSeen(notif?._id)}
                          >
                            View
                          </Link>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-8 text-center">
                  <FiBell className="text-3xl text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No notifications yet</p>
                </div>
              )}
              
              {notificationsArray.length > 0 && (
                <div className="p-2 border-t border-gray-200">
                  <button  
                    onClick={() => markSeenAllNotif(userEmail)}
                    className="w-full text-center text-xs text-[#FF006A] hover:text-pink-700 font-medium py-2"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center px-2 py-1 cursor-pointer md:px-3 md:py-2 rounded-full border bg-white text-gray-600 border-gray-300 text-sm font-medium hover:bg-pink-100 hover:text-pink-500 transition"
            disabled={profileLoading}
          >
            {profileLoading ? (
              <div className="w-10 h-10 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            ) : getUserImage() ? (
              <Image
                src={getUserImage()}
                alt="profile"
                width={40}
                height={40}
                className="rounded-full w-10 h-10 object-cover"
              />
            ) : (
              <FaUserCircle className="text-4xl" />
            )}
            <MdKeyboardArrowDown
              className={`text-2xl ml-1 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown */}
          {open && (
            <div className="absolute right-6  mt-2 w-40 bg-white border border-gray-200 rounded-lg z-10">
              <ul className="py-2 text-sm text-gray-700">
                <li>
                  <Link href={'/dashboard/profile'}> 
                    <button className="w-full text-left cursor-pointer px-4 py-2 hover:bg-pink-100 hover:text-pink-500">
                      Profile
                    </button>
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashNav;