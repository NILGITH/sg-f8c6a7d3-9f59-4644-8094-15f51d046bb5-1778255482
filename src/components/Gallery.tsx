"use client";

import Image from "next/image";
import { useContentManager } from "@/hooks/useContentManager";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  span: string;
}

interface GalleryData {
  images: GalleryImage[];
}

export function Gallery() {
  const { data, isLoading } = useContentManager<GalleryData>("gallery", { images: [] });

  if (isLoading) {
    return (
      <section className="py-16 md:py-20 lg:py-24 bg-background">
        <div className="container">
          <div className="text-center text-foreground/70">Chargement de la galerie...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-4 animate-fade-in">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Galerie Photos
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto" />
          <p className="text-base md:text-lg text-foreground/70 px-4">
            Revivez les meilleurs moments des éditions précédentes
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 max-w-6xl mx-auto">
          {data.images.map((image, index) => (
            <div
              key={image.id}
              className={`${image.span} relative overflow-hidden rounded-lg md:rounded-xl group cursor-pointer animate-scale-in stagger-${Math.min(index + 1, 5)}`}
            >
              <div className="relative aspect-square">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-end p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-xs md:text-sm font-medium line-clamp-2">
                    {image.alt}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {data.images.length === 0 && (
            <div className="col-span-full text-center py-12 text-foreground/50">
              <p>Aucune image dans la galerie</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}