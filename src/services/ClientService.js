import { supabase } from "./DatabaseConnection";

/**
 * @typedef {Object} Client
 * @property {string} id
 * @property {string} name
 * @property {string} first_surname
 * @property {string} second_surname
 * @property {string} DNI
 * @property {string} email
 * @property {string} phone
 * @property {string} id_headquarters
 */

/**
 * @returns {Promise<Client[]>}
 */
export async function fetchClients() {
  const { data, error } = await supabase.from("client").select(`
      id,
      name,
      first_surname,
      second_surname,
      phone,
      email,
      DNI,
      id_headquarters
    `);


  if (error) throw error;
  return data;
}
