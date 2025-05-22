import { supabase } from "./DatabaseConnection";

/**
 * @typedef {Object} Headquarters
 * @property {string} name
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} first_surname
 * @property {string} second_surname
 * @property {string} email
 * @property {string} rol
 * @property {string} date
 * @property {string} id_headquarters
 * @property {Headquarters|null} headquarters
 */

/**
 * @typedef {Object} UserInput
 * @property {string} name
 * @property {string} first_surname
 * @property {string} second_surname
 * @property {string} email
 * @property {string} rol
 * @property {string} date
 * @property {string} id_headquarters
 */

/**
 * @returns {Promise<User[]>}
 */
export async function fetchUsers() {
  const { data, error } = await supabase.from("users").select(`
    id,
    name,
    first_surname,
    second_surname,
    email,
    rol,
    date,
    headquarters (
      name
    )
  `);

  if (error) throw error;
  return data;
}

/**
 * @param {UserInput} userData
 * @returns {Promise<{ error: any }>}
 */
export async function createUser(userData) {
  const { error } = await supabase.from("users").insert([userData]);
  return { error };
}

/**
 * @param {string} id
 * @param {Partial<UserInput>} updatedData
 * @returns {Promise<{ error: any }>}
 */
export async function updateUser(id, updatedData) {
  const { error } = await supabase
    .from("users")
    .update(updatedData)
    .eq("id", id);
  return { error };
}

/**
 * @param {string} id
 * @returns {Promise<{ error: any }>}
 */
export async function deleteUser(id) {
  const { error } = await supabase.from("users").delete().eq("id", id);
  return { error };
}
