import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Program } from "@/components/Program";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SEO
        title="Festival des Grillades d'Abidjan 2026 | 15-17 Août"
        description="Célébrez la culture culinaire ouest-africaine lors du plus grand festival de grillades à Abidjan. 3 jours d'expériences gastronomiques, concerts et compétitions."
        image="/generated/hero-festival.png"
      />
      <Navigation />
      <main>
        <Hero />
        <About />
        <Program />
        <CTA />
      </main>
      <Footer />
    </>
  );
}