import Image from "next/image";
import { Home05Icon } from "@hugeicons/react-pro";
import LandingNav from "@/components/navigation/LandingNav";

export default function Home() {
  return (
    <>
      <LandingNav />
      <main className="p-6 flex justify-start items-center gap-2">
        <Image
          src={"/logo/logo_icon_dark_mode-01.svg"}
          alt="logo_dark_icon"
          width={40}
          height={40}
        />
        <h1 className="text-2xl font-bold">Valnes AI</h1>
      </main>

      <section className="flex flex-col justify-center items-center flex-grow w-full h-screen">
        <h1 className="text-3xl font-semibold ">
          Valnes AI Lunchs in 40 days...
        </h1>
      </section>
    </>
  );
}
