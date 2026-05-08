"use client";

import { Button } from "@/components/ui/button";
import { Ticket, Gift, Users, Check } from "lucide-react";
import { useContentManager } from "@/hooks/useContentManager";

interface Offer {
  id: string;
  title: string;
  price: string;
  features: string[];
  popular: boolean;
}

interface ReservationsData {
  offers: Offer[];
  reservations: any[];
}

export function CTA() {
  const { data, isLoading } = useContentManager<ReservationsData>("reservations", { offers: [], reservations: [] });

  const fallbackOffers: Offer[] = [
    {
      id: "1",
      title: "Pass 1 Jour",
      price: "15 000 FCFA",
      features: ["Accès toutes zones", "1 boisson offerte", "Livret programme"],
      popular: false,
    },
    {
      id: "2",
      title: "Pass 3 Jours",
      price: "35 000 FCFA",
      features: ["Accès VIP", "Boissons illimitées", "Rencontre avec les chefs", "Goodies exclusifs"],
      popular: true,
    },
    {
      id: "3",
      title: "Pass Famille",
      price: "50 000 FCFA",
      features: ["2 adultes + 2 enfants", "Accès toutes zones", "Zone enfants", "Livrets programmes"],
      popular: false,
    },
  ];

  const offers = data.offers.length > 0 ? data.offers : fallbackOffers;

  return (
    <section id="contact" className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-4 animate-fade-in">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Réservez Votre Place
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto" />
          <p className="text-base md:text-lg text-foreground/70 px-4">
            Choisissez votre formule et vivez une expérience culinaire inoubliable au cœur d'Abidjan
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-foreground/70">Chargement des offres...</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto mb-12 md:mb-16">
            {offers.map((offer, index) => (
              <div
                key={offer.id}
                className={`relative p-6 md:p-8 rounded-2xl border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-scale-in stagger-${index + 1} ${
                  offer.popular
                    ? "bg-primary/5 border-primary shadow-xl lg:scale-105"
                    : "bg-background border-border hover:border-primary"
                }`}
              >
                {offer.popular && (
                  <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 animate-float">
                    <span className="inline-block px-3 md:px-4 py-1 bg-primary text-white text-xs md:text-sm font-bold rounded-full shadow-lg">
                      Le plus populaire
                    </span>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-2">
                      {offer.title}
                    </h3>
                    <div className="text-3xl md:text-4xl font-bold text-primary">{offer.price}</div>
                  </div>

                  <ul className="space-y-3">
                    {offer.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm md:text-base text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                      offer.popular
                        ? "bg-primary hover:bg-primary/90"
                        : "bg-secondary hover:bg-secondary/90"
                    }`}
                    size="lg"
                  >
                    <Ticket className="w-4 h-4 mr-2" />
                    Réserver maintenant
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: Gift,
              title: "Offres Groupes",
              desc: "Réductions spéciales pour les groupes de 10 personnes et plus",
              color: "primary",
            },
            {
              icon: Users,
              title: "Entreprises",
              desc: "Packages sur mesure pour vos événements d'entreprise",
              color: "secondary",
            },
            {
              icon: Ticket,
              title: "Paiement Flexible",
              desc: "Réglez par Mobile Money, Orange Money ou carte bancaire",
              color: "accent",
            },
          ].map((item, index) => (
            <div
              key={item.title}
              className={`text-center space-y-3 p-6 rounded-xl hover:bg-muted/50 transition-all duration-300 hover:-translate-y-1 animate-slide-up stagger-${index + 4}`}
            >
              <div className={`w-14 h-14 md:w-16 md:h-16 mx-auto bg-${item.color}/10 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300`}>
                <item.icon className={`w-7 h-7 md:w-8 md:h-8 text-${item.color}`} />
              </div>
              <h3 className="font-serif text-lg md:text-xl font-bold text-foreground">{item.title}</h3>
              <p className="text-sm md:text-base text-foreground/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}