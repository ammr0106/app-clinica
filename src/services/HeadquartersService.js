import { supabase } from './DatabaseConnection'

/**
 * @typedef {Object} Headquarters
 * @property {string} id
 * @property {string} name
 * @property {string} city
 * @property {string} address
 * @property {string} phone
 */

/**
 * @returns {Promise<Headquarters[]>}
 */

export async function fetchHeadquarters() {
  const { data, error } = await supabase
    .from('headquarters')
    .select('id, name, city, address, phone')

  if (error) throw error
  return data
}
