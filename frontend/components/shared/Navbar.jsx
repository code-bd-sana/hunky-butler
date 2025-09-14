"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const [isServiceOpen, setIsServiceOpen] = useState(false); 

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
    <nav className="max-w-[1866px] mx-auto sticky z-50">
      <div
        className="flex items-center justify-between px-[32px] py-[20px] rounded-[100px] h-[88px] bg-transparent text-white shadow-xl backdrop-blur-lg"
        style={{ background: "rgba(74, 74, 74, 0.4)" }}
      >
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/logo/logoImg.png"
            alt="Hunky Butler Service Logo"
            className="w-[55px] h-[60px] object-contain"
          />
          <h1 className="text-xl font-semibold tracking-wide whitespace-nowrap">
            Hunky Butler Service
          </h1>
        </div>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-[8px] font-medium relative">
          {navLinks.map((link) => {
            const isActive = pathname === link.href && link.name !== "Home";

            if (link.submenu) {
              return (
                <div key={link.href} className="relative">
                  <button
                    onClick={() => setIsServiceOpen(!isServiceOpen)}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      isActive
                        ? "bg-[rgba(255,0,106,1)]"
                        : "hover:bg-[rgba(255,0,106,1)] text-white"
                    }`}
                  >
                    {link.name}
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

        {/* Social + Button */}
        <div className="flex items-center gap-[32px]">
          <div className="hidden md:flex gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/socialIcon/fb.png"
                alt="Facebook"
                width={32}
                height={32}
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
                width={32}
                height={32}
              />
            </a>
            <a href="https://t.com" target="_blank" rel="noopener noreferrer">
              <Image
                src="/socialIcon/t.png"
                alt="Twitter"
                width={18}
                height={32}
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
                width={32}
                height={32}
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
                width={32}
                height={32}
              />
            </a>
          </div>

          <button
            style={{ color: "rgba(255,0,106,1)" }}
            className="px-[18px] py-[12px] w-[176px] h-[48px] bg-white rounded-full font-semibold shadow-md transition-transform duration-200 hover:scale-105 whitespace-nowrap"
          >
            Get Instant Quote
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
