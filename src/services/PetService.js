import { supabase } from "./DatabaseConnection";

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
 * @property {Client|null} id_client
 * @property {Headquarters|null} headquarters
 */

/**
 * @typedef {Object} PetInput
 * @property {string} name
 * @property {string} kind
 * @property {string} birthdate
 * @property {number} chip_number
 * @property {string} observations
 * @property {string} breed
 * @property {string} client_id
 * @property {string} headquarters_id
 */

/**
 * @returns {Promise<Pet[]>}
 */
export async function fetchPets() {
  const { data, error } = await supabase.from("pets").select(`
      id,
      name,
      kind,
      birthdate,
      chip_number,
      observations,
      breed,
      client ( id, DNI ),
      headquarters ( name )
    `);

  if (error) throw error;
  return data;
}

/**
 * @param {PetInput} petData
 * @returns {Promise<{ error: any }>}
 */
export async function createPet(petData) {
  const { error } = await supabase.from("pets").insert([petData]);
  return { error };
}

/**
 * @param {string} id
 * @param {Partial<PetInput>} petData
 * @returns {Promise<{ error: any }>}
 */
export async function updatePet(id, petData) {
  const { error } = await supabase.from("pets").update(petData).eq("id", id);
  return { error };
}

/**
 * @param {string} id
 * @returns {Promise<{ error: any }>}
 */
export async function deletePet(id) {
  const { error } = await supabase.from("pets").delete().eq("id", id);
  return { error };
}