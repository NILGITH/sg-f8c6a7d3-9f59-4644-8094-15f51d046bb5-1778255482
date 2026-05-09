import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Save, X, Eye } from "lucide-react";
import { SEO } from "@/components/SEO";
import { blogService, type BlogPost } from "@/services/blogService";

export default function AdminBlog() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("festival_admin_auth");
    if (!isAuth) {
      router.push("/admin/login");
    } else {
      loadPosts();
    }
  }, [router]);

  const loadPosts = async () => {
    try {
      const data = await blogService.getAll();
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const handleAddPost = () => {
    setEditingPost({
      slug: "",
      title: "",
      excerpt: "",
      content: "",
      image: "/generated/blog-spices.png",
      author: "Équipe Festival",
      published: false,
    });
    setIsAdding(true);
  };

  const handleSavePost = async () => {
    if (!editingPost || !editingPost.title || !editingPost.content) {
      alert("Veuillez remplir au moins le titre et le contenu");
      return;
    }
    const postToSave = {
      ...editingPost,
      slug: editingPost.slug || generateSlug(editingPost.title),
    };

    try {
      if (isAdding) {
        await blogService.create(postToSave as any);
      } else if (editingPost.id) {
        await blogService.update(editingPost.id, postToSave);
      }
      await loadPosts();
      setEditingPost(null);
      setIsAdding(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (confirm("Supprimer cet article ?")) {
      try {
        await blogService.delete(id);
        await loadPosts();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const togglePublishStatus = async (post: BlogPost) => {
    try {
      await blogService.update(post.id, { published: !post.published });
      await loadPosts();
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <AdminLayout><div className="p-8">Chargement...</div></AdminLayout>;

  return (
    <>
      <SEO title="Gestion du Blog - Admin" />
      <AdminLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2">Gestion du Blog</h1>
            </div>
            <Button size="sm" onClick={handleAddPost}><Plus className="w-4 h-4 mr-2" /> Nouvel article</Button>
          </div>

          {(editingPost || isAdding) && (
            <Card className="border-2 border-primary">
              <CardHeader><CardTitle>{isAdding ? "Nouvel article" : "Modifier l'article"}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Titre *</label>
                    <Input value={editingPost.title || ""} onChange={(e) => {
                      const title = e.target.value;
                      setEditingPost({ ...editingPost, title, slug: editingPost.slug || generateSlug(title) });
                    }} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Slug (URL)</label>
                    <Input value={editingPost.slug || ""} onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Résumé</label>
                  <Textarea value={editingPost.excerpt || ""} onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })} rows={2} />
                </div>
                <div>
                  <label className="text-sm font-medium">Contenu *</label>
                  <Textarea value={editingPost.content || ""} onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })} rows={10} />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Image de couverture</label>
                    <Input value={editingPost.image || ""} onChange={(e) => setEditingPost({ ...editingPost, image: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Auteur</label>
                    <Input value={editingPost.author || ""} onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Statut</label>
                    <select value={editingPost.published ? "published" : "draft"} onChange={(e) => setEditingPost({ ...editingPost, published: e.target.value === "published" })} className="w-full px-3 py-2 border border-input rounded-md">
                      <option value="draft">Brouillon</option>
                      <option value="published">Publié</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => { setEditingPost(null); setIsAdding(false); }}><X className="w-4 h-4 mr-2" /> Annuler</Button>
                  <Button onClick={handleSavePost}><Save className="w-4 h-4 mr-2" /> Enregistrer</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle>{post.title}</CardTitle>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${post.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                        {post.published ? "Publié" : "Brouillon"}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/70">Par {post.author}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/blog/${post.slug}`)}><Eye className="w-4 h-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => { setEditingPost(post); setIsAdding(false); }}><Edit className="w-4 h-4" /></Button>
                    <Button variant={post.published ? "secondary" : "default"} size="sm" onClick={() => togglePublishStatus(post)}>
                      {post.published ? "Dépublier" : "Publier"}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeletePost(post.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}