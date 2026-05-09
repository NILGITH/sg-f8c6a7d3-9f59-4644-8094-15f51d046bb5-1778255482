"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { partnerService, type Partner } from "@/services/partnerService";

export function Partners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const data = await partnerService.getAll();
      setPartners(data);
    } catch (error) {
      console.error("Error loading partners:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 md:py-20 lg:py-24 bg-muted/20">
        <div className="container">
          <div className="text-center text-foreground/70">Chargement des partenaires...</div>
        </div>
      </section>
    );
  }

  const principalPartners = partners.filter((p) => p.category === "principal");
  const supportPartners = partners.filter((p) => p.category === "support");

  if (partners.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-background via-muted/10 to-background relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
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
            Ensemble, nous célébrons la culture culinaire des grillades à travers le monde
          </p>
        </div>

        {principalPartners.length > 0 && (
          <div className="mb-20">
            <h3 className="text-center font-serif text-2xl md:text-3xl font-bold text-foreground mb-10">
              Partenaires Principaux
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {principalPartners.map((partner, index) => (
                <a
                  key={partner.id}
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative p-10 bg-background rounded-2xl border-2 border-border hover:border-primary transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-scale-in stagger-${index + 1}`}
                >
                  <div className="relative aspect-video mb-6">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-110"
                    />
                  </div>

                  <div className="text-center space-y-3">
                    <h4 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                      {partner.name}
                    </h4>
                    
                    <div className="flex items-center justify-center gap-2 text-sm text-foreground/60 group-hover:text-primary transition-colors">
                      <span>Visiter le site</span>
                      <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </div>

                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent rounded-tr-2xl rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </a>
              ))}
            </div>
          </div>
        )}

        {supportPartners.length > 0 && (
          <div className="relative">
            <div className="flex items-center gap-4 mb-12 max-w-4xl mx-auto">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <span className="text-sm font-medium text-foreground/70 uppercase tracking-wider px-4">
                Avec le soutien de
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
              {supportPartners.map((partner) => (
                <a
                  key={partner.id}
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square p-4 bg-background/50 backdrop-blur-sm rounded-xl border border-border/50 hover:border-primary/50 hover:bg-background transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain transition-all duration-300 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100"
                    />
                  </div>
                  
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-20">
                    {partner.name}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-20 text-center animate-slide-up">
          <div className="inline-block p-8 md:p-10 bg-gradient-to-br from-primary/5 via-background to-secondary/5 rounded-2xl border-2 border-primary/20">
            <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-3">
              Devenez Partenaire
            </h3>
            <p className="text-foreground/70 mb-6 max-w-md">
              Rejoignez nos partenaires et participez à la célébration de la culture culinaire des grillades
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