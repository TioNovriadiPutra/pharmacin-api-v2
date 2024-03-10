import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import { Role } from '../enums/role_enum.js'

export default class PatientPolicy extends BasePolicy {
  handlePatient(user: User): AuthorizerResponse {
    return user.roleId === Role['ADMINISTRATOR'] || user.roleId === Role['ADMIN']
  }

  create(user: User): AuthorizerResponse {
    return user.roleId === Role['ADMINISTRATOR']
  }
}
