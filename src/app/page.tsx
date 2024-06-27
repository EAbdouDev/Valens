import Image from "next/image";
import { Home05Icon } from "@hugeicons/react-pro";
import LandingNav from "@/components/navigation/LandingNav";

export default function Home() {
  return (
    <>
      <LandingNav />

      <section className="flex flex-col justify-center items-center flex-grow w-full h-screen">
        <h1 className="text-3xl font-semibold ">
          Valnes AI Lunchs in 40 days...
        </h1>
      </section>
    </>
  );
}
