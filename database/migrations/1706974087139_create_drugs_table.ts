import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'drugs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('drug', 50).notNullable()
      table.string('drug_generic_name', 50).nullable()
      table.string('dose', 20).notNullable()
      table.integer('shelve').nullable()
      table.integer('purchase_price').notNullable()
      table.integer('selling_price').notNullable()
      table.integer('total_stock').notNullable().defaultTo(0)
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
      table
        .integer('drug_factory_id')
        .unsigned()
        .references('id')
        .inTable('drug_factories')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('drug_category_id')
        .unsigned()
        .references('id')
        .inTable('drug_categories')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('clinic_id')
        .unsigned()
        .references('id')
        .inTable('clinics')
        .onDelete('CASCADE')
        .notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
