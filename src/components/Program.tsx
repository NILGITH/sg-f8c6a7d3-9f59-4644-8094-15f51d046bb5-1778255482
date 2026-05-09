"use client";

import { useState, useEffect } from "react";
import { Clock, ChefHat, Music, MapPin, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { programService } from "@/services/programService";
import type { Tables } from "@/integrations/supabase/types";

type ProgramItem = Tables<"programs">;

const eventIcons: { [key: string]: any } = {
  "ceremony": ChefHat,
  "stands": MapPin,
  "concert": Music,
  "default": Clock,
};

export function Program() {
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<string>("abidjan");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      const data = await programService.getAll();
      setPrograms(data);
      if (data.length > 0 && !data.find(p => p.city_id === selectedCityId)) {
        setSelectedCityId(data[0].city_id);
      }
    } catch (error) {
      console.error("Error loading programs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentProgram = programs.find((p) => p.city_id === selectedCityId);

  return (
    <section id="program" className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 bg-primary text-white">Programme 2026</Badge>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
            Programme des Festivités
          </h2>
          <p className="text-lg text-foreground/70">
            Trois jours de célébration culinaire, de musique et de rencontres autour de la passion de la grillade
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-foreground/70 py-12">Chargement du programme...</div>
        ) : programs.length === 0 ? (
          <div className="text-center text-foreground/70 py-12">
            Aucun programme disponible pour le moment.
          </div>
        ) : (
          <Tabs value={selectedCityId} onValueChange={setSelectedCityId} className="w-full">
            {/* City Tabs - Centered */}
            <div className="flex justify-center mb-12">
              <TabsList className="inline-flex bg-card border border-border shadow-sm">
                {programs.map((program) => (
                  <TabsTrigger
                    key={program.id}
                    value={program.city_id}
                    className="data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-3"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {program.city}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Program Content */}
            {programs.map((program) => (
              <TabsContent key={program.id} value={program.city_id} className="mt-0">
                {/* City Info Card */}
                <Card className="mb-12 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                  <CardContent className="p-8 text-center">
                    <h3 className="font-serif text-3xl font-bold text-foreground mb-3">
                      {program.city}
                    </h3>
                    <p className="text-lg text-foreground/80 font-semibold">
                      📅 {program.dates}
                    </p>
                  </CardContent>
                </Card>

                {/* Events Grid - Centered & Aligned */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                  {program.events && Array.isArray(program.events) && program.events.length > 0 ? (
                    program.events.map((event: any, idx: number) => {
                      const Icon = eventIcons[event.type] || eventIcons.default;
                      return (
                        <Card
                          key={idx}
                          className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 bg-card"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <Icon className="w-6 h-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <Badge className="mb-2 bg-secondary text-white text-xs">
                                  {event.type === "ceremony" ? "Cérémonie" :
                                   event.type === "stands" ? "Stands" :
                                   event.type === "concert" ? "Concert" : event.type}
                                </Badge>
                                <h4 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                  {event.name}
                                </h4>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-foreground/70">
                                <Clock className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">{event.time}</span>
                              </div>
                              <p className="text-foreground/80 text-sm leading-relaxed">
                                {event.description}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  ) : (
                    <div className="col-span-full text-center text-foreground/70 py-12">
                      Programme détaillé à venir pour {program.city}
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* CTA Button - Centered */}
        <div className="text-center mt-16">
          <Button size="lg" variant="outline" className="gap-2">
            <Download className="w-5 h-5" />
            Télécharger le programme PDF
            <span className="text-xs text-foreground/60 ml-2">(bientôt disponible)</span>
          </Button>
        </div>
      </div>
    </section>
  );
}