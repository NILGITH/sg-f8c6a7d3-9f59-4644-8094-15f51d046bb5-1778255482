import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Edition = Tables<"editions">;

export const editionsService = {
  async getAll() {
    const { data, error } = await supabase
      .from("editions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching editions:", error);
      return [];
    }

    return data || [];
  },

  async create(edition: Omit<Edition, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase
      .from("editions")
      .insert(edition)
      .select()
      .single();

    if (error) {
      console.error("Error creating edition:", error);
      throw error;
    }

    return data;
  },

  async update(id: string, edition: Partial<Edition>) {
    const { data, error } = await supabase
      .from("editions")
      .update({ ...edition, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating edition:", error);
      throw error;
    }

    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from("editions").delete().eq("id", id);

    if (error) {
      console.error("Error deleting edition:", error);
      throw error;
    }
  },
};