import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Slider = Tables<"slider">;

export const sliderService = {
  async getAll() {
    const { data, error } = await supabase
      .from("slider")
      .select("*")
      .eq("is_active", true)
      .order("order_position", { ascending: true });

    if (error) {
      console.error("Error fetching slides:", error);
      return [];
    }

    return data || [];
  },

  async getAllAdmin() {
    const { data, error } = await supabase
      .from("slider")
      .select("*")
      .order("order_position", { ascending: true });

    if (error) {
      console.error("Error fetching slides:", error);
      return [];
    }

    return data || [];
  },

  async create(slide: Omit<Slider, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase
      .from("slider")
      .insert(slide)
      .select()
      .single();

    if (error) {
      console.error("Error creating slide:", error);
      throw error;
    }

    return data;
  },

  async update(id: string, slide: Partial<Slider>) {
    const { data, error } = await supabase
      .from("slider")
      .update({ ...slide, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating slide:", error);
      throw error;
    }

    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from("slider").delete().eq("id", id);

    if (error) {
      console.error("Error deleting slide:", error);
      throw error;
    }
  },
};