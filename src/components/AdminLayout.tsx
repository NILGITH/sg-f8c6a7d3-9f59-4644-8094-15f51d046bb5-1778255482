import Link from "next/link";
import { useRouter } from "next/router";
import { LayoutDashboard, Calendar, Image, Ticket, BookOpen, LogOut, Users, MapPin } from "lucide-react";

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
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/editions", label: "Éditions", icon: MapPin },
    { href: "/admin/program", label: "Programme", icon: Calendar },
    { href: "/admin/gallery", label: "Galerie", icon: Image },
    { href: "/admin/reservations", label: "Réservations", icon: Ticket },
    { href: "/admin/blog", label: "Blog", icon: BookOpen },
    { href: "/admin/partners", label: "Partenaires", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-background border-r border-border">
        <div className="p-6">
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Admin Festival
          </h1>
        </div>
        <nav className="px-4 space-y-1">
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
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-foreground/70 hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}