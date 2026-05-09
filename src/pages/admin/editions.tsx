import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Save, Upload, X, MapPin, Calendar as CalendarIcon, Flag } from "lucide-react";
import { SEO } from "@/components/SEO";
import Image from "next/image";
import { editionsService, type Edition } from "@/services/editionsService";

export default function AdminEditions() {
  const router = useRouter();
  const [editions, setEditions] = useState<Edition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [editingEdition, setEditingEdition] = useState<Partial<Edition> | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("festival_admin_auth");
    if (!isAuth) {
      router.push("/admin/login");
    } else {
      loadEditions();
    }
  }, [router]);

  const loadEditions = async () => {
    try {
      const data = await editionsService.getAll();
      setEditions(data);
    } catch (error) {
      console.error("Error loading editions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEdition = () => {
    setEditingEdition({
      city: "",
      country: "",
      date: "",
      status: "upcoming",
      description: "",
      image: "",
      is_origin: false,
    });
    setIsAdding(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreviewUrl(base64);
      if (editingEdition) {
        setEditingEdition({ ...editingEdition, image: base64 });
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEdition = async () => {
    if (!editingEdition || !editingEdition.city || !editingEdition.country || !editingEdition.date || !editingEdition.image) {
      alert("Veuillez remplir tous les champs requis");
      return;
    }

    try {
      if (isAdding) {
        await editionsService.create(editingEdition as Omit<Edition, "id" | "created_at">);
      } else if (editingEdition.id) {
        await editionsService.update(editingEdition.id, editingEdition);
      }
      await loadEditions();
      setEditingEdition(null);
      setIsAdding(false);
      setPreviewUrl("");
    } catch (error) {
      console.error("Error saving edition:", error);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleDeleteEdition = async (id: string) => {
    if (confirm("Supprimer cette édition ?")) {
      try {
        await editionsService.delete(id);
        await loadEditions();
      } catch (error) {
        console.error("Error deleting edition:", error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleEditEdition = (edition: Edition) => {
    setEditingEdition(edition);
    setPreviewUrl(edition.image);
    setIsAdding(false);
  };

  const handleCancelEdit = () => {
    setEditingEdition(null);
    setIsAdding(false);
    setPreviewUrl("");
  };

  if (isLoading) {
    return <AdminLayout><div className="p-8">Chargement...</div></AdminLayout>;
  }

  const upcomingEditions = editions.filter((e) => e.status === "upcoming");
  const pastEditions = editions.filter((e) => e.status === "past");

  return (
    <>
      <SEO title="Gestion des Éditions - Admin" />
      <AdminLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                Gestion des Éditions
              </h1>
              <p className="text-foreground/70">
                Gérer les différentes éditions du festival à travers le monde
              </p>
            </div>
            <Button size="sm" onClick={handleAddEdition}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter édition
            </Button>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{editions.length}</p>
                    <p className="text-sm text-foreground/70">Éditions totales</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <CalendarIcon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{upcomingEditions.length}</p>
                    <p className="text-sm text-foreground/70">À venir</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <Flag className="w-6 h-6 text-foreground/50" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{pastEditions.length}</p>
                    <p className="text-sm text-foreground/70">Passées</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {(editingEdition || isAdding) && (
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle>{isAdding ? "Nouvelle édition" : "Modifier l'édition"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Image de l'édition *</label>
                  {previewUrl ? (
                    <div className="space-y-4">
                      <div className="relative aspect-video max-w-2xl bg-muted rounded-lg overflow-hidden border-2 border-border">
                        <Image src={previewUrl} alt="Edition preview" fill className="object-cover" />
                      </div>
                      <div className="flex gap-2">
                        <label className="flex-1">
                          <Button variant="outline" className="w-full" asChild>
                            <span><Upload className="w-4 h-4 mr-2" /> Changer l'image</span>
                          </Button>
                          <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                        </label>
                        <Button variant="outline" onClick={() => { setPreviewUrl(""); if (editingEdition) setEditingEdition({ ...editingEdition, image: "" }); }}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <label className="block">
                      <Button variant="outline" className="w-full h-32 border-2 border-dashed" disabled={isUploading} asChild>
                        <span className="flex flex-col items-center gap-2">
                          <Upload className="w-8 h-8 text-foreground/50" />
                          <span className="text-sm text-foreground/70">{isUploading ? "Upload en cours..." : "Cliquer pour uploader l'image"}</span>
                        </span>
                      </Button>
                      <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" disabled={isUploading} />
                    </label>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Ville *</label>
                    <Input value={editingEdition.city || ""} onChange={(e) => setEditingEdition({ ...editingEdition, city: e.target.value })} placeholder="Ex: Abidjan" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Pays *</label>
                    <Input value={editingEdition.country || ""} onChange={(e) => setEditingEdition({ ...editingEdition, country: e.target.value })} placeholder="Ex: Côte d'Ivoire" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Date *</label>
                    <Input type="date" value={editingEdition.date || ""} onChange={(e) => setEditingEdition({ ...editingEdition, date: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Statut *</label>
                    <select value={editingEdition.status || "upcoming"} onChange={(e) => setEditingEdition({ ...editingEdition, status: e.target.value })} className="w-full px-3 py-2 border border-input rounded-md bg-background">
                      <option value="upcoming">À venir</option>
                      <option value="past">Passée</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea value={editingEdition.description || ""} onChange={(e) => setEditingEdition({ ...editingEdition, description: e.target.value })} placeholder="Décrivez cette édition du festival..." rows={4} />
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isOrigin" checked={editingEdition.is_origin || false} onChange={(e) => setEditingEdition({ ...editingEdition, is_origin: e.target.checked })} className="w-4 h-4" />
                  <label htmlFor="isOrigin" className="text-sm font-medium">Ville d'origine du festival (Abidjan)</label>
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline" onClick={handleCancelEdit}><X className="w-4 h-4 mr-2" /> Annuler</Button>
                  <Button onClick={handleSaveEdition}><Save className="w-4 h-4 mr-2" /> Enregistrer</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-accent" /> Éditions à venir ({upcomingEditions.length})
            </h3>
            {upcomingEditions.length === 0 ? (
              <Card><CardContent className="text-center py-8 text-foreground/50"><p className="text-sm">Aucune édition à venir</p></CardContent></Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingEditions.map((edition) => (
                  <Card key={edition.id} className={edition.is_origin ? "border-2 border-primary" : ""}>
                    <CardContent className="p-4 space-y-4">
                      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                        <Image src={edition.image} alt={edition.city} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                          {edition.city}, {edition.country}
                          {edition.is_origin && <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">Origine</span>}
                        </h4>
                        <p className="text-sm text-foreground/60">{new Date(edition.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
                        {edition.description && <p className="text-sm text-foreground/70 mt-2 line-clamp-2">{edition.description}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditEdition(edition)}><Edit className="w-4 h-4 mr-2" /> Modifier</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteEdition(edition.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {pastEditions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Flag className="w-5 h-5 text-foreground/50" /> Éditions passées ({pastEditions.length})
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastEditions.map((edition) => (
                  <Card key={edition.id} className="opacity-75">
                    <CardContent className="p-4 space-y-4">
                      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                        <Image src={edition.image} alt={edition.city} fill className="object-cover grayscale" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{edition.city}, {edition.country}</h4>
                        <p className="text-sm text-foreground/60">{new Date(edition.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditEdition(edition)}><Edit className="w-4 h-4 mr-2" /> Modifier</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteEdition(edition.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}