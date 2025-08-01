
import Hero from "@/components/landing/Hero";
import Lendinhas from "@/components/landing/Lendinhas";
import Planos from "@/components/landing/Planos";
import RumoresDaLenda from "@/components/landing/Rumores";
import Trilogia from "@/components/landing/Trilogia";

export default function HomePage() {
  return (
   <>
    <Hero/>
    <Trilogia/>
    <RumoresDaLenda/>
    <Lendinhas/>
    <Planos/>
   </>
  );
}
