import Header from '@/components/app/header';
import { Providers } from '../providers';
import Footer from '@/components/app/footer';
import '../globals.css'
// import { useAuth } from '@/contexts/AuthContext';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <Providers>
            <Header />
            <div className="max-w-[500px] my-10 mx-auto flex flex-col gap-4 px-[20px]">
                {children}
            </div>
            <Footer />
        </Providers>
    );
}


