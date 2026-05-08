import { Button } from "@/components/ui/button";
import { Ticket, Gift, Users } from "lucide-react";

export function CTA() {
  const ticketTypes = [
    {
      name: "Pass 1 Jour",
      price: "5 000 FCFA",
      features: ["Accès au festival", "Dégustation gratuite", "1 boisson incluse"],
      icon: Ticket,
    },
    {
      name: "Pass 3 Jours",
      price: "12 000 FCFA",
      features: ["Accès complet 3 jours", "Dégustations illimitées", "2 boissons/jour", "Merchandise exclusif"],
      icon: Gift,
      popular: true,
    },
    {
      name: "Pass Groupe (4+)",
      price: "40 000 FCFA",
      features: ["4 Pass 3 jours", "Table réservée VIP", "Rencontre avec les chefs", "Coffret cadeau"],
      icon: Users,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Réservez Votre Place
          </h2>
          <p className="text-lg text-foreground/70">
            Choisissez votre formule et vivez une expérience culinaire inoubliable
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {ticketTypes.map((ticket, index) => {
            const Icon = ticket.icon;
            return (
              <div
                key={index}
                className={`relative p-8 rounded-2xl border-2 bg-background ${
                  ticket.popular
                    ? "border-primary shadow-xl shadow-primary/20 scale-105"
                    : "border-border hover:border-primary/30"
                } transition-all duration-300`}
              >
                {ticket.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Plus populaire
                    </span>
                  </div>
                )}

                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                      {ticket.name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-primary">{ticket.price}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 text-left">
                    {ticket.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-foreground/80">
                        <svg
                          className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      ticket.popular
                        ? "bg-primary hover:bg-primary/90"
                        : "bg-foreground hover:bg-foreground/90"
                    }`}
                    size="lg"
                  >
                    Acheter maintenant
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-foreground/60 mt-12 max-w-2xl mx-auto">
          Nombre de places limité. Les billets sont non remboursables. 
          Paiement sécurisé par Mobile Money, Orange Money ou carte bancaire.
        </p>
      </div>
    </section>
  );
}