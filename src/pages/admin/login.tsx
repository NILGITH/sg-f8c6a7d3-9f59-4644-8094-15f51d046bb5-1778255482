import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (password === "admin2026") {
      localStorage.setItem("festival_admin_auth", "true");
      router.push("/admin");
    } else {
      setError("Mot de passe incorrect");
    }
  };

  return (
    <>
      <SEO title="Connexion Admin - Festival des Grillades" />
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
              Administration
            </h1>
            <p className="text-foreground/70">
              Festival des Grillades d'Abidjan
            </p>
          </div>

          <div className="bg-background rounded-2xl border border-border p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Mot de passe
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Entrez votre mot de passe"
                  className="w-full"
                />
                {error && (
                  <p className="text-sm text-destructive mt-2">{error}</p>
                )}
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Se connecter
              </Button>
            </form>

            <p className="text-xs text-foreground/50 text-center mt-6">
              Mot de passe par défaut : <code className="bg-muted px-2 py-1 rounded">admin2026</code>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}