import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class ValidationException extends Exception {
  messages: any

  constructor(
    messages: any,
    message: string = '',
    option: { code: string; status: number } = {
      code: 'E_VALIDATION_ERROR',
      status: 422,
    }
  ) {
    super(message, option)
    this.messages = messages
  }

  async handle(error: any, ctx: HttpContext) {
    ctx.response.unprocessableEntity({
      error: {
        message: this.messages,
        status: error.status,
        code: 'E_VALIDATION_ERROR',
      },
    })
  }
}
