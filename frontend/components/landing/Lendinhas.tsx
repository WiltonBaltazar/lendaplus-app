import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

const Lendinhas = () => {
    return (
        <div className="bg-lendablack py-[75px] px-[20px] md:px-0">
            <div className="container mx-auto text-center bg-lendapurple flex flex-col md:flex-row justify-between rounded-3xl py-[75px] px-[20px] md:px-[60px] gap-20">
                <div className="md:w-1/2 w-full flex flex-col gap-10">
                    <Image src={'/images/lendinhas.png'}
                        width={500}
                        height={500}
                        priority={true}
                        alt="Lendinhas: histórias em áudio para os petizes"
                    />
                </div>

                <div className="flex flex-col items-start justify-center gap-20 text-left md:w-1/2 w-full text-white ">
                    <h2 className="font-medium text-5xl">
                        Lendinhas: histórias em áudio para os petizes
                    </h2>
                    <div className="flex flex-col gap-2 md:gap-6">
                        <p>
                            Para os mais novos, histórias curtas com valores bíblicos como lições de moral e exercícios para aplicar o que foi aprendido.
                        </p>
                        <Button asChild className="rounded-full w-1/2 bg-white hover:bg-slate-200 text-lendapurple ">
                            <Link href='/signup'>Experimentar Agora</Link>
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Lendinhas;