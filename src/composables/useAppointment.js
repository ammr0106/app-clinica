import { reactive, onMounted } from 'vue'
import { fetchAppointments } from '@/services/AppointmentService'

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

/**
 * @returns {{
 *  appointments: AppointmentMapped[],
 *  loadAppointments: Function
 * }}
 */
export function useAppointment() {
  const appointments = reactive([])

  const loadAppointments = async () => {
    const data = await fetchAppointments()
    appointments.length = 0
    data.forEach(appointment => {
      appointments.push({
        id: appointment.id,
        date: appointment.date,
        time: appointment.time,
        reason: appointment.reason,
        status: appointment.status,
        note: appointment.note,
        pet_name: appointment.pets?.name || 'Sin mascota',
        specialty_name: appointment.specialties?.name || 'Sin especialidad',
        client_name: appointment.client?.name || 'Sin cliente',
        employee_name: appointment.employee?.name || 'Sin empleado',
        headquarters_name: appointment.headquarters?.name || 'Sin sede'
      })
    })
  }

  onMounted(loadAppointments)

  return {
    appointments,
    loadAppointments
  }
}
