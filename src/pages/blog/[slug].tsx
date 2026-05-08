import { useRouter } from "next/router";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useContentManager } from "@/hooks/useContentManager";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
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

export default function BlogPostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { data, isLoading } = useContentManager<BlogData>("blog", { posts: [] });

  if (isLoading) {
    return (
      <>
        <Navigation />
        <main className="py-20">
          <div className="container text-center">Chargement de l'article...</div>
        </main>
        <Footer />
      </>
    );
  }

  const post = data.posts.find((p) => p.slug === slug && p.status === "published");

  if (!post) {
    return (
      <>
        <Navigation />
        <main className="py-20">
          <div className="container text-center">
            <h1 className="font-serif text-3xl font-bold mb-4">Article non trouvé</h1>
            <p className="text-foreground/70 mb-8">
              Cet article n'existe pas ou n'est plus disponible.
            </p>
            <Link href="/blog">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au blog
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Lien copié dans le presse-papiers !");
    }
  };

  return (
    <>
      <SEO
        title={`${post.title} - Blog Festival`}
        description={post.excerpt}
        image={post.coverImage}
      />
      <Navigation />
      <main>
        <article className="py-12">
          <div className="container max-w-4xl">
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au blog
              </Button>
            </Link>

            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
                {post.title}
              </h1>

              <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-6 text-foreground/70">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span className="font-medium">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Partager
                </Button>
              </div>
            </div>

            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-12 shadow-xl">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="prose prose-lg max-w-none">
              {post.content.split("\n").map((paragraph, index) => (
                <p key={index} className="text-foreground/80 leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center justify-between">
                <Link href="/blog">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Tous les articles
                  </Button>
                </Link>
                <Button onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Partager cet article
                </Button>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}