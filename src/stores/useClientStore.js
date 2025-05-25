import { defineStore } from 'pinia'
import {
  fetchClients,
  createClient as createClientService,
  updateClient as updateClientService,
  deleteClient as deleteClientService
} from '@/services/ClientService'

/**
 * @typedef {Object} ClientMapped
 * @property {string} id
 * @property {string} full_name
 * @property {string} DNI
 * @property {string} email
 * @property {string} phone
 * @property {string} address
 * @property {string} headquarters_name
 */

export const useClientStore = defineStore('client', {
  state: () => ({
    /** @type {ClientMapped[]} */
    clients: []
  }),

  actions: {
    async loadClients() {
      const data = await fetchClients()
      this.clients = data.map(client => ({
        id: client.id,
        full_name: `${client.name} ${client.first_surname} ${client.second_surname || ''}`.trim(),
        DNI: client.DNI,
        email: client.email,
        phone: client.phone,
        address: client.address,
        headquarters_name: client.headquarters?.name || 'Sin sede'
      }))
    },

    async createClient(clientData) {
      const { error } = await createClientService(clientData)
      if (!error) await this.loadClients()
      return error
    },

    async editClient(id, updatedData) {
      const { error } = await updateClientService(id, updatedData)
      if (!error) await this.loadClients()
      return error
    },

    async removeClient(id) {
      const { error } = await deleteClientService(id)
      if (!error) {
        this.clients = this.clients.filter(c => c.id !== id)
      }
      return error
    }
  }
})
