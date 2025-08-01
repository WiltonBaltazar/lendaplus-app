import Image from "next/image";
import Link from "next/link";

const Footer = () => {
    return (
        <div className="flex flex-col gap-10 px-32 py-[40px] text-base text-black max-md:px-5 container">
            <Link href="/">
                <Image
                    src={"/images/lendabig.svg"}
                    alt="Lenda Logo"
                    width={60}
                    height={60}
                    priority={true}
                />
            </Link>

            <div className='flex flex-col md:flex-row justify-between gap-4'>
                <div className="flex flex-row gap-2">
                    <Link href="/termos-e-condicoes" className="underline text-xs">Termos e condições</Link>
                    <Link href="/politicas-de-privacidade" className="underline text-xs">Política de privacidade</Link>
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                    <span className="text-xs">© {new Date().getFullYear()} Lenda</span>
                    <span className="text-xs">Todos os direitos reservados</span>
                </div>
            </div>
        </div>

    )
}

export default Footer;