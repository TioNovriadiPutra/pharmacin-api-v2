import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Drug from './drug.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class DrugStock extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare batchNumber: string

  @column()
  declare totalStock: number

  @column()
  declare soldStock: number

  @column()
  declare activeStock: number

  @column.date()
  declare expired: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare drugId: number

  @belongsTo(() => Drug)
  declare drug: BelongsTo<typeof Drug>
}
