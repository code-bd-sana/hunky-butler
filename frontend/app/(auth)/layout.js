import "../globals.css";

export const metadata = {
    title: "Hunky Butler",
    description: "",
};

export default function RootLayout({ children }) {

    return (
        <html lang="en">
            <body>
                <main>
                    {children}
                </main>
            </body>
        </html>
    );
}