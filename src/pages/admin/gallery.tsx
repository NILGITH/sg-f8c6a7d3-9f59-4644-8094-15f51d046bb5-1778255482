import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Upload, Image as ImageIcon, X } from "lucide-react";
import { SEO } from "@/components/SEO";
import Image from "next/image";
import { galleryService, type GalleryItem } from "@/services/galleryService";

export default function AdminGallery() {
  const router = useRouter();
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newImage, setNewImage] = useState({ image: "", caption: "" });
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    const isAuth = localStorage.getItem("festival_admin_auth");
    if (!isAuth) {
      router.push("/admin/login");
    } else {
      loadGallery();
    }
  }, [router]);

  const loadGallery = async () => {
    try {
      const data = await galleryService.getAll();
      setImages(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadImage = async () => {
    if (!previewUrl && !newImage.image) {
      alert("Veuillez fournir une image");
      return;
    }
    try {
      await galleryService.create({
        image: previewUrl || newImage.image,
        caption: newImage.caption,
      } as any);
      await loadGallery();
      setNewImage({ image: "", caption: "" });
      setPreviewUrl("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (confirm("Supprimer cette image ?")) {
      try {
        await galleryService.delete(id);
        await loadGallery();
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (isLoading) return <AdminLayout><div className="p-8">Chargement...</div></AdminLayout>;

  return (
    <>
      <SEO title="Gestion de la Galerie - Admin" />
      <AdminLayout>
        <div className="space-y-8">
          <div><h1 className="font-serif text-3xl font-bold mb-2">Gestion de la Galerie</h1></div>
          <Card className="border-2 border-primary">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Ajouter une image</h3>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <label className="text-sm font-medium mb-1 block">Image (Upload ou URL)</label>
                    <div className="flex gap-2">
                      <Input value={newImage.image} onChange={(e) => setNewImage({ ...newImage, image: e.target.value })} placeholder="URL de l'image" />
                      <label>
                        <Button variant="outline" asChild><span><Upload className="w-4 h-4 mr-2" /> Upload</span></Button>
                        <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                      </label>
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <label className="text-sm font-medium mb-1 block">Description</label>
                    <Input value={newImage.caption} onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })} placeholder="Description" />
                  </div>
                  <Button onClick={handleUploadImage} disabled={isUploading} className="w-full md:w-auto"><Plus className="w-4 h-4 mr-2" /> Ajouter</Button>
                </div>
                {previewUrl && (
                  <div className="relative aspect-video max-w-sm rounded-lg overflow-hidden bg-muted">
                    <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                    <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => setPreviewUrl("")}><X className="w-4 h-4" /></Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <Card key={image.id} className="relative group">
                <CardContent className="p-0 h-full">
                  <div className="relative aspect-square h-full">
                    <Image src={image.image || ""} alt={image.caption || ""} fill className="object-cover rounded-lg" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteImage(image.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <div className="p-2"><p className="text-xs text-foreground/70 truncate">{image.caption}</p></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}