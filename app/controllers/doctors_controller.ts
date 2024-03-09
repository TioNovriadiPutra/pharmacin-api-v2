import ForbiddenException from '#exceptions/forbidden_exception'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class DoctorsController {
  async getDoctors({ response, auth, bouncer }: HttpContext) {
    try {
      if (await bouncer.with('DoctorPolicy').denies('create')) {
        throw new ForbiddenException()
      }

      const doctorData = await db.rawQuery(
        `SELECT
        d.id,
        CONCAT(p.full_name, ", ", ds.speciality_title) AS doctor
       FROM doctors d
       JOIN doctor_specialists ds ON d.speciality_id = ds.id
       JOIN profiles p ON d.profile_id = p.id
       WHERE d.clinic_id = ?
       ORDER BY p.full_name ASC`,
        [auth.user!.clinicId]
      )

      return response.ok({
        message: 'Data fetched!',
        data: doctorData[0],
      })
    } catch (error) {
      if (error.status === 403) {
        throw error
      }
    }
  }
}
