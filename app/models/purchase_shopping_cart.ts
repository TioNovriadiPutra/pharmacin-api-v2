import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import PurchaseTransaction from './purchase_transaction.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Drug from './drug.js'

export default class PurchaseShoppingCart extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare expired: Date

  @column()
  declare quantity: number

  @column()
  declare totalPrice: number

  @column()
  declare drugName: string

  @column()
  declare purchasePrice: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare purchaseTransactionId: number

  @belongsTo(() => PurchaseTransaction)
  declare purchaseTransaction: BelongsTo<typeof PurchaseTransaction>

  @column()
  declare drugId: number
  
  @belongsTo(() => Drug)
  declare drug: BelongsTo<typeof Drug>
}