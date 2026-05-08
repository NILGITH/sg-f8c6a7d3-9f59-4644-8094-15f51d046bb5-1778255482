import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Upload, Search, Filter } from "lucide-react";
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

interface ReservationsData {
  reservations: Reservation[];
}

export default function AdminReservations() {
  const router = useRouter();
  const { data, setData, exportData, importData } = useContentManager<ReservationsData>("reservations", {
    reservations: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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
      reservations: data.reservations.map((res) =>
        res.id === id ? { ...res, status: newStatus } : res
      ),
    });
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
      <SEO title="Gestion des Réservations - Admin" />
      <AdminLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                Gestion des Réservations
              </h1>
              <p className="text-foreground/70">
                Suivre et gérer les réservations de billets
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
      </AdminLayout>
    </>
  );
}