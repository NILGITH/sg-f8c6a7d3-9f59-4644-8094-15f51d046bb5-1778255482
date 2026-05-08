import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Save, Download, Upload, X, FileText, MapPin } from "lucide-react";
import { useContentManager } from "@/hooks/useContentManager";
import { SEO } from "@/components/SEO";

interface ProgramEvent {
  id: string;
  title: string;
  description: string;
  time: string;
  badge: string;
  icon: string;
  color: string;
}

interface CityProgram {
  id: string;
  city: string;
  dates: string;
  location: string;
  events: ProgramEvent[];
}

interface ProgramData {
  cities: CityProgram[];
  programPdf?: string;
}

export default function AdminProgram() {
  const router = useRouter();
  const { data, setData, exportData, importData } = useContentManager<ProgramData>("program", {
    cities: [],
    programPdf: "",
  });

  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [editingEvent, setEditingEvent] = useState<ProgramEvent | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingCity, setEditingCity] = useState<CityProgram | null>(null);
  const [isAddingCity, setIsAddingCity] = useState(false);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("festival_admin_auth");
    if (!isAuth) {
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    if (data.cities.length > 0 && !selectedCityId) {
      setSelectedCityId(data.cities[0].id);
    }
  }, [data.cities, selectedCityId]);

  const currentCity = data.cities.find((c) => c.id === selectedCityId);

  const handleAddCity = () => {
    const newCity: CityProgram = {
      id: Date.now().toString(),
      city: "",
      dates: "",
      location: "",
      events: [],
    };
    setEditingCity(newCity);
    setIsAddingCity(true);
  };

  const handleSaveCity = () => {
    if (!editingCity) return;
    if (!editingCity.city || !editingCity.id) {
      alert("La ville est requise");
      return;
    }

    if (isAddingCity) {
      setData({
        ...data,
        cities: [...data.cities, editingCity],
      });
      setSelectedCityId(editingCity.id);
    } else {
      setData({
        ...data,
        cities: data.cities.map((c) => (c.id === editingCity.id ? editingCity : c)),
      });
    }

    setEditingCity(null);
    setIsAddingCity(false);
  };

  const handleDeleteCity = (id: string) => {
    if (confirm("Supprimer ce programme et tous ses événements ?")) {
      const newCities = data.cities.filter((c) => c.id !== id);
      setData({ ...data, cities: newCities });
      if (selectedCityId === id && newCities.length > 0) {
        setSelectedCityId(newCities[0].id);
      }
    }
  };

  const handleAddEvent = () => {
    if (!currentCity) return;
    const newEvent: ProgramEvent = {
      id: Date.now().toString(),
      title: "",
      description: "",
      time: "",
      badge: "",
      icon: "ChefHat",
      color: "bg-primary/10 border-primary/20",
    };
    setEditingEvent(newEvent);
    setIsAddingEvent(true);
  };

  const handleSaveEvent = () => {
    if (!editingEvent || !currentCity) return;

    const updatedEvents = isAddingEvent
      ? [...currentCity.events, editingEvent]
      : currentCity.events.map((e) => (e.id === editingEvent.id ? editingEvent : e));

    setData({
      ...data,
      cities: data.cities.map((c) =>
        c.id === currentCity.id ? { ...c, events: updatedEvents } : c
      ),
    });

    setEditingEvent(null);
    setIsAddingEvent(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (!currentCity) return;
    if (confirm("Supprimer cet événement ?")) {
      setData({
        ...data,
        cities: data.cities.map((c) =>
          c.id === currentCity.id
            ? { ...c, events: c.events.filter((e) => e.id !== eventId) }
            : c
        ),
      });
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importData(file);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Veuillez sélectionner un fichier PDF");
      return;
    }

    setIsUploadingPdf(true);
    setPdfFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setData({ ...data, programPdf: base64 });
      setIsUploadingPdf(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePdf = () => {
    if (confirm("Supprimer le fichier PDF ?")) {
      setData({ ...data, programPdf: "" });
      setPdfFile(null);
    }
  };

  return (
    <>
      <SEO title="Gestion du Programme - Admin" />
      <AdminLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                Gestion du Programme
              </h1>
              <p className="text-foreground/70">Gérer les programmes par édition/ville</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="w-4 h-4 mr-2" /> Exporter JSON
              </Button>
              <label>
                <Button variant="outline" size="sm" asChild>
                  <span><Upload className="w-4 h-4 mr-2" /> Importer JSON</span>
                </Button>
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
              <Button size="sm" onClick={handleAddCity}>
                <Plus className="w-4 h-4 mr-2" /> Ajouter un programme ville
              </Button>
            </div>
          </div>

          <Card className="border-2 border-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" /> Programme PDF Global
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.programPdf ? (
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-primary" />
                    <div><p className="font-medium">Programme uploadé</p></div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="destructive" size="sm" onClick={handleRemovePdf}>
                      <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                    </Button>
                  </div>
                </div>
              ) : (
                <label className="block">
                  <Button className="w-full" disabled={isUploadingPdf} asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploadingPdf ? "Upload en cours..." : "Uploader le programme PDF"}
                    </span>
                  </Button>
                  <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" disabled={isUploadingPdf} />
                </label>
              )}
            </CardContent>
          </Card>

          {(editingCity || isAddingCity) && (
            <Card className="border-2 border-primary">
              <CardHeader><CardTitle>{isAddingCity ? "Ajouter une ville" : "Modifier la ville"}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Ville</label>
                    <Input
                      value={editingCity?.city || ""}
                      onChange={(e) => setEditingCity({ ...editingCity!, city: e.target.value })}
                      placeholder="Ex: Abidjan"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Lieu</label>
                    <Input
                      value={editingCity?.location || ""}
                      onChange={(e) => setEditingCity({ ...editingCity!, location: e.target.value })}
                      placeholder="Ex: Parc des Sports"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Dates</label>
                    <Input
                      value={editingCity?.dates || ""}
                      onChange={(e) => setEditingCity({ ...editingCity!, dates: e.target.value })}
                      placeholder="Ex: 15-17 Août 2026"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Identifiant URL (sans espace/accent)</label>
                    <Input
                      value={editingCity?.id || ""}
                      onChange={(e) => setEditingCity({ ...editingCity!, id: e.target.value })}
                      placeholder="Ex: abidjan"
                      disabled={!isAddingCity}
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => { setEditingCity(null); setIsAddingCity(false); }}>
                    <X className="w-4 h-4 mr-2" /> Annuler
                  </Button>
                  <Button onClick={handleSaveCity}><Save className="w-4 h-4 mr-2" /> Enregistrer</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {data.cities.length > 0 && (
            <Tabs value={selectedCityId} onValueChange={setSelectedCityId}>
              <TabsList className="flex flex-wrap gap-2 mb-4 bg-transparent">
                {data.cities.map((city) => (
                  <TabsTrigger key={city.id} value={city.id} className="data-[state=active]:bg-primary data-[state=active]:text-white">
                    <MapPin className="w-4 h-4 mr-2" /> {city.city}
                  </TabsTrigger>
                ))}
              </TabsList>

              {data.cities.map((city) => (
                <TabsContent key={city.id} value={city.id} className="space-y-6 mt-0">
                  <Card className="bg-muted/30">
                    <CardContent className="flex items-center justify-between p-6">
                      <div>
                        <h3 className="text-xl font-bold">{city.city}</h3>
                        <p className="text-foreground/70">{city.dates} • {city.location}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setEditingCity(city); setIsAddingCity(false); }}>
                          <Edit className="w-4 h-4 mr-2" /> Modifier info ville
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteCity(city.id)}>
                          <Trash2 className="w-4 h-4 mr-2" /> Supprimer ville
                        </Button>
                        <Button size="sm" onClick={handleAddEvent}>
                          <Plus className="w-4 h-4 mr-2" /> Ajouter un événement
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {(editingEvent || isAddingEvent) && currentCity?.id === city.id && (
                    <Card className="border-2 border-primary">
                      <CardHeader><CardTitle>{isAddingEvent ? "Nouvel événement" : "Modifier l'événement"}</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Titre</label>
                            <Input value={editingEvent?.title || ""} onChange={(e) => setEditingEvent({ ...editingEvent!, title: e.target.value })} />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Badge</label>
                            <Input value={editingEvent?.badge || ""} onChange={(e) => setEditingEvent({ ...editingEvent!, badge: e.target.value })} />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Description</label>
                          <Textarea value={editingEvent?.description || ""} onChange={(e) => setEditingEvent({ ...editingEvent!, description: e.target.value })} />
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium">Horaire</label>
                            <Input value={editingEvent?.time || ""} onChange={(e) => setEditingEvent({ ...editingEvent!, time: e.target.value })} />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Icône</label>
                            <select value={editingEvent?.icon || ""} onChange={(e) => setEditingEvent({ ...editingEvent!, icon: e.target.value })} className="w-full px-3 py-2 border rounded-md">
                              <option value="ChefHat">Chef Hat</option>
                              <option value="Music">Music</option>
                              <option value="Trophy">Trophy</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Couleur</label>
                            <select value={editingEvent?.color || ""} onChange={(e) => setEditingEvent({ ...editingEvent!, color: e.target.value })} className="w-full px-3 py-2 border rounded-md">
                              <option value="bg-primary/10 border-primary/20">Primary</option>
                              <option value="bg-secondary/10 border-secondary/20">Secondary</option>
                              <option value="bg-accent/10 border-accent/20">Accent</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => { setEditingEvent(null); setIsAddingEvent(false); }}>Annuler</Button>
                          <Button onClick={handleSaveEvent}>Enregistrer</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid gap-4">
                    {city.events.map((event) => (
                      <Card key={event.id}>
                        <CardHeader className="flex flex-row items-start justify-between">
                          <div>
                            <CardTitle>{event.title}</CardTitle>
                            <p className="text-sm text-foreground/70">{event.badge} • {event.time}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => { setEditingEvent(event); setIsAddingEvent(false); }}><Edit className="w-4 h-4" /></Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteEvent(event.id)}><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </AdminLayout>
    </>
  );
}