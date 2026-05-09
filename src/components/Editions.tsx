"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Calendar, ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { editionsService, type Edition } from "@/services/editionsService";

export function Editions() {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEditions();
  }, []);

  const loadEditions = async () => {
    try {
      const data = await editionsService.getAll();
      setEditions(data);
    } catch (error) {
      console.error("Error loading editions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 md:py-20 lg:py-24 bg-background">
        <div className="container">
          <div className="text-center text-foreground/70">Chargement des éditions...</div>
        </div>
      </section>
    );
  }

  if (editions.length === 0) {
    return null;
  }

  const getStatusBadge = (edition: Edition) => {
    if (edition.is_origin) {
      return (
        <Badge className="bg-primary text-white border-none">
          <Flame className="w-3 h-3 mr-1" />
          Maison Mère
        </Badge>
      );
    }
    
    if (edition.status === "upcoming") {
      return (
        <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
          À venir
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="text-foreground/60">
        Édition passée
      </Badge>
    );
  };

  return (
    <section id="editions" className="py-16 md:py-20 lg:py-24 bg-background">
      <div className="container">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 animate-slide-in-left">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Nos Éditions
            </h2>
            <p className="text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto">
              Un festival qui voyage à travers les capitales africaines et au-delà
            </p>
            <div className="w-20 h-1 bg-primary mx-auto" />
          </div>

          {/* Editions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {editions.map((edition, index) => (
              <div
                key={edition.id}
                className={`group relative bg-background rounded-2xl border-2 border-border hover:border-primary transition-all duration-300 overflow-hidden hover:shadow-2xl hover:-translate-y-2 animate-scale-in stagger-${(index % 3) + 1}`}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={edition.image || "/641655009_122170459016861582_5624134569926200889_n.jpg"}
                    alt={`${edition.city} ${edition.country}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(edition)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* City & Country */}
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-1">
                      {edition.city}
                    </h3>
                    <p className="text-sm text-foreground/60 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {edition.country}
                    </p>
                  </div>

                  {/* Description */}
                  {edition.description && (
                    <p className="text-foreground/70 text-sm leading-relaxed">
                      {edition.description}
                    </p>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                    <Calendar className="w-4 h-4 text-primary" />
                    {edition.date}
                  </div>

                  {/* CTA */}
                  <Button
                    variant="ghost"
                    className="w-full group-hover:bg-primary group-hover:text-white transition-all duration-300 mt-2"
                  >
                    En savoir plus
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center pt-8">
            <p className="text-foreground/70 mb-4">
              Votre ville n'est pas encore dans la liste ?
            </p>
            <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white">
              Proposer une nouvelle édition
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}