"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { galleryService, type GalleryItem as GalleryImage } from "@/services/galleryService";

export function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      console.log("🖼️ Loading gallery...");
      const data = await galleryService.getAll();
      console.log("✅ Gallery data received:", data);
      console.log("📊 Number of images:", data.length);
      if (data.length > 0) {
        console.log("🔍 First image sample:", data[0]);
      }
      setImages(data);
    } catch (error) {
      console.error("❌ Error loading gallery:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + images.length) % images.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      if (e.key === "Escape") setSelectedImage(null);
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, images.length]);

  return (
    <>
      <section id="gallery" className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Revivez les Meilleurs Moments
            </h2>
            <p className="text-lg text-foreground/70">
              Découvrez l'ambiance festive et conviviale des éditions précédentes du festival
            </p>
          </div>

          {isLoading ? (
            <div className="text-center text-foreground/70 py-12">Chargement de la galerie...</div>
          ) : images.length === 0 ? (
            <div className="text-center text-foreground/70 py-12">
              Aucune image disponible pour le moment.
            </div>
          ) : (
            /* Gallery Grid - Responsive & Aligned */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {images.map((image, index) => {
                const spanClasses = "col-span-1 row-span-1";
                
                return (
                  <div
                    key={image.id}
                    className={`${spanClasses} relative overflow-hidden rounded-xl group cursor-pointer animate-scale-in stagger-${Math.min(index + 1, 5)} aspect-[4/3]`}
                    onClick={() => setSelectedImage(index)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.image}
                      alt={image.caption || "Image de galerie"}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                      loading="lazy"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                    {/* Caption on hover */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <p className="text-white text-base font-medium line-clamp-2 mb-2">
                        {image.caption || "Image du festival"}
                      </p>
                      <div className="flex items-center gap-2 text-white/80 text-sm">
                        <ZoomIn className="w-4 h-4" />
                        <span>Cliquer pour agrandir</span>
                      </div>
                    </div>

                    {/* Decorative corner */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-foreground/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-background/10 hover:bg-background/20 text-white transition-colors z-10"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={prevImage}
            className="absolute left-6 p-3 rounded-full bg-background/10 hover:bg-background/20 text-white transition-colors z-10"
            aria-label="Image précédente"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-6 p-3 rounded-full bg-background/10 hover:bg-background/20 text-white transition-colors z-10"
            aria-label="Image suivante"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image Container */}
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] animate-scale-in flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[selectedImage].image}
              alt={images[selectedImage].caption || "Image de galerie"}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-foreground/90 to-transparent">
              <p className="text-white text-center text-lg font-medium">
                {images[selectedImage].caption || "Image du festival"}
              </p>
              <p className="text-white/70 text-center text-sm mt-2">
                {selectedImage + 1} / {images.length}
              </p>
            </div>

            {/* Navigation Hint */}
            <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-4 text-white/60 text-xs">
              <div className="flex items-center gap-1">
                <ChevronLeft className="w-3 h-3" />
                <span>Précédent</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span>Suivant</span>
                <ChevronRight className="w-3 h-3" />
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span>ESC pour fermer</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}