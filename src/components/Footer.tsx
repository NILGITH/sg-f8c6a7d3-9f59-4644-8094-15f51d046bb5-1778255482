import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/festivaldesgrilladesdabidjan", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  const quickLinks = [
    { href: "/", label: "Accueil" },
    { href: "#about", label: "À propos" },
    { href: "#editions", label: "Nos Éditions" },
    { href: "#program", label: "Programme" },
    { href: "/blog", label: "Blog" },
  ];

  const offices = [
    {
      city: "Abidjan",
      country: "Côte d'Ivoire",
      label: "Siège - Maison Mère",
      address: "Parc des Sports, Treichville",
      phone: "+225 07 08 09 10 11",
      email: "abidjan@festivalgrillades.com",
    },
    {
      city: "Dakar",
      country: "Sénégal",
      label: "Bureau Dakar",
      phone: "+221 77 123 45 67",
      email: "dakar@festivalgrillades.com",
    },
    {
      city: "Cotonou",
      country: "Bénin",
      label: "Bureau Cotonou",
      phone: "+229 97 12 34 56",
      email: "cotonou@festivalgrillades.com",
    },
  ];

  return (
    <footer id="contact" className="bg-foreground text-background pt-16 pb-8">
      <div className="container">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image
                  src="/logo-festival.jpg"
                  alt="Festival des Grillades"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-serif text-xl font-bold">Festival des Grillades</span>
            </div>
            <p className="text-background/70 leading-relaxed">
              Festival gastronomique itinérant célébrant l'art de la grillade africaine. 
              Né à Abidjan, présent dans les capitales d'Afrique et au-delà.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-background/10 hover:bg-primary rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4 text-background">Liens Rapides</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Offices - Spanning 2 columns on large screens */}
          <div className="lg:col-span-2">
            <h3 className="font-serif text-lg font-bold mb-4 text-background">Nos Bureaux</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {offices.map((office, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-background">
                        {office.city}
                        {office.label.includes("Maison Mère") && (
                          <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                            Siège
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-background/60">{office.country}</p>
                    </div>
                  </div>
                  {office.address && (
                    <p className="text-sm text-background/70 pl-7">{office.address}</p>
                  )}
                  <div className="space-y-1 text-sm text-background/70 pl-7">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{office.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{office.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mb-12 p-6 bg-background/5 rounded-2xl border border-background/10">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-serif text-lg font-bold mb-2 text-background">Restez Informé</h3>
            <p className="text-background/70 mb-4 text-sm">
              Recevez les dernières nouvelles et annonces des prochaines éditions
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-4 py-2 rounded-lg bg-background/10 border border-background/20 text-background placeholder:text-background/50 focus:outline-none focus:border-primary transition-colors"
              />
              <button className="px-6 py-2 bg-primary hover:bg-primary/90 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                S'inscrire
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-background/20 flex flex-col md:flex-row justify-between items-center gap-4 text-background/60 text-sm">
          <p>© {new Date().getFullYear()} Festival des Grillades. Abidjan, Côte d'Ivoire. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-primary transition-colors duration-300">
              Mentions légales
            </Link>
            <Link href="#" className="hover:text-primary transition-colors duration-300">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}