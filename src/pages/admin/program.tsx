import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Save, X, MapPin } from "lucide-react";
import { SEO } from "@/components/SEO";
import { programService, type Program } from "@/services/programService";

interface ProgramEvent {
  id: string;
  title: string;
  description: string;
  time: string;
  badge: string;
  icon: string;
  color: string;
}

export default function AdminProgram() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [editingEvent, setEditingEvent] = useState<ProgramEvent | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingCity, setEditingCity] = useState<Partial<Program> | null>(null);
  const [isAddingCity, setIsAddingCity] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("festival_admin_auth");
    if (!isAuth) {
      router.push("/admin/login");
    } else {
      loadPrograms();
    }
  }, [router]);

  const loadPrograms = async () => {
    try {
      const data = await programService.getAll();
      setPrograms(data);
      if (data.length > 0 && !selectedCityId) {
        setSelectedCityId(data[0].city_id);
      }
    } catch (error) {
      console.error("Error loading programs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentProgram = programs.find((p) => p.city_id === selectedCityId);

  const handleAddCity = () => {
    setEditingCity({
      city_id: "",
      city: "",
      dates: "",
      events: [],
    });
    setIsAddingCity(true);
  };

  const handleSaveCity = async () => {
    if (!editingCity || !editingCity.city || !editingCity.city_id) {
      alert("La ville et son identifiant sont requis");
      return;
    }

    try {
      if (isAddingCity) {
        await programService.create(editingCity as Omit<Program, "id" | "created_at">);
        setSelectedCityId(editingCity.city_id);
      } else if (editingCity.id) {
        await programService.update(editingCity.id, editingCity);
      }
      await loadPrograms();
      setEditingCity(null);
      setIsAddingCity(false);
    } catch (error) {
      console.error("Error saving city program:", error);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleDeleteCity = async (id: string) => {
    if (confirm("Supprimer ce programme et tous ses événements ?")) {
      try {
        await programService.delete(id);
        const data = await programService.getAll();
        setPrograms(data);
        if (selectedCityId === currentProgram?.city_id && data.length > 0) {
          setSelectedCityId(data[0].city_id);
        }
      } catch (error) {
        console.error("Error deleting city program:", error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleAddEvent = () => {
    if (!currentProgram) return;
    setEditingEvent({
      id: Date.now().toString(),
      title: "",
      description: "",
      time: "",
      badge: "",
      icon: "ChefHat",
      color: "bg-primary/10 border-primary/20",
    });
    setIsAddingEvent(true);
  };

  const handleSaveEvent = async () => {
    if (!editingEvent || !currentProgram) return;

    const currentEvents = (currentProgram.events as unknown as ProgramEvent[]) || [];
    const updatedEvents = isAddingEvent
      ? [...currentEvents, editingEvent]
      : currentEvents.map((e) => (e.id === editingEvent.id ? editingEvent : e));

    try {
      await programService.update(currentProgram.id, { events: updatedEvents as any });
      await loadPrograms();
      setEditingEvent(null);
      setIsAddingEvent(false);
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Erreur lors de l'enregistrement de l'événement");
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!currentProgram) return;
    if (confirm("Supprimer cet événement ?")) {
      const currentEvents = (currentProgram.events as unknown as ProgramEvent[]) || [];
      const updatedEvents = currentEvents.filter((e) => e.id !== eventId);
      
      try {
        await programService.update(currentProgram.id, { events: updatedEvents as any });
        await loadPrograms();
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Erreur lors de la suppression de l'événement");
      }
    }
  };

  if (isLoading) {
    return <AdminLayout><div className="p-8">Chargement...</div></AdminLayout>;
  }

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
            <Button size="sm" onClick={handleAddCity}>
              <Plus className="w-4 h-4 mr-2" /> Ajouter un programme ville
            </Button>
          </div>

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
                      value={editingCity?.city_id || ""}
                      onChange={(e) => setEditingCity({ ...editingCity!, city_id: e.target.value })}
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

          {programs.length > 0 && (
            <Tabs value={selectedCityId} onValueChange={setSelectedCityId}>
              <TabsList className="flex flex-wrap gap-2 mb-4 bg-transparent">
                {programs.map((program) => (
                  <TabsTrigger key={program.id} value={program.city_id} className="data-[state=active]:bg-primary data-[state=active]:text-white">
                    <MapPin className="w-4 h-4 mr-2" /> {program.city}
                  </TabsTrigger>
                ))}
              </TabsList>

              {programs.map((program) => {
                const programEvents = (program.events as unknown as ProgramEvent[]) || [];
                return (
                  <TabsContent key={program.id} value={program.city_id} className="space-y-6 mt-0">
                    <Card className="bg-muted/30">
                      <CardContent className="flex items-center justify-between p-6">
                        <div>
                          <h3 className="text-xl font-bold">{program.city}</h3>
                          <p className="text-foreground/70">{program.dates}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => { setEditingCity(program); setIsAddingCity(false); }}>
                            <Edit className="w-4 h-4 mr-2" /> Modifier info ville
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteCity(program.id)}>
                            <Trash2 className="w-4 h-4 mr-2" /> Supprimer ville
                          </Button>
                          <Button size="sm" onClick={handleAddEvent}>
                            <Plus className="w-4 h-4 mr-2" /> Ajouter un événement
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {(editingEvent || isAddingEvent) && currentProgram?.id === program.id && (
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
                              <select value={editingEvent?.icon || ""} onChange={(e) => setEditingEvent({ ...editingEvent!, icon: e.target.value })} className="w-full px-3 py-2 border border-input rounded-md bg-background">
                                <option value="ChefHat">Chef Hat</option>
                                <option value="Music">Music</option>
                                <option value="Trophy">Trophy</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Couleur</label>
                              <select value={editingEvent?.color || ""} onChange={(e) => setEditingEvent({ ...editingEvent!, color: e.target.value })} className="w-full px-3 py-2 border border-input rounded-md bg-background">
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
                      {programEvents.map((event) => (
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
                );
              })}
            </Tabs>
          )}
        </div>
      </AdminLayout>
    </>
  );
}