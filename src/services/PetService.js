import { supabase } from "./DatabaseConnection"

/**
 * @typedef {Object} Client
 * @property {string} name
 */

/**
 * @typedef {Object} Headquarters
 * @property {string} name
 */

/**
 * @typedef {Object} Pet
 * @property {string} id
 * @property {string} name
 * @property {string} kind
 * @property {string} birthdate
 * @property {number} chip_number
 * @property {string} observations
 * @property {string} breed
 * @property {Client|null} client
 * @property {Headquarters|null} headquarters
 */

/**
 * Obtiene todas las mascotas con nombre del cliente y sede si tienen.
 * @returns {Promise<Pet[]>}
 */
export async function fetchPets() {
  const { data, error } = await supabase
    .from("pets")
    .select(`
      id,
      name,
      kind,
      birthdate,
      chip_number,
      observations,
      breed,
      client (
        name
      ),
      headquarters (
        name
      )
    `)

  if (error) throw error
  return data
}
