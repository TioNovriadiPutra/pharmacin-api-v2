import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Doctor from './doctor.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class DoctorSpecialist extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare specialityName: string

  @column()
  declare specialityTitle: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Doctor)
  declare doctors: HasMany<typeof Doctor>
}
