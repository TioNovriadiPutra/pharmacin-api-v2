import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pasien_rekam_perawatans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('header_id').unsigned().references('id').inTable('pasien_transaction_headers').notNullable().onDelete('cascade')
      table.integer('diagnosa_id').unsigned().references('id').inTable('diagnoses').notNullable().onDelete('cascade')
      table.integer('berat_badan').notNullable()
      table.integer('tinggi_badan').notNullable()
      table.integer('suhu').notNullable()
      table.integer('nadi').notNullable()
      table.text('subjective').notNullable()
      table.text('objective').notNullable()
      table.string('assesment_plan').notNullable()

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}