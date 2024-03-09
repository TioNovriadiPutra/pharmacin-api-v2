import DataNotFoundException from '#exceptions/data_not_found_exception'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { Role } from '../enums/role_enum.js'
import ForbiddenException from '#exceptions/forbidden_exception'
import User from '#models/user'

export default class UsersController {
  async getUserProfile({ response, auth }: HttpContext) {
    try {
      const profileData = await db.rawQuery(
        `SELECT
          u.id,
          p.full_name,
          r.role_name
         FROM users u
         JOIN roles r ON u.role_id = r.id
         JOIN profiles p ON u.id = p.user_id
         WHERE u.id = ?`,
        [auth.user!.id]
      )

      return response.ok({
        message: 'Data fetched!',
        data: profileData[0][0],
      })
    } catch (error) {
      if (error.status === 404) {
        throw new DataNotFoundException('Data profile tidak ditemukan!')
      } else {
        console.log(error)
      }
    }
  }

  async getAdministrators({ response, auth, bouncer }: HttpContext) {
    try {
      if (await bouncer.with('UserPolicy').denies('showEmployee')) {
        throw new ForbiddenException()
      }

      const userData = await db.rawQuery(
        `SELECT
          u.id,
          u.email,
          p.full_name,
          CASE
            WHEN p.gender = 'male' THEN 'Laki-laki'
            WHEN p.gender = 'female' THEN 'Perempuan'
          END AS gender,
          p.phone,
          p.address
         FROM users u
         JOIN profiles p ON u.id = p.user_id
         WHERE u.clinic_id = ? AND u.role_id = ?
         ORDER BY p.full_name ASC`,
        [auth.user!.clinicId, Role['ADMINISTRATOR']]
      )

      return response.ok({
        message: 'Data fetched!',
        data: userData[0],
      })
    } catch (error) {
      if (error.status === 403) {
        throw error
      }
    }
  }

  async deleteAdministrator({ response, bouncer, params }: HttpContext) {
    try {
      const administratorData = await User.findOrFail(params.id)

      if (await bouncer.with('UserPolicy').denies('deleteEmployee', administratorData)) {
        throw new ForbiddenException()
      }

      await administratorData.delete()

      return response.ok({
        message: 'Data administrator berhasil dihapus!',
      })
    } catch (error) {
      if (error.status === 404) {
        throw new DataNotFoundException('Data karyawan tidak ditemukan!')
      } else if (error.status === 403) {
        throw error
      }
    }
  }
}
