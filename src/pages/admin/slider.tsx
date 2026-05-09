import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Save, Download, Upload, X, Image as ImageIcon, MoveUp, MoveDown } from "lucide-react";
import { useContentManager } from "@/hooks/useContentManager";
import { SEO } from "@/components/SEO";
import Image from "next/image";

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

export default function AdminSlider() {
  const router = useRouter();
  const { data, setData, exportData, importData } = useContentManager<SliderData>("slider", { slides: [] });

  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("festival_admin_auth");
    if (!isAuth) {
      router.push("/admin/login");
    }
  }, [router]);

  const sortedSlides = [...data.slides].sort((a, b) => a.order - b.order);

  const handleAddSlide = () => {
    const maxOrder = data.slides.length > 0 ? Math.max(...data.slides.map(s => s.order)) : 0;
    const newSlide: Slide = {
      id: Date.now().toString(),
      title: "",
      subtitle: "",
      description: "",
      image: "",
      ctaText: "En savoir plus",
      ctaLink: "#",
      order: maxOrder + 1,
      isActive: true,
    };
    setEditingSlide(newSlide);
    setIsAdding(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image");
      return;
    }

    setImageFile(file);
    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreviewUrl(base64);
      if (editingSlide) {
        setEditingSlide({ ...editingSlide, image: base64 });
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSlide = () => {
    if (!editingSlide || !editingSlide.title || !editingSlide.image) {
      alert("Veuillez remplir le titre et ajouter une image");
      return;
    }

    if (isAdding) {
      setData({ slides: [...data.slides, editingSlide] });
    } else {
      setData({ slides: data.slides.map((s) => (s.id === editingSlide.id ? editingSlide : s)) });
    }

    setEditingSlide(null);
    setIsAdding(false);
    setImageFile(null);
    setPreviewUrl("");
  };

  const handleDeleteSlide = (id: string) => {
    if (confirm("Supprimer ce slide ?")) {
      setData({ slides: data.slides.filter((s) => s.id !== id) });
    }
  };

  const handleToggleActive = (slide: Slide) => {
    setData({
      slides: data.slides.map((s) => (s.id === slide.id ? { ...s, isActive: !s.isActive } : s)),
    });
  };

  const handleMoveUp = (slide: Slide) => {
    const currentIndex = sortedSlides.findIndex(s => s.id === slide.id);
    if (currentIndex > 0) {
      const updatedSlides = [...data.slides];
      const prevSlide = sortedSlides[currentIndex - 1];
      
      updatedSlides.forEach(s => {
        if (s.id === slide.id) s.order = prevSlide.order;
        if (s.id === prevSlide.id) s.order = slide.order;
      });
      
      setData({ slides: updatedSlides });
    }
  };

  const handleMoveDown = (slide: Slide) => {
    const currentIndex = sortedSlides.findIndex(s => s.id === slide.id);
    if (currentIndex < sortedSlides.length - 1) {
      const updatedSlides = [...data.slides];
      const nextSlide = sortedSlides[currentIndex + 1];
      
      updatedSlides.forEach(s => {
        if (s.id === slide.id) s.order = nextSlide.order;
        if (s.id === nextSlide.id) s.order = slide.order;
      });
      
      setData({ slides: updatedSlides });
    }
  };

  const handleCancelEdit = () => {
    setEditingSlide(null);
    setIsAdding(false);
    setImageFile(null);
    setPreviewUrl("");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importData(file);
    }
  };

  return (
    <>
      <SEO title="Gestion du Slider Hero - Admin" />
      <AdminLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                Gestion du Slider Hero
              </h1>
              <p className="text-foreground/70">
                Gérer les slides du carrousel sur la page d'accueil
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
              <Button size="sm" onClick={handleAddSlide}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un slide
              </Button>
            </div>
          </div>

          {/* Stats */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <ImageIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{data.slides.length}</p>
                  <p className="text-sm text-foreground/70">Slides totaux</p>
                </div>
                <div className="ml-8">
                  <p className="text-2xl font-bold">{data.slides.filter(s => s.isActive).length}</p>
                  <p className="text-sm text-foreground/70">Actifs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit/Add Form */}
          {(editingSlide || isAdding) && (
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle>{isAdding ? "Nouveau slide" : "Modifier le slide"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Image du slide *</label>
                  {previewUrl ? (
                    <div className="space-y-4">
                      <div className="relative aspect-[21/9] max-w-full bg-muted rounded-lg overflow-hidden border-2 border-border">
                        <Image src={previewUrl} alt="Slide preview" fill className="object-cover" />
                      </div>
                      <div className="flex gap-2">
                        <label className="flex-1">
                          <Button variant="outline" className="w-full" asChild>
                            <span>
                              <Upload className="w-4 h-4 mr-2" />
                              Changer l'image
                            </span>
                          </Button>
                          <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                        </label>
                        <Button variant="outline" onClick={() => { setPreviewUrl(""); setImageFile(null); if (editingSlide) { setEditingSlide({ ...editingSlide, image: "" }); } }}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <label className="block">
                      <Button variant="outline" className="w-full h-32 border-2 border-dashed" disabled={isUploading} asChild>
                        <span className="flex flex-col items-center gap-2">
                          <Upload className="w-8 h-8 text-foreground/50" />
                          <span className="text-sm text-foreground/70">
                            {isUploading ? "Upload en cours..." : "Cliquer pour uploader l'image"}
                          </span>
                        </span>
                      </Button>
                      <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" disabled={isUploading} />
                    </label>
                  )}
                </div>

                {/* Slide Content */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Titre principal *</label>
                    <Input value={editingSlide.title} onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })} placeholder="Ex: Festival des Grillades" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Sous-titre</label>
                    <Input value={editingSlide.subtitle} onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })} placeholder="Ex: D'Abidjan au Monde" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea value={editingSlide.description} onChange={(e) => setEditingSlide({ ...editingSlide, description: e.target.value })} placeholder="Courte description du slide..." rows={3} />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Texte du bouton</label>
                    <Input value={editingSlide.ctaText} onChange={(e) => setEditingSlide({ ...editingSlide, ctaText: e.target.value })} placeholder="Ex: En savoir plus" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Lien du bouton</label>
                    <Input value={editingSlide.ctaLink} onChange={(e) => setEditingSlide({ ...editingSlide, ctaLink: e.target.value })} placeholder="Ex: #editions ou /contact" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isActive" checked={editingSlide.isActive} onChange={(e) => setEditingSlide({ ...editingSlide, isActive: e.target.checked })} className="w-4 h-4" />
                  <label htmlFor="isActive" className="text-sm font-medium">
                    Slide actif (visible sur le site)
                  </label>
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline" onClick={handleCancelEdit}>
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                  <Button onClick={handleSaveSlide}>
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Slides List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Slides ({sortedSlides.length})
            </h3>

            {sortedSlides.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8 text-foreground/50">
                  <p className="text-sm">Aucun slide configuré</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {sortedSlides.map((slide, index) => (
                  <Card key={slide.id} className={!slide.isActive ? "opacity-50" : ""}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="relative aspect-video w-48 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={slide.image} alt={slide.title} fill className="object-cover" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-foreground">{slide.title}</h4>
                              {slide.subtitle && <p className="text-sm text-foreground/70">{slide.subtitle}</p>}
                            </div>
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm" onClick={() => handleMoveUp(slide)} disabled={index === 0}>
                                <MoveUp className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleMoveDown(slide)} disabled={index === sortedSlides.length - 1}>
                                <MoveDown className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          {slide.description && <p className="text-sm text-foreground/60 line-clamp-2">{slide.description}</p>}
                          <div className="flex items-center gap-2 text-xs text-foreground/60">
                            <span>CTA: {slide.ctaText}</span>
                            <span>•</span>
                            <span>Lien: {slide.ctaLink}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleToggleActive(slide)}>
                            {slide.isActive ? "Désactiver" : "Activer"}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => { setEditingSlide(slide); setPreviewUrl(slide.image); setIsAdding(false); }}>
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteSlide(slide.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}