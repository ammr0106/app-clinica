import { defineStore } from 'pinia'
import {
  fetchPets,
  createPet as createPetService,
  updatePet as updatePetService,
  deletePet as deletePetService
} from '@/services/PetService'

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

export const usePetsStore = defineStore('pets', {
  state: () => ({
    /** @type {PetMapped[]} */
    pets: [],
    loading: false,
    /** @type {Error|null} */
    error: null
  }),

  actions: {
    async loadPets() {
      this.loading = true
      this.error = null
      try {
        const data = await fetchPets()
        this.pets = data.map(pet => ({
          id: pet.id,
          name: pet.name,
          kind: pet.kind,
          birthdate: pet.birthdate,
          chip_number: pet.chip_number,
          observations: pet.observations,
          breed: pet.breed,
          client_name: pet.client?.name || 'Sin cliente',
          headquarters_name: pet.headquarters?.name || 'Sin sede'
        }))
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async createPet(petData) {
      try {
        const { error } = await createPetService(petData);
        console.log("Supabase createPet error:", error); // Agrega este console.log
        if (error) {
          console.error("Error al crear la mascota:", error);
          this.error = error;
          return error;
        } else {
          console.log("Mascota creada correctamente");
          await this.loadPets(); // Recarga la lista de mascotas
          return null;
        }
      } catch (error) {
        console.error("Error al crear la mascota:", error);
        this.error = error;
        return error;
      }
    },

    async editPet(id, updatedData) {
      const { error } = await updatePetService(id, updatedData)
      if (!error) await this.loadPets()
      return error
    },

    async removePet(id) {
      const { error } = await deletePetService(id)
      if (!error) {
        this.pets = this.pets.filter(p => p.id !== id)
      }
      return error
    }
  }
})
