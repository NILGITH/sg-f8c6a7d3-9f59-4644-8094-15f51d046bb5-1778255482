import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Save, Upload, X, Award, Users } from "lucide-react";
import { SEO } from "@/components/SEO";
import Image from "next/image";
import { partnerService, type Partner } from "@/services/partnerService";

export default function AdminPartners() {
  const router = useRouter();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [editingPartner, setEditingPartner] = useState<Partial<Partner> | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("festival_admin_auth");
    if (!isAuth) {
      router.push("/admin/login");
    } else {
      loadPartners();
    }
  }, [router]);

  const loadPartners = async () => {
    try {
      const data = await partnerService.getAll();
      setPartners(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPartner = () => {
    setEditingPartner({
      name: "",
      logo: "",
      website: "",
      category: "support",
    });
    setIsAdding(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreviewUrl(base64);
      if (editingPartner) {
        setEditingPartner({ ...editingPartner, logo: base64 });
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSavePartner = async () => {
    if (!editingPartner || !editingPartner.name || !editingPartner.logo) {
      alert("Veuillez remplir le nom et uploader un logo");
      return;
    }
    try {
      if (isAdding) {
        await partnerService.create(editingPartner as any);
      } else if (editingPartner.id) {
        await partnerService.update(editingPartner.id, editingPartner);
      }
      await loadPartners();
      setEditingPartner(null);
      setIsAdding(false);
      setPreviewUrl("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (confirm("Supprimer ce partenaire ?")) {
      try {
        await partnerService.delete(id);
        await loadPartners();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEditPartner = (partner: Partner) => {
    setEditingPartner(partner);
    setPreviewUrl(partner.logo || "");
    setIsAdding(false);
  };

  const handleCancelEdit = () => {
    setEditingPartner(null);
    setIsAdding(false);
    setPreviewUrl("");
  };

  if (isLoading) return <AdminLayout><div className="p-8">Chargement...</div></AdminLayout>;

  const principalPartners = partners.filter((p) => p.category === "principal");
  const supportPartners = partners.filter((p) => p.category === "support");

  return (
    <>
      <SEO title="Gestion des Partenaires - Admin" />
      <AdminLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Gestion des Partenaires</h1>
              <p className="text-foreground/70">Gérer les logos et catégories des partenaires via Supabase</p>
            </div>
            <Button size="sm" onClick={handleAddPartner}>
              <Plus className="w-4 h-4 mr-2" /> Ajouter partenaire
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg"><Award className="w-6 h-6 text-primary" /></div>
                  <div><p className="text-2xl font-bold">{principalPartners.length}</p><p className="text-sm text-foreground/70">Partenaires Principaux</p></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/10 rounded-lg"><Users className="w-6 h-6 text-secondary" /></div>
                  <div><p className="text-2xl font-bold">{supportPartners.length}</p><p className="text-sm text-foreground/70">Avec le soutien de</p></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {(editingPartner || isAdding) && (
            <Card className="border-2 border-primary">
              <CardHeader><CardTitle>{isAdding ? "Nouveau partenaire" : "Modifier le partenaire"}</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Logo *</label>
                  {previewUrl ? (
                    <div className="space-y-4">
                      <div className="relative aspect-video max-w-md bg-muted rounded-lg overflow-hidden border-2 border-border">
                        <Image src={previewUrl} alt="Logo" fill className="object-contain p-4" />
                      </div>
                      <div className="flex gap-2">
                        <label className="flex-1">
                          <Button variant="outline" className="w-full" asChild>
                            <span><Upload className="w-4 h-4 mr-2" /> Changer</span>
                          </Button>
                          <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="block">
                      <Button variant="outline" className="w-full h-32 border-2 border-dashed" disabled={isUploading} asChild>
                        <span className="flex flex-col items-center gap-2"><Upload className="w-8 h-8 text-foreground/50" /><span>Upload</span></span>
                      </Button>
                      <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" disabled={isUploading} />
                    </label>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nom *</label>
                    <Input value={editingPartner.name || ""} onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Site web</label>
                    <Input value={editingPartner.website || ""} onChange={(e) => setEditingPartner({ ...editingPartner, website: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Catégorie *</label>
                  <select value={editingPartner.category || "support"} onChange={(e) => setEditingPartner({ ...editingPartner, category: e.target.value as any })} className="w-full px-3 py-2 border border-input rounded-md">
                    <option value="principal">Partenaire Principal</option>
                    <option value="support">Avec le soutien de</option>
                  </select>
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline" onClick={handleCancelEdit}><X className="w-4 h-4 mr-2" /> Annuler</Button>
                  <Button onClick={handleSavePartner}><Save className="w-4 h-4 mr-2" /> Enregistrer</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Award className="w-5 h-5 text-primary" /> Principaux</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {principalPartners.map((partner) => (
                <Card key={partner.id}>
                  <CardContent className="p-4 space-y-4">
                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden"><Image src={partner.logo || ""} alt={partner.name} fill className="object-contain p-2" /></div>
                    <h4 className="font-semibold">{partner.name}</h4>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditPartner(partner)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeletePartner(partner.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Users className="w-5 h-5 text-secondary" /> Soutien</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {supportPartners.map((partner) => (
                <Card key={partner.id}>
                  <CardContent className="p-3 space-y-3">
                    <div className="relative aspect-square bg-muted rounded-lg overflow-hidden"><Image src={partner.logo || ""} alt={partner.name} fill className="object-contain p-2" /></div>
                    <p className="text-xs font-medium text-center truncate">{partner.name}</p>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="flex-1 h-8" onClick={() => handleEditPartner(partner)}><Edit className="w-3 h-3" /></Button>
                      <Button variant="destructive" size="sm" className="h-8" onClick={() => handleDeletePartner(partner.id)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}