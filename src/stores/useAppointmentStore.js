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
        time: appointment.time,
        reason: appointment.reason,
        status: appointment.status,
        note: appointment.note,
        pet_name: appointment.pets?.name || "Sin mascota",
        specialty_name: appointment.specialties?.name || "Sin especialidad",
        client_name: appointment.client?.name || "Sin cliente",
        employee_name: appointment.employee?.name || "Sin empleado",
        headquarters_name: appointment.headquarters?.name || "Sin sede",
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
