import Link from "next/link";
import { useRouter } from "next/router";
import { LayoutDashboard, Calendar, Image, Users, FileText, LogOut, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("festival_admin_auth");
    router.push("/admin/login");
  };

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/program", icon: Calendar, label: "Programme" },
    { href: "/admin/gallery", icon: Image, label: "Galerie" },
    { href: "/admin/partners", icon: Building2, label: "Partenaires" },
    { href: "/admin/reservations", icon: Users, label: "Réservations" },
    { href: "/admin/blog", icon: FileText, label: "Blog" },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/admin" className="font-serif text-xl font-bold text-foreground">
            Admin - Festival des Grillades
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar Navigation */}
          <nav className="lg:col-span-1 space-y-2">
            {navItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "hover:bg-muted text-foreground/80 hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Page Content */}
          <main className="lg:col-span-4">{children}</main>
        </div>
      </div>
    </div>
  );
}