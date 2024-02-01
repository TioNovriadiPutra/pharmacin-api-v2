import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import DrugFactory from './drug_factory.js'

export default class Clinic extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare clinicName: string

  @column()
  declare clinicPhone: string

  @column()
  declare paymentStatus: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => User)
  declare users: HasMany<typeof User>

  @manyToMany(() => DrugFactory, {
    pivotTable: 'factory_partnerships',
  })
  declare partnerships: ManyToMany<typeof DrugFactory>
}
