import DataNotFoundException from '#exceptions/data_not_found_exception'
import ForbiddenException from '#exceptions/forbidden_exception'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { Role } from '../enums/role_enum.js'
import User from '#models/user'
import Profile from '#models/profile'
import { updateDoctorValidator } from '#validators/doctor'
import { Gender } from '../enums/gender_enum.js'
import Doctor from '#models/doctor'
import ValidationException from '#exceptions/validation_exception'

export default class DoctorsController {
  async getDoctors({ response, auth, bouncer }: HttpContext) {
    try {
      if (await bouncer.with('DoctorPolicy').denies('view')) {
        throw new ForbiddenException()
      }

      const doctorData = await db.rawQuery(
        `SELECT
          u.id,
          d.id AS doctor_id,
          CONCAT(p.full_name, ", ", ds.speciality_title) AS full_name,
          IF(p.gender = "male", "Laki-laki", "Perempuan") AS gender,
          p.phone,
          ds.speciality_name,
          p.address
         FROM doctors d
         JOIN doctor_specialists ds ON d.speciality_id = ds.id
         JOIN profiles p ON d.profile_id = p.id
         JOIN users u ON u.id = p.user_id
         WHERE d.clinic_id = ?
         ORDER BY p.full_name ASC`,
        [auth.user!.clinicId]
      )

      return response.ok({
        message: 'Data fetched!',
        data: doctorData[0],
      })
    } catch (error) {
      throw error
    }
  }

  async getDoctorDetail({ response, bouncer, params }: HttpContext) {
    try {
      if (await bouncer.with('DoctorPolicy').denies('view')) {
        throw new ForbiddenException()
      }

      const doctorData = await db.rawQuery(
        `SELECT
          p.full_name,
          JSON_OBJECT(
            'label', IF(p.gender = 'male', 'Laki-laki', 'Perempuan'),
            'value', p.gender
          ) AS gender,
          p.phone,
          JSON_OBJECT(
            'label', CONCAT(ds.speciality_name, ' (', ds.speciality_title, ')'),
            'value', ds.id
          ) AS speciality,
          p.address
         FROM users u
         JOIN profiles p ON u.id = p.user_id
         JOIN doctors d ON p.id = d.profile_id
         JOIN doctor_specialists ds ON d.speciality_id = ds.id
         WHERE u.id = ? AND u.role_id = ?`,
        [params.id, Role['DOCTOR']]
      )

      if (doctorData[0].length === 0) {
        throw new DataNotFoundException('Data dokter tidak ditemukan!')
      }

      Object.assign(doctorData[0][0], {
        gender: JSON.parse(doctorData[0][0].gender),
        speciality: JSON.parse(doctorData[0][0].speciality),
      })

      return response.ok({
        message: 'Data fetched!',
        data: doctorData[0][0],
      })
    } catch (error) {
      throw error
    }
  }

  async updateDoctor({ request, response, bouncer, params }: HttpContext) {
    try {
      const userData = await User.findOrFail(params.id)
      const profileData = await Profile.findByOrFail('user_id', params.id)
      const doctorData = await Doctor.findByOrFail('profile_id', profileData.id)

      if (await bouncer.with('DoctorPolicy').denies('create', userData)) {
        throw new ForbiddenException()
      }

      const data = await request.validateUsing(updateDoctorValidator)

      profileData.fullName = data.fullName
      profileData.gender = data.gender as Gender
      profileData.phone = data.phone
      profileData.address = data.address

      doctorData.specialityId = data.specialityId

      await profileData.save()
      await doctorData.save()

      return response.ok({
        message: 'Data dokter berhasil diubah!',
      })
    } catch (error) {
      if (error.status === 422) {
        throw new ValidationException(error.messages)
      } else if (error.status === 404) {
        throw new DataNotFoundException('Data dokter tidak ditemukan!')
      } else {
        throw error
      }
    }
  }

  async deleteDoctor({ response, bouncer, params }: HttpContext) {
    try {
      const doctorData = await User.findOrFail(params.id)

      if (await bouncer.with('DoctorPolicy').denies('create', doctorData)) {
        throw new ForbiddenException()
      }

      await doctorData.delete()

      return response.ok({
        message: 'Data dokter berhasil dihapus!',
      })
    } catch (error) {
      throw error
    }
  }
}
