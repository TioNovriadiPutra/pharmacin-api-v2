import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Pasien from './pasien.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Clinic from './clinic.js'

export default class PasienTransactionHeader extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare pasienId: number

  @column()
  declare dokterId: number

  @column()
  declare perawatId: number

  @column()
  declare clinicId: number

  @column()
  declare noRm: string

  @column()
  declare noRegistrasi: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Pasien)
  declare pasien: BelongsTo<typeof Pasien>
  
  @belongsTo(() => User)
  declare dokter: BelongsTo<typeof User>
  
  @belongsTo(() => User)
  declare perawat: BelongsTo<typeof User>

  @belongsTo(() => Clinic)
  declare clinic: BelongsTo<typeof Clinic>
  
}