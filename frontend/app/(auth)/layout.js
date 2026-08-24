'use client'

import { Provider } from "react-redux";
import "../globals.css";
import { store } from "@/store/store";

/**
 * Route-group layout for the authentication pages.
 *
 * This previously rendered its own <html> and <body>. Route groups nest inside
 * the root layout, so doing that produced two of each on every page, which is
 * an invalid document. The shell now lives only in app/layout.js; this keeps
 * the providers and chrome specific to this group.
 */
export default function AuthLayout({ children }) {
    return <Provider store={store}>{children}</Provider>;
}