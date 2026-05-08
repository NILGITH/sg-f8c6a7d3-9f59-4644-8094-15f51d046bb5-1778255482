import Image from "next/image";
import { Flame, Globe, MapPin, Award } from "lucide-react";

export function About() {
  const milestones = [
    { 
      year: "2018", 
      title: "Naissance à Abidjan", 
      description: "Création du festival au cœur de Treichville" 
    },
    { 
      year: "2020", 
      title: "Expansion régionale", 
      description: "Premières éditions à Dakar et Cotonou" 
    },
    { 
      year: "2024", 
      title: "Rayonnement africain", 
      description: "Le festival s'étend à Lagos et Accra" 
    },
    { 
      year: "2026", 
      title: "Dimension mondiale", 
      description: "Paris accueille sa première édition" 
    },
  ];

  const stats = [
    { icon: Globe, value: "6+", label: "Villes hôtes" },
    { icon: Flame, value: "150+", label: "Chefs participants" },
    { icon: MapPin, value: "200 000+", label: "Visiteurs cumulés" },
    { icon: Award, value: "4", label: "Pays africains" },
  ];

  return (
    <section id="about" className="py-16 md:py-20 lg:py-24 bg-muted/30">
      <div className="container">
        <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
          {/* Header */}
          <div className="text-center space-y-4 animate-slide-in-left">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              D'Abidjan au Monde
            </h2>
            <p className="text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto">
              L'histoire d'un festival gastronomique devenu un mouvement culturel international
            </p>
            <div className="w-20 h-1 bg-primary mx-auto" />
          </div>

          {/* Story Section */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image */}
            <div className="animate-slide-in-right">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500">
                <Image
                  src="/641501809_122170458476861582_102146802286182265_n.jpg"
                  alt="Grillades traditionnelles"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
              </div>
            </div>

            {/* Text Content */}
            <div className="space-y-6 animate-slide-in-left stagger-1">
              <div className="space-y-4 text-foreground/80 text-base md:text-lg leading-relaxed">
                <p>
                  Né en <span className="font-semibold text-foreground">2018 à Abidjan</span>, le Festival des Grillades 
                  est aujourd'hui la référence de la gastronomie de rue ouest-africaine. Ce qui a commencé comme une 
                  célébration locale est devenu un événement itinérant qui rayonne sur le continent africain et au-delà.
                </p>
                <p>
                  Chaque édition réunit les meilleurs maîtres grilleurs, chefs innovants et artisans culinaires autour 
                  d'une passion commune : célébrer l'art ancestral de la grillade et les saveurs authentiques de nos terroirs.
                </p>
                <p>
                  De <span className="font-semibold text-foreground">Dakar à Cotonou</span>, de{" "}
                  <span className="font-semibold text-foreground">Lagos à Accra</span>, et bientôt à{" "}
                  <span className="font-semibold text-foreground">Paris</span>, le festival crée des ponts entre les cultures, 
                  les générations et les continents, tout en restant fidèle à ses racines abidjanaises.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-8">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-center text-foreground">
              Notre Parcours
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative p-6 bg-background rounded-xl border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-scale-in stagger-${index + 1}`}
                >
                  <div className="text-5xl font-bold text-primary/20 mb-2">
                    {milestone.year}
                  </div>
                  <h4 className="font-semibold text-lg text-foreground mb-2">
                    {milestone.title}
                  </h4>
                  <p className="text-sm text-foreground/70">
                    {milestone.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pt-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`p-6 bg-background rounded-xl border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-center animate-scale-in stagger-${index + 1}`}
              >
                <stat.icon className="w-8 h-8 text-primary mb-3 mx-auto" />
                <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}