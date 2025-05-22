import { supabase } from './DatabaseConnection'

/**
 * @typedef {Object} Specialty
 * @property {string} id
 * @property {string} name
 * @property {boolean} active
 */

/**
 * Obtiene todas las especialidades activas.
 * @returns {Promise<Specialty[]>}
 */
export async function fetchSpecialties() {
  const { data, error } = await supabase
    .from('specialties')
    .select('id, name, active')
    .eq('active', true)

  if (error) throw error
  return data
}
