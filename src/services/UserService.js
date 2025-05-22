import { supabase } from './DatabaseConnection'

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
 * @property {Headquarters|null} headquarters
 */

/**
 * Obtiene la lista de empleados con su sede asociada.
 * @returns {Promise<User[]>}
 */
export async function fetchUsers() {
  const { data, error } = await supabase
    .from('users')
    .select(`
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
    `)

  if (error) throw error
  return data
}
