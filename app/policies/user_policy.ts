import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import { Role } from '../enums/role_enum.js'

export default class UserPolicy extends BasePolicy {
  before(user: User): AuthorizerResponse {
    return user.roleId === Role['ADMIN']
  }

  delete(user: User, employee: User): AuthorizerResponse {
    return this.before(user) && user.clinicId === employee.clinicId
  }
}
