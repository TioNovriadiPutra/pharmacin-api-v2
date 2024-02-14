import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { Gender } from '../enums/gender_enum.js'
import Clinic from './clinic.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Pasien extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare namaPasien: string

  @column()
  declare nikPasien: number

  @column()
  declare noRm: string

  @column()
  declare gender: Gender

  @column()
  declare occupation: string

  @column()
  declare tanggalLahirPasien: Date

  @column()
  declare tempatLahirPasien: string

  @column()
  declare alamatPasien: string

  @column()
  declare noHp: string

  @column()
  declare alergiObat?: string

  @column()
  declare clinicId: number

  @belongsTo(() => Clinic)
  declare clinic: BelongsTo<typeof Clinic>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}