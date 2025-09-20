'use client'

import { Provider } from "react-redux";
import "../globals.css";
import { Poppins } from "next/font/google";
import { store } from "@/store/store";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-poppins",
    display: "swap",
});



export default function RootLayout({ children }) {

    return (
        <html lang="en">
            <body>
               <Provider store={store}>
                 <main>
                    {children}
                </main>
               </Provider>
            </body>
        </html>
    );
}