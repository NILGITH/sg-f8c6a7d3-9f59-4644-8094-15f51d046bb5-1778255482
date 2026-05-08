import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Save, Download, Upload, X, Eye } from "lucide-react";
import { useContentManager } from "@/hooks/useContentManager";
import { SEO } from "@/components/SEO";

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

export default function AdminBlog() {
  const router = useRouter();
  const { data, setData, exportData, importData } = useContentManager<BlogData>("blog", { posts: [] });

  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("festival_admin_auth");
    if (!isAuth) {
      router.push("/admin/login");
    }
  }, [router]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleAddPost = () => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      slug: "",
      title: "",
      excerpt: "",
      content: "",
      coverImage: "/generated/blog-spices.png",
      author: "Équipe Festival",
      publishedAt: new Date().toISOString(),
      status: "draft",
      tags: [],
    };
    setEditingPost(newPost);
    setIsAdding(true);
  };

  const handleSavePost = () => {
    if (!editingPost || !editingPost.title || !editingPost.content) {
      alert("Veuillez remplir au moins le titre et le contenu");
      return;
    }

    const postToSave = {
      ...editingPost,
      slug: editingPost.slug || generateSlug(editingPost.title),
    };

    if (isAdding) {
      setData({
        posts: [...data.posts, postToSave],
      });
    } else {
      setData({
        posts: data.posts.map((p) => (p.id === postToSave.id ? postToSave : p)),
      });
    }

    setEditingPost(null);
    setIsAdding(false);
  };

  const handleDeletePost = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      setData({
        posts: data.posts.filter((p) => p.id !== id),
      });
    }
  };

  const togglePublishStatus = (id: string) => {
    setData({
      posts: data.posts.map((p) =>
        p.id === id
          ? {
              ...p,
              status: p.status === "published" ? "draft" : "published",
              publishedAt: p.status === "draft" ? new Date().toISOString() : p.publishedAt,
            }
          : p
      ),
    });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importData(file);
    }
  };

  return (
    <>
      <SEO title="Gestion du Blog - Admin" />
      <AdminLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                Gestion du Blog
              </h1>
              <p className="text-foreground/70">
                Créer et gérer les articles du blog
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
              <Button size="sm" onClick={handleAddPost}>
                <Plus className="w-4 h-4 mr-2" />
                Nouvel article
              </Button>
            </div>
          </div>

          {(editingPost || isAdding) && (
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle>
                  {isAdding ? "Nouvel article" : "Modifier l'article"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Titre *</label>
                    <Input
                      value={editingPost.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setEditingPost({
                          ...editingPost,
                          title,
                          slug: editingPost.slug || generateSlug(title),
                        });
                      }}
                      placeholder="Titre de l'article"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Slug (URL)</label>
                    <Input
                      value={editingPost.slug}
                      onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                      placeholder="url-de-l-article"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Résumé</label>
                  <Textarea
                    value={editingPost.excerpt}
                    onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                    rows={2}
                    placeholder="Court résumé de l'article..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Contenu *</label>
                  <Textarea
                    value={editingPost.content}
                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                    rows={10}
                    placeholder="Contenu complet de l'article..."
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Image de couverture</label>
                    <Input
                      value={editingPost.coverImage}
                      onChange={(e) => setEditingPost({ ...editingPost, coverImage: e.target.value })}
                      placeholder="/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Auteur</label>
                    <Input
                      value={editingPost.author}
                      onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                      placeholder="Nom de l'auteur"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Statut</label>
                    <select
                      value={editingPost.status}
                      onChange={(e) =>
                        setEditingPost({
                          ...editingPost,
                          status: e.target.value as "published" | "draft",
                        })
                      }
                      className="w-full px-3 py-2 border border-input rounded-md"
                    >
                      <option value="draft">Brouillon</option>
                      <option value="published">Publié</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Tags (séparés par des virgules)</label>
                  <Input
                    value={editingPost.tags.join(", ")}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                      })
                    }
                    placeholder="cuisine, recette, tradition"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingPost(null);
                      setIsAdding(false);
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                  <Button onClick={handleSavePost}>
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6">
            {data.posts.map((post) => (
              <Card key={post.id}>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle>{post.title}</CardTitle>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          post.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {post.status === "published" ? "Publié" : "Brouillon"}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/70">
                      Par {post.author} • {new Date(post.publishedAt).toLocaleDateString("fr-FR")}
                    </p>
                    {post.excerpt && (
                      <p className="text-sm text-foreground/80 mt-2">{post.excerpt}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/blog/${post.slug}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingPost(post);
                        setIsAdding(false);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={post.status === "published" ? "secondary" : "default"}
                      size="sm"
                      onClick={() => togglePublishStatus(post.id)}
                    >
                      {post.status === "published" ? "Dépublier" : "Publier"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}

            {data.posts.length === 0 && (
              <Card>
                <CardContent className="text-center py-12 text-foreground/50">
                  <p>Aucun article. Créez votre premier article !</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}