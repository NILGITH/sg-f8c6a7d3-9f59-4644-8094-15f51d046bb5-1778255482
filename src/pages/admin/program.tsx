import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Save, Download, Upload, X } from "lucide-react";
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

interface ProgramData {
  events: ProgramEvent[];
  festivalInfo: {
    dates: string;
    location: string;
    city: string;
  };
}

export default function AdminProgram() {
  const router = useRouter();
  const { data, setData, exportData, importData, resetData } = useContentManager<ProgramData>("program", {
    events: [],
    festivalInfo: { dates: "", location: "", city: "" },
  });

  const [editingEvent, setEditingEvent] = useState<ProgramEvent | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("festival_admin_auth");
    if (!isAuth) {
      router.push("/admin/login");
    }
  }, [router]);

  const handleAddEvent = () => {
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
    setIsAdding(true);
  };

  const handleSaveEvent = () => {
    if (!editingEvent) return;

    if (isAdding) {
      setData({
        ...data,
        events: [...data.events, editingEvent],
      });
    } else {
      setData({
        ...data,
        events: data.events.map((e) => (e.id === editingEvent.id ? editingEvent : e)),
      });
    }

    setEditingEvent(null);
    setIsAdding(false);
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      setData({
        ...data,
        events: data.events.filter((e) => e.id !== id),
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
      <SEO title="Gestion du Programme - Admin" />
      <AdminLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                Gestion du Programme
              </h1>
              <p className="text-foreground/70">
                Gérer les événements et horaires du festival
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
              <Button size="sm" onClick={handleAddEvent}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un événement
              </Button>
            </div>
          </div>

          {(editingEvent || isAdding) && (
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle>
                  {isAdding ? "Nouvel événement" : "Modifier l'événement"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Titre</label>
                    <Input
                      value={editingEvent.title}
                      onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                      placeholder="Ex: Démonstrations Culinaires"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Badge</label>
                    <Input
                      value={editingEvent.badge}
                      onChange={(e) => setEditingEvent({ ...editingEvent, badge: e.target.value })}
                      placeholder="Ex: Tous les jours"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={editingEvent.description}
                    onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                    rows={3}
                    placeholder="Description de l'événement..."
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Horaire</label>
                    <Input
                      value={editingEvent.time}
                      onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                      placeholder="Ex: 10h - 18h"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Icône</label>
                    <select
                      value={editingEvent.icon}
                      onChange={(e) => setEditingEvent({ ...editingEvent, icon: e.target.value })}
                      className="w-full px-3 py-2 border border-input rounded-md"
                    >
                      <option value="ChefHat">Chef Hat</option>
                      <option value="Music">Music</option>
                      <option value="Trophy">Trophy</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Couleur</label>
                    <select
                      value={editingEvent.color}
                      onChange={(e) => setEditingEvent({ ...editingEvent, color: e.target.value })}
                      className="w-full px-3 py-2 border border-input rounded-md"
                    >
                      <option value="bg-primary/10 border-primary/20">Primary</option>
                      <option value="bg-secondary/10 border-secondary/20">Secondary</option>
                      <option value="bg-accent/10 border-accent/20">Accent</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingEvent(null);
                      setIsAdding(false);
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                  <Button onClick={handleSaveEvent}>
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6">
            {data.events.map((event) => (
              <Card key={event.id}>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle>{event.title}</CardTitle>
                    <p className="text-sm text-foreground/70 mt-1">{event.badge} • {event.time}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingEvent(event);
                        setIsAdding(false);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">{event.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}