import { Episode } from "@/types";
import Image from "next/image";
import Link from "next/link";


const PodcastCard = ({ episode }: { episode: Episode }) => {
    return (
        <Link href={`/app/episodes/${episode.slug}`}>
            <Image
                src={episode.cover_image}
                alt={episode.title}
                width={458}
                height={458}
                className="w-full max-w-[458] h-[320px] object-cover rounded"
            />
        </Link>
    )
}

export default PodcastCard