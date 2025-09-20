import React from 'react';
import Banner from "@/components/shared/Banner";
import Footer from '@/components/homepage/Footer';
import img from "../public/error/error-cover-img.jpg";
import errorImg from "../public/error/404.png";
import Link from 'next/link';

import { IoCallSharp } from "react-icons/io5";
import { IoMdMail } from "react-icons/io";
import Image from "next/image";
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaYoutube,
    FaTumblr,
} from "react-icons/fa";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-white">
            <Banner
                image={img}
                service={"Error Page"}
                title={"404"}
            />

            <div className="flex justify-center py-10 sm:py-14 lg:py-22 relative">
                <Image
                    alt="404 img"
                    src={errorImg}
                    width={650}
                    height={650}
                    className="w-[250px] sm:w-[400px] md:w-[500px] lg:w-[650px] h-auto"
                    sizes="(max-width: 768px) 90vw, (max-width: 1200px) 60vw, 650px"
                    priority
                />
            </div>


            <div className='text-center'>
                <h2 className='text-3xl font-bold text-[#0F0F0F] mb-2'>There&apos;s Something Wrong </h2>
                <p className='text-[#6B6B6B] text-lg'>The page you are looking for doesn`&apos;`t exist or has been removed</p>
            </div>

            <Link href={'/'}>
                <button className='mt-16 btn-secondary text-center mx-auto mb-4 flex justify-center px-24'>Back To Home</button>
            </Link>



            {/* Footer Section */}
            <div className="bg-[#F2EDEF] w-full relative md:mt-[100px]">
                <footer className="p-6  max-w-[1240px] mx-auto py-12 bg-[#F2EDEF] md:h-[511px] pt-32 min-h-screen md:min-h-0">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-15">
                        {/* Brand */}
                        <div className="md:w-1/4">
                            <h3 className="font-bold text-[22px] flex items-center gap-2 mb-3">
                                <span role="img" aria-label="logo">
                                    <Image
                                        src="/Footer/logo.png"
                                        alt="Logo"
                                        width={35}
                                        height={40}
                                    />
                                </span>
                                Hunky Butler Service
                            </h3>
                            <p className="text-lg text-[#808080] mb-4">
                                Our Platform Simplifies Event Staffing By Connecting Hosts With
                                Verified Professionals and Seamless Tools For Unforgettable
                                Experiences.
                            </p>
                            <p className="text-base text-gray-800 flex items-center gap-2 mb-4">
                                <IoMdMail className=" text-[#FF006A]" />
                                <span className="font-bold">info@hunkybutlerserv.com</span>
                            </p>
                            <p className="text-base text-gray-800 flex items-center gap-2">
                                <IoCallSharp className="text-[#FF006A]" />{" "}
                                <span className="font-bold">+ (907) 555-0101</span>
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-semibold mb-3">Quick Links</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>Blog</li>
                                <li>About Us</li>
                                <li>Contact</li>
                                <li>Review</li>
                                <li>Services</li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="font-semibold mb-3">Legal</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>Privacy Policy</li>
                                <li>Terms Of Services</li>
                                <li>Cancellation Policy</li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className="md:w-3/12 space-y-3 md:items-start">
                            <h4 className="font-semibold text-xl md:text-2xl">
                                Keep Up With The Latest Update
                            </h4>
                            <p className="text-sm text-gray-600">
                                Join Our Newsletter To Stay Up-to-Date On Features And Releases.
                            </p>
                            <div className="flex flex-col items-start gap-2 space-y-3 w-full">
                                <input
                                    type="email"
                                    placeholder="Enter Your Email"
                                    className="w-11/12 px-4 py-2 rounded-full focus:outline-none text-sm bg-white"
                                />
                                <button className="bg-none border-[#FF006A] text-[#FF006A] px-10 py-2 rounded-full  font-medium text-xl hover:bg-pink-600 hover:text-white transition border-2 border-[#FF006A">
                                    Subscribe
                                </button>
                            </div>
                            <p className="text-sm text-gray-500">
                                By Subscribing You Agree To Our{" "}
                                <span className="text-[#FF006A] cursor-pointer">
                                    Privacy Policy
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 text-gray-500 text-sm flex flex-col md:flex-row items-center justify-between">
                        <div className="flex flex-col md:flex-row items-center gap-4 mt-4 text-gray-600 text-lg">
                            <h1 className="font-medium text-black text-base">
                                Stay In The Know
                            </h1>
                            <div className="flex items-center">
                                <FaFacebookF className="cursor-pointer hover:text-pink-500" />
                                <FaTwitter className="cursor-pointer hover:text-pink-500" />
                                <FaInstagram className="cursor-pointer hover:text-pink-500" />
                                <FaYoutube className="cursor-pointer hover:text-pink-500" />
                                <FaTumblr className="cursor-pointer hover:text-pink-500" />
                            </div>
                        </div>
                        <h1>© 2025 Hunky butler serv. All Rights Reserved.</h1>
                    </div>
                </footer>
            </div>


        </div>
    );
};

export default NotFound;