import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import { Role } from '../enums/role_enum.js'

export default class TransactionPolicy extends BasePolicy {
  before(user: User): AuthorizerResponse | undefined {
    if (user.roleId === Role['ADMIN']) {
      return true
    }

    return undefined
  }

  view(user: User): AuthorizerResponse {
    return user.roleId === Role['ADMINISTRATOR'] || user.roleId === Role['NURSE']
  }
}
