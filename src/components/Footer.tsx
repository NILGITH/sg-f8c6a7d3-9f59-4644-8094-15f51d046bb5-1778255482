import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Flame } from "lucide-react";

export function Footer() {
  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/festivaldesgrilladesdabidjan", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  const quickLinks = [
    { href: "/", label: "Accueil" },
    { href: "#about", label: "À propos" },
    { href: "#program", label: "Programme" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <footer id="contact" className="bg-foreground text-background pt-16 pb-8">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Flame className="w-8 h-8 text-primary" />
              <span className="font-serif text-xl font-bold">Festival des Grillades</span>
            </div>
            <p className="text-background/70 leading-relaxed">
              Le plus grand rassemblement gastronomique d'Afrique de l'Ouest célébrant 
              l'art de la grillade traditionnelle.
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
                    className="w-10 h-10 bg-background/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors"
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
            <h3 className="font-serif text-lg font-bold mb-4">Liens Rapides</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-3 text-background/70">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Parc des Sports, Treichville, Abidjan, Côte d'Ivoire</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span>+225 07 08 09 10 11</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span>info@festivalgrillades.ci</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-background/70 mb-4">
              Recevez les dernières nouvelles et offres exclusives
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-4 py-2 rounded-lg bg-background/10 border border-background/20 text-background placeholder:text-background/50 focus:outline-none focus:border-primary"
              />
              <button className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg font-semibold transition-colors">
                OK
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-background/20 flex flex-col md:flex-row justify-between items-center gap-4 text-background/60 text-sm">
          <p>© {new Date().getFullYear()} Festival des Grillades d'Abidjan. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-primary transition-colors">
              Mentions légales
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}