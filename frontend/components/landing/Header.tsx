import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

const Header = () => {
   return (
        <nav className="flex flex-wrap gap-10 justify-between items-center px-32 py-[10px] text-base text-black max-md:px-5 container" role="navigation">
            <Link href="/">
                <Image
                        src="/images/lendabig.svg"
                        alt={`app`}
                        width={60}
                        height={60}
                        priority={true}
                    />
            </Link>

         <div className="hidden md:block flex-1 justify-end items-center">
                <div>
                    <ul className="list-none flex justify-end items-center flex-1 gap-6">
                        <li className="my-4" role="menuitem" tabIndex={0}>
                            <Link href="#planos">
                                Pacotes
                            </Link>
                        </li>
                        <li className="my-4" role="menuitem" tabIndex={0}>
                            <Link href="/signup">
                                Criar conta
                            </Link>
                        </li>
                        <li className="my-4" role="menuitem" tabIndex={0}>
                            <Button asChild className="rounded-full">
                                <Link href="/login">Entrar</Link>
                            </Button>

                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
 
export default Header;