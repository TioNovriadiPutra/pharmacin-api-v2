import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import PasienTransactionHeader from './pasien_transaction_header.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import { Status } from '../enums/status_enum.js'

export default class QueuePasien extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare queueNumber: number

  @column()
  declare statusPanggilPerawat: boolean
  
  @column()
  declare statusPeriksa: Status
  
  @column()
  declare statusBayar: Status
  
  @column()
  declare statusBayarObat: boolean
  
  @column()
  declare statusAmbilObat: boolean
  
  @column.dateTime()
  declare timeQueueStart: DateTime
  
  @column.dateTime()
  declare timeQueueEnd: DateTime

  @column.dateTime()
  declare timePangilPerawat: DateTime

  @column.dateTime()
  declare timePeriksa: DateTime

  @column()
  declare transactionId: number

  @column()
  declare dokterId: number

  @column()
  declare perawatId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => PasienTransactionHeader)
  declare transaction: BelongsTo<typeof PasienTransactionHeader>

  @belongsTo(() => User)
  declare dokter: BelongsTo<typeof User>

  @belongsTo(() => User)
  declare perawat: BelongsTo<typeof User>

}