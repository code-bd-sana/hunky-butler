"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTumblr,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { IoCallSharp } from "react-icons/io5";

const Footer = () => {
  const data = useSession();

  return (
    <div className='bg-[#F2EDEF] w-full relative md:mt-[550px]'>
      <div
        className=' bg-[#FF006A] text-white rounded-xl md:rounded-3xl max-w-[1240px] mx-auto text-start h-[350px] md:h-[497px] pt-8 md:pt-16 pl-6 md:pl-20 absolute -top-[340px] md:-top-[410px] inset-x-0 overflow-hidden '
        style={{
          backgroundImage: "url('/Footer/bg2.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}>
        <img
          src='/Footer/loon.png'
          alt='Logo'
          className='w-[620px] absolute top-36 -left-78 -rotate-[25deg]'
        />
        <img
          src='/Footer/loon.png'
          alt='Logo'
          className='w-[680px] absolute -top-[40px] -right-[440px]  blur'
        />

        <h2 className='text-xl md:text-3xl lg:text-5xl font-semibold leading-tight'>
          Ready to Book Your <br /> Buff Butlers or <br /> Entertainers?
        </h2>
        <p className='my-5 text-xs md:text-base capitalize w-2/5 md:w-2/6 lg:w-1/2'>
          From Buff Butlers and Cocktail Classes to Life Drawing and Strippers,
          Hunky Butler Service has everything you need for an unforgettable
          night. Get your instant quote now and secure your entertainers today.
        </p>
        <Link href={"/quote"}>
          <button className='bg-white relative text-sm text-[#FF006A] px-2 py-1 md:px-5 md:py-[14px] cursor-pointer rounded-full hover:bg-gray-100 transition md:mt-4 font-semibold z-50'>
            Get An Instant Quote
          </button>
        </Link>

        <img
          src='/Footer/twoBoy.png'
          alt='Book buff butlers and hen party entertainment UK'
          title='Book Buff Butlers UK'
          className='w-[280px] md:w-[540px] lg:w-[640px] absolute -top-[25px] md:-top-[150px] -right-[59px] md:-right-[100px] brightness-125'
        />
      </div>

      <footer className='p-6 max-w-[1240px] mx-auto py-12 bg-[#F2EDEF] md:h-[511px] pt-32 min-h-screen md:min-h-0'>
        <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-15'>
          {/* Brand */}
          <div className='md:w-1/4'>
            <h3 className='font-bold text-[22px] flex items-center gap-2 mb-3'>
              <span role='img' aria-label='logo'>
                <Image
                  src='/Footer/logo.png'
                  alt='Logo'
                  width={35}
                  height={40}
                />
              </span>
              Hunky Butler Service
            </h3>
            <p className='text-sm text-[#808080] mb-4'>
              36a Renshaw Street <br /> Liverpool <br /> L1 4EF <br />
              United Kingdom
            </p>

            {/* ক্লিকযোগ্য ইমেইল */}
            <p className='text-base text-gray-800 flex items-center gap-2 mb-4'>
              <IoMdMail className='text-[#FF006A]' />
              <a
                href='mailto:info@hunkybutlerservice.co.uk'
                className='font-bold hover:text-[#FF006A] transition-colors'>
                info@hunkybutlerservice.co.uk
              </a>
            </p>

            {/* ক্লিকযোগ্য ফোন নম্বর */}
            <p className='text-base text-gray-800 flex items-center gap-2'>
              <IoCallSharp className='text-[#FF006A]' />
              <a
                href='tel:+447745865352'
                className='font-bold hover:text-[#FF006A] transition-colors'>
                +44 7745 865352
              </a>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='font-semibold mb-3'>Quick Links</h4>
            <ul className='space-y-2 text-sm text-gray-600'>
              {data?.status === "authenticated" && (
                <li>
                  <Link
                    href={"/dashboard"}
                    className='hover:text-[#FF006A] transition-colors'>
                    Dashboard
                  </Link>
                </li>
              )}
              {data?.status !== "authenticated" && (
                <li>
                  <Link
                    href={"/login"}
                    className='hover:text-[#FF006A] transition-colors'>
                    Login
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href={"/about"}
                  className='hover:text-[#FF006A] transition-colors'>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href={"/contact"}
                  className='hover:text-[#FF006A] transition-colors'>
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href={"/party-entertainment-services"}
                  className='hover:text-[#FF006A] transition-colors'>
                  Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className='font-semibold mb-3'>Legal</h4>
            <ul className='space-y-2 text-sm text-gray-600'>
              <li>
                <a
                  href='/privacy-policy'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-[#FF006A] transition-colors'>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href='/terms-and-conditon'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-[#FF006A] transition-colors'>
                  Terms Of Conditions
                </a>
              </li>
              <li>
                <a
                  href='/refund-policy'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-[#FF006A] transition-colors'>
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className='md:w-3/12 space-y-3 md:items-start'>
            <h4 className='font-semibold text-xl md:text-2xl'>
              Keep Up With The Latest Update
            </h4>
            <p className='text-sm text-gray-600'>
              Join Our Newsletter To Stay Up-to-Date On Features And Releases.
            </p>
            <div className='flex flex-col items-start gap-2 space-y-3 w-full'>
              <input
                type='email'
                placeholder='Enter Your Email'
                className='w-11/12 px-4 py-2 rounded-full focus:outline-none text-sm bg-white'
              />
              <button className='cursor-pointer bg-none border-[#FF006A] text-[#FF006A] px-10 py-2 rounded-full font-medium text-xl hover:bg-pink-600 hover:text-white transition border-2 border-[#FF006A]'>
                Subscribe
              </button>
            </div>
            <p className='text-sm text-gray-500'>
              By Subscribing You Agree To Our
              <span className='text-[#FF006A] cursor-pointer hover:underline'>
                {" "}
                <a href='/privacy-policy' target='_blank'>
                  {" "}
                  Privacy Policy
                </a>
              </span>
            </p>
          </div>
        </div>

        <div className='mt-8 text-gray-500 text-sm flex flex-col md:flex-row items-center justify-between'>
          <div className='flex flex-col md:flex-row items-center gap-4 mt-4 text-gray-600 text-lg'>
            <h1 className='font-medium text-black text-base'>
              Stay In The Know
            </h1>
            <div className='flex items-center gap-4'>
              <a
                href='https://facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-[#FF006A] transition-colors'>
                <FaFacebookF />
              </a>
              <a
                href='https://twitter.com'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-[#FF006A] transition-colors'>
                <FaTwitter />
              </a>
              <a
                href='https://instagram.com'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-[#FF006A] transition-colors'>
                <FaInstagram />
              </a>
              <a
                href='https://youtube.com'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-[#FF006A] transition-colors'>
                <FaYoutube />
              </a>
              <a
                href='https://tumblr.com'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-[#FF006A] transition-colors'>
                <FaTumblr />
              </a>
            </div>
          </div>
          <h1>© 2025 Hunky butler serv. All Rights Reserved.</h1>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
