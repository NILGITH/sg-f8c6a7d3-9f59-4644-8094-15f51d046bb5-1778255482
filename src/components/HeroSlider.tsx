"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContentManager } from "@/hooks/useContentManager";

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  order: number;
  isActive: boolean;
}

interface SliderData {
  slides: Slide[];
}

export function HeroSlider() {
  const { data, isLoading } = useContentManager<SliderData>("slider", { slides: [] });
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeSlides = data.slides
    .filter((slide) => slide.isActive)
    .sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (activeSlides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [activeSlides.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  };

  if (isLoading || activeSlides.length === 0) {
    return null;
  }

  const currentSlide = activeSlides[currentIndex];

  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Images */}
      {activeSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/75 to-foreground/60" />
        </div>
      ))}

      {/* Content */}
      <div className="container relative z-10">
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
          <div
            key={`cta-${currentSlide.id}`}
            className="flex flex-col sm:flex-row gap-4 animate-slide-up stagger-3"
          >
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-5 md:py-6"
            >
              <Link href={currentSlide.ctaLink}>{currentSlide.ctaText}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {activeSlides.length > 1 && (
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
            {activeSlides.map((_, index) => (
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
    </section>
  );
}