import { supabase } from "./DatabaseConnection";

/**
 * @typedef {Object} AppointmentDB
 * @property {string} id
 * @property {string} date
 * @property {string} time
 * @property {string} reason
 * @property {string} status
 * @property {string} note
 * @property {{ name: string } | null} pets
 * @property {{ name: string } | null} specialties
 * @property {{ name: string } | null} client
 * @property {{ name: string } | null} employee
 * @property {{ name: string } | null} headquarters
 */

/**
 * Obtiene todas las citas con datos relacionados.
 * @returns {Promise<AppointmentDB[]>}
 */
export async function fetchAppointments() {
  const { data, error } = await supabase.from("appointment").select(`
      id,
      date,
      time,
      reason,
      status,
      note,
      pets (
        name
      ),
      specialties (
        name
      ),
      client (
        name
      ),
      employee:users (
        name
      ),
      headquarters (
        name
      )
    `);

  if (error) throw error;
  return data;
}
