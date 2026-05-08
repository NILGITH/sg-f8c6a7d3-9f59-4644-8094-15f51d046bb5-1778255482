"use client";

import Image from "next/image";
import { useContentManager } from "@/hooks/useContentManager";

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
      <section className="py-16 md:py-20 bg-muted/20">
        <div className="container">
          <div className="text-center text-foreground/70">Chargement des partenaires...</div>
        </div>
      </section>
    );
  }

  if (!data?.partners || data.partners.length === 0) {
    return null;
  }

  const featuredPartners = data.partners.filter((p) => p.featured);
  const otherPartners = data.partners.filter((p) => !p.featured);

  return (
    <section className="py-16 md:py-20 bg-muted/20">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-4 animate-fade-in">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Nos Partenaires
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto" />
          <p className="text-base md:text-lg text-foreground/70 px-4">
            Ils nous font confiance et contribuent au succès du festival
          </p>
        </div>

        {/* Featured Partners */}
        {featuredPartners.length > 0 && (
          <div className="mb-12">
            <h3 className="text-center text-xl md:text-2xl font-semibold text-foreground mb-8 animate-fade-in stagger-1">
              Partenaires Principaux
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
              {featuredPartners.map((partner, index) => (
                <a
                  key={partner.id}
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group p-6 md:p-8 bg-background rounded-xl border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-scale-in stagger-${index + 2}`}
                >
                  <div className="relative aspect-video">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
                    />
                  </div>
                  <p className="text-center text-sm text-foreground/70 mt-4 group-hover:text-foreground transition-colors">
                    {partner.name}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Other Partners */}
        {otherPartners.length > 0 && (
          <div>
            <h3 className="text-center text-lg md:text-xl font-semibold text-foreground mb-8 animate-fade-in stagger-2">
              Avec le soutien de
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6 max-w-6xl mx-auto">
              {otherPartners.map((partner, index) => (
                <a
                  key={partner.id}
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group p-4 bg-background rounded-lg border border-border hover:border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-scale-in stagger-${index + 3}`}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}