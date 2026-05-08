import Image from "next/image";
import { Flame, Users, Award, Calendar } from "lucide-react";

export function About() {
  const stats = [
    { icon: Users, value: "50+", label: "Restaurants participants" },
    { icon: Flame, value: "100+", label: "Variétés de grillades" },
    { icon: Award, value: "10", label: "Concours culinaires" },
    { icon: Calendar, value: "3", label: "Jours de festivités" },
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 order-2 md:order-1">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              Une Célébration de la Tradition Culinaire
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed">
              Le Festival des Grillades d'Abidjan réunit chaque année les meilleurs grilleurs, 
              restaurants et chefs de Côte d'Ivoire pour trois jours exceptionnels dédiés à l'art 
              de la grillade africaine.
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed">
              Découvrez des saveurs authentiques, des recettes traditionnelles revisitées, 
              et partagez des moments conviviaux autour du feu dans une ambiance festive 
              qui célèbre notre riche patrimoine gastronomique.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="text-center p-4 bg-background rounded-lg border border-border hover:border-primary/30 transition-colors"
                  >
                    <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="font-serif text-3xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-foreground/70 mt-1">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/generated/about-grilling.png"
                alt="Grillades traditionnelles"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}