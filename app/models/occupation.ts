import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Patient from './patient.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Occupation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare occupationName: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @hasMany(() => Patient)
  declare patients: HasMany<typeof Patient>
}
