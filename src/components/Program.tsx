"use client";

import { Clock, ChefHat, Music, Trophy, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useContentManager } from "@/hooks/useContentManager";

interface ProgramEvent {
  id: string;
  title: string;
  description: string;
  time: string;
  badge: string;
  icon: string;
  color: string;
}

interface ProgramData {
  events: ProgramEvent[];
  festivalInfo: {
    dates: string;
    location: string;
    city: string;
  };
  programPdf?: string;
}

const iconMap: Record<string, typeof ChefHat> = {
  ChefHat,
  Music,
  Trophy,
};

export function Program() {
  const { data, isLoading } = useContentManager<ProgramData>("program", { 
    events: [], 
    festivalInfo: { dates: "", location: "", city: "" },
    programPdf: ""
  });

  if (isLoading) {
    return (
      <section id="program" className="py-16 md:py-20 lg:py-24 bg-background">
        <div className="container">
          <div className="text-center text-foreground/70">Chargement du programme...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="program" className="py-16 md:py-20 lg:py-24 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-4 animate-fade-in">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Programme du Festival
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto" />
          <p className="text-base md:text-lg text-foreground/70 px-4">
            Trois jours d'expériences culinaires, de compétitions passionnantes et de 
            célébrations autour de la grillade africaine
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {data.events.map((event, index) => {
            const Icon = iconMap[event.icon] || ChefHat;
            return (
              <Card
                key={event.id}
                className={`${event.color} border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer animate-scale-in stagger-${index + 1}`}
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

        <div className="mt-12 md:mt-16 p-6 md:p-8 bg-muted/50 rounded-2xl border border-border text-center animate-slide-up stagger-4">
          <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-4">
            Programme Complet Disponible
          </h3>
          <p className="text-sm md:text-base text-foreground/70 mb-6 max-w-2xl mx-auto px-4">
            Téléchargez le programme détaillé avec tous les horaires, participants et activités 
            pour ne rien manquer du festival
          </p>
          {data.programPdf ? (
            <Button
              onClick={() => {
                const link = document.createElement("a");
                link.href = data.programPdf!;
                link.download = "programme-festival-grillades.pdf";
                link.click();
              }}
              className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Télécharger le programme PDF
            </Button>
          ) : (
            <Button 
              className="bg-primary hover:bg-primary/90" 
              disabled 
              size="lg"
            >
              Programme PDF bientôt disponible
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}