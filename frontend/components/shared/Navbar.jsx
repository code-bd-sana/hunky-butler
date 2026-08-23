"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HiOutlineMenu, HiX } from "react-icons/hi";

import {
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa";
import logo from "@/public/logo/logo.png";
import ServicePopup from "../servicePopup/ServicePopup";
import { SOCIAL_LINKS, HEADER_SOCIAL_LINKS } from "@/lib/socialLinks";

// Mobile menu renders react-icons rather than the PNG set used on desktop.
const MOBILE_SOCIAL_ICONS = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  tiktok: FaTiktok,
  whatsapp: FaWhatsapp,
};

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showService, setShowService] = useState(false);

  const hideTimer = useRef(null);

  const startHideTimer = () => {
    hideTimer.current = setTimeout(() => {
      setShowService(false);
    }, 500);
  };

  const cancelHideTimer = () => {
    clearTimeout(hideTimer.current);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Service", href: "/party-entertainment-services" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
    { name: "Join The Team", href: "/joinTheTeam" },
    // { name: "Location", href: "/locations" },
  ];

  return (
    <nav className="fixed mt-[32px] top-0 left-0 w-full z-[100]">
      <div className="max-w-[1866px] mx-auto relative">
        <div
          className="flex items-center justify-between px-[32px] py-[20px] rounded-[100px] h-[68px] bg-transparent backdrop-blur-lg text-white shadow-xl"
          style={{ background: "rgba(74, 74, 74, 0.4)" }}
        >
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2">
              <Image
                src={logo}
                alt="Hunky Butler Service Logo"
                className="object-contain"
                width={35}
                height={40}
              />
              {/* Brand name is a logo, not a page heading. Using a span keeps
                  exactly one H1 per page (the page's own title) so search
                  engines get a single clear signal about the page topic. */}
              <span className="text-xl hidden 2xl:block font-semibold tracking-wide whitespace-nowrap">
                Hunky Butler Service
              </span>
            </div>
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-[8px] font-medium relative">
            {navLinks.map((link) => {
              const isActive = pathname === link.href && link.name !== "Home";

              if (link.name === "Service") {
                return (
                  <div
                    key={link.href}
                    onMouseEnter={() => {
                      cancelHideTimer();
                      setShowService(true);
                    }}
                    onMouseLeave={startHideTimer}
                  >
                    <Link
                      href={link.href}
                      className={`px-4 py-2 rounded-full transition-colors ${
                        isActive
                          ? "bg-[rgba(255,0,106,1)]"
                          : "hover:bg-[rgba(255,0,106,1)] text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
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
          <div className="hidden xl:flex items-center gap-[32px]">
            {/* Desktop social icons, from lib/socialLinks.js. Only profiles
                that actually exist are rendered. */}
            <div className="flex gap-4">
              {HEADER_SOCIAL_LINKS.map(({ key, href, label, name, icon }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <Image src={icon} alt={name} width={24} height={24} />
                </a>
              ))}
            </div>

            <Link
              href={"/quote"}
              className="inline-flex items-center justify-center px-6 h-11 min-w-[164px] bg-white text-[#FF006A] rounded-full font-semibold transition-transform duration-200 hover:scale-105 whitespace-nowrap text-center"
            >
              Get Instant Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <HiX className="w-8 h-8 text-white" />
              ) : (
                <HiOutlineMenu className="w-8 h-8 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Service Dropdown Mega Menu */}
        {showService && (
          <div
            className="absolute left-0 top-full w-full mt-4 px-[32px] z-[200]"
            onMouseEnter={cancelHideTimer}
            onMouseLeave={startHideTimer}
          >
            <div className="max-w-[1866px] mx-auto">
              <ServicePopup />
            </div>
          </div>
        )}

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="xl:hidden mt-2 px-[32px] py-4 bg-white text-black rounded-[24px] shadow-lg">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 font-medium rounded-full transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {/* Social Icons, from lib/socialLinks.js */}
              <div className="flex justify-center gap-4 mt-4">
                {SOCIAL_LINKS.map(({ key, href, label }) => {
                  const Icon = MOBILE_SOCIAL_ICONS[key];
                  if (!Icon) return null;
                  return (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                    >
                      <Icon size={32} />
                    </a>
                  );
                })}
              </div>

              {/* Quote Button */}
              <button className="mt-4 px-[18px] py-[12px] w-full bg-[rgba(255,0,106,1)] text-[13px] text-white rounded-full font-semibold shadow-md transition-transform duration-200 hover:scale-105 whitespace-nowrap">
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
