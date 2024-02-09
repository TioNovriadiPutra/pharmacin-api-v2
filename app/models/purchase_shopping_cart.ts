import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import PurchaseTransaction from './purchase_transaction.js'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import Drug from './drug.js'
import DrugStock from './drug_stock.js'

export default class PurchaseShoppingCart extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.date()
  declare expired: DateTime

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

  @column()
  declare drugId?: number

  @belongsTo(() => PurchaseTransaction)
  declare purchaseTransaction: BelongsTo<typeof PurchaseTransaction>

  @belongsTo(() => Drug)
  declare drug: BelongsTo<typeof Drug>

  @hasOne(() => DrugStock)
  declare drugStock: HasOne<typeof DrugStock>
}
