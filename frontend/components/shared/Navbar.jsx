"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HiChevronDown, HiOutlineMenu, HiX } from "react-icons/hi";

import {
  FaTumblr,
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
  FaTelegram,
} from "react-icons/fa";
import logo from "@/public/logo/logo.png";

const Navbar = () => {
  const pathname = usePathname();
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileServiceOpen, setIsMobileServiceOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    {
      name: "Service",
      href: "/service",
      submenu: [
        { name: "Buff Butlers", href: "/service/buffButlers" },
        { name: "Life Drawing", href: "/service/lifeDrawing" },
        { name: "Cocktail Masterclasses", href: "/service/cocktail" },
        { name: "Strippers", href: "/service/strippers" },
      ],
    },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
    { name: "Jobs", href: "/jobs" },
  ];

  return (
    <nav className="fixed mt-[32px] top-0 left-0 w-full z-100">
      <div className="max-w-[1866px] mx-auto">
        <div
          className="flex items-center justify-between px-[32px] py-[20px] rounded-[100px] h-[68px] bg-transparent backdrop-blur-lg text-white shadow-xl"
          style={{ background: "rgba(74, 74, 74, 0.4)" }}
        >
          {/* Logo */}
          <div className="flex items-center gap-[3.5px]">
            <Image
              src={logo}
              alt="Hunky Butler Service Logo"
              className="object-contain"
              width={35}
              height={40}
            />
            <h1 className="text-xl hidden xl:block font-semibold tracking-wide whitespace-nowrap">
              Hunky Butler Service
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-[8px] font-medium relative">
            {navLinks.map((link) => {
              const isActive = pathname === link.href && link.name !== "Home";

              if (link.submenu) {
                return (
                  <div key={link.href} className="relative">
                    <button
                      onClick={() => setIsServiceOpen(!isServiceOpen)}
                      className={`px-4 py-2 rounded-full transition-colors flex items-center gap-2 ${
                        isActive
                          ? "bg-[rgba(255,0,106,1)]"
                          : "hover:bg-[rgba(255,0,106,1)] text-white"
                      }`}
                    >
                      {link.name}
                      <HiChevronDown
                        className={`transition-transform duration-200 -mb-1 ${
                          isServiceOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>

                    {/* Submenu */}
                    {isServiceOpen && (
                      <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded-[16px] shadow-lg w-[220px] z-50">
                        {link.submenu.map((sublink) => (
                          <Link
                            key={sublink.href}
                            href={sublink.href}
                            className="block px-4 py-2 hover:bg-[rgba(255,0,106,0.1)] transition-colors"
                            onClick={() => setIsServiceOpen(false)}
                          >
                            {sublink.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    isActive
                      ? "bg-[rgba(255,0,106,1)]"
                      : "hover:bg-[rgba(255,0,106,1)] text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Social + Button */}
          <div className="hidden lg:flex items-center gap-[32px]">
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/socialIcon/fb.png"
                  alt="Facebook"
                  width={24}
                  height={24}
                />
              </a>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/socialIcon/wp.png"
                  alt="WhatsApp"
                  width={24}
                  height={24}
                />
              </a>
              <a href="https://t.com" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/socialIcon/t.png"
                  alt="Tumblr"
                  width={14}
                  height={24}
                />
              </a>
              <a
                href="https://telegram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/socialIcon/telegram.png"
                  alt="Telegram"
                  width={24}
                  height={24}
                />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/socialIcon/insta.png"
                  alt="Instagram"
                  width={24}
                  height={24}
                />
              </a>
            </div>

            <button
              style={{ color: "rgba(255,0,106,1)" }}
              className="px-[16px] py-[8px] w-[164px] h-[44px] bg-white rounded-full font-semibold shadow-md transition-transform duration-200 hover:scale-105 whitespace-nowrap"
            >
              Get Instant Quote
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <HiX className="w-8 h-8 text-white" />
              ) : (
                <HiOutlineMenu className="w-8 h-8 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden mt-2 px-[32px] py-4 bg-white text-black rounded-[24px] shadow-lg">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => {
                if (link.submenu) {
                  return (
                    <div key={link.href}>
                      <button
                        onClick={() =>
                          setIsMobileServiceOpen(!isMobileServiceOpen)
                        }
                        className="w-full px-4 py-2 font-medium rounded-full transition-colors flex items-center gap-2"
                      >
                        <span>{link.name}</span>
                        <HiChevronDown
                          className={`transition-transform duration-200 -mb-1 ${
                            isMobileServiceOpen ? "rotate-180" : "rotate-0"
                          }`}
                        />
                      </button>

                      {isMobileServiceOpen && (
                        <div className="ml-4 mt-2 flex flex-col gap-2">
                          {link.submenu.map((sublink) => (
                            <Link
                              key={sublink.href}
                              href={sublink.href}
                              className="px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-[rgba(255,0,106,0.1)] transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {sublink.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 font-medium rounded-full transition-colors`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <h1>{link.name}</h1>
                    </div>
                  </Link>
                );
              })}

              {/* Social Icons */}
              <div className="flex justify-center gap-4 mt-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook size={32} />
                </a>
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp size={32} />
                </a>
                <a
                  href="https://t.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTumblr size={32} />
                </a>
                <a
                  href="https://telegram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTelegram size={32} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram size={32} />
                </a>
              </div>

              {/* Quote Button */}
              <button className="mt-4 px-[18px] py-[12px] w-full bg-[rgba(255,0,106,1)] text-white rounded-full font-semibold shadow-md transition-transform duration-200 hover:scale-105 whitespace-nowrap">
                Get Instant Quote
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
