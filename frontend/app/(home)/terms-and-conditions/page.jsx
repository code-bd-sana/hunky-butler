import Footer from "@/components/homepage/Footer";
import Link from "next/link";

// Without its own metadata this page inherited the homepage title and
// description verbatim, so several URLs competed on one title.
export const metadata = {
  title: "Terms & Conditions | Hunky Butler Service",
  description:
    "The terms and conditions that apply to bookings made with Hunky Butler Service, including our price match promise.",
  alternates: { canonical: "https://www.hunkybutlerservice.co.uk/terms-and-conditions" },
  openGraph: {
    title: "Terms & Conditions | Hunky Butler Service",
    description:
      "The terms and conditions that apply to bookings made with Hunky Butler Service, including our price match promise.",
    url: "https://www.hunkybutlerservice.co.uk/terms-and-conditions",
    siteName: "Hunky Butler Service",
    type: "website",
    images: [{ url: "https://www.hunkybutlerservice.co.uk/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions | Hunky Butler Service",
    description:
      "The terms and conditions that apply to bookings made with Hunky Butler Service, including our price match promise.",
    images: ["https://www.hunkybutlerservice.co.uk/logo.png"],
  },
  // Legal boilerplate carries no search value and can dilute crawl budget.
  robots: { index: false, follow: true },
};


export default function TermsAndConditon() {
  return (
    <div className='min-h-screen bg-white text-gray-900'>
      {/* Header Section */}
      <div className='bg-linear-to-r from-[#d70a65] to-[#bf0055] text-white py-24 px-4 md:px-8 rounded-b-[60px] shadow-xl'>
        <div className='max-w-7xl mx-auto flex flex-col text-center md:text-start md:flex-row justify-center  gap-12 pt-20 items-center'>
          {/* Left Column */}
          <div className='md:w-1/2'>
            <h1 className='text-4xl font-extrabold mb-4'>
              Terms and Conditions
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
          <h2 className='text-3xl font-bold mb-4'>1. Payments and Bookings</h2>
          <ul className='space-y-3 text-lg pl-6 list-disc'>
            <li>
              A non-refundable £20 deposit is required to confirm all bookings.
              The remaining balance must be paid no later than 14 days prior to
              the event.
            </li>
            <li>
              The only exception to this non-refundable deposit is where Hunky
              Butler Service cannot facilitate the original booking due to
              internal error or availability issues. This does not include
              booking errors or booking detail changes made by the customer.
            </li>
            <li>
              In some cases, Hunky Butler Service may permit part of the final
              balance to be paid in cash on the day of the event. This
              arrangement must be agreed in writing prior to the event. However,
              in the event of cancellation within 14 days, any outstanding
              balance — including amounts due in cash on the day — remains fully
              payable and must be settled by alternative means.
            </li>
            <li>
              Booking is only considered confirmed once both the deposit and
              full booking details have been received.
            </li>
            <li>
              Hunky Butler Service cannot be held liable for booking errors.
              Refunds or booking transfers will not be provided in the case of
              incorrect information provided by the customer, which includes,
              but is not limited to, event address, contact number, and time of
              the event.
            </li>
            <li>
              Administration fees may be applied upon changes in booking
              details.
            </li>
            <li>
              Any incorrect details provided by the customer that result in the
              need to cancel or alter the booking will not entitle the customer
              to any refund or reschedule.
            </li>
            <li>
              By submitting a quote form and/or paying a deposit, you agree to
              these terms and conditions in full.
            </li>
            <li>
              By attending the event, you agree to allow the use of photographs
              and videos taken during the event for promotional purposes, unless
              otherwise specified in writing at the time of booking or on the
              day of the event.
            </li>
            <li>
              Where a refund is applicable, funds will be returned within 10
              working days.
            </li>
          </ul>
        </section>

        <section className=''>
          <h2 className='text-3xl font-bold mb-4'>2. Services Agreement</h2>
          <ul className='text-lg leading-relaxed list-disc pl-6 space-y-2'>
            <li>
              All butlers, life drawing models, mixologists, and other staff are
              self-employed contractors of Hunky Butler Service and are not our
              employees.
            </li>
            <li>
              Our staff may provide a range of services including, but not
              limited to, welcoming guests, serving drinks, facilitating games
              and activities, and posing for photographs with guests.
            </li>
            <li>
              While we strive to accommodate preferences for specific staff,
              final staff selection remains at our discretion. Refunds or
              discounts will not be offered for changes to staff or if specific
              requests cannot be met.
            </li>
            <li>
              All attendees at an event must be at least 18 years of age and
              acknowledge that the event and services are intended for adult
              entertainment only.
            </li>
            <li>
              Hunky Butler Service takes no responsibility or liability for
              underage attendees. The responsibility to ensure age compliance
              lies solely with the event organiser and all other adults present.
            </li>
            <li>
              All attendees must treat our staff with respect. Unsafe,
              inappropriate, discriminatory, or abusive behaviour towards staff
              will not be tolerated.
            </li>
            <li>
              Should any attendee behave in a manner deemed inappropriate under
              section 2.6, staff have the right to leave the venue immediately.
              No refunds will be issued for time or services lost as a result.
            </li>
            <li>
              If incorrect details provided by the customer result in a butler
              missing the event entirely or arriving late (including but not
              limited to incorrect address, phone number, or booking time), no
              refund or reschedule will be provided.
            </li>
            <li>
              All attendees consume food and drink at their own risk. Hunky
              Butler Service accepts no liability for any adverse effects or
              harm resulting from food or drink consumed during the event.
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

        <section>
          <h2 className='text-3xl font-bold mb-4'>3. Cancellations</h2>
          <ul className='text-lg leading-relaxed list-disc pl-6 space-y-2'>
            <li>
              Hunky Butler Service reserves the right to cancel a booking at any
              time. If we initiate the cancellation and cannot offer a suitable
              alternative, a full refund will be issued.
            </li>
            <li>
              All deposits are non-refundable, apart from when Hunky Butler
              Service has initiated the cancellation.
            </li>
            <li>
              If the client cancels more than 14 days before the event, the
              deposit remains non-refundable, but any additional payments made
              will be refunded.
            </li>
            <li>
              If the client cancels within 14 days of the event, all payments
              are non-refundable. If any balance remains outstanding at the time
              of cancellation — including where cash was due on the day — the
              full balance must still be paid by any reasonable means, as agreed
              in the original booking.
            </li>
            <li>
              Requests to reschedule a booking may be considered at our
              discretion, subject to staff availability. Rescheduling within 14
              days of the event is not guaranteed and may result in a loss of
              payment.
            </li>
          </ul>
        </section>

        <section className='border-l-4 border-[#d70a65] pl-6'>
          <h2 className='text-3xl font-bold mb-4'>
            4. Limitation of Liability
          </h2>
          <ul className='text-lg leading-relaxed list-disc pl-6 space-y-2'>
            <li>
              Hunky Butler Service accepts no liability for any damages
              experienced by you and/or your guests, either directly or
              indirectly, due to any actions by us or our contractors, or from
              any breach of contract by us or our contractors.
            </li>
            <li>
              Hunky Butler Service accepts no liability for any death or
              personal injury to you or your guests caused by actions from us or
              our contractors or due to breach of contract. All contractors are
              independent and self-employed.
            </li>
            <li>
              Hunky Butler Service accepts no liability for death or injury to
              our contractors, including while travelling to or from the event
              location, regardless of the cause.
            </li>
            <li>
              Hunky Butler Service is not responsible for damage to contractor
              property while travelling to or from the event venue.
            </li>
            <li>
              Where liability cannot legally be excluded, our liability is
              limited to the amount paid for the services by the client.
            </li>
          </ul>
        </section>

        <section>
          <h2 className='text-3xl font-bold mb-4'>5. Force Majeure</h2>
          <p className='text-lg leading-relaxed'>
            Hunky Butler Service shall not be liable for any failure or delay in
            performing its obligations where such failure or delay results from
            any cause beyond our reasonable control, including but not limited
            to natural disasters, strikes, civil unrest, pandemics, or transport
            disruptions.
          </p>
        </section>
        <section>
          <h2 className='text-3xl font-bold mb-4'>6. Privacy</h2>
          <p className='text-lg leading-relaxed'>
            Personal data is collected, stored, and processed in accordance with
            our Privacy Policy. By engaging our services, you consent to the
            collection and use of your data as outlined. Please refer to our
            full{" "}
            <Link href={"/privacy-policy"} className='text-[#DE305F]'>
              Privacy Policy
            </Link>
            . for more information on how your data is handled.
          </p>
        </section>
        <section>
          <h2 className='text-3xl font-bold mb-4'>
            7. Governing Law and Jurisdiction
          </h2>
          <p className='text-lg leading-relaxed'>
            These terms and conditions, along with any disputes arising from or
            related to them, shall be governed by and construed in accordance
            with the laws of the United Kingdom. Any legal actions must be
            brought in UK courts.
          </p>
        </section>

        <section className=''>
          <h2 className='text-3xl font-bold mb-4'>8. Contact Us</h2>
          <p className='text-lg leading-relaxed'>
            If you have any questions about these terms and conditions, please
            contact us at{" "}
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
