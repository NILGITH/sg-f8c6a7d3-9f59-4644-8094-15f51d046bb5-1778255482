import { Calendar, MapPin, Flame, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Hero() {
  const cities = [
    "Abidjan",
    "Dakar",
    "Cotonou",
    "Lagos",
    "Accra",
    "Paris",
  ];

  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/641655009_122170459016861582_5624134569926200889_n.jpg"
          alt="Festival des Grillades - D'Abidjan au Monde"
          fill
          className="object-cover animate-scale-in"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/75 to-foreground/60" />
      </div>

      {/* Content */}
      <div className="container relative z-10">
        <div className="max-w-3xl space-y-6 md:space-y-8">
          {/* Flame Icon */}
          <div className="animate-fade-in">
            <div className="inline-flex p-3 md:p-4 bg-primary rounded-full animate-float">
              <Flame className="w-8 h-8 md:w-12 md:h-12 text-white" />
            </div>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight animate-slide-up stagger-1">
            Festival des Grillades
          </h1>

          <div className="animate-slide-up stagger-1">
            <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-primary mb-2">
              D'Abidjan au Monde
            </p>
          </div>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl animate-slide-up stagger-2">
            Né à Abidjan, célébré dans les capitales africaines et au-delà. 
            Une expérience gastronomique unique qui voyage à travers le monde.
          </p>

          {/* Cities Ribbon */}
          <div className="animate-slide-up stagger-3">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <p className="text-sm font-semibold text-white/90 uppercase tracking-wide">
                Nos éditions
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {cities.map((city, index) => (
                <div
                  key={city}
                  className="px-3 md:px-4 py-1.5 md:py-2 bg-white/15 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/25 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-xs md:text-sm font-medium text-white">
                    {city}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Info Cards */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 animate-slide-up stagger-4">
            <div className="flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
              <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              <div>
                <p className="text-xs md:text-sm text-white/70">Maison Mère</p>
                <p className="font-semibold text-white text-sm md:text-base">Abidjan, Côte d'Ivoire</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              <div>
                <p className="text-xs md:text-sm text-white/70">Prochaine édition</p>
                <p className="font-semibold text-white text-sm md:text-base">Abidjan - Août 2026</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up stagger-5">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-5 md:py-6"
            >
              Découvrir nos éditions
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-foreground shadow-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-5 md:py-6"
            >
              Voir le programme
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}