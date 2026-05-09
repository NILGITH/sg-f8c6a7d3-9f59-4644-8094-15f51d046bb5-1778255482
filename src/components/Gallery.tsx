"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { galleryService, type Gallery as GalleryImage } from "@/services/galleryService";

export function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const data = await galleryService.getAll();
      setImages(data);
    } catch (error) {
      console.error("Error loading gallery:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 md:py-20 lg:py-24 bg-background">
        <div className="container">
          <div className="text-center text-foreground/70">Chargement de la galerie...</div>
        </div>
      </section>
    );
  }

  const handlePrevious = () => {
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null && selectedImage < images.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") setSelectedImage(null);
    if (e.key === "ArrowLeft") handlePrevious();
    if (e.key === "ArrowRight") handleNext();
  };

  // Attach keyboard listener
  if (typeof window !== "undefined" && selectedImage !== null) {
    window.addEventListener("keydown", handleKeyDown as any);
  }

  return (
    <>
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-muted/20 via-background to-muted/20">
        <div className="container">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full mb-4">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
                Galerie Photos
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Revivez les Meilleurs Moments
            </h2>
            <p className="text-base md:text-lg text-foreground/70 px-4">
              Découvrez l'ambiance festive et conviviale des éditions précédentes du festival
            </p>
          </div>

          {/* Masonry Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-3 md:gap-4">
            {images.map((image, index) => {
              const spanClasses = image.span || "col-span-1 row-span-1";
              
              return (
                <div
                  key={image.id}
                  className={`${spanClasses} relative overflow-hidden rounded-xl group cursor-pointer animate-scale-in stagger-${Math.min(index + 1, 5)}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image.image}
                    alt={image.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-125"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <p className="text-white text-sm md:text-base font-medium line-clamp-2 mb-2">
                      {image.title}
                    </p>
                    <div className="flex items-center gap-2 text-white/80 text-xs md:text-sm">
                      <ZoomIn className="w-4 h-4" />
                      <span>Cliquer pour agrandir</span>
                    </div>
                  </div>

                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              );
            })}

            {images.length === 0 && (
              <div className="col-span-full text-center py-20">
                <div className="inline-flex flex-col items-center gap-4 p-8 bg-muted/50 rounded-2xl">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-foreground/50" />
                  </div>
                  <p className="text-foreground/70">Aucune image dans la galerie</p>
                </div>
              </div>
            )}
          </div>

          {images.length > 0 && (
            <div className="text-center mt-12 md:mt-16 animate-slide-up">
              <p className="text-sm text-foreground/60 mb-4">
                {images.length} photo{images.length > 1 ? "s" : ""} disponible{images.length > 1 ? "s" : ""}
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-foreground/70">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-border" />
                <span>Cliquez sur une image pour l'agrandir</span>
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-border" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-[100] bg-foreground/95 backdrop-blur-md animate-fade-in">
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-300 hover:scale-110 z-10"
              aria-label="Fermer"
            >
              <X className="w-6 h-6" />
            </button>

            {selectedImage > 0 && (
              <button
                onClick={handlePrevious}
                className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-300 hover:scale-110 z-10"
                aria-label="Précédent"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {selectedImage < images.length - 1 && (
              <button
                onClick={handleNext}
                className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-300 hover:scale-110 z-10"
                aria-label="Suivant"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            <div className="relative w-full h-full max-w-6xl max-h-[90vh] animate-scale-in">
              <Image
                src={images[selectedImage].image}
                alt={images[selectedImage].title}
                fill
                className="object-contain"
                priority
              />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-foreground/90 to-transparent">
                <p className="text-white text-center text-lg font-medium">
                  {images[selectedImage].title}
                </p>
                <p className="text-white/70 text-center text-sm mt-2">
                  {selectedImage + 1} / {images.length}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6 text-white/60 text-xs">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white/10 rounded">ESC</kbd>
              <span>Fermer</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white/10 rounded">←</kbd>
              <kbd className="px-2 py-1 bg-white/10 rounded">→</kbd>
              <span>Naviguer</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}