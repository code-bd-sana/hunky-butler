"use client";

import Script from "next/script";
import { readConsent, GRANTED, DENIED } from "@/lib/consent";

/**
 * Google Tag Manager, gated by Consent Mode v2.
 *
 * The site had no analytics of any kind, so nothing about traffic, conversion
 * or attribution was measurable. GA4 lives inside the GTM container rather
 * than being hard-coded here, so the Meta and TikTok pixels can be added later
 * from the GTM interface without a code change or a deploy.
 *
 * Load order matters and is the reason this is not a one-liner:
 *
 *   1. Consent defaults are set to denied, BEFORE the container loads. If the
 *      container loads first, tags can fire and write cookies before the
 *      visitor has chosen, which is the thing PECR prohibits.
 *   2. Any previously stored choice is replayed immediately, so a returning
 *      visitor who already granted consent is measured on this page view
 *      rather than the next one.
 *   3. Only then does the container load.
 *
 * Renders nothing at all when NEXT_PUBLIC_GTM_ID is unset, so preview and
 * local environments do not pollute production analytics.
 */
export default function Analytics() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  if (!gtmId) return null;

  // Inlined rather than imported so it can run in beforeInteractive, which
  // executes before any module code.
  const consentBootstrap = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }

    // Deny everything until the visitor chooses. url_passthrough and
    // ads_data_redaction keep measurement working without cookies.
    gtag('consent', 'default', ${JSON.stringify({
      ...DENIED,
      functionality_storage: "granted",
      security_storage: "granted",
      wait_for_update: 500,
    })});
    gtag('set', 'url_passthrough', true);
    gtag('set', 'ads_data_redaction', true);

    // Replay a stored choice so returning visitors are measured immediately.
    try {
      var raw = window.localStorage.getItem('hbs_cookie_consent');
      if (raw) {
        var saved = JSON.parse(raw);
        if (saved && saved.version === 1 && saved.state === 'granted') {
          gtag('consent', 'update', ${JSON.stringify(GRANTED)});
        }
      }
    } catch (e) { /* private mode, stay denied */ }
  `;

  return (
    <>
      <Script
        id="consent-mode-default"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: consentBootstrap }}
      />
      <Script id="gtm-loader" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
      </Script>
    </>
  );
}

/**
 * The <noscript> iframe half of GTM, for visitors without JavaScript.
 * Must sit immediately inside <body>, which is why it is a separate export.
 */
export function AnalyticsNoScript() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  if (!gtmId) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
