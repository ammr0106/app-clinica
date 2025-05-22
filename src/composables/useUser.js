import { reactive, onMounted } from "vue";
import { fetchUsers } from "@/services/UserService";

/**
 * @typedef {Object} UserMapped
 * @property {string} id
 * @property {string} full_name
 * @property {string} email
 * @property {string} rol
 * @property {string} date
 * @property {string} headquarters_name
 */

/**
 * @returns {{
 *  users: UserMapped[],
 *  loadUsers: Function
 * }}
 */

export function useUser() {
  const users = reactive([]);

  const loadUsers = async () => {
    const data = await fetchUsers();
    users.length = 0;
    data.forEach((user) => {
      users.push({
        id: user.id,
        full_name: `${user.name} ${user.first_surname} ${
          user.second_surname || ""
        }`.trim(),
        email: user.email,
        rol: user.rol,
        date: user.date,
        headquarters_name: user.headquarters?.name || "Sin sede",
      });
    });
  };

  onMounted(loadUsers);

  return {
    users,
    loadUsers,
  };
}
