import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Clinic from './clinic.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class DrugFactory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare factoryName: string

  @column()
  declare factoryEmail: string

  @column()
  declare factoryPhone: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @manyToMany(() => Clinic, {
    pivotTable: 'factory_partnerships',
  })
  declare partnerships: ManyToMany<typeof Clinic>
}
