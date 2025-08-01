import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const RumoresDaLenda = () => {
    return (
        < div className = "bg-lendablack pt-[75px] px-[20px] md:px-0" >
            <div className="container mx-auto text-center bg-lendagreen flex flex-col md:flex-row justify-between rounded-3xl py-[75px] px-[20px] md:px-[60px] gap-20">
                <div className="md:w-1/2 w-full flex flex-col gap-10">
                    <Image src={"/images/featured-rumores.png"}
                    width={500}
                    height={500}
                         priority={true}
                        alt="Rumores da Lenda"
                         />
                    <Image src={"/images/more-rumores.png"}
                    width={500}
                    height={500}
                         priority={true}
                          alt="" />
                </div>

                <div className="flex flex-col items-start justify-center gap-20 text-left md:w-1/2 w-full text-white ">
                    <h3 className="text-2xl font-medium">Podcast: Rumores da Lenda</h3>
                    <h2 className="font-medium text-5xl">
                        Conversas sobre Criatividade e Fé
                    </h2>
                    <div className="flex flex-col gap-2 md:gap-6">
                        <p>
                            Com convidados lendários, exploramos histórias inspiradoras sobre criatividade, vida dbcotidiana e fé cristã. Entretenimento, reflexão e motivação em cada conversa!
                        </p>
                        <Button asChild className="w-1/2 bg-black hover:bg-lendablack  rounded-full">
                            <Link href='/app'>Escutar Podcast</Link>
                        </Button>
                    </div>
                </div>

            </div>
        </div >
     );
}

export default RumoresDaLenda;