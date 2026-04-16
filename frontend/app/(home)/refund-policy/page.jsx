import Footer from "@/components/homepage/Footer";
import Link from "next/link";

export default function RefundAndPolicy() {
  return (
    <div className='min-h-screen bg-white text-gray-900'>
      {/* Header Section */}
      <div className='bg-linear-to-r from-[#d70a65] to-[#bf0055] text-white py-24 px-5 md:px-8 rounded-b-[60px] shadow-xl'>
        <div className='max-w-7xl mx-auto flex flex-col text-center md:text-start md:flex-row justify-center  gap-12 pt-20 items-center'>
          {/* Left Column */}
          <div className='md:w-1/2'>
            <h1 className='text-4xl font-extrabold mb-4'>
              Refund & Cancellation Policy
            </h1>
            <h2 className='text-2xl font-semibold'>Hunky Butler Service</h2>
            <p className='mt-4 text-white/80 italic'>
              Last updated: 11/11/2025
            </p>
          </div>

          {/* Right Column */}
          <div className='md:w-1/2'>
            <h3 className='text-3xl md:text-4xl font-extrabold leading-tight mb-4'>
              Read First. Party Hard. No Surprises.
            </h3>
            <p className='text-white/90 leading-relaxed text-lg'>
              Please read our Terms & Conditions carefully before booking to
              ensure a smooth and unforgettable event experience. By submitting
              a quote form and/or paying a deposit, you agree to the terms
              outlined below — it’s the boring stuff, but important, so the only
              surprises are the good kind and everything stays fun, safe, and
              stress-free!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-5xl mx-auto px-6 md:px-12 py-20 space-y-16'>
        {/* <section className="border-l-4 border-[#d70a65] pl-6">
          <h2 className="text-3xl font-bold mb-4">1. Introduction</h2>
          <p className="text-lg leading-relaxed">
            This Privacy Policy outlines how Hunky Butler Service collects,
            uses, discloses, and protects your personal information when you
            engage our services or use our website.
          </p>
        </section> */}
        {/* 
        <section className="bg-gray-50 p-8 rounded-3xl shadow-sm">
          <h2 className="text-3xl font-bold mb-4">2. Data We Collect</h2>
          <ul className="space-y-3 text-lg">
            <li>
              <strong>Contact Information:</strong> Full name, email address,
              phone number
            </li>
            <li>
              <strong>Booking Information:</strong> Event address, date, time,
              service requested
            </li>
            <li>
              <strong>Payment Details:</strong> Processed securely via
              third-party platforms (Square/PayPal); we do not store card data
            </li>
            <li>
              <strong>Media:</strong> Photos/videos captured at events for
              promotional use (unless opted out)
            </li>
            <li>
              <strong>Website Usage Data:</strong> IP address, browser type,
              session duration, device info
            </li>
          </ul>
        </section> */}

        <section className='border-l-4 border-[#d70a65] pl-6'>
          <h2 className='text-3xl font-bold mb-4'>
            1. Deposit & Payment Terms
          </h2>
          <ul className='space-y-3 text-lg pl-6 list-disc'>
            <li>
              A £20 deposit is required for all bookings. This deposit is
              non-refundable.
            </li>
            <li>
              The remaining balance must be paid no later than 14 days before
              the event.
            </li>
          </ul>
        </section>

        <section className=''>
          <h2 className='text-3xl font-bold mb-4'>
            2. Cancellation by Customer
          </h2>
          <ul className='text-lg leading-relaxed list-disc pl-6 space-y-2'>
            <li>
              If you cancel more than 14 days before the event: your deposit is
              retained, but any additional payments are refunded.
            </li>
            <li>
              Our staff may provide a range of services including, but not
              limited to, welcoming guests, serving drinks, facilitating games
              and activities, and posing for photographs with guests.
            </li>
          </ul>
        </section>
        {/* 
        <section className="bg-gray-50 p-8 rounded-3xl shadow-sm">
          <h2 className="text-3xl font-bold mb-4">5. Data Sharing</h2>
          <ul className="text-lg space-y-3">
            <li>Event staff & contractors</li>
            <li>Payment processors</li>
            <li>Cloud storage & communication tools</li>
          </ul>
          <p className="mt-4 text-lg font-semibold">
            We never sell or rent your data.
          </p>
        </section> */}

        <section className='border-l-4 border-[#d70a65] pl-6'>
          <h2 className='text-3xl font-bold mb-4'>
            3. Cancellation by Hunky Butler Service
          </h2>
          <ul className='text-lg leading-relaxed list-disc pl-6 space-y-2'>
            <li>
              Requests to reschedule made over 14 days in advance may be
              accommodated, subject to availability.
            </li>
            <li>
              Requests made within 14 days are at our discretion and may incur a
              fee.
            </li>
          </ul>
        </section>

        <section>
          <h2 className='text-3xl font-bold mb-4'>4. Rescheduling</h2>
          <p className='text-lg leading-relaxed'>
            Hunky Butler Service shall not be liable for any failure or delay in
            performing its obligations where such failure or delay results from
            any cause beyond our reasonable control, including but not limited
            to natural disasters, strikes, civil unrest, pandemics, or transport
            disruptions.
          </p>
        </section>

        <section className='border-l-4 border-[#d70a65] pl-6'>
          <h2 className='text-3xl font-bold mb-4'>
            5. Booking Errors & No Shows
          </h2>
          <ul className='text-lg leading-relaxed list-disc pl-6 space-y-2'>
            <li>
              If you provide incorrect details (e.g. time, address, contact
              info) that result in missed or delayed service, no refund is
              provided.
            </li>
            <li>
              Our staff will attempt contact but will not wait more than 15
              minutes without a response.
            </li>
          </ul>
        </section>

        <section>
          <h2 className='text-3xl font-bold mb-4'>
            6. Behaviour or Safety Issues
          </h2>
          <p className='text-lg leading-relaxed'>
            If our team leaves due to inappropriate or unsafe behaviour, or
            underage guests are present, no refund will be issued.
          </p>
        </section>
        <section>
          <h2 className='text-3xl font-bold mb-4'>7. Refund Timing</h2>
          <p className='text-lg leading-relaxed'>
            Where a refund is approved, we aim to process it within 10 working
            days.
          </p>
        </section>

        <section className=''>
          <h2 className='text-3xl font-bold mb-4'>8. Complaints</h2>
          <p className='text-lg leading-relaxed'>
            All complaints must be submitted in writing within 7 days of the
            event to{" "}
            <span className='text-[#B90650]'>
              info@hunkybutlerservice.co.uk
            </span>
          </p>
        </section>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
