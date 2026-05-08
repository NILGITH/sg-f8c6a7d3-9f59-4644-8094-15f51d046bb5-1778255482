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

  // Fallback offers if none configured
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
    <section id="contact" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Réservez Votre Place
          </h2>
          <p className="text-lg text-foreground/70">
            Choisissez votre formule et vivez une expérience culinaire inoubliable au cœur d'Abidjan
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-foreground/70">Chargement des offres...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className={`relative p-8 rounded-2xl border-2 transition-all hover:shadow-xl hover:-translate-y-1 ${
                  offer.popular
                    ? "bg-primary/5 border-primary shadow-lg scale-105"
                    : "bg-background border-border"
                }`}
              >
                {offer.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-block px-4 py-1 bg-primary text-white text-sm font-bold rounded-full">
                      Le plus populaire
                    </span>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                      {offer.title}
                    </h3>
                    <div className="text-4xl font-bold text-primary">{offer.price}</div>
                  </div>

                  <ul className="space-y-3">
                    {offer.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      offer.popular
                        ? "bg-primary hover:bg-primary/90"
                        : "bg-secondary hover:bg-secondary/90"
                    }`}
                  >
                    <Ticket className="w-4 h-4 mr-2" />
                    Réserver maintenant
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Gift className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground">Offres Groupes</h3>
            <p className="text-foreground/70 text-sm">
              Réductions spéciales pour les groupes de 10 personnes et plus
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-secondary/10 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground">Entreprises</h3>
            <p className="text-foreground/70 text-sm">
              Packages sur mesure pour vos événements d'entreprise
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
              <Ticket className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground">Paiement Flexible</h3>
            <p className="text-foreground/70 text-sm">
              Réglez par Mobile Money, Orange Money ou carte bancaire
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}