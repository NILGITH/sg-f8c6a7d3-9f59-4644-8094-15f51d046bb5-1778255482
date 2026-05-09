"use client";

import Image from "next/image";
import { Flame, Users, Award, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function About() {
  const features = [
    {
      icon: Flame,
      title: "L'Art de la Grillade",
      description: "Découvrez les techniques ancestrales et modernes de la cuisine au feu de bois, transmises de génération en génération.",
    },
    {
      icon: Users,
      title: "Célébration Communautaire",
      description: "Un événement qui rassemble familles, amis et passionnés autour du partage et de la convivialité.",
    },
    {
      icon: Award,
      title: "Excellence Culinaire",
      description: "Des chefs talentueux et des grilleurs expérimentés venus de toute l'Afrique pour partager leur savoir-faire.",
    },
    {
      icon: Globe,
      title: "Rayonnement International",
      description: "D'Abidjan au monde entier, le festival célèbre la richesse gastronomique africaine sur tous les continents.",
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
          {/* Image Column */}
          <div className="relative">
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden group">
              <Image
                src="/generated/about-grilling.png"
                alt="L'art de la grillade africaine"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-white text-lg font-semibold">
                  La tradition de la grillade africaine
                </p>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-accent/20 rounded-full blur-3xl -z-10" />
          </div>

          {/* Content Column */}
          <div className="space-y-8 animate-slide-in-right order-1 lg:order-2">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
                L'Histoire du Festival
              </h2>
              <div className="space-y-4 text-foreground/80 leading-relaxed">
                <p>
                  Né à <strong className="text-primary">Abidjan</strong>, le Festival des Grillades est devenu
                  le rendez-vous incontournable des amateurs de cuisine au feu de bois en Afrique de l'Ouest
                  et au-delà.
                </p>
                <p>
                  Chaque année, le festival célèbre l'art ancestral de la grillade à travers des démonstrations
                  culinaires, des compétitions entre chefs, des concerts et des animations pour toute la famille.
                </p>
                <p>
                  De <strong className="text-primary">Dakar à Cotonou</strong>, en passant par{" "}
                  <strong className="text-primary">Lagos et Accra</strong>, le festival se déploie dans les grandes
                  capitales africaines, tout en gardant ses racines ivoiriennes bien ancrées.
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 bg-card/50 backdrop-blur-sm"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-foreground mb-1 text-sm">
                          {feature.title}
                        </h3>
                        <p className="text-foreground/70 text-xs leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}