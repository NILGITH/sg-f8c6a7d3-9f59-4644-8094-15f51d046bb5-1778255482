"use client";

import { useState } from "react";
import { Clock, ChefHat, Music, Trophy, Download, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// Programmes par ville
const cityPrograms = {
  abidjan: {
    city: "Abidjan",
    dates: "15-17 Août 2026",
    location: "Parc des Sports, Treichville",
    events: [
      {
        id: "1",
        title: "Grande Ouverture",
        description: "Cérémonie d'ouverture avec démonstrations des maîtres grilleurs d'Abidjan",
        time: "Vendredi 18h - 21h",
        badge: "Jour 1",
        icon: "ChefHat",
        color: "bg-muted/50",
      },
      {
        id: "2",
        title: "Compétition des Chefs",
        description: "Battle culinaire entre les meilleurs grilleurs de Côte d'Ivoire",
        time: "Samedi 14h - 18h",
        badge: "Jour 2",
        icon: "Trophy",
        color: "bg-muted/50",
      },
      {
        id: "3",
        title: "Concert & Gala Final",
        description: "Soirée musicale avec artistes locaux et dégustation géante",
        time: "Dimanche 19h - 23h",
        badge: "Jour 3",
        icon: "Music",
        color: "bg-muted/50",
      },
    ],
  },
  dakar: {
    city: "Dakar",
    dates: "10-12 Septembre 2026",
    location: "Place du Souvenir Africain",
    events: [
      {
        id: "1",
        title: "Découverte des Grillades Sénégalaises",
        description: "Initiation aux techniques de grillade traditionnelles du Sénégal",
        time: "Jeudi 17h - 20h",
        badge: "Jour 1",
        icon: "ChefHat",
        color: "bg-muted/50",
      },
      {
        id: "2",
        title: "Marché des Saveurs",
        description: "Village gastronomique avec stands de dégustation et ateliers",
        time: "Vendredi 12h - 22h",
        badge: "Jour 2",
        icon: "ChefHat",
        color: "bg-muted/50",
      },
      {
        id: "3",
        title: "Nuit Teranga",
        description: "Grand festin et concert mbalax sous les étoiles",
        time: "Samedi 18h - Minuit",
        badge: "Jour 3",
        icon: "Music",
        color: "bg-muted/50",
      },
    ],
  },
  cotonou: {
    city: "Cotonou",
    dates: "5-7 Octobre 2026",
    location: "Jardin des Plantes et de la Nature",
    events: [
      {
        id: "1",
        title: "Traditions Béninoises",
        description: "Mise en valeur des recettes ancestrales du Bénin",
        time: "Samedi 16h - 20h",
        badge: "Jour 1",
        icon: "ChefHat",
        color: "bg-muted/50",
      },
      {
        id: "2",
        title: "Compétition Régionale",
        description: "Challenge entre grilleurs du Bénin, Togo et Nigeria",
        time: "Dimanche 13h - 17h",
        badge: "Jour 2",
        icon: "Trophy",
        color: "bg-muted/50",
      },
      {
        id: "3",
        title: "Fête de Clôture",
        description: "Soirée festive avec musique vodun et dégustation",
        time: "Lundi 18h - 22h",
        badge: "Jour 3",
        icon: "Music",
        color: "bg-muted/50",
      },
    ],
  },
};

export function Program() {
  const [selectedCity, setSelectedCity] = useState<keyof typeof cityPrograms>("abidjan");
  const currentProgram = cityPrograms[selectedCity];

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
          <Tabs value={selectedCity} onValueChange={(value) => setSelectedCity(value as keyof typeof cityPrograms)}>
            <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50">
              <TabsTrigger 
                value="abidjan" 
                className="data-[state=active]:bg-primary data-[state=active]:text-white font-semibold py-3"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Abidjan
              </TabsTrigger>
              <TabsTrigger 
                value="dakar"
                className="data-[state=active]:bg-primary data-[state=active]:text-white font-semibold py-3"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Dakar
              </TabsTrigger>
              <TabsTrigger 
                value="cotonou"
                className="data-[state=active]:bg-primary data-[state=active]:text-white font-semibold py-3"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Cotonou
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedCity} className="mt-8">
              {/* Event Info */}
              <div className="text-center mb-8 p-6 bg-muted/30 rounded-xl border border-border">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                  {currentProgram.city}
                </h3>
                <p className="text-foreground/70 mb-1">{currentProgram.dates}</p>
                <p className="text-sm text-foreground/60 flex items-center justify-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {currentProgram.location}
                </p>
              </div>

              {/* Events Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {currentProgram.events.map((event, index) => {
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
            </TabsContent>
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