import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import "../globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <Header/>
      <main className="flex-1 wrapper">
        {children}
      </main>
      <Footer/>
    </div>
  );
}
