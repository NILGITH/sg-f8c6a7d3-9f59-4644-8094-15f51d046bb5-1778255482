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
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center">Chargement de la galerie...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Galerie Photos
          </h2>
          <p className="text-lg text-foreground/70">
            Revivez les meilleurs moments des éditions précédentes
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {data.images.map((image) => (
            <div
              key={image.id}
              className={`${image.span} relative overflow-hidden rounded-xl group cursor-pointer`}
            >
              <div className="relative aspect-square">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/0 to-foreground/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}