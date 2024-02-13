import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'resep_obat_racikan_details'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('header_id').unsigned().references('id').inTable('resep_obat_racikan_headers').notNullable().onDelete('CASCADE')
      table.integer('drug_id').unsigned().references('id').inTable('drugs').notNullable().onDelete('CASCADE')

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}