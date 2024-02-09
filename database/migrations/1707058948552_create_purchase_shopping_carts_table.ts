import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'purchase_shopping_carts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.integer('drug_id').unsigned().references('drugs.id').onDelete('CASCADE').notNullable()
      table.integer('purchase_transaction_id').unsigned().references('purchase_transactions.id').onDelete('CASCADE').notNullable()
      table.date('expired').notNullable()
      table.integer('quantity').notNullable()
      table.integer('total_price').notNullable()
      table.string('drug_name').notNullable()
      table.integer('purchase_price').notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable().notNullable().defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).notNullable().notNullable().defaultTo(this.now());
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}