import { useState, FormEvent } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, Send, Facebook, Instagram, Twitter } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "contact@festivalgrillades.ci",
      link: "mailto:contact@festivalgrillades.ci",
    },
    {
      icon: Phone,
      title: "Téléphone",
      content: "+225 07 XX XX XX XX",
      link: "tel:+22507XXXXXXXX",
    },
    {
      icon: MapPin,
      title: "Adresse",
      content: "Parc des Sports, Treichville, Abidjan, Côte d'Ivoire",
      link: "https://maps.google.com",
    },
    {
      icon: Clock,
      title: "Horaires",
      content: "Lun-Ven: 9h-18h | Sam: 10h-16h",
      link: null,
    },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      label: "Facebook",
      href: "https://www.facebook.com/festivaldesgrilladesdabidjan",
      color: "hover:text-blue-600",
    },
    {
      icon: Instagram,
      label: "Instagram",
      href: "#",
      color: "hover:text-pink-600",
    },
    {
      icon: Twitter,
      label: "Twitter",
      href: "#",
      color: "hover:text-sky-500",
    },
  ];

  return (
    <>
      <SEO
        title="Contact - Festival des Grillades d'Abidjan"
        description="Contactez l'équipe du Festival des Grillades d'Abidjan. Nous sommes à votre écoute pour toutes questions, partenariats ou réservations."
      />
      <Navigation />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto space-y-4 animate-fade-in">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
                Contactez-nous
              </h1>
              <div className="w-20 h-1 bg-primary mx-auto" />
              <p className="text-lg md:text-xl text-foreground/70 px-4">
                Une question ? Un partenariat ? Nous sommes là pour vous répondre
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Contact Info Cards */}
              <div className="lg:col-span-1 space-y-6">
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <Card
                      key={index}
                      className={`border-2 hover:border-primary transition-all duration-300 hover:shadow-lg animate-slide-in-left stagger-${index + 1}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <info.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">
                              {info.title}
                            </h3>
                            {info.link ? (
                              <a
                                href={info.link}
                                target={info.link.startsWith("http") ? "_blank" : undefined}
                                rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                                className="text-sm text-foreground/70 hover:text-primary transition-colors"
                              >
                                {info.content}
                              </a>
                            ) : (
                              <p className="text-sm text-foreground/70">{info.content}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Social Links */}
                <Card className="border-2 border-accent/30 bg-accent/5 animate-slide-in-left stagger-5">
                  <CardHeader>
                    <CardTitle className="text-lg">Suivez-nous</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      {socialLinks.map((social) => (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-3 bg-background rounded-lg hover:scale-110 transition-all duration-300 ${social.color}`}
                          aria-label={social.label}
                        >
                          <social.icon className="w-6 h-6" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2 animate-slide-in-right">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-2xl">Envoyez-nous un message</CardTitle>
                    <p className="text-foreground/70">
                      Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais
                    </p>
                  </CardHeader>
                  <CardContent>
                    {submitted ? (
                      <div className="py-12 text-center space-y-4 animate-scale-in">
                        <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                          <Send className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-foreground">
                          Message envoyé !
                        </h3>
                        <p className="text-foreground/70">
                          Nous vous répondrons dans les plus brefs délais.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                              Nom complet *
                            </label>
                            <Input
                              required
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                              }
                              placeholder="Votre nom"
                              className="transition-all duration-300 focus:scale-[1.02]"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                              Email *
                            </label>
                            <Input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                              }
                              placeholder="votre@email.com"
                              className="transition-all duration-300 focus:scale-[1.02]"
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                              Téléphone
                            </label>
                            <Input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData({ ...formData, phone: e.target.value })
                              }
                              placeholder="+225 XX XX XX XX"
                              className="transition-all duration-300 focus:scale-[1.02]"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                              Sujet *
                            </label>
                            <Input
                              required
                              value={formData.subject}
                              onChange={(e) =>
                                setFormData({ ...formData, subject: e.target.value })
                              }
                              placeholder="Sujet de votre message"
                              className="transition-all duration-300 focus:scale-[1.02]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Message *
                          </label>
                          <Textarea
                            required
                            value={formData.message}
                            onChange={(e) =>
                              setFormData({ ...formData, message: e.target.value })
                            }
                            placeholder="Écrivez votre message ici..."
                            rows={6}
                            className="transition-all duration-300 focus:scale-[1.01]"
                          />
                        </div>

                        <Button
                          type="submit"
                          size="lg"
                          className="w-full sm:w-auto bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                          disabled={isSubmitting}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container">
            <Card className="overflow-hidden border-2 animate-fade-in">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="w-12 h-12 mx-auto text-primary" />
                  <p className="text-foreground/70">
                    Carte intégrable ici (Google Maps)
                  </p>
                  <p className="text-sm text-foreground/50">
                    Parc des Sports, Treichville, Abidjan
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}