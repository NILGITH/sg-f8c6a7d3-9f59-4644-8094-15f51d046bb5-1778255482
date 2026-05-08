import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useContentManager } from "@/hooks/useContentManager";
import { Calendar, User, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  status: "published" | "draft";
  tags: string[];
}

interface BlogData {
  posts: BlogPost[];
}

export default function BlogPage() {
  const { data, isLoading } = useContentManager<BlogData>("blog", { posts: [] });

  const publishedPosts = data.posts
    .filter((post) => post.status === "published")
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

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
                            src={featuredPost.coverImage}
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
                              {new Date(featuredPost.publishedAt).toLocaleDateString("fr-FR", {
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
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <CardContent className="p-6">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <h3 className="font-serif text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
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
                              {new Date(post.publishedAt).toLocaleDateString("fr-FR")}
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