import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type BlogPost = Tables<"blog">;

export const blogService = {
  async getAll() {
    const { data, error } = await supabase
      .from("blog")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching blog posts:", error);
      return [];
    }

    return data || [];
  },

  async getAllAdmin() {
    const { data, error } = await supabase
      .from("blog")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching blog posts:", error);
      return [];
    }

    return data || [];
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from("blog")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error) {
      console.error("Error fetching blog post:", error);
      return null;
    }

    return data;
  },

  async create(post: Omit<BlogPost, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase
      .from("blog")
      .insert(post)
      .select()
      .single();

    if (error) {
      console.error("Error creating blog post:", error);
      throw error;
    }

    return data;
  },

  async update(id: string, post: Partial<BlogPost>) {
    const { data, error } = await supabase
      .from("blog")
      .update({ ...post, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating blog post:", error);
      throw error;
    }

    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from("blog").delete().eq("id", id);

    if (error) {
      console.error("Error deleting blog post:", error);
      throw error;
    }
  },
};