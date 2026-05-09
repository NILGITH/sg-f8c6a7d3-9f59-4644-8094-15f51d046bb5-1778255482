"use client";

import { useState, useEffect } from "react";
import { Clock, ChefHat, Music, Trophy, Download, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { programService, type Program } from "@/services/programService";

interface ProgramEvent {
  id: string;
  title: string;
  description: string;
  time: string;
  badge: string;
  icon: string;
  color: string;
}

const iconMap: Record<string, typeof ChefHat> = {
  ChefHat,
  Music,
  Trophy,
};

export function Program() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCityId, setSelectedCityId] = useState<string>("");

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      const data = await programService.getAll();
      setPrograms(data);
      if (data.length > 0 && !selectedCityId) {
        setSelectedCityId(data[0].city_id);
      }
    } catch (error) {
      console.error("Error loading programs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || programs.length === 0) {
    return (
      <section className="py-16 md:py-20 lg:py-24 bg-background">
        <div className="container text-center">
          <p className="text-foreground/70">Chargement du programme...</p>
        </div>
      </section>
    );
  }

  const currentProgram = programs.find((p) => p.city_id === selectedCityId) || programs[0];
  const events = (currentProgram.events as unknown as ProgramEvent[]) || [];

  return (
    <section id="program" className="py-16 md:py-20 lg:py-24 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-4 animate-fade-in">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Programme du Festival
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto" />
          <p className="text-base md:text-lg text-foreground/70 px-4">
            Découvrez le programme de chaque édition du festival
          </p>
        </div>

        {/* City Selector */}
        <div className="max-w-4xl mx-auto mb-12">
          <Tabs value={selectedCityId} onValueChange={setSelectedCityId}>
            <TabsList className="flex flex-wrap justify-center w-full h-auto p-1 bg-muted/50 rounded-xl gap-2">
              {programs.map((program) => (
                <TabsTrigger 
                  key={program.city_id}
                  value={program.city_id} 
                  className="data-[state=active]:bg-primary data-[state=active]:text-white font-semibold py-3 px-6"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {program.city}
                </TabsTrigger>
              ))}
            </TabsList>

            {programs.map((program) => {
              const programEvents = (program.events as unknown as ProgramEvent[]) || [];
              return (
                <TabsContent key={program.city_id} value={program.city_id} className="mt-8">
                  {/* Event Info */}
                  <div className="text-center mb-8 p-6 bg-muted/30 rounded-xl border border-border">
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                      {program.city}
                    </h3>
                    <p className="text-foreground/70 mb-1">{program.dates}</p>
                  </div>

                  {/* Events Grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {programEvents.map((event, index) => {
                      const Icon = iconMap[event.icon] || ChefHat;
                      return (
                        <Card
                          key={event.id}
                          className={`${event.color} border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer animate-scale-in stagger-${(index % 3) + 1}`}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between mb-4">
                              <div className="p-3 bg-background rounded-lg shadow-sm hover:scale-110 transition-transform duration-300">
                                <Icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                              </div>
                              <Badge variant="secondary" className="font-semibold text-xs md:text-sm">
                                {event.badge}
                              </Badge>
                            </div>
                            <CardTitle className="font-serif text-xl md:text-2xl">{event.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center gap-2 text-foreground/70">
                              <Clock className="w-4 h-4 flex-shrink-0" />
                              <span className="font-semibold text-sm md:text-base">{event.time}</span>
                            </div>
                            <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
                              {event.description}
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>

        {/* Download Section */}
        <div className="mt-12 md:mt-16 p-6 md:p-8 bg-muted/50 rounded-2xl border border-border text-center animate-slide-up stagger-4">
          <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-4">
            Programme Complet Disponible
          </h3>
          <p className="text-sm md:text-base text-foreground/70 mb-6 max-w-2xl mx-auto px-4">
            Téléchargez le programme détaillé de {currentProgram.city} avec tous les horaires, 
            participants et activités
          </p>
          <Button 
            className="bg-primary hover:bg-primary/90" 
            disabled
            size="lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Programme PDF bientôt disponible
          </Button>
        </div>
      </div>
    </section>
  );
}