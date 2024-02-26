import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'selling_transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.string('customer_name', 50).notNullable()
      table.integer('pasien_transaction_id').unsigned().references('id').inTable('pasien_transaction_headers').notNullable().onDelete('cascade')
      table.integer('payment_method_id').unsigned().references('id').inTable('payment_methods').notNullable().onDelete('cascade')
      table.integer('total_price').notNullable()
      table.integer('total_tunai').notNullable()
      table.integer('total_kembalian').notNullable()
      table.date('purchase_date').notNullable()

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}