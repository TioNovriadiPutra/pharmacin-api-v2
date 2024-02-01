import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class InvalidCredentialException extends Exception {
  constructor(
    message: string = 'Email atau Password salah!',
    option: { code: string; status: number } = {
      code: 'E_INVALID_CREDENTIALS',
      status: 401,
    }
  ) {
    super(message, option)
  }

  async handle(error: this, ctx: HttpContext) {
    ctx.response.unauthorized({
      error: {
        message: error.message,
        code: error.code,
        status: error.status,
      },
    })
  }
}
