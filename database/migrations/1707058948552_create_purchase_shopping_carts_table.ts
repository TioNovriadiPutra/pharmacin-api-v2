import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'purchase_shopping_carts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.date('expired').notNullable()
      table.integer('quantity').notNullable()
      table.integer('total_price').notNullable()
      table.string('drug_name').notNullable()
      table.integer('purchase_price').notNullable()
      table
        .timestamp('created_at', { useTz: true })
        .notNullable()
        .notNullable()
        .defaultTo(this.now())
      table
        .timestamp('updated_at', { useTz: true })
        .notNullable()
        .notNullable()
        .defaultTo(this.now())
      table
        .integer('drug_id')
        .unsigned()
        .references('id')
        .inTable('drugs')
        .onDelete('SET NULL')
        .nullable()
      table
        .integer('purchase_transaction_id')
        .unsigned()
        .references('id')
        .inTable('purchase_transactions')
        .onDelete('CASCADE')
        .notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
