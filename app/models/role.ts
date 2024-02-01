import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare roleName: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @hasMany(() => User)
  declare users: HasMany<typeof User>
}
