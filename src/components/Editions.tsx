"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Users, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { editionsService } from "@/services/editionsService";
import type { Tables } from "@/integrations/supabase/types";

type Edition = Tables<"editions">;

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

  return (
    <section id="editions" className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 bg-primary text-white">Nos Éditions</Badge>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
            D'Abidjan au Monde
          </h2>
          <p className="text-lg text-foreground/70">
            Le Festival des Grillades se déploie dans les grandes capitales africaines et au-delà,
            célébrant la richesse de notre gastronomie
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-foreground/70 py-12">Chargement des éditions...</div>
        ) : editions.length === 0 ? (
          <div className="text-center text-foreground/70 py-12">
            Aucune édition disponible pour le moment.
          </div>
        ) : (
          /* Editions Grid - Responsive & Centered */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {editions.map((edition, index) => (
              <Card
                key={edition.id}
                className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/50 animate-scale-in bg-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="p-0">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={edition.image}
                      alt={edition.city}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
                    
                    {/* Badge overlay */}
                    {edition.is_origin && (
                      <Badge className="absolute top-4 right-4 bg-accent text-foreground font-bold shadow-lg">
                        Maison Mère
                      </Badge>
                    )}

                    {/* City name overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="font-serif text-3xl font-bold text-white mb-2">
                        {edition.city}
                      </h3>
                      <div className="flex items-center gap-2 text-white/90 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{edition.country}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                  {/* Dates */}
                  <div className="flex items-center gap-2 text-foreground/70">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{edition.date}</span>
                  </div>

                  {/* Description */}
                  <p className="text-foreground/80 text-sm leading-relaxed line-clamp-3">
                    {edition.description}
                  </p>

                  {/* CTA Button */}
                  <Link href="/contact">
                    <Button
                      variant="ghost"
                      className="w-full group-hover:bg-primary group-hover:text-white transition-all mt-2"
                    >
                      Réserver pour {edition.city}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}