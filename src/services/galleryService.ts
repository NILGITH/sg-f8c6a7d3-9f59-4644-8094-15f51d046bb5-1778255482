import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type GalleryItem = Tables<"gallery">;

// Helper pour construire les URLs publiques
function getPublicUrl(imagePath: string): string {
  // Si c'est déjà une URL complète (http/https ou data:), la retourner telle quelle
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    console.log("✅ Already a full URL:", imagePath);
    return imagePath;
  }
  
  // Si c'est un chemin local Next.js (commence par /), le retourner tel quel
  if (imagePath.startsWith('/')) {
    console.log("✅ Local Next.js path:", imagePath);
    return imagePath;
  }
  
  // Sinon, c'est un chemin Supabase Storage, construire l'URL publique
  const { data } = supabase.storage
    .from('gallery')
    .getPublicUrl(imagePath);
  
  console.log("🔗 Converted Supabase Storage path:", { imagePath, publicUrl: data.publicUrl });
  return data.publicUrl;
}

export const galleryService = {
  async getAll() {
    console.log("📡 Fetching gallery from Supabase...");
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("order_position", { ascending: true });

    console.log("📥 Supabase response:", { data, error });

    if (error) {
      console.error("❌ Error fetching gallery:", error);
      return [];
    }

    // Transformer les chemins en URLs publiques
    const imagesWithPublicUrls = (data || []).map(item => ({
      ...item,
      image: getPublicUrl(item.image)
    }));

    console.log("✅ Gallery items count:", imagesWithPublicUrls.length);
    if (imagesWithPublicUrls.length > 0) {
      console.log("🖼️ First image URL:", imagesWithPublicUrls[0].image);
    }
    
    return imagesWithPublicUrls;
  },

  async create(item: Omit<GalleryItem, "id" | "created_at">) {
    const { data, error } = await supabase
      .from("gallery")
      .insert(item)
      .select()
      .single();

    if (error) {
      console.error("Error creating gallery item:", error);
      throw error;
    }

    return data;
  },

  async update(id: string, item: Partial<GalleryItem>) {
    const { data, error } = await supabase
      .from("gallery")
      .update(item)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating gallery item:", error);
      throw error;
    }

    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from("gallery").delete().eq("id", id);

    if (error) {
      console.error("Error deleting gallery item:", error);
      throw error;
    }
  },
};