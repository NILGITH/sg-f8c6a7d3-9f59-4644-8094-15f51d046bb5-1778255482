import { Calendar, MapPin, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/641655009_122170459016861582_5624134569926200889_n.jpg"
          alt="Festival des Grillades d'Abidjan"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/70 to-foreground/50" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-20">
        <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30">
            <Flame className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-background">Édition 2026</span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-bold text-background leading-tight">
            Festival des Grillades d'Abidjan
          </h1>

          <p className="text-xl md:text-2xl text-background/90 font-medium leading-relaxed max-w-2xl">
            Célébrez la culture culinaire ouest-africaine lors du plus grand rassemblement 
            gastronomique autour des grillades à Abidjan.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 text-background/90">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-semibold">15-17 Août 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-semibold">Parc des Sports, Treichville</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white text-lg px-8">
              Réserver mes billets
            </Button>
            <Button size="lg" variant="outline" className="bg-background/10 backdrop-blur-sm border-background/30 text-background hover:bg-background/20 text-lg px-8">
              Découvrir le programme
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}