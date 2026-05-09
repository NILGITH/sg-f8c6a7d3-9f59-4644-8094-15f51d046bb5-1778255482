import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { reservationService } from "@/services/reservationService";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    guests: 1,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await reservationService.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        guests: formData.guests,
        message: formData.message,
        ticket_type: "standard",
        status: "pending",
      } as any);

      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        city: "",
        guests: 1,
        message: "",
      });

      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting reservation:", error);
      alert("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact & Réservations - Festival des Grillades"
        description="Réservez votre place pour le Festival des Grillades. Contactez-nous pour plus d'informations sur nos éditions à Abidjan, Dakar, Cotonou et autres villes."
      />
      <Navigation />
      <main>
        <section className="py-20 md:py-24 bg-gradient-to-b from-muted/30 to-background">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-4 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Contactez-nous
                </span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                Réservez Votre Place
              </h1>
              <p className="text-lg text-foreground/70">
                Rejoignez-nous pour une expérience gastronomique inoubliable
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
              <div className="space-y-6 animate-slide-in-left">
                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 space-y-6">
                    <h2 className="font-serif text-2xl font-bold text-foreground">
                      Informations de Contact
                    </h2>

                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground mb-1">Siège - Abidjan</p>
                          <p className="text-sm text-foreground/70">Plateau, Abidjan, Côte d'Ivoire</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground mb-1">Email</p>
                          <a
                            href="mailto:contact@festivaldesgrillades.com"
                            className="text-sm text-primary hover:underline"
                          >
                            contact@festivaldesgrillades.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Phone className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground mb-1">Téléphone</p>
                          <a
                            href="tel:+2250707070707"
                            className="text-sm text-primary hover:underline"
                          >
                            +225 07 07 07 07 07
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border">
                      <h3 className="font-semibold text-foreground mb-3">Nos Bureaux</h3>
                      <div className="space-y-2 text-sm text-foreground/70">
                        <p>
                          <span className="font-medium text-foreground">Dakar:</span> Almadies, Dakar, Sénégal
                        </p>
                        <p>
                          <span className="font-medium text-foreground">Cotonou:</span> Cadjèhoun, Cotonou, Bénin
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="animate-slide-in-right">
                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 space-y-6">
                    <h2 className="font-serif text-2xl font-bold text-foreground">
                      Formulaire de Réservation
                    </h2>

                    {isSuccess ? (
                      <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center space-y-3">
                        <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                        <p className="font-semibold text-green-800">Réservation envoyée !</p>
                        <p className="text-sm text-green-700">
                          Nous vous contacterons bientôt pour confirmer votre réservation.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-foreground mb-1 block">
                              Nom complet *
                            </label>
                            <Input
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="Votre nom"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground mb-1 block">
                              Email *
                            </label>
                            <Input
                              required
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="votre@email.com"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-foreground mb-1 block">
                              Téléphone
                            </label>
                            <Input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="+225 01 23 45 67 89"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground mb-1 block">
                              Ville *
                            </label>
                            <select
                              required
                              value={formData.city}
                              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                            >
                              <option value="">Sélectionnez une ville</option>
                              <option value="Abidjan">Abidjan</option>
                              <option value="Dakar">Dakar</option>
                              <option value="Cotonou">Cotonou</option>
                              <option value="Lagos">Lagos</option>
                              <option value="Accra">Accra</option>
                              <option value="Paris">Paris</option>
                              <option value="Autre">Autre</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-foreground mb-1 block">
                            Nombre de personnes *
                          </label>
                          <Input
                            required
                            type="number"
                            min="1"
                            max="20"
                            value={formData.guests}
                            onChange={(e) =>
                              setFormData({ ...formData, guests: parseInt(e.target.value) || 1 })
                            }
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-foreground mb-1 block">
                            Message (optionnel)
                          </label>
                          <Textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Dites-nous en plus sur votre demande..."
                            rows={4}
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          size="lg"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            "Envoi en cours..."
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Envoyer ma réservation
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}