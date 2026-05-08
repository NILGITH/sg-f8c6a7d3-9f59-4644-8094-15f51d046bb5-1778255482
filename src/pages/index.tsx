import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Program } from "@/components/Program";
import { Gallery } from "@/components/Gallery";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SEO
        title="Festival des Grillades d'Abidjan 2026 | 15-17 Août"
        description="Célébrez la culture culinaire ouest-africaine lors du plus grand festival de grillades à Abidjan. 3 jours d'expériences gastronomiques, concerts et compétitions."
        image="/641655009_122170459016861582_5624134569926200889_n.jpg"
      />
      <Navigation />
      <main>
        <Hero />
        <About />
        <Program />
        <Gallery />
        <CTA />
      </main>
      <Footer />
    </>
  );
}