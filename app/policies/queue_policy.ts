import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import { Role } from '../enums/role_enum.js'
import Queue from '#models/queue'

export default class QueuePolicy extends BasePolicy {
  addPatientQueue(user: User): AuthorizerResponse {
    return user.roleId === Role['ADMINISTRATOR']
  }

  changeStatusToConsultingQueue(user: User, queue: Queue): AuthorizerResponse {
    return user.roleId === Role['DOCTOR_ASSISTANT'] && user.clinicId === queue.clinicId
  }

  cancelQueue(user: User, queue: Queue): AuthorizerResponse {
    return (
      user.roleId === Role['ADMINISTRATOR'] ||
      (user.roleId === Role['DOCTOR_ASSISTANT'] && user.clinicId === queue.clinicId)
    )
  }
}
