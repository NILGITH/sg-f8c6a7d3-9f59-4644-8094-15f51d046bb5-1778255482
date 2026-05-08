"use client";

import Image from "next/image";
import Link from "next/link";
import { useContentManager } from "@/hooks/useContentManager";
import { ExternalLink } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  logo: string;
  website: string;
  category: string;
  featured: boolean;
}

interface PartnersData {
  partners: Partner[];
}

export function Partners() {
  const { data, isLoading } = useContentManager<PartnersData>("partners", { partners: [] });

  if (isLoading) {
    return (
      <section className="py-16 md:py-20 lg:py-24 bg-muted/20">
        <div className="container">
          <div className="text-center text-foreground/70">Chargement des partenaires...</div>
        </div>
      </section>
    );
  }

  const featuredPartners = data.partners.filter((p) => p.featured);
  const regularPartners = data.partners.filter((p) => !p.featured);

  // Duplicate partners for infinite scroll effect
  const duplicatedPartners = [...regularPartners, ...regularPartners, ...regularPartners];

  if (data.partners.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-background via-muted/10 to-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Nos Partenaires
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Ils Nous Font Confiance
          </h2>
          <p className="text-base md:text-lg text-foreground/70 px-4">
            Ils contribuent au succès du Festival des Grillades d'Abidjan et partagent notre passion pour la culture culinaire
          </p>
        </div>

        {/* Featured Partners */}
        {featuredPartners.length > 0 && (
          <div className="mb-16 md:mb-20">
            <h3 className="text-center font-serif text-2xl md:text-3xl font-bold text-foreground mb-8 md:mb-12">
              Partenaires Principaux
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
              {featuredPartners.map((partner, index) => (
                <a
                  key={partner.id}
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative p-8 md:p-10 bg-background rounded-2xl border-2 border-border hover:border-primary transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-scale-in stagger-${index + 1}`}
                >
                  {/* Logo Container */}
                  <div className="relative aspect-video mb-6">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-110"
                    />
                  </div>

                  {/* Partner Name */}
                  <div className="text-center space-y-3">
                    <h4 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                      {partner.name}
                    </h4>
                    
                    {/* Link Icon */}
                    <div className="flex items-center justify-center gap-2 text-sm text-foreground/60 group-hover:text-primary transition-colors">
                      <span>Visiter le site</span>
                      <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </div>

                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent rounded-tr-2xl rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Regular Partners - Infinite Scroll */}
        {regularPartners.length > 0 && (
          <div className="relative">
            {/* Divider */}
            <div className="flex items-center gap-4 mb-12 max-w-4xl mx-auto">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <span className="text-sm font-medium text-foreground/70 uppercase tracking-wider px-4">
                Avec le soutien de
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            {/* Scrolling Container */}
            <div className="scroll-container relative overflow-hidden py-4">
              {/* Gradient Edges */}
              <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

              {/* Scrolling Track */}
              <div className="flex gap-8 md:gap-12 animate-scroll">
                {duplicatedPartners.map((partner, index) => (
                  <a
                    key={`${partner.id}-${index}`}
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex-shrink-0 w-40 md:w-48 h-24 md:h-28 p-6 bg-background/50 backdrop-blur-sm rounded-xl border border-border/50 hover:border-primary/50 hover:bg-background transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        className="object-contain transition-all duration-300 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100"
                      />
                    </div>
                    
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-20">
                      {partner.name}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Scroll Hint */}
            <div className="text-center mt-8">
              <p className="text-xs text-foreground/50">
                Survolez pour mettre en pause • {regularPartners.length} partenaire{regularPartners.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 md:mt-20 text-center animate-slide-up">
          <div className="inline-block p-8 md:p-10 bg-gradient-to-br from-primary/5 via-background to-secondary/5 rounded-2xl border-2 border-primary/20">
            <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-3">
              Devenez Partenaire
            </h3>
            <p className="text-foreground/70 mb-6 max-w-md">
              Rejoignez nos partenaires et participez à la promotion de la culture culinaire ivoirienne
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Nous Contacter
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}