import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type GalleryItem = Tables<"gallery">;

export const galleryService = {
  async getAll() {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("order_position", { ascending: true });

    if (error) {
      console.error("Error fetching gallery:", error);
      return [];
    }

    return data || [];
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