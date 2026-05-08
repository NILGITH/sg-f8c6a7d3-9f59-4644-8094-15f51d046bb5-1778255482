import Image from "next/image";
import { Flame, Users, Award, Calendar } from "lucide-react";

export function About() {
  const stats = [
    { icon: Users, value: "50 000+", label: "Visiteurs attendus" },
    { icon: Flame, value: "30+", label: "Chefs participants" },
    { icon: Award, value: "10+", label: "Compétitions" },
    { icon: Calendar, value: "3", label: "Jours d'événements" },
  ];

  return (
    <section id="about" className="py-16 md:py-20 lg:py-24 bg-muted/30">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
            <div className="space-y-4 animate-slide-in-left">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                Une Célébration de la Culture Culinaire Ivoirienne
              </h2>
              <div className="w-20 h-1 bg-primary" />
            </div>

            <div className="space-y-4 text-foreground/80 text-base md:text-lg leading-relaxed animate-slide-in-left stagger-1">
              <p>
                Le <span className="font-semibold text-foreground">Festival des Grillades d'Abidjan</span> est 
                devenu le rendez-vous incontournable des amateurs de cuisine traditionnelle ouest-africaine. 
                Chaque année, nous réunissons les meilleurs grilleurs, chefs et artisans culinaires pour 
                célébrer l'art ancestral de la grillade.
              </p>
              <p>
                Découvrez des saveurs authentiques, participez à des ateliers culinaires, assistez à des 
                compétitions spectaculaires et partagez des moments conviviaux autour du feu. Plus qu'un 
                simple festival gastronomique, c'est une immersion complète dans nos traditions culinaires.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 pt-4 md:pt-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`p-4 md:p-6 bg-background rounded-xl border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-scale-in stagger-${index + 2}`}
                >
                  <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-primary mb-2 md:mb-3" />
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-foreground/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2 animate-slide-in-right">
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
        </div>
      </div>
    </section>
  );
}