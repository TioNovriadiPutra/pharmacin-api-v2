import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'drug_stocks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('batch_number', 50).notNullable()
      table.integer('total_stock').notNullable()
      table.integer('sold_stock').notNullable().defaultTo(0)
      table.integer('active_stock').notNullable()
      table.date('expired').notNullable()
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
      table
        .integer('drug_id')
        .unsigned()
        .references('id')
        .inTable('drugs')
        .onDelete('CASCADE')
        .notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
