import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Save, Download, Upload, X, Building2 } from "lucide-react";
import { useContentManager } from "@/hooks/useContentManager";
import { SEO } from "@/components/SEO";
import Image from "next/image";

interface Partner {
  id: string;
  name: string;
  logo: string;
  website: string;
  category: string;
  featured: boolean;
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
      category: "sponsor",
      featured: false,
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
                Gérer les logos et informations des partenaires
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

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Catégorie</label>
                    <select
                      value={editingPartner.category}
                      onChange={(e) =>
                        setEditingPartner({ ...editingPartner, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-input rounded-md"
                    >
                      <option value="sponsor">Sponsor</option>
                      <option value="media">Média</option>
                      <option value="institutional">Institutionnel</option>
                      <option value="supplier">Fournisseur</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={editingPartner.featured}
                      onChange={(e) =>
                        setEditingPartner({ ...editingPartner, featured: e.target.checked })
                      }
                      className="w-4 h-4"
                    />
                    <label htmlFor="featured" className="text-sm font-medium">
                      Partenaire principal (affiché en grand)
                    </label>
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

          {/* Partners List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Partenaires ({data.partners.length})
            </h3>

            {data.partners.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12 text-foreground/50">
                  <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun partenaire ajouté</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.partners.map((partner) => (
                  <Card key={partner.id} className={partner.featured ? "border-2 border-primary" : ""}>
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
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                          {partner.name}
                          {partner.featured && (
                            <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                              Principal
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-foreground/60 capitalize">{partner.category}</p>
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
        </div>
      </AdminLayout>
    </>
  );
}