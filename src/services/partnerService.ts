import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Partner = Tables<"partners">;

export const partnerService = {
  async getAll() {
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("order_position", { ascending: true });

    if (error) {
      console.error("Error fetching partners:", error);
      return [];
    }

    return data || [];
  },

  async getByCategory(category: "principal" | "support") {
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .eq("category", category)
      .order("order_position", { ascending: true });

    if (error) {
      console.error("Error fetching partners:", error);
      return [];
    }

    return data || [];
  },

  async create(partner: Omit<Partner, "id" | "created_at">) {
    const { data, error } = await supabase
      .from("partners")
      .insert(partner)
      .select()
      .single();

    if (error) {
      console.error("Error creating partner:", error);
      throw error;
    }

    return data;
  },

  async update(id: string, partner: Partial<Partner>) {
    const { data, error } = await supabase
      .from("partners")
      .update(partner)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating partner:", error);
      throw error;
    }

    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from("partners").delete().eq("id", id);

    if (error) {
      console.error("Error deleting partner:", error);
      throw error;
    }
  },
};