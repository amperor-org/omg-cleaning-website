import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { RoomScene } from "@/components/RoomScene";
import { Services } from "@/components/Services";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <RoomScene />
        <Services />
      </main>
    </>
  );
}
