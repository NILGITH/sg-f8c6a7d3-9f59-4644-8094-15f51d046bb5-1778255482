import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Program = Tables<"programs">;

export const programService = {
  async getAll() {
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching programs:", error);
      return [];
    }

    return data || [];
  },

  async getByCity(cityId: string) {
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .eq("city_id", cityId)
      .single();

    if (error) {
      console.error("Error fetching program:", error);
      return null;
    }

    return data;
  },

  async create(program: Omit<Program, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase
      .from("programs")
      .insert(program)
      .select()
      .single();

    if (error) {
      console.error("Error creating program:", error);
      throw error;
    }

    return data;
  },

  async update(id: string, program: Partial<Program>) {
    const { data, error } = await supabase
      .from("programs")
      .update({ ...program, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating program:", error);
      throw error;
    }

    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from("programs").delete().eq("id", id);

    if (error) {
      console.error("Error deleting program:", error);
      throw error;
    }
  },
};