import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'factory_partnerships'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('drug_factory_id')
        .unsigned()
        .references('id')
        .inTable('drug_factories')
        .onDelete('CASCADE')
      table.integer('clinic_id').unsigned().references('id').inTable('clinics').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
