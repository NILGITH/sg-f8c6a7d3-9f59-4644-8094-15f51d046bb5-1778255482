"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { partnerService, type Partner } from "@/services/partnerService";

export function Partners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const principalScrollRef = useRef<HTMLDivElement>(null);
  const supportScrollRef = useRef<HTMLDivElement>(null);

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

  // Animation de défilement automatique
  useEffect(() => {
    const principalScroll = principalScrollRef.current;
    const supportScroll = supportScrollRef.current;
    
    let principalAnimationId: number;
    let supportAnimationId: number;
    
    const animatePrincipal = () => {
      if (principalScroll) {
        principalScroll.scrollLeft += 1;
        if (principalScroll.scrollLeft >= principalScroll.scrollWidth / 2) {
          principalScroll.scrollLeft = 0;
        }
      }
      principalAnimationId = requestAnimationFrame(animatePrincipal);
    };
    
    const animateSupport = () => {
      if (supportScroll) {
        supportScroll.scrollLeft -= 1;
        if (supportScroll.scrollLeft <= 0) {
          supportScroll.scrollLeft = supportScroll.scrollWidth / 2;
        }
      }
      supportAnimationId = requestAnimationFrame(animateSupport);
    };
    
    if (partners.length > 0) {
      principalAnimationId = requestAnimationFrame(animatePrincipal);
      supportAnimationId = requestAnimationFrame(animateSupport);
    }
    
    return () => {
      cancelAnimationFrame(principalAnimationId);
      cancelAnimationFrame(supportAnimationId);
    };
  }, [partners.length]);

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
            
            {/* Conteneur avec défilement droite → gauche */}
            <div className="relative overflow-hidden">
              <div 
                ref={principalScrollRef}
                className="flex gap-8 overflow-x-hidden"
                style={{ scrollBehavior: 'auto' }}
              >
                {/* Double les partenaires pour un défilement infini */}
                {[...principalPartners, ...principalPartners].map((partner, index) => (
                  <a
                    key={`${partner.id}-${index}`}
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex-shrink-0 w-80 p-10 bg-background rounded-2xl border-2 border-border hover:border-primary transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                  >
                    <div className="relative aspect-video mb-6">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        className="object-contain transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-110"
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgZmlsbD0iI2ZlZjVlNyIvPjwvc3ZnPg=="
                        loading="lazy"
                        sizes="320px"
                        quality={85}
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

            {/* Conteneur avec défilement gauche → droite */}
            <div className="relative overflow-hidden">
              <div 
                ref={supportScrollRef}
                className="flex gap-6 overflow-x-hidden"
                style={{ scrollBehavior: 'auto' }}
              >
                {/* Double les partenaires pour un défilement infini */}
                {[...supportPartners, ...supportPartners].map((partner, index) => (
                  <a
                    key={`${partner.id}-${index}`}
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex-shrink-0 w-32 aspect-square p-4 bg-background/50 backdrop-blur-sm rounded-xl border border-border/50 hover:border-primary/50 hover:bg-background transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    <div className="relative h-full grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        className="object-contain"
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgZmlsbD0iI2ZlZjVlNyIvPjwvc3ZnPg=="
                        loading="lazy"
                        sizes="128px"
                        quality={80}
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