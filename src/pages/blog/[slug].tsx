import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { blogService, type BlogPost } from "@/services/blogService";

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug && typeof slug === "string") {
      loadPost(slug);
    }
  }, [slug]);

  const loadPost = async (postSlug: string) => {
    try {
      const post = await blogService.getBySlug(postSlug);
      setPost(post);
    } catch (error) {
      console.error("Error loading post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <main className="py-20">
          <div className="container text-center">Chargement...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <SEO title="Article non trouvé - Festival des Grillades" />
        <Navigation />
        <main className="py-20">
          <div className="container text-center">
            <h1 className="font-serif text-3xl font-bold mb-4">Article non trouvé</h1>
            <Link href="/blog">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" /> Retour au blog
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const readingTime = Math.ceil((post.content?.split(" ").length || 0) / 200);

  return (
    <>
      <SEO
        title={`${post.title} - Blog Festival des Grillades`}
        description={post.excerpt || ""}
        image={post.image || undefined}
      />
      <Navigation />
      <main>
        <article className="py-12 md:py-16 lg:py-20">
          <div className="container max-w-4xl">
            <Link href="/blog">
              <Button variant="ghost" className="mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" /> Retour au blog
              </Button>
            </Link>

            <div className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                    {post.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/70">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.created_at || "").toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {readingTime} min de lecture
                    </div>
                  </div>
                </div>

                {post.image && (
                  <div className="relative aspect-[21/9] rounded-2xl overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="text-xl text-foreground/80 font-medium leading-relaxed mb-8">
                  {post.excerpt}
                </div>

                <div
                  className="text-foreground/90 leading-relaxed space-y-6"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {post.content}
                </div>
              </div>

              <div className="pt-8 border-t border-border">
                <Link href="/blog">
                  <Button variant="outline" size="lg">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Retour aux articles
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}