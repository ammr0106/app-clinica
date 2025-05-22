import { ref, onMounted } from 'vue'
import { fetchHeadquarters } from '@/services/HeadquartersService'

/**
 * @typedef {Object} Headquarters
 * @property {string} id
 * @property {string} name
 * @property {string} city
 * @property {string} address
 * @property {string} phone
 */

/**
 * @returns {{
 *  headquarters: import('vue').Ref<Headquarters[]>,
 *  loading: import('vue').Ref<boolean>,
 *  error: import('vue').Ref<Error|null>,
 *  loadHeadquarters: Function
 * }}
 */
export function useHeadquarters() {
  const headquarters = ref([])
  const loading = ref(false)
  const error = ref(null)

  const loadHeadquarters = async () => {
    loading.value = true
    try {
      headquarters.value = await fetchHeadquarters()
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  onMounted(loadHeadquarters)

  return {
    headquarters,
    loading,
    error,
    loadHeadquarters
  }
}
