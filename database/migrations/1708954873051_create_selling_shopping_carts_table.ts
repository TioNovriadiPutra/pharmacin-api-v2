import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'selling_shopping_carts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('selling_transaction_id').unsigned().references('id').inTable('selling_transactions').notNullable().onDelete('cascade')
      table.integer('item_name')
      table.integer('item_price')
      table.integer('item_qty')
      table.integer('subtotal')

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}