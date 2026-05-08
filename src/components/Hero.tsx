import { Calendar, MapPin, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/641655009_122170459016861582_5624134569926200889_n.jpg"
          alt="Festival des Grillades d'Abidjan"
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
            Festival des Grillades d'Abidjan
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl animate-slide-up stagger-2">
            Célébrez la culture culinaire ouest-africaine lors du plus grand rassemblement 
            autour des grillades traditionnelles
          </p>

          {/* Info Cards */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 animate-slide-up stagger-3">
            <div className="flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              <div>
                <p className="text-xs md:text-sm text-white/70">Dates</p>
                <p className="font-semibold text-white text-sm md:text-base">15-17 Août 2026</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
              <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              <div>
                <p className="text-xs md:text-sm text-white/70">Lieu</p>
                <p className="font-semibold text-white text-sm md:text-base">Parc des Sports, Treichville</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up stagger-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-5 md:py-6"
            >
              Réserver maintenant
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