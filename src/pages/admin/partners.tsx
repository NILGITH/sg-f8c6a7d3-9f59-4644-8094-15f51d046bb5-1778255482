import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Save, Download, Upload, X, Building2, Award, Users } from "lucide-react";
import { useContentManager } from "@/hooks/useContentManager";
import { SEO } from "@/components/SEO";
import Image from "next/image";

interface Partner {
  id: string;
  name: string;
  logo: string;
  website: string;
  category: "principal" | "support";
}

interface PartnersData {
  partners: Partner[];
}

export default function AdminPartners() {
  const router = useRouter();
  const { data, setData, exportData, importData } = useContentManager<PartnersData>("partners", { partners: [] });

  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("festival_admin_auth");
    if (!isAuth) {
      router.push("/admin/login");
    }
  }, [router]);

  const handleAddPartner = () => {
    const newPartner: Partner = {
      id: Date.now().toString(),
      name: "",
      logo: "",
      website: "",
      category: "support",
    };
    setEditingPartner(newPartner);
    setIsAdding(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image");
      return;
    }

    setLogoFile(file);
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

  const handleSavePartner = () => {
    if (!editingPartner || !editingPartner.name || !editingPartner.logo) {
      alert("Veuillez remplir le nom et uploader un logo");
      return;
    }

    if (isAdding) {
      setData({
        partners: [...data.partners, editingPartner],
      });
    } else {
      setData({
        partners: data.partners.map((p) => (p.id === editingPartner.id ? editingPartner : p)),
      });
    }

    setEditingPartner(null);
    setIsAdding(false);
    setLogoFile(null);
    setPreviewUrl("");
  };

  const handleDeletePartner = (id: string) => {
    if (confirm("Supprimer ce partenaire ?")) {
      setData({
        partners: data.partners.filter((p) => p.id !== id),
      });
    }
  };

  const handleEditPartner = (partner: Partner) => {
    setEditingPartner(partner);
    setPreviewUrl(partner.logo);
    setIsAdding(false);
  };

  const handleCancelEdit = () => {
    setEditingPartner(null);
    setIsAdding(false);
    setLogoFile(null);
    setPreviewUrl("");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importData(file);
    }
  };

  const principalPartners = data.partners.filter((p) => p.category === "principal");
  const supportPartners = data.partners.filter((p) => p.category === "support");

  return (
    <>
      <SEO title="Gestion des Partenaires - Admin" />
      <AdminLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                Gestion des Partenaires
              </h1>
              <p className="text-foreground/70">
                Gérer les logos et catégories des partenaires
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
              <Button size="sm" onClick={handleAddPartner}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter partenaire
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{principalPartners.length}</p>
                    <p className="text-sm text-foreground/70">Partenaires Principaux</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <Users className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{supportPartners.length}</p>
                    <p className="text-sm text-foreground/70">Avec le soutien de</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit/Add Form */}
          {(editingPartner || isAdding) && (
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle>
                  {isAdding ? "Nouveau partenaire" : "Modifier le partenaire"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo Upload */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Logo du partenaire *</label>
                  {previewUrl ? (
                    <div className="space-y-4">
                      <div className="relative aspect-video max-w-md bg-muted rounded-lg overflow-hidden border-2 border-border">
                        <Image
                          src={previewUrl}
                          alt="Logo preview"
                          fill
                          className="object-contain p-4"
                        />
                      </div>
                      <div className="flex gap-2">
                        <label className="flex-1">
                          <Button variant="outline" className="w-full" asChild>
                            <span>
                              <Upload className="w-4 h-4 mr-2" />
                              Changer le logo
                            </span>
                          </Button>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </label>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setPreviewUrl("");
                            setLogoFile(null);
                            if (editingPartner) {
                              setEditingPartner({ ...editingPartner, logo: "" });
                            }
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <label className="block">
                      <Button
                        variant="outline"
                        className="w-full h-32 border-2 border-dashed"
                        disabled={isUploading}
                        asChild
                      >
                        <span className="flex flex-col items-center gap-2">
                          <Upload className="w-8 h-8 text-foreground/50" />
                          <span className="text-sm text-foreground/70">
                            {isUploading ? "Upload en cours..." : "Cliquer pour uploader le logo"}
                          </span>
                        </span>
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  )}
                </div>

                {/* Partner Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nom du partenaire *</label>
                    <Input
                      value={editingPartner.name}
                      onChange={(e) =>
                        setEditingPartner({ ...editingPartner, name: e.target.value })
                      }
                      placeholder="Ex: Orange Côte d'Ivoire"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Site web</label>
                    <Input
                      value={editingPartner.website}
                      onChange={(e) =>
                        setEditingPartner({ ...editingPartner, website: e.target.value })
                      }
                      placeholder="https://exemple.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Catégorie *</label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setEditingPartner({ ...editingPartner, category: "principal" })}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        editingPartner.category === "principal"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Award className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <p className="font-semibold">Partenaire Principal</p>
                      <p className="text-xs text-foreground/60 mt-1">Logo grand, mise en avant</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingPartner({ ...editingPartner, category: "support" })}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        editingPartner.category === "support"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Users className="w-6 h-6 mx-auto mb-2 text-secondary" />
                      <p className="font-semibold">Avec le soutien de</p>
                      <p className="text-xs text-foreground/60 mt-1">Logo petit, grille</p>
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline" onClick={handleCancelEdit}>
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                  <Button onClick={handleSavePartner}>
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Partenaires Principaux */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Partenaires Principaux ({principalPartners.length})
            </h3>

            {principalPartners.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8 text-foreground/50">
                  <p className="text-sm">Aucun partenaire principal</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {principalPartners.map((partner) => (
                  <Card key={partner.id} className="border-2 border-primary/30">
                    <CardContent className="p-4 space-y-4">
                      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                        <Image
                          src={partner.logo}
                          alt={partner.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{partner.name}</h4>
                        <p className="text-sm text-primary">Partenaire Principal</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEditPartner(partner)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePartner(partner.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Avec le soutien de */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary" />
              Avec le soutien de ({supportPartners.length})
            </h3>

            {supportPartners.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8 text-foreground/50">
                  <p className="text-sm">Aucun partenaire de soutien</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {supportPartners.map((partner) => (
                  <Card key={partner.id}>
                    <CardContent className="p-3 space-y-3">
                      <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                        <Image
                          src={partner.logo}
                          alt={partner.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <p className="text-xs font-medium text-center truncate">{partner.name}</p>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-8 text-xs"
                          onClick={() => handleEditPartner(partner)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8"
                          onClick={() => handleDeletePartner(partner.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
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