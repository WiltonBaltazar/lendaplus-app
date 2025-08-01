import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const Hero = () => {
    return (
        <div className="bg-lendablack">
            <div className="container mx-auto flex flex-col items-center justify-center h-screen md:h-[700px] text-center gap-10 pt-[50px] px-[20px]">
                <h1 className="font-semibold text-5xl text-white">Onde a Fé encontra a <br /> Fantasia e a Criatividade</h1>
                <Image 
                    src={"/images/hero-image.png"}
                    alt="Hero Image"
                    width={500}
                    height={300}
                    priority={true}
                className="max-w-full h-auto mx-auto"
                />
                <div className="flex gap-5">
                    <Button asChild className="rounded-full bg-black hover:bg-slate-950 text-white px-8 py-3">
                        <Link href='signup'>Entrar Agora</Link>
                    </Button>
                    <Button asChild className="rounded-full bg-white hover:bg-slate-200 text-black px-8 py-3">
                        <Link href='signup'>Saber Mais</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Hero;