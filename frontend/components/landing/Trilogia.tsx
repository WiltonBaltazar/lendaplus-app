import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

const Trilogia = () => {
    return (
        <div className="bg-lendablack px-[20px] md:px-0">
            <div className="container mx-auto text-center bg-white flex flex-col md:flex-row justify-between rounded-3xl py-[75px] px-[20px] md:px-[60px] gap-20">
                <div className="flex flex-col items-center justify-center gap-20 text-left w-full md:w-1/2">
                    <h2 className="font-medium text-5xl">Todo Universo da Lenda de Oãda em tuas mãos</h2>
                    <div className="flex flex-col gap-6">
                        <p>Desde os e-livros da Trilogia, áudiolivros. futuras histórias e todo material de expansão do Universo da Lenda de Oãda à um toque de distância.</p>
                        <Button asChild className="w-1/2  rounded-full  bg-black hover:bg-lendablack">
                            <Link href='/signup'>Experimetar Agora</Link>
                        </Button>
                    </div>
                </div>
                <Image src={'/images/universo.png'}
                    width={500}
                    height={500}
                    priority={true}
                    alt="Todo Universo da Lenda de Oãda em tuas mãos" 
                    className="w-full md:w-1/2" />

            </div>
        </div>
    );
}

export default Trilogia;