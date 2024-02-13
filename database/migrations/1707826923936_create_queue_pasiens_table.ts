import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'queue_pasiens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('queue_number').notNullable()
      table.integer('transaction_id').unsigned().references('id').inTable('pasien_transaction_headers').notNullable().onDelete('cascade')
      table.integer('dokter_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
      table.integer('perawat_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
      table.integer('status_panggil_perawat')
      // butuh pertanyaan utk diatas
      table.integer('status_periksa')
      table.integer('status_bayar_obat')
      table.integer('status_ambil_obat')
      table.integer('time_queue_start')
      table.integer('time_queue_end')
      table.integer('time_panggil_perawat')
      table.integer('time_periksa')

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}