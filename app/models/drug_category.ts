import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Clinic from './clinic.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Drug from './drug.js'

export default class DrugCategory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare categoryNumber: string

  @column()
  declare categoryName: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare clinicId: number

  @belongsTo(() => Clinic)
  declare clinic: BelongsTo<typeof Clinic>

  @hasMany(() => Drug)
  declare drugs: HasMany<typeof Drug>
}
