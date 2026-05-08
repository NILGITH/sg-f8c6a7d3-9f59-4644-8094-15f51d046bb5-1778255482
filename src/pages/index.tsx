import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Editions } from "@/components/Editions";
import { Program } from "@/components/Program";
import { Gallery } from "@/components/Gallery";
import { Partners } from "@/components/Partners";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SEO
        title="Festival des Grillades - D'Abidjan au Monde | Célébration Gastronomique"
        description="Festival gastronomique itinérant né à Abidjan. Découvrez nos éditions à Dakar, Cotonou, Lagos, Accra et Paris. Une célébration de la culture culinaire africaine."
        image="/641655009_122170459016861582_5624134569926200889_n.jpg"
      />
      <Navigation />
      <main>
        <Hero />
        <About />
        <Editions />
        <Program />
        <Gallery />
        <Partners />
        <CTA />
      </main>
      <Footer />
    </>
  );
}