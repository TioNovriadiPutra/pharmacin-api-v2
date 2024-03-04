import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class ForbiddenException extends Exception {
  constructor(
    message: string = 'Anda tidak memiliki akses!',
    option: {
      code?: string
      status?: number
    } = {
      code: 'E_AUTHORIZATION_FAILURE',
      status: 403,
    }
  ) {
    super(message, option)
  }

  async handle(error: any, ctx: HttpContext) {
    ctx.response.forbidden({
      error: {
        message: error.message,
        code: error.code,
        status: error.status,
      },
    })
  }
}
