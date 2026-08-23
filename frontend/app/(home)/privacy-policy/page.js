
// Without its own metadata this page inherited the homepage title and
// description verbatim, so several URLs competed on one title.
export const metadata = {
  title: "Privacy Policy | Hunky Butler Service",
  description:
    "How Hunky Butler Service collects, uses and protects your personal data when you request a quote or make a booking.",
  alternates: { canonical: "https://www.hunkybutlerservice.co.uk/privacy-policy" },
  openGraph: {
    title: "Privacy Policy | Hunky Butler Service",
    description:
      "How Hunky Butler Service collects, uses and protects your personal data when you request a quote or make a booking.",
    url: "https://www.hunkybutlerservice.co.uk/privacy-policy",
    siteName: "Hunky Butler Service",
    type: "website",
    images: [{ url: "https://www.hunkybutlerservice.co.uk/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Hunky Butler Service",
    description:
      "How Hunky Butler Service collects, uses and protects your personal data when you request a quote or make a booking.",
    images: ["https://www.hunkybutlerservice.co.uk/logo.png"],
  },
  // Legal boilerplate carries no search value and can dilute crawl budget.
  robots: { index: false, follow: true },
};

export default function PrivacyPolicy() {
  return (
    <div className='min-h-screen bg-white text-gray-900'>
      {/* Header Section */}
      <div className='bg-linear-to-r from-[#d70a65] to-[#bf0055] text-white py-24 md:px-8 rounded-b-[60px] shadow-xl'>
        <div className='max-w-7xl mx-auto flex flex-col text-center md:text-start md:flex-row justify-center  gap-12 pt-20 items-center'>
          {/* Left Column */}
          <div className='md:w-1/2'>
            <h1 className='text-4xl font-extrabold mb-4'>Privacy Policy</h1>
            <h2 className='text-2xl font-semibold'>Hunky Butler Service</h2>
            <p className='mt-4 text-white/80 italic'>
              Last updated: 01/05/2024
            </p>
          </div>

          {/* Right Column */}
          <div className='px-5 md:px-0 md:w-1/2'>
            <h3 className='text-3xl md:text-4xl font-extrabold leading-tight mb-4'>
              We keep things cheeky — but your data? That stays professional.
            </h3>
            <p className='text-white/90 leading-relaxed text-lg'>
              Please read our Privacy Policy carefully to understand how your
              personal data is handled before submitting a quote or booking with
              us. By engaging our services, you agree to the way we collect,
              store, and use your information — it’s the boring stuff, but
              essential to keep everything safe, secure, and GDPR-friendly!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-5xl mx-auto px-6 md:px-12 py-20 space-y-16'>
        <section className='border-l-4 border-[#d70a65] pl-6'>
          <h2 className='text-3xl font-bold mb-4'>1. Introduction</h2>
          <p className='text-lg leading-relaxed'>
            This Privacy Policy outlines how Hunky Butler Service collects,
            uses, discloses, and protects your personal information when you
            engage our services or use our website.
          </p>
        </section>

        <section className='bg-gray-50 p-8 rounded-3xl shadow-sm'>
          <h2 className='text-3xl font-bold mb-4'>2. Data We Collect</h2>
          <ul className='space-y-3 text-lg'>
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
        </section>

        <section>
          <h2 className='text-3xl font-bold mb-4'>3. How We Use Your Data</h2>
          <ul className='space-y-3 text-lg pl-6 list-disc'>
            <li>To manage bookings & deliver services</li>
            <li>To send confirmations & event updates</li>
            <li>To process secure payments</li>
            <li>To enhance customer experience</li>
            <li>For promotional purposes (with consent)</li>
          </ul>
        </section>

        <section className='border-l-4 border-[#d70a65] pl-6'>
          <h2 className='text-3xl font-bold mb-4'>4. Lawful Basis</h2>
          <ul className='text-lg leading-relaxed list-disc pl-6 space-y-2'>
            <li>Performance of a contract</li>
            <li>Legitimate interest (smooth business operations)</li>
            <li>Consent (marketing/photos)</li>
            <li>Legal compliance (record-keeping)</li>
          </ul>
        </section>

        <section className='bg-gray-50 p-8 rounded-3xl shadow-sm'>
          <h2 className='text-3xl font-bold mb-4'>5. Data Sharing</h2>
          <ul className='text-lg space-y-3'>
            <li>Event staff & contractors</li>
            <li>Payment processors</li>
            <li>Cloud storage & communication tools</li>
          </ul>
          <p className='mt-4 text-lg font-semibold'>
            We never sell or rent your data.
          </p>
        </section>

        <section>
          <h2 className='text-3xl font-bold mb-4'>6. Retention Period</h2>
          <ul className='text-lg leading-relaxed list-disc pl-6 space-y-2'>
            <li>Booking records: 7 years</li>
            <li>Marketing data: until unsubscribed</li>
            <li>Media content: until removed on request</li>
          </ul>
        </section>

        <section className='border-l-4 border-[#d70a65] pl-6'>
          <h2 className='text-3xl font-bold mb-4'>7. Your Rights</h2>
          <ul className='text-lg leading-relaxed list-disc pl-6 space-y-2'>
            <li>Request data copy</li>
            <li>Correction or deletion</li>
            <li>Withdraw consent anytime</li>
            <li>Complain to UK ICO</li>
          </ul>
        </section>

        <section>
          <h2 className='text-3xl font-bold mb-4'>8. Cookies</h2>
          <p className='text-lg leading-relaxed'>
            We use cookies to enhance user experience and track performance. You
            can disable cookies anytime in your browser settings.
          </p>
        </section>

        <section className='bg-gray-50 p-8 rounded-3xl shadow-sm'>
          <h2 className='text-3xl font-bold mb-4'>9. Security</h2>
          <p className='text-lg leading-relaxed'>
            Your data is encrypted, stored securely, and accessible only to
            authorized staff.
          </p>
        </section>

        <section className='overflow-scroll'>
          <h2 className='text-3xl font-bold mb-4'>10. Contact</h2>
          <p className='text-lg leading-relaxed'>
            For privacy questions, email:
            <span className='font-bold text-[#d70a65]'>
              info@hunkybutlerservice.co.uk
            </span>
          </p>
        </section>
      </div>
    </div>
  );
}
