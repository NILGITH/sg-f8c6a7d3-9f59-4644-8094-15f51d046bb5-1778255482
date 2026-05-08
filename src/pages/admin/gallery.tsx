import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Download, Upload, Image as ImageIcon } from "lucide-react";
import { useContentManager } from "@/hooks/useContentManager";
import { SEO } from "@/components/SEO";
import Image from "next/image";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  span: string;
}

interface GalleryData {
  images: GalleryImage[];
}

export default function AdminGallery() {
  const router = useRouter();
  const { data, setData, exportData, importData } = useContentManager<GalleryData>("gallery", { images: [] });
  const [newImage, setNewImage] = useState({ src: "", alt: "", span: "col-span-1 row-span-1" });

  useEffect(() => {
    const isAuth = localStorage.getItem("festival_admin_auth");
    if (!isAuth) {
      router.push("/admin/login");
    }
  }, [router]);

  const handleAddImage = () => {
    if (!newImage.src || !newImage.alt) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    const image: GalleryImage = {
      id: Date.now().toString(),
      ...newImage,
    };

    setData({
      images: [...data.images, image],
    });

    setNewImage({ src: "", alt: "", span: "col-span-1 row-span-1" });
  };

  const handleDeleteImage = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
      setData({
        images: data.images.filter((img) => img.id !== id),
      });
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importData(file);
    }
  };

  return (
    <>
      <SEO title="Gestion de la Galerie - Admin" />
      <AdminLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                Gestion de la Galerie
              </h1>
              <p className="text-foreground/70">
                Gérer les photos du festival
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
              <label>
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Importer
                  </span>
                </Button>
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
            </div>
          </div>

          <Card className="border-2 border-primary">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Ajouter une nouvelle image</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">URL de l'image</label>
                  <Input
                    value={newImage.src}
                    onChange={(e) => setNewImage({ ...newImage, src: e.target.value })}
                    placeholder="/nom-image.jpg ou URL complète"
                  />
                  <p className="text-xs text-foreground/50 mt-1">
                    Placez vos images dans /public/ puis utilisez /nom-image.jpg
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Description (alt)</label>
                    <Input
                      value={newImage.alt}
                      onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
                      placeholder="Description de l'image"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Taille</label>
                    <select
                      value={newImage.span}
                      onChange={(e) => setNewImage({ ...newImage, span: e.target.value })}
                      className="w-full px-3 py-2 border border-input rounded-md"
                    >
                      <option value="col-span-1 row-span-1">Normal (1x1)</option>
                      <option value="col-span-2 row-span-2">Grande (2x2)</option>
                      <option value="col-span-2 row-span-1">Large (2x1)</option>
                      <option value="col-span-1 row-span-2">Haute (1x2)</option>
                    </select>
                  </div>
                </div>

                <Button onClick={handleAddImage} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter l'image
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.images.map((image) => (
              <Card key={image.id} className={`${image.span} relative group`}>
                <CardContent className="p-0 h-full">
                  <div className="relative aspect-square h-full">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-foreground/70 truncate">{image.alt}</p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {data.images.length === 0 && (
              <div className="col-span-full text-center py-12 text-foreground/50">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucune image dans la galerie</p>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}