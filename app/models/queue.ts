import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { QueueStatus } from '../enums/queue_enum.js'
import Clinic from './clinic.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Patient from './patient.js'
import Doctor from './doctor.js'

export default class Queue extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare status: QueueStatus

  @column()
  declare registrationNumber: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare clinicId: number

  @column()
  declare patientId: number

  @column()
  declare doctorId: number

  @belongsTo(() => Clinic)
  declare clinic: BelongsTo<typeof Clinic>

  @belongsTo(() => Patient)
  declare patient: BelongsTo<typeof Patient>

  @belongsTo(() => Doctor)
  declare doctor: BelongsTo<typeof Doctor>
}
