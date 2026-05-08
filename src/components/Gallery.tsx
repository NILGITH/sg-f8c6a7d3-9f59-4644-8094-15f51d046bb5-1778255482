import Image from "next/image";

export function Gallery() {
  const images = [
    {
      src: "/festival-poster.png",
      alt: "Affiche du Festival des Grillades",
      span: "col-span-2 row-span-2",
    },
    {
      src: "/festival-menu.png",
      alt: "Menu du festival",
      span: "col-span-1 row-span-1",
    },
    {
      src: "/festival-info.png",
      alt: "Informations pratiques",
      span: "col-span-1 row-span-1",
    },
    {
      src: "/641655009_122170459016861582_5624134569926200889_n.jpg",
      alt: "Ambiance festival",
      span: "col-span-1 row-span-1",
    },
    {
      src: "/641501809_122170458476861582_102146802286182265_n.jpg",
      alt: "Grillades festival",
      span: "col-span-1 row-span-1",
    },
  ];

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
          {images.map((image, index) => (
            <div
              key={index}
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