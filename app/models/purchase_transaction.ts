import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Clinic from './clinic.js';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import PurchaseShoppingCart from './purchase_shopping_cart.js';
import DrugFactory from './drug_factory.js';

export default class PurchaseTransaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare invoiceNumber: string;

  @column()
  declare totalPrice: number

  @column()
  declare factoryName: string

  @column()
  declare factoryEmail: string

  @column()
  declare factoryPhone: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare clinicId: number

  @belongsTo(() => Clinic)
  declare clinic: BelongsTo<typeof Clinic>

  @column()
  declare drugFactoryId: number

  @belongsTo(() => DrugFactory)
  declare drugFactory: BelongsTo<typeof DrugFactory>

  @hasMany(() => PurchaseShoppingCart)
  declare purchaseShoppingCarts: HasMany<typeof PurchaseShoppingCart>
}