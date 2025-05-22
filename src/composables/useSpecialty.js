import { ref, onMounted } from "vue";
import { fetchSpecialties } from "@/services/SpecialtyService";

/**
 * @typedef {Object} Specialty
 * @property {string} id
 * @property {string} name
 * @property {boolean} active
 */

/**
 * @returns {{
 *  specialties: import('vue').Ref<Specialty[]>,
 *  loading: import('vue').Ref<boolean>,
 *  error: import('vue').Ref<Error|null>,
 *  loadSpecialties: Function
 * }}
 */

export function useSpecialty() {
  const specialties = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const loadSpecialties = async () => {
    loading.value = true;
    try {
      specialties.value = await fetchSpecialties();
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  onMounted(loadSpecialties);

  return {
    specialties,
    loading,
    error,
    loadSpecialties,
  };
}
