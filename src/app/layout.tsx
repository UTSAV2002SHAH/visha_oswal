// import type { Metadata } from "next";
// import { AppProvider } from "@/context/AppContext";
// import Navbar from "@/components/Navbar";
// import { BrandLogo } from "@/components/BrandLogo";
// import "./globals.css";


// export const metadata: Metadata = {
//   title: "VISHA OSWAL",
//   description: "A visually appealing professional profile application with a responsive, hanging navigation bar and a full authentication flow.",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className="font-sans text-gray-800">
//         <AppProvider>
//           <div className="relative min-h-screen w-full">
//             <BrandLogo className="absolute top-5 left-1/2 -translate-x-1/2 md:left-5 md:translate-x-0 z-40 h-10 w-auto transition-all duration-300" />
//             {children}
//             <Navbar />
//           </div>
//         </AppProvider>
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import AppNavbar from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { BackgroundGraphics } from "@/components/layout/BackgroundGraphics";
import { Toaster } from 'react-hot-toast';
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Visha Oswal Community",
  description: "Official community platform for Visha Oswal members. Connect, share, and grow together.",
};

import { GoogleAuthProviderWrapper } from "@/components/features/auth/GoogleAuthProviderWrapper";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans text-slate-800 antialiased bg-slate-50 dark:bg-slate-950 dark:text-slate-100 min-h-screen relative selection:bg-saffron-200 selection:text-saffron-900 transition-colors duration-300`}>
        <GoogleAuthProviderWrapper clientId={process.env.GOOGLE_CLIENT_ID || ""}>
          <AppProvider>
            <ThemeProvider>
              <BackgroundGraphics />
              <Toaster position="bottom-left" reverseOrder={false} />

              {/* Content Wrapper */}
              <div className="relative z-10 min-h-screen flex flex-col">
                <AppNavbar />

                <main className="flex-grow w-full pb-16 sm:pb-0">
                  {children}
                </main>

                {/* Mobile bottom navigation */}
                <BottomNav />
              </div>
            </ThemeProvider>
          </AppProvider>
        </GoogleAuthProviderWrapper>
      </body>
    </html>
  );
}