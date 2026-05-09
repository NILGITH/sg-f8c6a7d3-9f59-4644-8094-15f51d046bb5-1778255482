import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Reservation = Tables<"reservations">;

export const reservationService = {
  async getAll() {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reservations:", error);
      return [];
    }

    return data || [];
  },

  async create(reservation: Omit<Reservation, "id" | "created_at" | "status">) {
    const { data, error } = await supabase
      .from("reservations")
      .insert({ ...reservation, status: "pending" })
      .select()
      .single();

    if (error) {
      console.error("Error creating reservation:", error);
      throw error;
    }

    return data;
  },

  async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from("reservations")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating reservation status:", error);
      throw error;
    }

    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from("reservations").delete().eq("id", id);

    if (error) {
      console.error("Error deleting reservation:", error);
      throw error;
    }
  },
};