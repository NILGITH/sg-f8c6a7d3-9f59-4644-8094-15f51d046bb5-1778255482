"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sliderService, type Slider } from "@/services/sliderService";

export function HeroSlider() {
  const [slides, setSlides] = useState<Slider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      const data = await sliderService.getAll();
      setSlides(data);
    } catch (error) {
      console.error("Error loading slides:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  if (isLoading || slides.length === 0) {
    return null;
  }

  const currentSlide = slides[currentIndex];

  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden bg-foreground">
      {isLoading ? (
        <div className="container mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-center min-h-[85vh]">
          <div className="text-background/70 text-lg">Chargement...</div>
        </div>
      ) : slides.length === 0 ? (
        <div className="container mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-center min-h-[85vh]">
          <div className="text-center max-w-2xl">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-background mb-6">
              Festival des Grillades
            </h1>
            <p className="text-xl text-background/80">
              D'Abidjan au Monde - Une célébration gastronomique unique
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Current Slide */}
          <div className="absolute inset-0 transition-opacity duration-1000">
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/50" />
          </div>

          {/* Content - Centered with max-width */}
          <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-6 md:space-y-8">
              {/* Logo */}
              <div className="animate-fade-in">
                <div className="relative w-20 h-20 md:w-28 md:h-28 animate-float">
                  <Image
                    src="/logo-festival.jpg"
                    alt="Festival des Grillades"
                    fill
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Main Title */}
              <h1
                key={`title-${currentSlide.id}`}
                className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight animate-slide-up"
              >
                {currentSlide.title}
              </h1>

              {/* Subtitle */}
              {currentSlide.subtitle && (
                <div
                  key={`subtitle-${currentSlide.id}`}
                  className="animate-slide-up stagger-1"
                >
                  <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-primary mb-2">
                    {currentSlide.subtitle}
                  </p>
                </div>
              )}

              {/* Description */}
              {currentSlide.description && (
                <p
                  key={`desc-${currentSlide.id}`}
                  className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl animate-slide-up stagger-2"
                >
                  {currentSlide.description}
                </p>
              )}

              {/* CTA Button */}
              {currentSlide.cta_text && currentSlide.cta_link && (
                <div
                  key={`cta-${currentSlide.id}`}
                  className="flex flex-col sm:flex-row gap-4 animate-slide-up stagger-3"
                >
                  <Button
                    asChild
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-5 md:py-6"
                  >
                    <Link href={currentSlide.cta_link}>{currentSlide.cta_text}</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          {slides.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 transition-all duration-300 group"
                aria-label="Slide précédent"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 transition-all duration-300 group"
                aria-label="Slide suivant"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-8 bg-primary"
                        : "w-2 bg-white/40 hover:bg-white/60"
                    }`}
                    aria-label={`Aller au slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : null}
    </section>
  );
}