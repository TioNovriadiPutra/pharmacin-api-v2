import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tr_detail_obat_racikans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('header_id').unsigned().references('id').inTable('resep_obat_racikan_headers').notNullable().onDelete('cascade')
      table.integer('racikan_id').unsigned().references('id').inTable('resep_obat_racikan_details').nullable()
      table.integer('drug_id').unsigned().references('id').inTable('drugs').notNullable().onDelete('cascade')
      table.string('drug_name').notNullable()
      table.integer('quantity')
      table.string('dose_name').notNullable()
      table.integer('price').notNullable()

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}