"use client"

import Image from "next/image";
import Link from "next/link";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const Header = () => {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <nav className="flex flex-wrap gap-10 justify-between items-center px-32 py-[20px] text-base text-black max-md:px-5" role="navigation">
            <Link href="/app">
                <Image 
                    src={"/images/lendabig.svg"}
                    width={100}
                    height={100}
                    priority
                    quality={100}
                    alt="Logo" 
                    className="w-40" 
                />
            </Link>

            <div>
                {user ? (
                    // Show logout button when user is authenticated
                    <button
                        onClick={handleLogout}
                        className="bg-lendablack hover:bg-lendapurple text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                        Logout
                    </button>
                ) : (
                    // Show login button when user is not authenticated
                    <button
                        onClick={() => router.push('/login')}
                        className="bg-lendablack hover:bg-lendapurple text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                        Login
                    </button>
                )}
            </div>

            {/* <img src={home} alt="Logo" className="w-10" /> */}

            {/* <div className="sm:hidden flex flex-1 justify-end items-center">
                <div>
                    <ul className="list-none flex flex-col justify-end items-center flex-1">
                        <li className="my-4" role="menuitem" tabIndex={0}>
                            Página Inicial
                        </li>
                        <li className="my-4" role="menuitem" tabIndex={0}>
                            Sobre
                        </li>
                        <li className="my-4" role="menuitem" tabIndex={0}>
                            Contato
                        </li>
                    </ul>
                </div>
            </div> */}
        </nav>
    );
}

export default Header;