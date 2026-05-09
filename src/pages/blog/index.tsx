import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { blogService, type BlogPost } from "@/services/blogService";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await blogService.getAll();
      setPosts(data);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const publishedPosts = posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime());

  const featuredPost = publishedPosts[0];
  const otherPosts = publishedPosts.slice(1);

  return (
    <>
      <SEO
        title="Blog - Festival des Grillades d'Abidjan"
        description="Découvrez nos articles sur la cuisine africaine, les traditions culinaires et les coulisses du festival"
      />
      <Navigation />
      <main>
        <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                Blog du Festival
              </h1>
              <p className="text-lg text-foreground/70">
                Découvrez les secrets de la cuisine africaine, rencontrez nos chefs et explorez
                les traditions culinaires d'Abidjan
              </p>
            </div>

            {isLoading ? (
              <div className="text-center text-foreground/70">Chargement des articles...</div>
            ) : publishedPosts.length === 0 ? (
              <div className="text-center text-foreground/70 py-12">
                Aucun article publié pour le moment. Revenez bientôt !
              </div>
            ) : (
              <>
                {featuredPost && (
                  <Link href={`/blog/${featuredPost.slug}`}>
                    <Card className="mb-12 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer border-2">
                      <div className="grid md:grid-cols-2">
                        <div className="relative aspect-[16/10] md:aspect-auto">
                          <Image
                            src={featuredPost.image || "/641655009_122170459016861582_5624134569926200889_n.jpg"}
                            alt={featuredPost.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <CardContent className="p-8 flex flex-col justify-center">
                          <Badge className="w-fit mb-4 bg-primary text-white">
                            Article Vedette
                          </Badge>
                          <h2 className="font-serif text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                            {featuredPost.title}
                          </h2>
                          <p className="text-foreground/80 mb-6 line-clamp-3">
                            {featuredPost.excerpt}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-foreground/70 mb-6">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              {featuredPost.author}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(featuredPost.created_at || "").toLocaleDateString("fr-FR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-primary font-semibold">
                            Lire l'article
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
                        <div className="relative aspect-[16/10]">
                          <Image
                            src={post.image || "/641655009_122170459016861582_5624134569926200889_n.jpg"}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <CardContent className="p-6">
                          <h3 className="font-serif text-xl font-bold text-foreground mb-3 mt-3 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-foreground/70 text-sm mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-foreground/60">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {post.author}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(post.created_at || "").toLocaleDateString("fr-FR")}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}