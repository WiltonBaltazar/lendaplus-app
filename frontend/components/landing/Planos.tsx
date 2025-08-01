
const API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8000/api/v1';

import { Button } from '@/components/ui/button';
import { Plan } from '@/types';
import Link from 'next/link';

function PlanCard(props: Plan) {
    return (<div className="p-10 md:p-12 rounded-3xl gap-6 flex flex-col text-left" style={{
        backgroundColor: props.bg_color,
        color: props.text_color
    }}>
        <p className="font-medium text-2xl">{props.name}</p>
        <h3 className="font-bold text-3xl">{props.formatted_price}/ano</h3>
        <div className="font-normal" dangerouslySetInnerHTML={{
            __html: props.description
        }} />
        <Button asChild className="lg:w-1/2 rounded-full bg-lendagreen hover:bg-green-600  text-white px-8 py-3">
            <Link href={`/signup?plan=${props.slug}`}>Assinar Agora</Link>
        </Button>
    </div>);
}


const Planos = async () => {

    const res = await fetch(`${API_URL}/plans`, {
        next: { revalidate: 3600 }, // cache for 60 seconds (optional)
        headers: {
            // 'Authorization': `Bearer ${token}`, // if needed
        },
    });

    if (!res.ok) throw new Error('Failed to fetch');

    const json = await res.json();
    const plans: Plan[] = json.data ?? json;

    return (
        <div className="bg-lendablack py-[75px] px-[20px] md:px-0" id='planos'>
            <div className="container mx-auto text-center flex flex-col md:flex-row justify-between rounded-3xl px-[20px] md:px-[60px] gap-20">
                <div className="flex flex-col items-start justify-center gap-10 text-left w-full md:w-1/2 text-white ">
                    <h2 className="font-medium text-5xl">
                        Membros: Acesso a todo conteúdo
                    </h2>
                    <div className="flex flex-col gap-2 md:gap-6">
                        <p className="font-normal">
                            Torne-se um membro e mergulhe de cabeça em um mundo de histórias e inspirações! Ao assinar, você terá acesso exclusivo a todos os eBooks, audiolivros e episódios especiais do podcast, explorando profundamente a conexão entre criatividade e fé cristã.
                        </p>
                    </div>
                </div>
                <div></div>
            </div>
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2  px-[20px] md:px-[60px] gap-6 mt-10">
                {plans?.map((plan: Plan) => (
                    <PlanCard key={plan.slug + `${plan.id}`} {...plan} />
                ))}

            </div>

        </div>
    );
}

export default Planos;