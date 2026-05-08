import { useEffect } from "react";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Image as ImageIcon, Ticket, BookOpen, TrendingUp, Users } from "lucide-react";
import { useContentManager } from "@/hooks/useContentManager";
import { SEO } from "@/components/SEO";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: programData } = useContentManager("program", { events: [], festivalInfo: {} });
  const { data: galleryData } = useContentManager("gallery", { images: [] });
  const { data: reservationsData } = useContentManager("reservations", { reservations: [] });
  const { data: blogData } = useContentManager("blog", { posts: [] });

  useEffect(() => {
    const isAuth = localStorage.getItem("festival_admin_auth");
    if (!isAuth) {
      router.push("/admin/login");
    }
  }, [router]);

  const stats = [
    {
      title: "Événements du programme",
      value: programData.events?.length || 0,
      icon: Calendar,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Photos en galerie",
      value: galleryData.images?.length || 0,
      icon: ImageIcon,
      color: "bg-secondary/10 text-secondary",
    },
    {
      title: "Réservations",
      value: reservationsData.reservations?.length || 0,
      icon: Ticket,
      color: "bg-accent/10 text-accent",
    },
    {
      title: "Articles de blog",
      value: blogData.posts?.length || 0,
      icon: BookOpen,
      color: "bg-muted text-foreground",
    },
  ];

  const recentReservations = reservationsData.reservations?.slice(0, 5) || [];

  return (
    <>
      <SEO title="Dashboard Admin - Festival des Grillades" />
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
              Dashboard
            </h1>
            <p className="text-foreground/70">
              Vue d'ensemble de la gestion du festival
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-foreground/70">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Réservations récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReservations.length === 0 ? (
                  <p className="text-foreground/50 text-center py-8">
                    Aucune réservation pour le moment
                  </p>
                ) : (
                  recentReservations.map((reservation: any) => (
                    <div
                      key={reservation.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">{reservation.customerName}</p>
                        <p className="text-sm text-foreground/70">
                          {reservation.ticketType} × {reservation.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{reservation.totalAmount}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          reservation.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {reservation.status === "confirmed" ? "Confirmé" : "En attente"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </>
  );
}