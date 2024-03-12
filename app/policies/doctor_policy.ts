import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import { Role } from '../enums/role_enum.js'

export default class DoctorPolicy extends BasePolicy {
  before(user: User): AuthorizerResponse | undefined {
    if (user.roleId === Role['ADMIN']) {
      return true
    }
  }

  view(user: User): AuthorizerResponse {
    return user.roleId === Role['ADMINISTRATOR']
  }

  create(user: User, doctor: User): AuthorizerResponse {
    if (this.before(user)) {
      return user.clinicId === doctor.clinicId
    }

    return false
  }
}
