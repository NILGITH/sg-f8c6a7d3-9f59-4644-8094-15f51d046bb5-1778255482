import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Search, CheckCircle, Clock, XCircle, Download, Mail, Phone, MapPin, Users, Calendar as CalendarIcon } from "lucide-react";
import { SEO } from "@/components/SEO";
import { reservationService, type Reservation } from "@/services/reservationService";

export default function AdminReservations() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");

  useEffect(() => {
    const isAuth = localStorage.getItem("festival_admin_auth");
    if (!isAuth) {
      router.push("/admin/login");
    } else {
      loadReservations();
    }
  }, [router]);

  const loadReservations = async () => {
    try {
      const data = await reservationService.getAll();
      setReservations(data);
    } catch (error) {
      console.error("Error loading reservations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReservation = async (id: string) => {
    if (confirm("Supprimer cette réservation ?")) {
      try {
        await reservationService.delete(id);
        await loadReservations();
      } catch (error) {
        console.error("Error deleting reservation:", error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleUpdateStatus = async (id: string, status: "pending" | "confirmed" | "cancelled") => {
    try {
      await reservationService.updateStatus(id, status);
      await loadReservations();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  const exportToCSV = () => {
    const headers = ["Date", "Nom", "Email", "Téléphone", "Ville", "Nombre de personnes", "Type de billet", "Statut"];
    const rows = filteredReservations.map((r) => [
      new Date(r.created_at || "").toLocaleDateString("fr-FR"),
      r.name,
      r.email,
      r.phone || "",
      r.city || "",
      r.quantity?.toString() || "1",
      r.ticket_type || "",
      r.status,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reservations-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filteredReservations = reservations
    .filter((r) => statusFilter === "all" || r.status === statusFilter)
    .filter((r) => {
      const query = searchQuery.toLowerCase();
      return (
        r.name.toLowerCase().includes(query) ||
        r.email.toLowerCase().includes(query) ||
        (r.phone && r.phone.toLowerCase().includes(query)) ||
        (r.city && r.city.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime());

  const pendingCount = reservations.filter((r) => r.status === "pending").length;
  const confirmedCount = reservations.filter((r) => r.status === "confirmed").length;
  const cancelledCount = reservations.filter((r) => r.status === "cancelled").length;

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { text: "En attente", class: "bg-yellow-100 text-yellow-700", icon: Clock },
      confirmed: { text: "Confirmée", class: "bg-green-100 text-green-700", icon: CheckCircle },
      cancelled: { text: "Annulée", class: "bg-red-100 text-red-700", icon: XCircle },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.class}`}>
        <Icon className="w-3 h-3" />
        {badge.text}
      </span>
    );
  };

  if (isLoading) {
    return <AdminLayout><div className="p-8">Chargement...</div></AdminLayout>;
  }

  return (
    <>
      <SEO title="Gestion des Réservations - Admin" />
      <AdminLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                Gestion des Réservations
              </h1>
              <p className="text-foreground/70">
                {reservations.length} réservation{reservations.length > 1 ? "s" : ""} au total
              </p>
            </div>
            <Button size="sm" onClick={exportToCSV} disabled={filteredReservations.length === 0}>
              <Download className="w-4 h-4 mr-2" /> Exporter CSV
            </Button>
          </div>

          <div className="grid sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{reservations.length}</p>
                    <p className="text-sm text-foreground/70">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-700" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{pendingCount}</p>
                    <p className="text-sm text-foreground/70">En attente</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{confirmedCount}</p>
                    <p className="text-sm text-foreground/70">Confirmées</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <XCircle className="w-6 h-6 text-red-700" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{cancelledCount}</p>
                    <p className="text-sm text-foreground/70">Annulées</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par nom, email, téléphone ou ville..."
                    className="pl-10"
                  />
                </div>
                <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)} className="w-full md:w-auto">
                  <TabsList className="grid grid-cols-4 w-full md:w-auto">
                    <TabsTrigger value="all">Tous</TabsTrigger>
                    <TabsTrigger value="pending">En attente</TabsTrigger>
                    <TabsTrigger value="confirmed">Confirmées</TabsTrigger>
                    <TabsTrigger value="cancelled">Annulées</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          {filteredReservations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-foreground/50">Aucune réservation trouvée</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredReservations.map((reservation) => (
                <Card key={reservation.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{reservation.name}</CardTitle>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-foreground/70">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {reservation.email}
                          </div>
                          {reservation.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {reservation.phone}
                            </div>
                          )}
                          {reservation.city && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {reservation.city}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            {new Date(reservation.created_at || "").toLocaleDateString("fr-FR")}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(reservation.status)}
                        <div className="text-xs text-foreground/60">
                          {reservation.quantity} personne{reservation.quantity > 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex gap-2">
                        {reservation.status !== "confirmed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:bg-green-50"
                            onClick={() => handleUpdateStatus(reservation.id, "confirmed")}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" /> Confirmer
                          </Button>
                        )}
                        {reservation.status !== "cancelled" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleUpdateStatus(reservation.id, "cancelled")}
                          >
                            <XCircle className="w-4 h-4 mr-1" /> Annuler
                          </Button>
                        )}
                        {reservation.status !== "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(reservation.id, "pending")}
                          >
                            <Clock className="w-4 h-4 mr-1" /> En attente
                          </Button>
                        )}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteReservation(reservation.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Supprimer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}