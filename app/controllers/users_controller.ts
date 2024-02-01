import DataNotFoundException from '#exceptions/data_not_found_exception'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class UsersController {
  async getUserProfile({ response, auth }: HttpContext) {
    try {
      const profileData = await db
        .from('users')
        .join('profiles', 'profiles.user_id', '=', 'users.id')
        .join('roles', 'roles.id', '=', 'users.role_id')
        .select('users.id', 'profiles.full_name', 'roles.role_name')
        .where('users.id', auth.user!.id)
        .firstOrFail()

      return response.ok({
        message: 'Data fetched!',
        data: profileData,
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
