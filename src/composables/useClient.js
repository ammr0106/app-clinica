import { reactive, onMounted } from "vue";
import { fetchClients } from "@/services/ClientService";

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

/**
 * @returns {{
 *  clients: ClientMapped[],
 *  loadClients: Function
 * }}
 */

export function useClient() {
  const clients = reactive([]);

  const loadClients = async () => {
    const data = await fetchClients();

    clients.length = 0;

    data.forEach((client) => {
      clients.push({
        id: client.id,
        full_name: `${client.name} ${client.first_surname} ${
          client.second_surname || ""
        }`.trim(),
        DNI: client.DNI,
        email: client.email,
        phone: client.phone,
        address: client.address,
        headquarters_name: client.headquarters?.name || "Sin sede",
      });
    });
  };

  onMounted(loadClients);

  return {
    clients,
    loadClients,
  };
}
