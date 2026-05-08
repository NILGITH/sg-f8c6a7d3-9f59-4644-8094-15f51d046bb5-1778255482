import Link from "next/link";
import { useRouter } from "next/router";
import { LayoutDashboard, Calendar, Image as ImageIcon, Ticket, BookOpen, LogOut, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/program", icon: Calendar, label: "Programme" },
    { href: "/admin/gallery", icon: ImageIcon, label: "Galerie" },
    { href: "/admin/reservations", icon: Ticket, label: "Réservations" },
    { href: "/admin/blog", icon: BookOpen, label: "Blog" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("festival_admin_auth");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <nav className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/admin" className="font-serif text-xl font-bold">
            Admin - Festival des Grillades
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank">
              <Button variant="outline" size="sm">
                Voir le site
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </nav>

      <div className="container py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <aside className="lg:col-span-1">
            <nav className="space-y-2 sticky top-24">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "hover:bg-muted text-foreground/80"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          <main className="lg:col-span-4">{children}</main>
        </div>
      </div>
    </div>
  );
}