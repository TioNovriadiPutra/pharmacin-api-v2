import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'purchase_transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      // FK
      table.integer('drug_factory_id').unsigned().references('drug_factories.id').onDelete('CASCADE').notNullable()
      table.integer('clinic_id').unsigned().references('clinics.id').onDelete('CASCADE').notNullable()
      // END FK
      table.string('invoice_number', 100).notNullable()
      table.integer('total_price').notNullable()
      table.string('factory_name', 50).notNullable()
      table.string('factory_email', 255).notNullable()
      table.string('factory_phone', 20).notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now());
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}