import { reactive, onMounted } from "vue";
import { fetchPets } from "@/services/PetService";

/**
 * @typedef {Object} PetMapped
 * @property {string} id
 * @property {string} name
 * @property {string} kind
 * @property {string} birthdate
 * @property {number} chip_number
 * @property {string} observations
 * @property {string} breed
 * @property {string} client_name
 * @property {string} headquarters_name
 */

/**
 * @returns {{
 *  pets: PetMapped[],
 *  loadPets: Function
 * }}
 */

export function usePet() {
  const pets = reactive([]);

  const loadPets = async () => {
    const data = await fetchPets();
    pets.length = 0;
    data.forEach((pet) => {
      pets.push({
        id: pet.id,
        name: pet.name,
        kind: pet.kind,
        birthdate: pet.birthdate,
        chip_number: pet.chip_number,
        observations: pet.observations,
        breed: pet.breed,
        client_name: pet.client?.name || "Sin cliente",
        headquarters_name: pet.headquarters?.name || "Sin sede",
      });
    });
  };

  onMounted(loadPets);

  return {
    pets,
    loadPets,
  };
}
