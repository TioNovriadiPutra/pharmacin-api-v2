import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class DoktersController {

    async getDokterData({request, response, auth}: HttpContext) {
        try {
          const dokterData = await db.rawQuery(
            `
            SELECT * FROM users WHERE role_id = 2
            `
          )

          return response.ok({message: "Data fetched!", data: dokterData[0]})
        } catch (error) {
          console.log(error)

        }
      }
}