import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import { Role } from '../enums/role_enum.js'

export default class DoctorAssistantPolicy extends BasePolicy {
  before(user: User): AuthorizerResponse | undefined {
    if (user.roleId === Role['ADMIN']) {
      return true
    }

    return undefined
  }

  handle(user: User, assistant: User): AuthorizerResponse | undefined {
    return this.before(user) && user.clinicId === assistant.clinicId
  }
}
