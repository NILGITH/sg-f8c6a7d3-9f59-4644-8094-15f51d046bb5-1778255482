import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Upload, Search, Plus, Edit, Trash2, Save, X, Tag } from "lucide-react";
import { useContentManager } from "@/hooks/useContentManager";
import { SEO } from "@/components/SEO";

interface Reservation {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  ticketType: string;
  quantity: number;
  totalAmount: string;
  status: "confirmed" | "pending" | "cancelled";
  paymentMethod: string;
  createdAt: string;
}

interface Offer {
  id: string;
  title: string;
  price: string;
  features: string[];
  popular: boolean;
}

interface ReservationsData {
  offers: Offer[];
  reservations: Reservation[];
}

export default function AdminReservations() {
  const router = useRouter();
  const { data, setData, exportData, importData } = useContentManager<ReservationsData>("reservations", {
    offers: [],
    reservations: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"offers" | "reservations">("offers");
  
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [isAddingOffer, setIsAddingOffer] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("festival_admin_auth");
    if (!isAuth) {
      router.push("/admin/login");
    }
  }, [router]);

  const filteredReservations = data.reservations.filter((res) => {
    const matchesSearch =
      res.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || res.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id: string, newStatus: "confirmed" | "pending" | "cancelled") => {
    setData({
      ...data,
      reservations: data.reservations.map((res) =>
        res.id === id ? { ...res, status: newStatus } : res
      ),
    });
  };

  const handleAddOffer = () => {
    const newOffer: Offer = {
      id: Date.now().toString(),
      title: "",
      price: "",
      features: [],
      popular: false,
    };
    setEditingOffer(newOffer);
    setIsAddingOffer(true);
  };

  const handleSaveOffer = () => {
    if (!editingOffer || !editingOffer.title || !editingOffer.price) {
      alert("Veuillez remplir le titre et le prix");
      return;
    }

    if (isAddingOffer) {
      setData({
        ...data,
        offers: [...data.offers, editingOffer],
      });
    } else {
      setData({
        ...data,
        offers: data.offers.map((o) => (o.id === editingOffer.id ? editingOffer : o)),
      });
    }

    setEditingOffer(null);
    setIsAddingOffer(false);
  };

  const handleDeleteOffer = (id: string) => {
    if (confirm("Supprimer cette offre ?")) {
      setData({
        ...data,
        offers: data.offers.filter((o) => o.id !== id),
      });
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importData(file);
    }
  };

  const stats = {
    total: data.reservations.length,
    confirmed: data.reservations.filter((r) => r.status === "confirmed").length,
    pending: data.reservations.filter((r) => r.status === "pending").length,
    cancelled: data.reservations.filter((r) => r.status === "cancelled").length,
  };

  return (
    <>
      <SEO title="Gestion des Réservations & Offres - Admin" />
      <AdminLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                Réservations & Offres
              </h1>
              <p className="text-foreground/70">
                Gérer les offres tarifaires et les réservations
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

          {/* Tabs */}
          <div className="flex gap-2 border-b border-border">
            <button
              onClick={() => setActiveTab("offers")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "offers"
                  ? "text-primary border-b-2 border-primary"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              <Tag className="w-4 h-4 inline mr-2" />
              Offres & Tarifs
            </button>
            <button
              onClick={() => setActiveTab("reservations")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "reservations"
                  ? "text-primary border-b-2 border-primary"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              Réservations ({data.reservations.length})
            </button>
          </div>

          {/* Offres Tab */}
          {activeTab === "offers" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-sm text-foreground/70">
                  Ces offres s'affichent automatiquement sur la section billetterie du site
                </p>
                <Button size="sm" onClick={handleAddOffer}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle offre
                </Button>
              </div>

              {(editingOffer || isAddingOffer) && (
                <Card className="border-2 border-primary">
                  <CardHeader>
                    <CardTitle>
                      {isAddingOffer ? "Nouvelle offre" : "Modifier l'offre"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Titre de l'offre *</label>
                        <Input
                          value={editingOffer.title}
                          onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                          placeholder="Ex: Pass 3 Jours"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Prix *</label>
                        <Input
                          value={editingOffer.price}
                          onChange={(e) => setEditingOffer({ ...editingOffer, price: e.target.value })}
                          placeholder="Ex: 35 000 FCFA"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Avantages (un par ligne)</label>
                      <Textarea
                        value={editingOffer.features.join("\n")}
                        onChange={(e) =>
                          setEditingOffer({
                            ...editingOffer,
                            features: e.target.value.split("\n").filter(Boolean),
                          })
                        }
                        rows={4}
                        placeholder="Accès VIP&#10;Boissons illimitées&#10;Rencontre avec les chefs"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="popular"
                        checked={editingOffer.popular}
                        onChange={(e) =>
                          setEditingOffer({ ...editingOffer, popular: e.target.checked })
                        }
                        className="w-4 h-4"
                      />
                      <label htmlFor="popular" className="text-sm font-medium">
                        Marquer comme offre populaire (badge "Populaire")
                      </label>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingOffer(null);
                          setIsAddingOffer(false);
                        }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Annuler
                      </Button>
                      <Button onClick={handleSaveOffer}>
                        <Save className="w-4 h-4 mr-2" />
                        Enregistrer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid md:grid-cols-3 gap-6">
                {data.offers.map((offer) => (
                  <Card key={offer.id} className={offer.popular ? "border-2 border-primary" : ""}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{offer.title}</CardTitle>
                          {offer.popular && (
                            <span className="inline-block mt-2 px-2 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                              Populaire
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingOffer(offer);
                              setIsAddingOffer(false);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteOffer(offer.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-3xl font-bold text-primary">{offer.price}</div>
                      <ul className="space-y-2">
                        {offer.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-foreground/80 flex items-start gap-2">
                            <span className="text-primary mt-1">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}

                {data.offers.length === 0 && (
                  <Card className="col-span-full">
                    <CardContent className="text-center py-12 text-foreground/50">
                      <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Aucune offre créée</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Reservations Tab */}
          {activeTab === "reservations" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <p className="text-sm text-foreground/70">Total</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
                    <p className="text-sm text-foreground/70">Confirmées</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                    <p className="text-sm text-foreground/70">En attente</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
                    <p className="text-sm text-foreground/70">Annulées</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                      <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Rechercher par nom, email ou ID..."
                        className="pl-10"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-input rounded-md"
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="confirmed">Confirmées</option>
                      <option value="pending">En attente</option>
                      <option value="cancelled">Annulées</option>
                    </select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredReservations.map((reservation) => (
                      <Card key={reservation.id} className="border">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-4">
                                <span className="font-mono text-sm text-foreground/70">
                                  {reservation.id}
                                </span>
                                <span
                                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                    reservation.status === "confirmed"
                                      ? "bg-green-100 text-green-700"
                                      : reservation.status === "pending"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {reservation.status === "confirmed"
                                    ? "Confirmé"
                                    : reservation.status === "pending"
                                    ? "En attente"
                                    : "Annulé"}
                                </span>
                              </div>

                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <p className="font-semibold text-lg">{reservation.customerName}</p>
                                  <p className="text-sm text-foreground/70">{reservation.email}</p>
                                  <p className="text-sm text-foreground/70">{reservation.phone}</p>
                                </div>
                                <div>
                                  <p className="text-sm">
                                    <span className="font-medium">Billet:</span> {reservation.ticketType}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Quantité:</span> {reservation.quantity}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Montant:</span>{" "}
                                    <span className="font-bold">{reservation.totalAmount}</span>
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Paiement:</span> {reservation.paymentMethod}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              {reservation.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => updateStatus(reservation.id, "confirmed")}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Confirmer
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => updateStatus(reservation.id, "cancelled")}
                                  >
                                    Annuler
                                  </Button>
                                </>
                              )}
                              {reservation.status === "confirmed" && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateStatus(reservation.id, "cancelled")}
                                >
                                  Annuler
                                </Button>
                              )}
                              {reservation.status === "cancelled" && (
                                <Button
                                  size="sm"
                                  onClick={() => updateStatus(reservation.id, "pending")}
                                >
                                  Réactiver
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {filteredReservations.length === 0 && (
                      <p className="text-center text-foreground/50 py-8">
                        Aucune réservation trouvée
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}