import "../globals.css";

export const metadata = {
    title: "Hunky Butler",
    description: "",
};

export default async function RootLayout({ children }) {

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