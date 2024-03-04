import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import { Gender } from '../enums/gender_enum.js'
import User from './user.js'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import Doctor from './doctor.js'
import DoctorAssistant from './doctor_assistant.js'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string

  @column()
  declare gender: Gender

  @column()
  declare phone: string

  @column()
  declare address?: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasOne(() => Doctor)
  declare doctor: HasOne<typeof Doctor>

  @hasOne(() => DoctorAssistant)
  declare doctorAssistant: HasOne<typeof DoctorAssistant>
}
