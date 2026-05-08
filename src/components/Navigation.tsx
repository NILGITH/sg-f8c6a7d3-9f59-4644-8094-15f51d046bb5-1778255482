"use client";

import Link from "next/link";
import { Flame, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navLinks = [
    { href: "/#about", label: "À propos" },
    { href: "/#program", label: "Programme" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg"
          : "bg-background/90 backdrop-blur-sm"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 group">
            <div className="p-1.5 md:p-2 bg-primary rounded-lg group-hover:scale-110 transition-transform duration-300 group-hover:rotate-12">
              <Flame className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="font-serif text-base md:text-xl font-bold text-foreground hidden sm:block">
              Festival des Grillades
            </span>
            <span className="font-serif text-base md:text-xl font-bold text-foreground sm:hidden">
              FGA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/80 hover:text-primary font-medium transition-all duration-300 hover:scale-105 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Réserver
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-all duration-300 hover:scale-110"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-foreground/80 backdrop-blur-sm md:hidden animate-fade-in"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Mobile Menu */}
        <div
          className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-72 bg-background shadow-2xl md:hidden transform transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full p-6 space-y-6">
            {/* Navigation Links */}
            <nav className="space-y-4">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block text-lg font-medium text-foreground/80 hover:text-primary transition-all duration-300 hover:translate-x-2 animate-slide-in-right stagger-${index + 1}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="pt-6 border-t border-border animate-slide-in-right stagger-5">
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => setIsOpen(false)}
              >
                Réserver ma place
              </Button>
            </div>

            {/* Contact Info */}
            <div className="mt-auto pt-6 border-t border-border space-y-3 text-sm text-foreground/70 animate-slide-in-right stagger-5">
              <p>📧 contact@festivalgrillades.ci</p>
              <p>📞 +225 07 XX XX XX XX</p>
              <div className="flex gap-4 pt-2">
                <a
                  href="https://www.facebook.com/festivaldesgrilladesdabidjan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors duration-300"
                >
                  Facebook
                </a>
                <a
                  href="#"
                  className="hover:text-primary transition-colors duration-300"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}