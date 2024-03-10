import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { QueueStatus } from '../enums/queue_enum.js'
import Queue from '#models/queue'
import DataNotFoundException from '#exceptions/data_not_found_exception'
import ForbiddenException from '#exceptions/forbidden_exception'
import Patient from '#models/patient'
import DoctorAssistant from '#models/doctor_assistant'

export default class QueuesController {
  async getConsultWaitQueue({ response, auth }: HttpContext) {
    const queueData = await db.rawQuery(
      `SELECT
        q.id,
        q.registration_number,
        p.full_name,
        p.record_number,
        p.gender,
        q.created_at,
        q.status
       FROM queues q
       JOIN patients p ON q.patient_id = p.id
       WHERE q.clinic_id = ? AND q.status = ?
       ORDER BY q.created_at ASC`,
      [auth.user!.clinicId, QueueStatus['CONSULT_WAIT']]
    )

    return response.ok({
      message: 'Data fetched!',
      data: { queue: queueData[0], total: queueData[0].length },
    })
  }

  async getDoctorConsultWaitQueue({ response, auth }: HttpContext) {
    const doctorAssistant = await DoctorAssistant.query()
      .whereHas('profile', (builderProfile) => {
        builderProfile.whereHas('user', (builderUser) => {
          builderUser.where('id', auth.user!.id)
        })
      })
      .firstOrFail()

    const queueData = await db.rawQuery(
      `SELECT
        q.id,
        p.full_name,
        p.record_number,
        q.registration_number
       FROM queues q
       JOIN patients p ON q.patient_id = p.id
       WHERE q.clinic_id = ? AND q.doctor_id = ? AND q.status = ?
       ORDER BY q.created_at ASC`,
      [auth.user!.clinicId, doctorAssistant.doctorId, QueueStatus['CONSULT_WAIT']]
    )

    return response.ok({
      message: 'Data fetched',
      data: { queue: queueData[0], total: queueData[0].length },
    })
  }

  async changeStatusToConsultingQueue({ response, params, bouncer }: HttpContext) {
    try {
      const queueData = await Queue.findOrFail(params.id)

      if (await bouncer.with('QueuePolicy').denies('changeStatusToConsultingQueue', queueData)) {
        throw new ForbiddenException()
      }

      queueData.status = QueueStatus['CONSULTING']

      await queueData.save()

      return response.ok({
        message: queueData.registrationNumber,
      })
    } catch (error) {
      if (error.status === 404) {
        throw new DataNotFoundException('Data antrian tidak ditemukan!')
      } else if (error.status === 403) {
        throw error
      }
    }
  }

  async cancelQueue({ response, params, bouncer }: HttpContext) {
    try {
      const queueData = await Queue.findOrFail(params.id)

      if (await bouncer.with('QueuePolicy').denies('cancelQueue', queueData)) {
        throw new ForbiddenException()
      }

      const patientData = await Patient.findOrFail(queueData.patientId)
      patientData.ready = true

      await queueData.delete()
      await patientData.save()

      return response.ok({
        message: 'Antrian dibatalkan!',
      })
    } catch (error) {
      if (error.status === 404) {
        throw new DataNotFoundException('Data antrian tidak ditemukan!')
      } else {
        throw error
      }
    }
  }
}
