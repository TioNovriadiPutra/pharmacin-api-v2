import DataNotFoundException from '#exceptions/data_not_found_exception'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

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
}
