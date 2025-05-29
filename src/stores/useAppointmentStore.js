import { defineStore } from "pinia";
import {
  fetchAppointments,
  createAppointment as createAppointmentService,
  updateAppointment as updateAppointmentService,
  deleteAppointment as deleteAppointmentService,
} from "@/services/AppointmentService";

/**
 * @typedef {Object} AppointmentMapped
 * @property {string} id
 * @property {string} date
 * @property {string} time
 * @property {string} reason
 * @property {string} status
 * @property {string} note
 * @property {string} pet_name
 * @property {string} specialty_name
 * @property {string} client_name
 * @property {string} employee_name
 * @property {string} headquarters_name
 */
function capitalize(str) {
      if (!str) return "";
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    function capitalizeWords(str) {
  if (!str) return "";
  return str
    .split(" ")
    .map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join(" ");
}

export const useAppointmentStore = defineStore("appointment", {
  state: () => ({
    /** @type {AppointmentMapped[]} */
    appointments: [],
  }),

  actions: {
    async loadAppointments() {
      const data = await fetchAppointments();
      this.appointments = data.map((appointment) => ({
        id: appointment.id,
        date: appointment.date,
        time: appointment.time ? appointment.time.split("+")[0].slice(0, 5) : "", //De esta forma se obtiene la hora sin la zona horaria
        reason: capitalize(appointment.reason),
        status: capitalize(appointment.status),
        note: capitalize(appointment.note),
        pet_name: capitalize(appointment.pets?.name || "Sin mascota"),
        specialty_name: capitalize(appointment.specialties?.name || "Sin especialidad"),
        client_name: appointment.client
  ? capitalizeWords(
      [
        appointment.client.name,
        appointment.client.first_surname,
        appointment.client.second_surname
      ]
        .filter(Boolean)
        .join(" ")
    )
  : "Sin cliente",
        employee_name: capitalize(appointment.employee?.name || "Sin empleado"),
        headquarters_name: capitalize(appointment.headquarters?.name || "Sin sede"),
      }));
    },

    async createAppointment(appointmentData) {
      const { error } = await createAppointmentService(appointmentData);
      if (!error) await this.loadAppointments();
      return error;
    },

    async editAppointment(id, updatedData) {
      const { error } = await updateAppointmentService(id, updatedData);
      if (!error) await this.loadAppointments();
      return error;
    },

    async removeAppointment(id) {
      const { error } = await deleteAppointmentService(id);
      if (!error) {
        this.appointments = this.appointments.filter((a) => a.id !== id);
      }
      return error;
    },
  },
});
