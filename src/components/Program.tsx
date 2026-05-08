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
      <section id="program" className="py-20 bg-background">
        <div className="container">
          <div className="text-center">Chargement du programme...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="program" className="py-20 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Programme du Festival
          </h2>
          <p className="text-lg text-foreground/70">
            Trois jours d'expériences culinaires, de compétitions passionnantes et de 
            célébrations autour de la grillade africaine
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {data.events.map((event) => {
            const Icon = iconMap[event.icon] || ChefHat;
            return (
              <Card
                key={event.id}
                className={`${event.color} border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-background rounded-lg shadow-sm">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <Badge variant="secondary" className="font-semibold">
                      {event.badge}
                    </Badge>
                  </div>
                  <CardTitle className="font-serif text-2xl">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-foreground/70">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold">{event.time}</span>
                  </div>
                  <p className="text-foreground/80 leading-relaxed">
                    {event.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 p-8 bg-muted/50 rounded-2xl border border-border text-center">
          <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
            Programme Complet Disponible
          </h3>
          <p className="text-foreground/70 mb-6 max-w-2xl mx-auto">
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
              className="bg-primary hover:bg-primary/90"
            >
              <Download className="w-4 h-4 mr-2" />
              Télécharger le programme PDF
            </Button>
          ) : (
            <Button className="bg-primary hover:bg-primary/90" disabled>
              Programme PDF bientôt disponible
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}